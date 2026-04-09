import { macOSActivate } from '@guidepup/guidepup';
import type { VoiceOverPlaywright } from '@guidepup/playwright';
import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Maps Playwright browser type names (e.g. `chromium`) to macOS app names.
 */
export const GUIDEPUP_MACOS_APP_BY_BROWSER: Record<string, string> = {
  chromium: 'Google Chrome For Testing',
  chrome: 'Google Chrome',
  'chrome-beta': 'Google Chrome Beta',
  msedge: 'Microsoft Edge',
  'msedge-beta': 'Microsoft Edge Beta',
  'msedge-dev': 'Microsoft Edge Dev',
  firefox: 'Nightly',
  webkit: 'Playwright',
};

/**
 * Default VoiceOver `interact` / `perform` options: favor speed, only initial
 * capture, no full logging.
 */
export const guidepupVoiceOverFast = { capture: 'initial' as const };

/**
 * Resolves the macOS application name Guidepup must activate for this test's
 * browser. Uses the live browser when present, otherwise the project name.
 */
export function macOSAppNameForBrowser(page: Page, browserName: string): string {
  const key = page.context().browser()?.browserType().name() ?? browserName ?? '';
  const name = GUIDEPUP_MACOS_APP_BY_BROWSER[key];
  if (!name) {
    throw new Error(`Guidepup macOSActivate: unknown browser "${key}"`);
  }
  return name;
}

/**
 * Gets VoiceOver ready to read the page: opens the browser, brings the
 * test window forward, focuses a root element (by default `<main>`), and runs
 * Guidepup's function to enter web content.
 *
 * `browserName` is usually `test.info().project.use.browserName`. It is combined
 * with the live page browser (when available) to resolve the macOS app name for
 * `macOSActivate`.
 *
 * Guidepup normally focuses `<body>`, but focusing `<main>` avoids flaky
 * behavior when `actionTimeout` is `0`. Elements that are not focusable get
 * `tabindex="-1"` only if they do not already have a tabindex, so programmatic
 * `focus()` will work.
 */
export async function startVoiceOver(
  page: Page,
  voiceOver: VoiceOverPlaywright,
  browserName: string,
  options?: { rootSelector?: string; focusTimeoutMs?: number }
): Promise<void> {
  const app = macOSAppNameForBrowser(page, browserName);
  const rootSelector = options?.rootSelector ?? 'main';
  const focusTimeoutMs = options?.focusTimeoutMs ?? 15_000;

  voiceOver.navigateToWebContent = async () => {
    await macOSActivate(app);
    await page.bringToFront();
    const root = page.locator(rootSelector);
    await root.waitFor();
    await root.evaluate((el: HTMLElement) => {
      if (el.hasAttribute('tabindex')) {
        return;
      }
      const tag = el.tagName;
      if (tag === 'MAIN' || tag === 'BODY') {
        el.tabIndex = -1;
      }
    });
    await root.focus({ timeout: focusTimeoutMs });
    await voiceOver.interact(guidepupVoiceOverFast);
    await voiceOver.perform(voiceOver.keyboardCommands.jumpToLeftEdge, guidepupVoiceOverFast);
    await voiceOver.clearItemTextLog();
    await voiceOver.clearSpokenPhraseLog();
  };
  await voiceOver.navigateToWebContent();
}

/**
 * Focuses a target, asserts it is focused, clears VoiceOver logs, and runs
 * `moveCursorToKeyboardFocus` so the screen reader matches the focused control.
 * Use instead of Tab when focus order is unstable.
 */
export async function focusTargetForVoiceOver(target: Locator, voiceOver: VoiceOverPlaywright): Promise<void> {
  await target.focus();
  await expect(target).toBeFocused();
  await voiceOver.clearItemTextLog();
  await voiceOver.clearSpokenPhraseLog();
  await voiceOver.perform(voiceOver.keyboardCommands.moveCursorToKeyboardFocus, guidepupVoiceOverFast);
}

/**
 * Concatenates item text, last spoken phrase, and the spoken-phrase log into
 * one lowercase string. Use for flexible assertions on VoiceOver output.
 */
export async function voiceOverOutputString(voiceOver: VoiceOverPlaywright): Promise<string> {
  const parts = [
    (await voiceOver.itemText()).toLowerCase(),
    (await voiceOver.lastSpokenPhrase()).toLowerCase(),
    (await voiceOver.spokenPhraseLog()).join(' ').toLowerCase(),
  ];
  return parts.filter(Boolean).join(' | ');
}
