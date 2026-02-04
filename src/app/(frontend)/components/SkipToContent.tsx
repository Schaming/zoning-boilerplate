import React from 'react'

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-background text-foreground px-4 py-2 border rounded-md shadow-md"
    >
      Skip to main content
    </a>
  )
}
