# Contributing

Contributions are welcome; inclusion remains at the maintainer's discretion. Feel free to fork the project.

Read the [project overview](README.md), [practice guide](docs/practice.md), and [developer setup guide](SETUP.md). **Coding agents must read [AGENTS.md](AGENTS.md) before editing**, including the temporary dependency-backport TODO.

Participation follows [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), including its private reporting and enforcement process.

## Propose a change

Check existing [issues](https://github.com/mbianchidev/engineering-interviews/issues) before reporting a non-sensitive bug or proposing a feature. Include reproduction steps and expected behavior. Use synthetic responses and examples, never private interview material, credentials, or real personal data.

Report vulnerabilities through [SECURITY.md](SECURITY.md), not public issues or pull requests. For accessibility barriers and UI verification expectations, see [ACCESSIBILITY.md](ACCESSIBILITY.md).

Useful contributions include question scenarios, documentation, fixes, and improvements to the practice workflow. Discuss substantial behavior changes in an issue before implementing them.

## Develop and validate

Use Node.js 26.12.1 from `.node-version` and npm. Follow [local setup](SETUP.md#run-locally), then run the [validation commands](SETUP.md#validate-changes) before opening a pull request. Both production and development dependencies are audited.

Keep changes focused, preserve existing behavior unless the change is intentional, and add synthetic-data regression tests for behavior changes. Update directly related documentation.

For interface and media changes, follow the [accessibility guidelines and manual checks](ACCESSIBILITY.md#verify-interface-changes); automated checks alone do not establish WCAG compliance.

## Edit questions

Use [Editing questions](SETUP.md#editing-questions) for the source format and generation steps. The archived source is `legacy.md`; readers should browse and practice through the website rather than the README.

Preserve existing question wording and category headings unless a route or saved-answer migration is intentional. Include regenerated `public/questions.json` when the bank changes.

## Open a pull request

Use a feature branch and describe the change, its motivation, and the checks you ran. Address review feedback and keep CI passing. Do not include unrelated generated files or private data.

All contributors remain accountable for their work, including AI-assisted contributions. Follow the [AI policy](README.md#ai-policy), review the result, and be able to explain what it does and why it is needed.
