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
npm start
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## Project Structure

```
├── app/
│   ├── api/questions/       # API endpoint for questions
│   ├── practice/            # Practice mode page
│   ├── topics/              # Topic browsing pages
│   │   └── [categoryId]/    # Dynamic category pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── lib/
│   └── parseQuestions.ts    # Question parsing logic
├── README.md                # Original interview questions
└── SETUP.md                 # This file
```

## How It Works

The application parses the `README.md` file at build time to extract:
- Question categories (General, DevOps, Software Engineering)
- Subcategories (Git, Network, React, etc.)
- Individual questions

This data is then used to:
1. Generate static pages for each topic category
2. Provide an API endpoint for the practice mode
3. Enable random question selection with progress tracking

## License

See the main README.md for project information and guidelines.

## Contributing

Contributions are welcome! Please refer to the main README.md for contribution guidelines.
