import { newE2EPage } from '@stencil/core/testing';

import { listenForEvent, waitForFunctionTestContext } from '../../../test/utils';

test(`animation:web: multiple`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/multiple' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const ANIMATION_FINISHED = 'onIonAnimationFinished';
  const animationStatus: any = {
    'AnimationRootFinished': false,
    'AnimationAFinished': false,
    'AnimationBFinished': false,
    'AnimationCFinished': false,
    'AnimationCSubAFinished': false
  };
  await page.exposeFunction(ANIMATION_FINISHED, (ev: any) => {
    console.log(ev.detail)
    
    // need to check state of animations for on each event
    animationStatus[ev.detail] = true;
    
    console.log(animationStatus)
  });

  const squareA = await page.$('.square-a');
  await listenForEvent(page, 'ionAnimationFinished', squareA, ANIMATION_FINISHED)
  
  await page.click('.play');
  await page.waitForSelector('.play');
  
  await waitForFunctionTestContext((payload: any) => {
    return payload.animationStatus['AnimationRootFinished'] === true;
  }, { animationStatus });
  
  // need to ensure all other animations resolved

  screenshotCompares.push(await page.compareScreenshot());
});

/*
test(`animation:css: basic`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/basic?ionic:_forceCSSAnimations=true' });

  page.evaluate(() => window.Ionic.config._forceCSSAnimations = true);

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

  screenshotCompares.push(await page.compareScreenshot());
});
*/
