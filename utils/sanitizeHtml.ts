import DOMPurify from 'dompurify';

/**
 * Sanitisation for the two places SkillVerse renders stored HTML through
 * `dangerouslySetInnerHTML`: course content (`CourseView`) and interview
 * answers (`CareerMode`).
 *
 * Both strings come out of Firestore, and both are ultimately assembled from
 * text typed into the Admin Dashboard — `lessonForm.content` is concatenated
 * into the compiled course HTML by `compileContent`, and `question.answer` is
 * written straight through. Neither is escaped on the way in, so before this
 * existed any `<script>`, `<img onerror=…>` or inline handler in that content
 * executed in the viewing learner's origin, with access to their Firebase
 * session and to everything the app keeps in localStorage.
 *
 * A note on why this delegates rather than hand-rolling an allowlist walk:
 * writing a correct HTML sanitiser is genuinely hard. mXSS — markup that is
 * safe when parsed but dangerous once re-serialised and re-parsed — defeats
 * most hand-written ones, and the failure mode is a silent hole rather than a
 * broken page. DOMPurify is the audited implementation of exactly this, and it
 * was already in the dependency tree as a transitive dependency of the PDF
 * export path, so making it direct costs nothing in bundle size.
 *
 * What is ours is the policy below: which tags and attributes this app's
 * content legitimately needs.
 */

/**
 * Tags the course/answer content actually uses, plus the ordinary formatting
 * an author might reasonably reach for.
 *
 * `code` and `pre` matter beyond formatting: `CourseView` walks the rendered
 * content for `<code>` elements and swaps them for a live `CodePlayground`, so
 * stripping them would silently remove every interactive snippet.
 */
const ALLOWED_TAGS = [
  'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'code', 'div', 'em',
  'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img',
  'kbd', 'li', 'mark', 'ol', 'p', 'pre', 'samp', 'section', 'small', 'span',
  'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
  'u', 'ul', 'var',
];

/**
 * `class` carries the entire visual design — the content is Tailwind markup —
 * so it has to stay. `style` is allowed because `generateRichContent` uses it
 * for `animation-delay`; DOMPurify parses and rebuilds the declaration list, so
 * scheme-based tricks inside a style value do not survive.
 */
const ALLOWED_ATTR = [
  'alt', 'class', 'colspan', 'dir', 'height', 'href', 'id', 'lang', 'loading',
  'rel', 'rowspan', 'src', 'style', 'target', 'title', 'width',
];

/**
 * Schemes permitted on `href`/`src`: http, https, mailto, tel, and relative
 * URLs (which is what the in-app `/#/playground?...` links are). Everything
 * else is dropped, including `javascript:` and every `data:` URI — the course
 * content has no need for inline data images, and allowing them would reopen
 * `data:text/html`-adjacent tricks for the sake of a feature nobody uses.
 */
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

let hooksInstalled = false;

/**
 * Anything opening in a new tab gets `rel="noopener noreferrer"`.
 *
 * Without `noopener`, the opened page can reach back through `window.opener`
 * and navigate this tab — a redirect to a convincing fake login is the usual
 * use — and course content is full of `target="_blank"` links to external
 * documentation.
 */
const installHooks = (): void => {
  if (hooksInstalled || typeof window === 'undefined') return;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    const element = node as Element;
    if (typeof element.tagName !== 'string') return;
    if (element.tagName.toUpperCase() === 'A' && element.hasAttribute('target')) {
      element.setAttribute('rel', 'noopener noreferrer');
    }
  });

  hooksInstalled = true;
};

/**
 * Returns `html` with everything that could execute removed: `<script>`,
 * `<style>`, `<iframe>`, `<object>`, every `on*` handler, and any `href`/`src`
 * that is not a safe scheme. Formatting and layout are preserved.
 *
 * Safe to call on every render — DOMPurify parses into an inert document, so
 * nothing in the input runs and no resources are fetched during sanitisation.
 */
export const sanitizeHtml = (html: string | null | undefined): string => {
  if (!html) return '';

  // No DOM (SSR, a test runner without jsdom): returning the raw string would
  // hand an unsanitised value to whatever rendered it, so return nothing.
  if (typeof window === 'undefined') return '';

  installHooks();

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    // Belt and braces: these are already excluded by the allowlist, but naming
    // them means an accidental widening of ALLOWED_TAGS cannot bring them back.
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'base', 'meta'],
    FORBID_ATTR: ['srcset', 'formaction', 'xlink:href'],
    // Deliberately no USE_PROFILES here: it replaces ALLOWED_TAGS/ALLOWED_ATTR
    // rather than combining with them, so setting it would silently discard
    // the policy above. SVG and MathML are excluded simply by not appearing in
    // the tag allowlist.
    KEEP_CONTENT: true,
  });
};

/**
 * Plain text for the AI assistant's context window.
 *
 * The previous approach was `content.replace(/<[^>]*>?/gm, '')`, which does not
 * decode entities — `&lt;`, `&amp;`, `&nbsp;` all reached the model verbatim —
 * and mangles any content containing a literal `<`. Parsing and reading
 * `textContent` gets both right.
 */
export const htmlToPlainText = (html: string | null | undefined): string => {
  if (!html) return '';

  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  }

  const parsed = new DOMParser().parseFromString(sanitizeHtml(html), 'text/html');
  return (parsed.body.textContent || '').replace(/\s+/g, ' ').trim();
};
