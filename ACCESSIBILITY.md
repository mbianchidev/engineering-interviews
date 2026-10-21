# Accessibility

## Target and current status

WCAG 2.2 Level AA is the contribution target for the practice website, documentation, and media. This is not a certification or a claim that every criterion has been independently audited.

The current interface includes a skip link, semantic navigation and main content, labeled response fields, visible keyboard focus, expandable controls with state information, automatic light/dark appearance, and reduced-motion styling. Preserve these features when making changes.

The repository does not include a dedicated automated WCAG test suite or a documented comprehensive screen-reader audit. Existing lint rules check some ARIA usage; unit tests cover question data, storage, and dependency regressions. Passing those checks alone does not establish accessibility.

## Contribution guidelines

- Use semantic HTML, logical headings, and native buttons, links, and form controls. Give controls meaningful accessible names and expose selection and expansion states.
- Keep every workflow usable with a keyboard. Preserve logical tab order, visible and unobscured focus, the skip link, and a way to leave any temporary UI. Manage focus deliberately when content changes.
- Associate labels and instructions with inputs. Explain validation errors in text and make meaningful dynamic status updates available to assistive technology without announcing every timer tick.
- Maintain at least 4.5:1 contrast for normal text, 3:1 for large text, and 3:1 for necessary control boundaries and indicators. Check both color schemes; do not use color alone to communicate status.
- Support zoom and reflow without losing content or controls. Check narrow layouts at 320 CSS pixels and zoom up to 400%. Meet WCAG 2.2 target-size requirements, including the 24-by-24 CSS-pixel minimum where applicable, and prefer larger touch targets.
- Respect `prefers-reduced-motion` and avoid unexpected movement or context changes. Provide an untimed path for practice and explain timed behavior before a round begins.
- Add descriptive alternative text to informative images and text explanations for complex diagrams. Supply captions/transcripts for any future video or audio. Use only synthetic, non-sensitive content in screenshots and test fixtures.

## Verify interface changes

Run the existing [lint, test, and build checks](SETUP.md#validate-changes), then perform the checks relevant to the changed workflow:

1. Use only the keyboard to reach the skip link, navigate topics, expand a question, write and save a response, choose practice filters/modes, advance a round, and submit all three self-evaluation ratings. Check focus order, visibility, and confirmation dialogs using synthetic saved work.
2. With a screen reader such as VoiceOver with Safari or NVDA with Firefox, check page landmarks/headings, control names and states, response labels, progress, validation, and dynamic question/evaluation changes. Record the actual browser, assistive technology, and results.
3. Check light and dark appearances, measured contrast, reduced-motion preferences, text enlargement, and narrow/zoomed layouts. Confirm that content and actions remain available without horizontal scrolling for ordinary text layouts.
4. If an automated accessibility checker is used, review and report its findings as well as the manual results. Do not treat a tool score as proof of full compliance.

## Known limitations

Standard and Hard rounds automatically advance on timeout and do not offer pause or timer-extension controls. Choose **Easy** for untimed practice. Screen-reader announcements and focus behavior across every timed transition have not been comprehensively documented as audited.

The application requires JavaScript. Saving responses and progress requires available browser local storage; there is no server-side recovery or cross-device alternative.

## Report an accessibility barrier

Open a non-sensitive [GitHub issue](https://github.com/mbianchidev/engineering-interviews/issues), including the affected page/workflow, browser and operating system, assistive technology if relevant, reproduction steps, expected behavior, and what prevented access. Synthetic examples or redacted screenshots are useful; do not include private interview responses or credentials.

For a security-sensitive problem, use [private vulnerability reporting](SECURITY.md#report-a-vulnerability-privately). For conduct concerns, use the [Code of Conduct reporting process](CODE_OF_CONDUCT.md#reporting-an-issue).
