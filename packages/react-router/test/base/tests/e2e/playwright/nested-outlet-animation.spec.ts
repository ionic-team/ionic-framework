import { test, expect } from '@playwright/test';
import { ionPageVisible, ionNav, ionBackClick } from './utils/test-utils';

/**
 * Tests that nested outlet back navigation animates correctly on both
 * iOS and MD modes. Regression test for bug where back button navigation
 * in nested outlets animated on iOS but not on MD.
 *
 * These tests run with animations ENABLED (no ionic:_testing=true).
 */
test.describe('Nested outlet back animation', () => {
  /**
   * Helper: installs a probe that records whether a real CSS animation ran
   * on any element inside a router outlet during a navigation.
   *
   * Uses document.getAnimations() polling via requestAnimationFrame to catch
   * animations that may be short-lived (MD back is only 200ms).
   */
  async function installAnimationProbe(page: import('@playwright/test').Page) {
    await page.evaluate(() => {
      (window as any).__ionAnimProbe = { detected: false, count: 0, targets: [] as string[] };
      let polling = true;
      const poll = () => {
        if (!polling) return;
        const anims = document.getAnimations();
        if (anims.length > 0) {
          (window as any).__ionAnimProbe.detected = true;
          (window as any).__ionAnimProbe.count = anims.length;
          (window as any).__ionAnimProbe.targets = anims.map((a) => {
            const target = (a.effect as KeyframeEffect)?.target as HTMLElement | null;
            return target ? `${target.tagName}.${target.className}` : 'unknown';
          });
        }
        requestAnimationFrame(poll);
      };
      requestAnimationFrame(poll);
      // Stop polling after 2s to avoid memory leaks
      setTimeout(() => {
        polling = false;
      }, 2000);
    });
  }

  async function readAnimationProbe(page: import('@playwright/test').Page) {
    return page.evaluate(() => (window as any).__ionAnimProbe as { detected: boolean; count: number; targets: string[] });
  }

  // --- NestedOutlet: back from nested outlet to parent level ---

  test('MD mode: back with direction="back" from nested outlet to parent should animate', async ({ page }) => {
    await page.goto('/nested-outlet?ionic:mode=md');
    await ionPageVisible(page, 'firstpage');

    await ionNav(page, 'ion-button', 'Go to second page');
    await ionPageVisible(page, 'secondpage');

    // Verify the leaving page has visible content during the back animation.
    // The MD back animation (200ms) slides the leaving page down + fades it out.
    // If the inner content (secondpage) is removed before the animation runs,
    // the slide-down animates an empty shell, making the transition look instant.
    //
    // We sample the leaving page's opacity and inner content presence during
    // the transition to verify the animation is visually meaningful.
    await page.evaluate(() => {
      (window as any).__ionTransitionCapture = { samples: [] as any[] };
    });

    // Click back button
    await page.locator('ion-button').filter({ hasText: 'Back with direction "back"' }).click();

    // Rapidly sample the leaving page's state
    const capture = await page.evaluate(async () => {
      for (let i = 0; i < 15; i++) {
        await new Promise((r) => setTimeout(r, 20));
        // The leaving element is the nested ion-router-outlet with ionPage
        const leavingOutlet = document.querySelector('ion-router-outlet.ion-page.can-go-back');
        // The inner page content
        const innerPage = document.querySelector('[data-pageid="secondpage"]');
        (window as any).__ionTransitionCapture.samples.push({
          time: i * 20,
          leavingInDOM: leavingOutlet ? leavingOutlet.isConnected : false,
          leavingOpacity: leavingOutlet ? getComputedStyle(leavingOutlet).opacity : 'N/A',
          innerPageExists: !!innerPage && innerPage.isConnected,
        });
      }
      return (window as any).__ionTransitionCapture;
    });

    // The inner content should still exist while the leaving page is animating (opacity < 1)
    const animatingSamples = capture.samples.filter(
      (s: any) => s.leavingInDOM && s.leavingOpacity !== 'N/A' && parseFloat(s.leavingOpacity) < 0.95 && parseFloat(s.leavingOpacity) > 0.05
    );

    const contentPresentDuringAnimation = animatingSamples.some((s: any) => s.innerPageExists);

    await ionPageVisible(page, 'firstpage');

    expect(animatingSamples.length, 'Expected leaving page to have intermediate opacity during back animation').toBeGreaterThan(0);
    expect(contentPresentDuringAnimation, 'Inner page content should still exist while the leaving page is mid-animation').toBe(true);
  });

  test('iOS mode: back with direction="back" from nested outlet to parent should animate', async ({ page }) => {
    await page.goto('/nested-outlet?ionic:mode=ios');
    await ionPageVisible(page, 'firstpage');

    await ionNav(page, 'ion-button', 'Go to second page');
    await ionPageVisible(page, 'secondpage');

    await installAnimationProbe(page);

    await page.locator('ion-button').filter({ hasText: 'Back with direction "back"' }).click();
    await page.waitForTimeout(800);
    await ionPageVisible(page, 'firstpage');

    const probe = await readAnimationProbe(page);
    expect(probe.detected, 'Expected CSS animation to run during iOS back transition').toBe(true);
  });

  // --- NestedOutlet2: back within a nested outlet (List -> Item -> back to List) ---

  test('MD mode: IonBackButton within nested outlet should animate', async ({ page }) => {
    await page.goto('/nested-outlet2?ionic:mode=md');
    // Redirects to /nested-outlet2/home
    await ionPageVisible(page, 'home');

    // Navigate to list (cross-outlet)
    await ionNav(page, 'ion-item', 'Go to list from Home');
    await ionPageVisible(page, 'list');

    // Navigate to item detail (within nested outlet)
    await ionNav(page, 'ion-item', 'Item #1');
    await ionPageVisible(page, 'item');

    // Install probe and navigate back via IonBackButton
    await installAnimationProbe(page);

    await ionBackClick(page, 'item');
    await page.waitForTimeout(500);
    await ionPageVisible(page, 'list');

    const probe = await readAnimationProbe(page);
    expect(probe.detected, 'Expected CSS animation to run during MD IonBackButton back transition in nested outlet').toBe(true);
  });

  test('iOS mode: IonBackButton within nested outlet should animate', async ({ page }) => {
    await page.goto('/nested-outlet2?ionic:mode=ios');
    await ionPageVisible(page, 'home');

    await ionNav(page, 'ion-item', 'Go to list from Home');
    await ionPageVisible(page, 'list');

    await ionNav(page, 'ion-item', 'Item #1');
    await ionPageVisible(page, 'item');

    await installAnimationProbe(page);

    await ionBackClick(page, 'item');
    await page.waitForTimeout(800);
    await ionPageVisible(page, 'list');

    const probe = await readAnimationProbe(page);
    expect(probe.detected, 'Expected CSS animation to run during iOS IonBackButton back transition in nested outlet').toBe(true);
  });
});
