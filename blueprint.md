# Personal Stylist App Blueprint

## Project Overview
A personal stylist service that helps users find their best style based on their physical characteristics.

## Design Principles
- **Modern Aesthetics:** Clean spacing, vibrant colors, multi-layered shadows, and subtle textures.
- **Responsiveness:** Works perfectly on both mobile and web.
- **Accessibility:** Follows WAI-ARIA standards using MUI.
- **User Experience:** Intuitive navigation and interactive feedback (glow effects, animations).

## Tech Stack
- **Framework:** React 19 (Vite)
- **UI Library:** Material UI (MUI)
- **Routing:** React Router DOM
- **Icons:** MUI Icons

## Current Implementation Plan: User Input Screen
1. **Goal:** Create a screen where users can enter their basic information: photo, height, and weight.
2. **Steps:**
    - Install `react-router-dom`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`.
    - Set up `BrowserRouter` in `src/main.jsx` or `src/App.jsx`.
    - Create `src/pages/SetupProfile.jsx` with:
        - Photo upload component with preview.
        - Height input (with units).
        - Weight input (with units).
        - "Next" button with modern styling (glow effect).
    - Update `src/App.jsx` to route to this new page.
    - Apply global styles for background texture and premium feel.
