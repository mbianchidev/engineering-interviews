# Engineering Interview Practice - Next.js Website

A modern, minimalist web application for practicing engineering interview questions. This website transforms the engineering-interviews repository into an interactive study platform.

## Features

- 📚 **Browse by Topic**: Explore 210+ questions organized by categories including DevOps, Backend, Frontend, and more
- 🎯 **Practice Mode**: Get random questions with a built-in timer to simulate real interview conditions
- ⏱️ **Timer**: Track how long you spend on each question
- ➡️ **Skip Functionality**: Move to the next question whenever you're ready
- 📊 **Progress Tracking**: See how many questions you've viewed
- 🌗 **Dark Mode**: Automatic dark mode support for comfortable studying
- 📱 **Responsive Design**: Works great on desktop, tablet, and mobile devices
- 🎨 **Clean UI**: Minimalist design focused on the content, no clutter

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mbianchidev/engineering-interviews.git
cd engineering-interviews
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The build creates a static export in the `out/` directory.

### Building for Static Export (GitHub Pages)

This project is configured to export as a static site for GitHub Pages deployment:

```bash
npm run build
```

The static files will be generated in the `out/` directory, ready for deployment.

## Deployment

### GitHub Pages

This repository includes a GitHub Actions workflow that automatically deploys the website to GitHub Pages when changes are pushed to the `main` branch.

**Setup Steps:**

1. Go to your repository's Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push to the `main` branch to trigger the deployment

The site will be available at: `https://<username>.github.io/engineering-interviews/`

You can also manually trigger the deployment workflow from the Actions tab.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages deployment workflow
├── app/
│   ├── practice/              # Practice mode page
│   ├── topics/                # Topic browsing pages
│   │   └── [categoryId]/      # Dynamic category pages
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── lib/
│   ├── parseQuestions.ts      # Question parsing logic
│   └── questionsData.ts       # Client-side questions data
├── scripts/
│   └── generate-questions.ts  # Build-time question JSON generator
├── public/
│   └── questions.json         # Generated questions data
├── README.md                  # Original interview questions
└── SETUP.md                   # This file
```

## How It Works

The application parses the `README.md` file at build time to extract:
- Question categories (General, DevOps, Software Engineering)
- Subcategories (Git, Network, React, etc.)
- Individual questions

The build process:
1. Runs `generate-questions.ts` to parse README.md and create `public/questions.json`
2. Generates static pages for each topic category via SSG
3. Exports all pages as static HTML in the `out/` directory
4. The practice mode loads questions from the JSON file client-side

## License

See the main README.md for project information and guidelines.

## Contributing

Contributions are welcome! Please refer to the main README.md for contribution guidelines.
