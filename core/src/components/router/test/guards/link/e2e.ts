import { newE2EPage } from '@stencil/core/testing';

test('router: guards - router-link - allow/allow', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/guards?ionic:_testing=true'
  });

  // Test 1: beforeEnter: allow, beforeLeave: allow
  await setBeforeEnterHook(page, 'allow');

  const routerLink = await page.$('#router-link');
  await routerLink.click();

  await page.waitForChanges();

  await checkUrl(page, '#/child/1');

  const backButton = await page.$('ion-back-button');
  await backButton.click();

  await page.waitForChanges();

  await checkUrl(page, '#/home');
});

test('router: guards - router-link - block/allow', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/guards?ionic:_testing=true'
  });

  // Test 2: beforeEnter: block, beforeLeave: allow
  await setBeforeEnterHook(page, 'block');

  const routerLink = await page.$('#router-link');
  await routerLink.click();

  await page.waitForChanges();

  await checkUrl(page, '#/home');
});

test('router: guards - router-link - redirect/allow', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/guards?ionic:_testing=true'
  });

  // Test 3: beforeEnter: redirect, beforeLeave: allow
  await setBeforeEnterHook(page, 'redirect');

  const routerLink = await page.$('#router-link');
  await routerLink.click();

  await page.waitForChanges();

  await checkUrl(page, '#/test');

  const backButton = await page.$('ion-back-button');
  await backButton.click();

  await page.waitForChanges();

  await checkUrl(page, '#/home');
});




test('router: guards - router-link - allow/block', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/guards?ionic:_testing=true'
  });

  // Test 4: beforeEnter: allow, beforeLeave: block
  await setBeforeLeaveHook(page, 'block');

  const routerLink = await page.$('#router-link');
  await routerLink.click();

  await page.waitForChanges();

  await checkUrl(page, '#/child/1');

  const backButton = await page.$('ion-back-button');
  await backButton.click();

  await page.waitForChanges();

  await checkUrl(page, '#/child/1');
});

test('router: guards - router-link - allow/redirect', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/guards?ionic:_testing=true'
  });

  // Test 5: beforeEnter: allow, beforeLeave: redirect
  await setBeforeLeaveHook(page, 'redirect');

  const routerLink = await page.$('#router-link');
  await routerLink.click();

  await page.waitForChanges();

  await checkUrl(page, '#/child/1');

  const backButton = await page.$('ion-back-button');
  await backButton.click();

  await page.waitForChanges();

  await checkUrl(page, '#/test');
});

const checkUrl = async (page, url: string) => {
  const getUrl = await page.url();
  expect(getUrl).toContain(url);
}

const setBeforeEnterHook = async (page, type: string) => {
  const button = await page.$(`ion-radio-group#beforeEnter ion-radio[value=${type}]`);
  await button.click();
}

const setBeforeLeaveHook = async (page, type: string) => {
  const button = await page.$(`ion-radio-group#beforeLeave ion-radio[value=${type}]`);
  await button.click();
}
