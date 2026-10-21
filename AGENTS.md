# Agent instructions

## Repository map and validation

Read the [developer guide](SETUP.md) and [contribution guidance](CONTRIBUTING.md). The [documentation index](docs/README.md) links user and developer workflows.

The README is a website-first landing page. Keep question content in `legacy.md`; `lib/parseQuestions.ts` reads that source, and `scripts/generate-questions.ts` produces `public/questions.json`. Do not move questions back into the README. Preserve question wording and category headings unless changing saved-answer IDs or topic routes is intentional.

Use Node.js 24 LTS and npm. Run the [validation commands](SETUP.md#validate-changes) for changes, keep generated question data consistent, and use only synthetic data in tests and screenshots.

## TODO: Replace the temporary braces security backport

**Check this TODO when working on dependencies in this repository. Keep the accepted pin until an official compatible fix is verified.**

`package.json` scopes an npm override to `@next/eslint-plugin-next`, replacing its transitive `braces` dependency with **`npm:@dieub/braces-depth-guard@3.0.3-pn.0`**. The affected chain is `eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`.

The community backport is temporary: upstream `braces@3.0.3` had no published fix for [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) when the workaround was adopted. It adds parser and AST depth guards against stack-exhaustion denial of service while preserving ordinary brace and glob behavior.

1. Check the advisory and official upstream `braces` and Next.js ESLint-plugin releases for a published fix. Confirm that it addresses the actual nesting vulnerability, not just the audit report.
2. When a compatible official fix is available, replace the community alias with that release, or remove the override after a compatible parent upgrade supplies the fix. Regenerate `package-lock.json`; do not downgrade Next.js or disable lint rules to hide the finding.
3. Retain the useful regression coverage in `tests/braces.test.ts` and `tests/lintGlobs.test.ts`. Adapt dependency-resolution or legitimate API details if necessary, but preserve checks for excessive input/AST depth, ordinary brace behavior, and literal, absolute, wildcard, and array directory roots.
4. Rerun clean installation, full dependency auditing (including development dependencies), targeted security/glob checks, and the existing validation:

   ```bash
   npm ci
   npm audit
   node --import tsx --test tests/braces.test.ts tests/lintGlobs.test.ts
   npm run lint
   npm test
   npm run build
   DEPLOY_ENV=github-pages npm run build
   ```

5. Require a clean full audit and passing checks before retiring the workaround. Do not substitute `npm audit --omit=dev` for the full audit. Update the backport note in `SETUP.md` and this TODO when the official fix is in place.
