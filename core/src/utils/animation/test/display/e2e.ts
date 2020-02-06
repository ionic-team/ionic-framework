import { newE2EPage } from '@stencil/core/testing';

import { listenForEvent, waitForFunctionTestContext } from '../../../test/utils';

test(`animation:web: display`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/display' });
  await runTest(page);
});

test(`animation:css: display`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/display?ionic:_forceCSSAnimations=true' });
  await runTest(page);
});

const runTest = async (page: any) => {
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const ANIMATION_FINISHED = 'onIonAnimationFinished';
  const animationStatus = [];
  await page.exposeFunction(ANIMATION_FINISHED, (ev: any) => {
    animationStatus.push(ev.detail);
  });

  const squareA = await page.$('.square-a');
  await listenForEvent(page, 'ionAnimationFinished', squareA, ANIMATION_FINISHED);

  await page.click('.play');
  await page.waitForSelector('.play');

  await waitForFunctionTestContext((payload: any) => {
    return payload.animationStatus.join(', ') === ['AnimationBFinished', 'AnimationAFinished', 'AnimationRootFinished'].join(', ');

  }, { animationStatus });
  screenshotCompares.push(await page.compareScreenshot('end animation'));
};
