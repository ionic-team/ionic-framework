import { test, expect } from '@playwright/test';
import { ionPageVisible, ionPageDoesNotExist, withTestingMode } from './utils/test-utils';

test.describe('Replace Params', () => {
  test('replaced views with params should be unmounted and fresh on revisit', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25640',
    });

    await page.goto(withTestingMode('/replace-params/step1'));
    await ionPageVisible(page, 'replace-params-step1');

    await page.locator('#go-step2-first').click();
    await ionPageVisible(page, 'replace-params-step2');
    await expect(page.locator('[data-testid="step2-param"]')).toHaveText('first');

    await page.locator('#go-step3').click();
    await ionPageVisible(page, 'replace-params-step3');
    await expect(page.locator('[data-testid="step3-param"]')).toHaveText('first');

    // Record mount ID to verify we get a fresh component later
    const firstMountId = await page.locator('[data-testid="step3-mount-id"]').textContent();

    await page.locator('#go-step4').click();
    await ionPageVisible(page, 'replace-params-step4');

    await page.locator('#go-to-step1').click();
    await ionPageVisible(page, 'replace-params-step1');

    await page.locator('#go-step2-second').click();
    await ionPageVisible(page, 'replace-params-step2');
    await expect(page.locator('[data-testid="step2-param"]')).toHaveText('second');

    // Wait for previously replaced views to be fully removed from the DOM
    await ionPageDoesNotExist(page, 'replace-params-step4');
    await ionPageDoesNotExist(page, 'replace-params-step3');

    // Critical assertion: step3 should show 'second' params, not stale 'first'
    await page.locator('#go-step3').click();
    await ionPageVisible(page, 'replace-params-step3');
    await expect(page.locator('[data-testid="step3-param"]')).toHaveText('second');

    // Verify it's a fresh component instance, not the cached one
    const secondMountId = await page.locator('[data-testid="step3-mount-id"]').textContent();
    expect(secondMountId).not.toBe(firstMountId);
  });

  test('simple replace chain should clean up replaced views', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25640',
    });

    await page.goto(withTestingMode('/replace-params/step1'));
    await ionPageVisible(page, 'replace-params-step1');

    await page.locator('#go-step2-first').click();
    await ionPageVisible(page, 'replace-params-step2');
    await ionPageDoesNotExist(page, 'replace-params-step1');

    await page.locator('#go-step3').click();
    await ionPageVisible(page, 'replace-params-step3');
    await ionPageDoesNotExist(page, 'replace-params-step2');
  });
});
