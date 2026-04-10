# Accessibility Testing

This page describes how Ionic Core tests accessibility in Playwright: rule violations with Axe, and screen reader behavior via Guidepup.

## Table of Contents

- [Overview](#overview)
- [Axe violations](#axe-violations)
  - [Creating a test](#creating-a-test)
  - [Disabling rules](#disabling-rules)
- [Screen reader automation](#screen-reader-automation)
  - [Playwright configuration](#playwright-configuration)
  - [VoiceOver](#voiceover)
  - [NVDA](#nvda)

## Overview

Core accessibility tests use two complementary approaches:

1. **Axe violations** (`@axe-core/playwright`) — automated checks for common accessibility issues.
2. **Screen reader automation** (`@guidepup/guidepup`, `@guidepup/playwright`) — assertions on VoiceOver output.

## Axe violations

[Axe](https://github.com/dequelabs/axe-core) evaluates the rendered page against a comprehensive set of accessibility rules, returning violations and related findings. It provides a fast, reliable way to catch issues that are difficult or time-consuming to identify through manual testing or screen reader checks alone.

Common rules flag issues such as insufficient color contrast, missing or ambiguous accessible names on buttons and inputs, images without alternative text, and keyboard accessibility problems (e.g., focus traps or controls that should be focusable but aren't). Axe also detects structural issues, like content outside of landmarks or skipped heading levels.

The exact checks depend on the rule set in use, and you can customize coverage by enabling specific tags or disabling rules per test.

### Creating a test

Import `AxeBuilder` from `@axe-core/playwright` and call `analyze()` on the page. No extra Playwright config is required for Axe violation tests.

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('badge: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * All page content should be contained by landmarks (main, nav, etc.)
       * By containing the badge in a main element, we can avoid this violation.
       */
      await page.setContent(
        `
        <main>
          <ion-badge>123</ion-badge>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
```

### Disabling rules

You can turn off specific Axe rules when a violation is a false positive or intentionally ignored for that test. In this example, `scrollable-region-focusable` is disabled because the fixture omits `ion-app`, which normally supplies the focus behavior the rule expects:

```ts
/**
 * Disable the 'scrollable-region-focusable' rule because this test
 * is missing the required `ion-app` wrapper component. The `ion-app`
 * wrapper provides the necessary focus management that allows the
 * menu content to be focusable.
 */
const results = await new AxeBuilder({ page }).disableRules('scrollable-region-focusable').analyze();
expect(results.violations).toEqual([]);
```

> [!TIP]
> For more Playwright-focused accessibility testing APIs and ideas, see [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing).

## Screen reader automation

[Guidepup](https://www.guidepup.dev/) integrates Playwright with VoiceOver on macOS, exposing item text and spoken phrase logs you can check against. This allows you to validate what assistive technologies actually communicate to users, something DOM-based checks and tools like Axe don't fully capture.

Typical tests verify announced names and roles, including text derived from visible labels or aria-label attributes. They also confirm that announcements update correctly when focus changes or when controls expand, collapse, or otherwise change state.

### Playwright configuration

Guidepup is already configured in this repository. The following are required and should not be removed:

1. **Guidepup packages** — `@guidepup/guidepup` and `@guidepup/playwright` must be installed in core.
2. **Merged Playwright config** — [`screenReaderConfig`](/core/playwright.config.ts) from `@guidepup/playwright` is included to apply Guidepup's defaults.
3. **VoiceOver Safari project** — On macOS, the config defines a headed VoiceOver Safari project with `testMatch`: `test/voiceover/**/*.e2e.ts`. This is the only project that runs VoiceOver specs.
4. **Single worker on macOS (and CI)** — [`workers`](/core/playwright.config.ts) is set to `1` on macOS or in CI to prevent parallel workers from conflicting over a shared VoiceOver session.

### VoiceOver

#### Creating a test

1. **Path** — Create the test at `core/src/components/<component>/test/voiceover/*.e2e.ts` so it matches the VoiceOver Safari `testMatch`.

2. **Imports** — Import `test` from `@utils/test/playwright` (Ionic's helpers are merged with Guidepup's `voiceOver` fixture). Import the VoiceOver helpers you need, for example:

   ```ts
   import {
     configureVoiceOverTests,
     configs,
     focusTargetForVoiceOver,
     startVoiceOver,
     test,
     voiceOverOutputString,
   } from '@utils/test/playwright';
   ```

3. **Test setup** — At the start of each `test.describe`, `configureVoiceOverTests()` needs to be called to skip the test if VoiceOver is unavailable.

4. **Page content** — Tests can be written using either `page.setContent` or `page.goto` like other core E2E tests. The test content needs to be wrapped in a `<main>` so VoiceOver will focus the content properly.

5. **Order** — After the page content has been defined, `startVoiceOver` needs to be called. `startVoiceOver` waits for the root locator (default `main`) and runs Guidepup web entry. If the markup is not there yet, the wait will time out.

6. **Typical flow** — Load the page, optionally assert visibility, start VoiceOver, then for each control: `focusTargetForVoiceOver(locator, voiceOver)` and assert on `voiceOverOutputString(voiceOver)`.

   ```ts
   test.describe(title('my-component: voiceover'), () => {
     configureVoiceOverTests();

     test('announces the control', async ({ page, voiceOver, browserName }) => {
       await page.setContent(`<main>...</main>`, config);
       await startVoiceOver(page, voiceOver, browserName);

       await focusTargetForVoiceOver(myLocator, voiceOver);
       const output = await voiceOverOutputString(voiceOver);
       expect(output).toMatch(/expected phrase/i);
     });
   });
   ```

7. **Optional** — Add static HTML at `test/voiceover/index.html` for manual testing.

For a full example, refer to [Breadcrumbs](/core/src/components/breadcrumbs/test/voiceover/breadcrumbs.e2e.ts).

#### Running VoiceOver locally

> [!IMPORTANT]
> A **Mac** is required to run VoiceOver tests locally.

1. `cd core`
2. Run: `npx @guidepup/setup`
3. Complete [manual VoiceOver setup (local)](https://www.guidepup.dev/docs/guides/manual-voiceover-setup#local-setup)
4. Confirm detection:

   ```bash
   node -e "const { voiceOver } = require('@guidepup/guidepup'); voiceOver.detect().then(v => console.log('voiceOver.detect =', v));"
   ```

5. You should see `voiceOver.detect = true`.
6. Run tests:

   ```bash
   npm run test.e2e
   ```

   Single file:

   ```bash
   npm run test.e2e src/components/breadcrumbs/test/voiceover/breadcrumbs.e2e.ts
   ```

7. Approve Accessibility (and Screen Recording, if asked) when macOS prompts you.
8. If tests skip, open **System Settings → Privacy & Security → Accessibility** and enable the app that starts Playwright (Terminal, iTerm, Cursor, VS Code, and so on).

9. If VoiceOver does not shut down after a run:

    ```bash
    osascript -e 'tell application "VoiceOver" to quit'
    ```

    If it is still running:

    ```bash
    killall "VoiceOver"
    ```

### NVDA

> [!IMPORTANT]
> A **Windows** machine is required to run Guidepup with NVDA.

> [!NOTE]
> NVDA is **not supported** locally in Ionic Framework core at this time. Automated screen reader tests in this repository are currently only configured for [VoiceOver on macOS](#voiceover).
