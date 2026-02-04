---
name: accessibility-implementation
overview: Implement Canadian accessibility standards (WCAG 2.1 AA) by adding automated testing tools, structural enhancements (skip links, landmarks), and component improvements.
todos:
  - id: install-axe
    content: Install @axe-core/react and setup in a new component `AxeCore.tsx`
    status: completed
  - id: add-skip-link
    content: Add SkipToContent component and integrate into RootLayout
    status: completed
  - id: add-main-landmark
    content: Update RootLayout or Page templates to use <main id='main-content'>
    status: completed
  - id: global-focus
    content: Add global focus styles to globals.css
    status: completed
  - id: audit-image-renderer
    content: Audit and update ImageRenderer.tsx for robust alt text handling
    status: completed
---

# Accessibility Implementation Plan

This plan outlines the steps to ensure the application follows Canadian accessibility practices (primarily WCAG 2.1 Level AA, as required by AODA/ACA).

## 1. Automated Testing & Tooling

Add tools to catch accessibility issues during development.

- **Install `axe-core` and `@axe-core/react`**: These will log accessibility errors to the Chrome DevTools console in development mode.
- **Verify ESLint**: Ensure `eslint-plugin-jsx-a11y` is configured and enforcing strict rules.

## 2. Structural Improvements

Implement core navigation and landmark features.

- **Skip to Content Link**: Add a hidden-until-focused link at the top of `src/app/(frontend)/layout.tsx` that jumps to the main content.
- **Main Landmark**: Wrap the page content in `<main id="main-content">` in `src/app/(frontend)/layout.tsx` (or ensure it exists in page templates) to support the skip link and screen reader navigation.

## 3. Component Enhancements

Refine existing renderers to ensure semantic HTML.

- **`ImageRenderer.tsx`**: Ensure images with no alt text provided by the CMS default to `alt=""` (decorative) only if appropriate, or warn in dev.
- **`TableRenderer.tsx`**: Review logic for `scope="col"` vs `scope="row"`. Ensure complex tables have proper headers.
- **Global Focus Styles**: Update `globals.css` to ensure a high-contrast focus ring is visible on all interactive elements (buttons, links, inputs).

## 4. Manual Verification Steps

(To be performed after implementation)

- **Keyboard Navigation**: Tab through the entire site. Ensure you can reach every link/button and see where you are.
- **Zoom**: Zoom to 200%. Ensure no content overlaps or disappears.
- **Screen Reader**: Brief test with VoiceOver (Mac) or NVDA (Windows) to ensure the skip link works and headings are announced.