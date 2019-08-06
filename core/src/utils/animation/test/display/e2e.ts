import { newE2EPage } from '@stencil/core/testing';

import { listenForEvent, waitForFunctionTestContext } from '../../../test/utils';

test(`animation:web: display`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/display' });
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
  screenshotCompares.push(await page.compareScreenshot());
});

test(`animation:css: display`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/display?ionic:_forceCSSAnimations=true' });
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
    // CSS Animations do not account for elements with `display: none` very well, so we need to add a workaround for this.
    return payload.animationStatus.join(', ') === ['AnimationAFinished', 'AnimationBFinished', 'AnimationRootFinished'].join(', ');

  }, { animationStatus });
  screenshotCompares.push(await page.compareScreenshot());
});
