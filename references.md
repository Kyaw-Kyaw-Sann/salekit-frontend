>>>> vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})

/////////////////////////////////////////////////

>>>> index.css

@import "tailwindcss";

@theme {
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-on-primary: #ffffff;

  --color-sidebar: #111827;
  --color-sidebar-hover: #1f2937;
  --color-sidebar-border: #374151;
  --color-sidebar-text: #f9fafb;
  --color-sidebar-muted: #d1d5db;

  --color-background: #f8fafc;
  --color-surface: #ffffff;

  --color-heading: #111827;
  --color-body: #4b5563;
  --color-muted: #9ca3af;
  --color-border: #e5e7eb;

  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-body);
  font-family: Arial, Helvetica, sans-serif;
}

button,
input,
select,
textarea {
  font: inherit;
}

/////////////////////////////////////////////////////

