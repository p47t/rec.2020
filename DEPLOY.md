# Deployment Guide

This project is a static web application built using **Vite** and deployed to **Cloudflare Workers** using **mise** for managing development dependencies and tasks.

## Cloudflare Workers (Primary)

### Prerequisites

Ensure you have [mise](https://mise.jdx.dev) installed.

1. Install project tools:
   ```bash
   mise install
   npm install
   ```

2. Start the development server:
   ```bash
   mise run dev
   ```

3. Build the static assets:
   ```bash
   mise run build
   ```

4. Preview the production build locally:
   ```bash
   mise run preview
   ```

5. Deploy to Cloudflare Workers:
   ```bash
   mise run deploy
   ```

Deployed Worker: [https://rec-2020.simplypatrick.workers.dev](https://rec-2020.simplypatrick.workers.dev)

---

## Alternative Options

### Option 2: GitHub Pages
1. Push this repository to GitHub.
2. Go to repository **Settings** -> **Pages**.
3. Under **Build and deployment**, configure GitHub Actions with Vite, or deploy `dist` to GitHub Pages.

### Option 3: Netlify / Vercel
Connect your repository and set:
- Build command: `npm run build`
- Output directory: `dist`
