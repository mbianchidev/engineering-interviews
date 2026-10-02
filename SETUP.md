# Engineering Interview Practice

A static Next.js website for working through the interview questions in [README.md](README.md).

## Features

- **Browse by topic:** 366 questions across engineering fundamentals, software engineering, coding and problem solving, platforms and SRE, and observability.
- **Practice rounds:** Ten randomly selected questions per round, with topic and subtopic selection. Select at least ten questions when applying a filter; no selection means the full bank.
- **Three practice modes:** Easy has no timer. Standard allows five minutes per question and rolls unused time into an extra-time pool. Hard has five minutes with no rollover. Timed modes advance when time expires.
- **Responses and progress:** Write, revisit, or clear answers, track viewed questions, and review self-evaluations after a round.
- **Questions to ask companies:** Expand sections about culture, growth, role expectations, and company fit.
- **Responsive styling:** Shared typography and components, automatic light/dark appearance, visible keyboard focus, and reduced-motion support.

Responses, viewed-question IDs, and evaluations stay in browser local storage. Responses save when the text box loses focus or the practice question changes. There is no account or backend; clearing browser storage removes your saved work.

The additional coding prompts abstract reusable concepts from exercises rather than publishing company-specific assignments. Observability covers OpenTelemetry, Prometheus/PromQL, Grafana, instrumentation, telemetry pipelines, and tail latency. Reliability and platform scenarios draw inspiration from the [Platform Engineering Roadmap](https://platform-engineering-roadmap.mbianchi.dev/).

## Run locally

Use Node.js 24 LTS, matching CI, and npm.

```bash
git clone https://github.com/mbianchidev/engineering-interviews.git
cd engineering-interviews
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validate changes

```bash
npm run lint
npm test
npm audit
npm run build
```

Tests check question coverage, unique IDs, stable existing routes and representative question IDs, generated-data consistency, and local-storage behavior using synthetic data. The PR workflow runs installation, audit, lint, tests, and a production export.

## Build and deployment

```bash
npm run build
```

Production builds always create a static export in `out/`. Serve that directory with a static host that resolves extensionless routes to their `.html` files. `next start` is not a preview server for a static export.

To reproduce the GitHub Pages asset prefix locally:

```bash
DEPLOY_ENV=github-pages npm run build
```

This exports links and assets under `/engineering-interviews`. GitHub Actions selects the same prefix automatically through `GITHUB_ACTIONS=true`.

The [Pages workflow](.github/workflows/deploy.yml) publishes after changes reach `main`, or when manually dispatched. Draft pull requests do not deploy.

In repository **Settings > Pages**, choose **GitHub Actions** as the build source. The website is available at [mbianchidev.github.io/engineering-interviews](https://mbianchidev.github.io/engineering-interviews/).

## Stack and structure

Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS. Space Grotesk and DM Sans are bundled through Fontsource packages; no external font service is contacted by the browser.

```text
.github/workflows/ci.yml       PR validation
.github/workflows/deploy.yml   GitHub Pages deployment
app/components/               Shared header, page headings, and icons
app/topics/                   Topic index and question pages
app/practice/                 Practice modes and self-evaluations
app/ask-companies/             Company questions
app/globals.css                Shared design tokens and responsive styling
lib/parseQuestions.ts          README parser and question types
lib/questionsData.ts           Generated data for client components
lib/*Storage.ts                Browser-local responses, progress, and ratings
lib/topicPresentation.ts       Topic descriptions and question counts
scripts/generate-questions.ts  Question JSON generator
public/questions.json         Generated question data
tests/                        Question and storage regression tests
README.md                     Canonical question bank
```

## Editing questions

Keep the question bank in `README.md`. Top-level headings define categories, second-level headings define subtopics, and question bullets start with an uppercase letter. The parser skips the introductory, resource, STAR, behavioral, and outro sections.

Run `npm run generate-questions` after editing questions and commit the updated `public/questions.json`. Development, tests, and production builds also regenerate it automatically. Topic pages are generated at build time; practice mode imports the same data.

Question IDs derive from their text. Changing an existing question's wording changes its ID and disconnects previously saved answers and viewed status. Append new questions rather than rewording existing ones unless that migration is intentional. Give a new subtopic at least ten questions so it can be selected for a complete practice round.

## Contributing and license

See [README.md](README.md) for contribution guidelines. Licensed under [AGPL-3.0](LICENSE).
