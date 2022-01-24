import { newE2EPage } from '@stencil/core/testing';

test('nav.pop should update the URL', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/all/pr-24645.html?ionic:_testing=true'
  });  

  const push = await page.$('#router-push');
  const pop = await page.$('#nav-pop');

  const routes = [
    '/a',
    '/a/b',
    '/fixed/a/b/c',
    '/routeparam/a',
    '/routeparam/a/b',
  ];
  
  // Push all the routes.
  for (const r of routes) {
    await page.$eval('#route', (el: any, route) => el.value = route, r);    
    await push.click();
    await page.waitForChanges();
    expect(await page.url()).toMatch(new RegExp(`#${r}$`));
  }

  // Pop should restore the urls.
  for (const r of routes.reverse()) {
    expect(await page.url()).toMatch(new RegExp(`#${r}$`));
    await pop.click();
    await page.waitForChanges();
  }
});

test('nav.push should update the URL', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/all/pr-24645.html?ionic:_testing=true'
  });  

  const pushX = await page.$('#nav-push-x');
  await pushX.click();
  await page.waitForChanges();
  expect(await page.url()).toMatch(/\/x$/);

  const pushFixed = await page.$('#nav-push-fixed');
  await pushFixed.click();
  await page.waitForChanges();
  expect(await page.url()).toMatch(/\/fixed\/x\/y\/z$/);

  const pushRouteParam = await page.$('#nav-push-routeparam');
  await pushRouteParam.click();
  await page.waitForChanges();
  expect(await page.url()).toMatch(/\/routeparam\/x$/);
});