# Deployment Guide

This project is a static web application consisting of HTML, CSS, and JavaScript files. You can deploy it using any static site hosting service.

## Option 1: GitHub Pages (Recommended if using GitHub)

1.  Push this repository to GitHub.
2.  Go to the repository **Settings**.
3.  Navigate to the **Pages** section.
4.  Under **Source**, select `Deploy from a branch`.
5.  Select your main branch (e.g., `main` or `master`) and the `/ (root)` folder.
6.  Click **Save**.
7.  Your site will be live at `https://<username>.github.io/<repo-name>/`.

## Option 2: Netlify (Drag & Drop)

1.  Go to [Netlify](https://www.netlify.com/).
2.  Log in or sign up.
3.  Drag and drop the project folder (containing `index.html`) into the "Sites" area on your dashboard.
4.  Netlify will automatically deploy the site and give you a URL.

## Option 3: Vercel

1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in the project directory.
3.  Follow the prompts (mostly default settings).
4.  Your site will be deployed instantly.

## Option 4: Local Testing

To run the site locally, you can use a simple HTTP server.

**Using Python:**
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Using VS Code:**
Install the "Live Server" extension and click "Go Live" in the status bar.
