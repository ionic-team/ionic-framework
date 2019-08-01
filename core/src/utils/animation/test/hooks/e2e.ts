import { newE2EPage } from '@stencil/core/testing';

import { listenForEvent, waitForFunctionTestContext } from '../../../test/utils';

test(`animation:web: hooks`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/hooks' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const square = await page.$('.square-a');

  const styles = await getStyles(page, '.square-a');
  expect(styles.paddingBottom).toEqual('20px');
  expect(styles.color).toEqual('rgb(0, 0, 0)');
  
  const classList = await getClassList(square);
  expect(classList.includes('hello-world')).toEqual(true);
  expect(classList.includes('test-class')).toEqual(false);
  
  await waitForEventToBeCalled('ionAnimationFinished', page, square, async () => {
    await waitForEventToBeCalled('beforeWrite', page, square, async () => {
      await waitForEventToBeCalled('beforeRead', page, square, async () => {
        await page.click('.play');
        await page.waitForSelector('.play');
      });
    });    
  });
  
  // Test beforeRemoveClass and beforeAddClass
  const classListAgain = await getClassList(square);
  expect(classListAgain.includes('hello-world')).toEqual(false);
  expect(classListAgain.includes('test-class')).toEqual(true);

  // Test beforeStyles and beforeClearStyles  
  const stylesAgain = await getStyles(page, '.square-a');
  expect(stylesAgain.paddingBottom).toEqual('0px');
  expect(stylesAgain.color).toEqual('rgb(128, 0, 128)');
  
  screenshotCompares.push(await page.compareScreenshot());
});

test(`animation:css: hooks`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/hooks?ionic:_forceCSSAnimations=true' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const square = await page.$('.square-a');

  const styles = await getStyles(page, '.square-a');
  expect(styles.paddingBottom).toEqual('20px');
  expect(styles.color).toEqual('rgb(0, 0, 0)');
  
  const classList = await getClassList(square);
  expect(classList.includes('hello-world')).toEqual(true);
  expect(classList.includes('test-class')).toEqual(false);
  
  await waitForEventToBeCalled('ionAnimationFinished', page, square, async () => {
    await waitForEventToBeCalled('beforeWrite', page, square, async () => {
      await waitForEventToBeCalled('beforeRead', page, square, async () => {
        await page.click('.play');
        await page.waitForSelector('.play');
      });
    });    
  });
  
  // Test beforeRemoveClass and beforeAddClass
  const classListAgain = await getClassList(square);
  expect(classListAgain.includes('hello-world')).toEqual(false);
  expect(classListAgain.includes('test-class')).toEqual(true);

  // Test beforeStyles and beforeClearStyles  
  const stylesAgain = await getStyles(page, '.square-a');
  expect(stylesAgain.paddingBottom).toEqual('0px');
  expect(stylesAgain.color).toEqual('rgb(128, 0, 128)');
  
  screenshotCompares.push(await page.compareScreenshot());
});

const waitForEventToBeCalled = (eventName: string, page: any, el: HTMLElement, fn: any, num: number = 1) => {
  return new Promise(async (resolve) => {
    const EVENT_FIRED = `on${eventName}`;
    const eventFiredCount: any = { count: 0 };
    await page.exposeFunction(EVENT_FIRED, () => {
      eventFiredCount.count += 1;
    });
    
    await listenForEvent(page, eventName, el, EVENT_FIRED);

    if (fn) {
      await fn();
    }
    
    await waitForFunctionTestContext((payload: any) => {
      return payload.eventFiredCount.count === payload.num;
    }, { eventFiredCount, num });
    
    return resolve();
  });
}

const getStyles = async (page: any, selector: string) => {
  return await page.evaluate((payload: any) => {
    const el = document.querySelector(payload.selector);
    
    return JSON.parse(JSON.stringify(getComputedStyle(el)));
  }, { selector });
}

const getClassList = async (el: HTMLElement) => {
  const classListObject = await el.getProperty('classList');
  const jsonValue = await classListObject.jsonValue();
  
  return Object.values(jsonValue);
}