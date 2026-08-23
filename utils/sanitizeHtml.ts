/**
 * Lightweight allowlist HTML sanitiser for admin-authored course/answer
 * content. No external dependency — built on the browser's DOMParser,
 * which parses into an inert document (nothing executes) and lets us walk
 * the tree and rebuild only the tags/attributes we explicitly allow.
 *
 * Used at every dangerouslySetInnerHTML boundary that renders
 * Firestore-stored HTML (course lesson content, interview answers) so a
 * malicious or compromised admin/instructor account can't persist a
 * stored-XSS payload that runs in every learner's session.
 */

const ALLOWED_TAGS = new Set([
    'div', 'span', 'p', 'br', 'hr',
    'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sup', 'sub',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'figure', 'figcaption', 'section', 'article',
]);

// Tags whose content (including nested text) is dropped entirely rather
// than unwrapped — their text is never meant to be displayed as content.
const DROP_ENTIRELY = new Set([
    'script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base',
    'form', 'input', 'button', 'textarea', 'select', 'option', 'noscript',
    'svg', 'math', 'audio', 'video', 'source', 'track', 'applet',
]);

const ALLOWED_GLOBAL_ATTRS = new Set(['class', 'id', 'title', 'colspan', 'rowspan', 'target']);

const SAFE_URL_SCHEMES = /^(https?:|mailto:)/i;
const SAFE_IMAGE_DATA_URL = /^data:image\/(png|jpe?g|gif|webp);base64,/i;

const isSafeUrl = (value: string, isImage: boolean): boolean => {
    const trimmed = value.trim();
    if (trimmed === '') return false;
    // Relative and hash/fragment links are safe.
    if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
        return true;
    }
    if (isImage && SAFE_IMAGE_DATA_URL.test(trimmed)) return true;
    return SAFE_URL_SCHEMES.test(trimmed);
};

const sanitizeStyleValue = (value: string): string => {
    // Strip anything that could load external resources or execute code via
    // legacy CSS (url(), expression(), @import, javascript:).
    if (/url\s*\(|expression\s*\(|@import|javascript:/i.test(value)) return '';
    return value;
};

const sanitizeElement = (el: Element): Node[] => {
    const tag = el.tagName.toLowerCase();

    const children: Node[] = [];
    el.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            children.push(child.cloneNode(true));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            children.push(...sanitizeElement(child as Element));
        }
        // Comments and other node types are silently dropped.
    });

    if (DROP_ENTIRELY.has(tag)) return [];
    if (!ALLOWED_TAGS.has(tag)) return children; // unwrap unknown tags, keep safe children

    const clean = document.createElement(tag);

    Array.from(el.attributes).forEach(attr => {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        if (name.startsWith('on')) return; // every event handler, unconditionally
        if (name === 'href') {
            if (tag === 'a' && isSafeUrl(value, false)) clean.setAttribute('href', value.trim());
            return;
        }
        if (name === 'src') {
            if (tag === 'img' && isSafeUrl(value, true)) clean.setAttribute('src', value.trim());
            return;
        }
        if (name === 'style') {
            const safe = sanitizeStyleValue(value);
            if (safe) clean.setAttribute('style', safe);
            return;
        }
        if (name === 'alt' || name === 'width' || name === 'height' || name === 'loading') {
            if (tag === 'img') clean.setAttribute(name, value);
            return;
        }
        if (ALLOWED_GLOBAL_ATTRS.has(name) || name.startsWith('aria-')) {
            clean.setAttribute(name, value);
        }
    });

    if (tag === 'a') {
        clean.setAttribute('rel', 'noopener noreferrer');
    }

    children.forEach(child => clean.appendChild(child));
    return [clean];
};

const parseToSafeContainer = (dirty: string): HTMLDivElement => {
    const container = document.createElement('div');
    if (!dirty) return container;

    const doc = new DOMParser().parseFromString(dirty, 'text/html');
    doc.body.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            container.appendChild(child.cloneNode(true));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            sanitizeElement(child as Element).forEach(node => container.appendChild(node));
        }
    });
    return container;
};

/** Sanitise stored HTML down to an allowlist before it reaches dangerouslySetInnerHTML. */
export const sanitizeHtml = (dirty: string): string => parseToSafeContainer(dirty).innerHTML;

/** Sanitise then extract plain text (entities properly decoded, unlike a regex tag-strip). */
export const htmlToPlainText = (dirty: string): string =>
    (parseToSafeContainer(dirty).textContent || '').replace(/\s+/g, ' ').trim();