import { newE2EPage } from '@stencil/core/testing';
import { dragElementBy } from '@utils/test';

test('swipe to go back should complete', async () => {
  const page = await newE2EPage({ url: '/src/utils/gesture/test?ionic:mode=ios' });

  const nav = await page.find('ion-nav');
  const ionNavDidChange = await nav.spyOnEvent('ionNavDidChange');

  await page.click('.next');
  await ionNavDidChange.next();

  const content = await page.$('.page-two-content');

  const width = await page.evaluate(() => window.innerWidth);
  await dragElementBy(content, page, width, 0, { x: 25, y: 100 });

  await ionNavDidChange.next();
});

test('swipe to go back should complete in rtl', async () => {
  const page = await newE2EPage({ url: '/src/utils/gesture/test?rtl=true&ionic:mode=ios' });

  const nav = await page.find('ion-nav');
  const ionNavDidChange = await nav.spyOnEvent('ionNavDidChange');

  await page.click('.next');
  await ionNavDidChange.next();

  const width = await page.evaluate(() => window.innerWidth);

  const content = await page.$('.page-two-content');
  await dragElementBy(content, page, -width, 0, { x: width - 25, y: 100 });

  await ionNavDidChange.next();
});
