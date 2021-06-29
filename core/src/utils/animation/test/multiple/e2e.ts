import { newE2EPage } from '@stencil/core/testing';

import { listenForEvent, waitForFunctionTestContext } from '../../../test/utils';

test(`animation:web: multiple`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/multiple' });
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
    return payload.animationStatus.join(', ') === ['AnimationCSubBFinished', 'AnimationBFinished', 'AnimationCSubAFinished', 'AnimationCFinished', 'AnimationAFinished', 'AnimationRootFinished'].join(', ');

  }, { animationStatus });
  screenshotCompares.push(await page.compareScreenshot('end animation'));
});

test(`animation:css: multiple`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/multiple?ionic:_forceCSSAnimations=true' });
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
    return payload.animationStatus.join(', ') === ['AnimationCSubBFinished', 'AnimationBFinished', 'AnimationCSubAFinished', 'AnimationCFinished', 'AnimationAFinished', 'AnimationRootFinished'].join(', ');

  }, { animationStatus });
  screenshotCompares.push(await page.compareScreenshot('end animation'));
});
