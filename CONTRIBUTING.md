# Contributing to SkillVerse ✨

Welcome to the **SkillVerse** contributor guidelines!

SkillVerse is an advanced, modern E-learning platform designed to simulate a real SaaS product. Our mission is to deliver a personalized, engaging, and career-focused learning experience through high-quality UI/UX, structured courses, gamification, and real-world interview preparation.

Whether you're fixing a bug, improving the UI, or adding new features, we appreciate your time and effort in making this platform better.

---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Before You Start](#before-you-start)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Issue Workflow](#issue-workflow)
- [Code Review Expectations](#code-review-expectations)
- [Good First Contributions](#good-first-contributions)
- [Documentation Standards](#documentation-standards)
- [Security](#security)
- [Community Guidelines](#community-guidelines)
- [Recognition](#recognition)
- [ECSOC 2026 Guidelines](#ecsoc-2026-guidelines)

---

## Ways to Contribute

You can contribute to SkillVerse in several ways:

- **UI & Frontend**: Enhancing components, glassmorphism effects, and Framer Motion animations.
- **Accessibility (a11y)**: Improving ARIA labels, semantic HTML, and keyboard navigation.
- **Performance**: Optimizing React re-renders, lazy loading, and asset delivery.
- **Bug Fixes**: Resolving issues across the dashboard, course viewer, and career mode.
- **Documentation**: Improving this repository's README, inline code comments, and guides.
- **Testing**: While automated tests aren't configured yet, manual testing reports and UI verification are highly valued.
- **Feature Ideas**: Suggesting or building gamification improvements, new mock interview categories, or certificate designs.
- **Refactoring**: Cleaning up large view files (like `LandingPage.tsx` or `CareerMode.tsx`) into smaller, modular components.

---

## Before You Start

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher recommended.
- **Package Manager**: npm (we use `package-lock.json`).
- **Git**: Basic knowledge of branching, commits, and PRs.

### Environment Variables

SkillVerse uses Firebase for authentication and database, and Google Gemini API for AI features. You will need to set up environment variables locally for these services to function. See the `.env.example` file in the root directory for the required keys.

---

## Local Development Setup

Follow these exact steps to run SkillVerse locally:

### 1. Clone the repository

```bash
git clone https://github.com/Khushi1310-nayak/SkillVerse.git
cd SkillVerse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Copy the `.env.example` file to a new file named `.env` and fill in your Firebase and OpenRouter/Gemini API credentials.

```bash
cp .env.example .env
```

### 4. Run development server

```bash
npm run dev
```

### 5. Build for production

To ensure your changes compile correctly:

```bash
npm run build
```

### 6. Preview production build

```bash
npm run preview
```

### Linting, Type Checking, Formatting & Testing

> [!NOTE]
> Currently, `package.json` does not include specific scripts for linting, automated type checking (e.g., `tsc --noEmit`), formatting (Prettier), or testing (Jest/Vitest).
>
> **Expectation**: Ensure your IDE is configured to use TypeScript strictly (as defined in `tsconfig.json`) and verify that `npm run build` succeeds before opening a PR. Please match the existing code formatting manually.

---

## Project Structure

Understanding the repository layout will help you navigate the codebase:

- **`components/`**: Core React components and views (e.g., `Dashboard.tsx`, `CareerMode.tsx`, `Auth.tsx`). Note that some components act as full page views.
- **`contexts/`**: React Context providers for global state management.
- **`firebase/`**: Firebase configuration (`firebase.ts`) and auth providers (`providers.ts`).
- **`guards/`**: Route protection components (e.g., redirecting unauthenticated users).
- **`hooks/`**: Custom React hooks for reusable logic.
- **`services/`**: External API integrations (e.g., AI assistant communication).
- **`utils/`**: Helper functions and shared utilities.
- **`public/`**: Static assets like icons and images.
- **`index.html`**: Entry point. **Note**: Tailwind CSS configuration and dark mode defaults are injected here via CDN scripts and inline styles.

---

## Development Guidelines

### React Best Practices

- Use functional components and hooks.
- Keep state as local as possible. Use context only for global states like Auth or Theme.
- Avoid unnecessary re-renders.

### TypeScript Conventions

- Use `interface` for object shapes and `type` for unions/intersections.
- Avoid using `any`. Always strictly type your props and API responses.
- Follow the `tsconfig.json` which enforces strict mode (`"strict": true`).

### Component Organization & Philosophy

- **Modularization**: Large files like `LandingPage.tsx` (67KB) should ideally be broken down into smaller, reusable components in future PRs.
- **Props**: Destructure props in the function signature.
- **Exporting**: Use default exports for page views and named exports for utility components.

### Naming Conventions

- **Files/Components**: PascalCase (e.g., `CourseView.tsx`, `CertificateDisplay.tsx`).
- **Functions/Variables**: camelCase (e.g., `handleLogin`, `fetchUserData`).
- **Constants**: UPPER_SNAKE_CASE (e.g., in `constants.ts`).

### Tailwind & Styling Conventions

> [!IMPORTANT]
> Tailwind is configured directly in `index.html` via a CDN script, not through a standard `tailwind.config.js` build step.

- Use Tailwind utility classes for all styling.
- Utilize the custom theme colors defined in `index.html` (`bg-primary`, `text-textMain`, `bg-background`).
- SkillVerse is a **Dark Mode first** application. The `.dark` class is applied by default on the `<html>` tag. Ensure all new components look premium in dark mode.
- Use the provided custom utility classes like `.glass-bg`, `.bg-gradient-input`, and `.certificate-pattern` where appropriate.

### Accessibility (a11y) & Responsive Design

- Ensure all interactive elements have focus states.
- Use semantic HTML (`<main>`, `<section>`, `<button>`, `<nav>`).
- Always use mobile-first Tailwind prefixes (`sm:`, `md:`, `lg:`) to ensure responsiveness across all devices.

### Animation Guidelines

- We use **Framer Motion** for complex animations and Tailwind classes (`animate-fade-in`, `animate-float`) for simple micro-interactions.
- Keep animations smooth, subtle, and purposeful. Avoid excessive motion that detracts from learning.

---

## Pull Request Guidelines

### Branch Naming

Use descriptive branch names prefixing the type of work:

- `feature/add-dark-mode-toggle`
- `bugfix/fix-auth-redirect`
- `refactor/split-landing-page`
- `docs/update-readme`

### Commit Message Recommendations

- Use imperative mood: "Add new course category" instead of "Added new course category".
- Keep the first line under 50 characters.

### PR Expectations

- **Small & Focused**: Do not combine unrelated changes in a single PR.
- **Screenshots/Videos**: If your PR alters the UI, you **must** include before/after screenshots or a short GIF/video in the PR description.
- **Responsive Testing**: Verify your UI changes look good on mobile, tablet, and desktop views.

### Self-Review Checklist

- [ ] Have I tested this locally using `npm run dev`?
- [ ] Does `npm run build` complete without TypeScript errors?
- [ ] Does the UI adhere to the dark-mode-first glassmorphism aesthetic?
- [ ] Did I remove all `console.log` statements used for debugging?

---

## Issue Workflow

- **Claiming Issues**: Comment on the issue requesting assignment. Wait for a maintainer to assign the issue before beginning work. Pull requests for unassigned issues may be closed without review.
- **Discussing Features**: For new features, open an issue first to discuss the idea with maintainers before writing code.
- **Bug Reports**: Provide clear steps to reproduce, expected behavior, actual behavior, and browser/OS details.

---

## Code Review Expectations

Maintainers look for:

- Adherence to the existing architecture (LocalStorage + Firebase).
- Strict TypeScript typing.
- Premium UI aesthetics matching the rest of the app.

**Common reasons PRs are rejected:**

- Introducing heavy backend dependencies (the app is designed to be frontend-heavy with Firebase).
- Breaking responsiveness on mobile devices.
- Failing to follow the dark mode styling.
- Large, monolithic PRs containing unrelated changes.

---

## Good First Contributions

If you are new to the project, here are some great areas to start:

1. **Mock Interview Questions**: Add new company-specific questions to `CareerMode.tsx`.
2. **UI Polish**: Replace standard browser scrollbars with custom CSS or fix alignment issues on mobile.
3. **Component Refactoring**: Extract smaller components from `LandingPage.tsx` or `Auth.tsx`.
4. **Content**: Add new learning materials to the existing course data structures.

---

## Documentation Standards

- Keep README and markdown files clean and professional.
- Use emojis sparingly in headings to maintain a welcoming but professional tone.
- Document complex logic inside hooks or services using standard inline comments.

---

## Security

- **Responsible Disclosure**: If you find a security vulnerability (e.g., in Firebase rules), do not open a public issue. Contact the maintainer directly.
- **Never Commit Secrets**: Never commit `.env` files or hardcode API keys. Always use `import.meta.env` or the defined `process.env` wrappers setup in `vite.config.ts`.

---

## Community Guidelines

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inspiring environment for all.

---

## Recognition

Contributors who have their PRs merged will be highlighted in our repository's contributor graph. Significant contributions may be acknowledged in release notes.

---

## ECSOC 2026 Guidelines

For contributors participating in the **Elite Coders Summer of Code (ECSoC) 2026**:

1. **Claim First**: You must claim an issue, receive maintainer assignment, and only then begin work. PRs submitted without prior assignment may be closed.
2. **Reference the Issue**: Your Pull Request must reference the issue number (e.g., `Fixes #12`).
3. **Required Label**: Your PR must have the `ECSoC26` label. If you do not have permission to add labels, request a maintainer to add it for you before the PR is merged.
4. **Keep PRs Focused**: Only submit changes related to the specific issue you claimed.
5. **No Unrelated Changes**: Do not combine refactoring, formatting changes, or other features with your assigned issue task.

---

Thank you for helping make SkillVerse the best learning platform! 🚀
