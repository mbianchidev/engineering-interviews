# Engineering Interview Practice

Developer setup for the static Next.js [practice website](https://mbianchidev.github.io/engineering-interviews/). For practice modes, saved answers, self-evaluations, and troubleshooting, see the [user guide](docs/practice.md).

## Run locally

Use Node.js 24 LTS, matching CI, and npm.

Validation and Pages jobs use the explicit Ubuntu 24.04 runner image rather than the moving `ubuntu-latest` label.

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

Tests check the `legacy.md` source independently of the README, question coverage, unique IDs, stable existing routes and representative question IDs, generated-data consistency, local-storage behavior, Next.js lint-root glob compatibility, and brace nesting limits using synthetic data. The PR workflow runs installation, audit, lint, tests, and a production export.

CI audits both production and development dependencies. A scoped npm override pins `braces` within the Next.js ESLint plugin's dependency tree to the community backport `@dieub/braces-depth-guard@3.0.3-pn.0` while an upstream fix for [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) remains unpublished. Its only runtime changes from `braces@3.0.3` are nesting-depth guards: inputs and ASTs deeper than 100 levels are rejected, and stricter `maxDepth` limits are supported. Next.js, ESLint, and globbing APIs and lint rules are unchanged. Revisit the override when an official patched release becomes available.

Next.js is pinned to `16.4.2`, which includes fixes for [image-optimization remote code execution](https://github.com/advisories/GHSA-2464-fhr4-w9xw) and [Server Actions denial of service](https://github.com/advisories/GHSA-p3m5-59mp-jv5r). The existing ESLint toolchain is unchanged.

### Dependency install scripts

`package.json` records exact-version `allowScripts` approvals for the reviewed `esbuild@0.25.12`, `unrs-resolver@1.11.1`, and macOS-only `fsevents@2.3.3` dependencies. Current npm uses these approvals for dependency lifecycle scripts; unreviewed packages or upgraded versions remain subject to review.

Use `npm install-scripts ls` to inspect pending approvals. After a dependency upgrade, read the affected lifecycle script and its helpers before recording a new pinned approval with `npm install-scripts approve <package>`. Do not use blanket `--all` approval or global script permissions. Rerun clean installation, the full audit, tests, lint, and builds after changing approvals.

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
lib/parseQuestions.ts          Legacy question-bank parser and question types
lib/questionsData.ts           Generated data for client components
lib/*Storage.ts                Browser-local responses, progress, and ratings
lib/topicPresentation.ts       Topic descriptions and question counts
scripts/generate-questions.ts  Question JSON generator
public/questions.json         Generated question data
tests/                        Question and storage regression tests
legacy.md                     Canonical question bank and archived interview material
README.md                     Website-first project overview
docs/README.md                User/developer documentation index
```

The parser reads `legacy.md`, excluding introductory, behavioral, and closing sections from practice rounds. The generator writes `public/questions.json` for client components; topic pages read the same source directly and are generated at build time. The README is independent of that data flow. Browser-local helpers store answers, viewed IDs, and self-evaluations; no backend is involved.

## Editing questions

Keep the question bank in [`legacy.md`](legacy.md), not the README. It preserves the original interview material from `Intro` onward, while the website is the default reading and practice interface. Top-level headings define categories, second-level headings define subtopics, and question bullets start with an uppercase letter. The parser skips the introductory, behavioral, and outro sections.

Run `npm run generate-questions` after editing questions and commit the updated `public/questions.json`. Development, tests, and production builds also regenerate it automatically. Topic pages are generated at build time; practice mode imports the same data.

Question IDs derive from their text. Changing an existing question's wording changes its ID and disconnects previously saved answers and viewed status. Append new questions rather than rewording existing ones unless that migration is intentional. Give a new subtopic at least ten questions so it can be selected for a complete practice round.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and [AGENTS.md](AGENTS.md) for agent instructions. Licensed under [AGPL-3.0](LICENSE).

Follow the [Code of Conduct](CODE_OF_CONDUCT.md), [security reporting policy](SECURITY.md), and [accessibility contribution guidance](ACCESSIBILITY.md). Contributor Covenant's attribution and CC BY-SA 4.0 license are retained in the Code of Conduct.
