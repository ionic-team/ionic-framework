import { newE2EPage } from '@stencil/core/testing';

import { listenForEvent, waitForFunctionTestContext } from '../../../test/utils';

test(`animation:web: basic`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/basic' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const ANIMATION_FINISHED = 'onIonAnimationFinished';
  const animationFinishedCount: any = { count: 0 };
  await page.exposeFunction(ANIMATION_FINISHED, () => {
    animationFinishedCount.count += 1;
  });

  const square = await page.$('.square-a');
  await listenForEvent(page, 'ionAnimationFinished', square, ANIMATION_FINISHED);

  await page.click('.play');
  await page.waitForSelector('.play');

  await waitForFunctionTestContext((payload: any) => {
    return payload.animationFinishedCount.count === 1;
  }, { animationFinishedCount });

  screenshotCompares.push(await page.compareScreenshot('end animation'));
});

test(`animation:css: basic`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/basic?ionic:_forceCSSAnimations=true' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const ANIMATION_FINISHED = 'onIonAnimationFinished';
  const animationFinishedCount: any = { count: 0 };
  await page.exposeFunction(ANIMATION_FINISHED, () => {
    animationFinishedCount.count += 1;
  });

  const square = await page.$('.square-a');
  await listenForEvent(page, 'ionAnimationFinished', square, ANIMATION_FINISHED);

  await page.click('.play');
  await page.waitForSelector('.play');

  await waitForFunctionTestContext((payload: any) => {
    return payload.animationFinishedCount.count === 1;
  }, { animationFinishedCount });

  screenshotCompares.push(await page.compareScreenshot('end animation'));
});
