import type { Page } from '@playwright/test';

/**
 * Selects a radio button from the radio group for configuring the
 * beforeEnter hook of the router.
 */
export const setBeforeEnterHook = async (page: Page, type: string) => {
  await page.click(`ion-radio-group#beforeEnter ion-radio[value=${type}]`);
};

/**
 * Selects a radio button from the radio group for configuring the
 * beforeLeave hook of the router.
 */
export const setBeforeLeaveHook = async (page: Page, type: string) => {
  await page.click(`ion-radio-group#beforeLeave ion-radio[value=${type}]`);
};
