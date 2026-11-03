import { test, expect, type Page } from '@playwright/test';
import { ionPageVisible, ionTabClick, settledRenderCounts, withTestingMode } from './utils/test-utils';

const showTab = async (page: Page, tab: 'b' | 'c') => {
  await ionTabClick(page, `Tab ${tab.toUpperCase()}`);
  await ionPageVisible(page, `hidden-view-renders-${tab}`);
};

/**
 * Visits Tabs A, B and C, then switches to B and C again. Returns the render
 * counts from before and after that second round.
 */
const switchTabsAfterVisitingAll = async (page: Page) => {
  await page.goto(withTestingMode('/hidden-view-renders/a'));
  await ionPageVisible(page, 'hidden-view-renders-a');
  await showTab(page, 'b');
  await showTab(page, 'c');

  const before = await settledRenderCounts(page);

  await showTab(page, 'b');
  await showTab(page, 'c');

  const after = await settledRenderCounts(page);

  return { before, after };
};

test.describe('Hidden View Renders', () => {
  test('should not re-render pages that read useParams when switching tabs', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31528',
    });

    const { before, after } = await switchTabsAfterVisitingAll(page);

    // Tab A stayed hidden for both switches.
    expect(after['a:params']).toBe(before['a:params']);
    // B and C were shown again at the same pathname.
    expect(after['b:params']).toBe(before['b:params']);
    expect(after['c:params']).toBe(before['c:params']);
  });

  test('should re-render a hidden page that reads useIonRouter once per navigation', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31528',
    });

    const { before, after } = await switchTabsAfterVisitingAll(page);

    // Since `useIonRouter` exposes the live `routeInfo`, it re-renders once per switch.
    expect(after['a:ionRouter'] - before['a:ionRouter']).toBe(2);
  });

  test('should render the shown page once when its route match changes', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31528',
    });

    await page.goto(withTestingMode('/hidden-view-renders/d/one'));
    await ionPageVisible(page, 'hidden-view-renders-d');
    await expect(page.locator('#splat-param')).toHaveText('one');

    const before = await settledRenderCounts(page);

    await page.locator('#go-to-d-two').click();
    await expect(page.locator('#splat-param')).toHaveText('two');

    const after = await settledRenderCounts(page);

    expect(after['d:params'] - before['d:params']).toBe(1);
  });
});
