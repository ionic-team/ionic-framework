import { newE2EPage } from '@stencil/core/testing';

import { listenForEvent, waitForFunctionTestContext } from '../../../test/utils';
import { ElementHandle } from 'puppeteer';

test(`animation:web: hooks`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/hooks' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const square = await page.$('.square-a');

  const styles = await getStyles(page, '.square-a');
  expect(styles.paddingBottom).toEqual('20px');
  expect(styles.color).toEqual('rgb(0, 0, 0)');

  expect(square).toHaveClass('hello-world');
  expect(square).not.toHaveClass('test-class');

  await waitForEventToBeCalled('afterWrite', page, square!, async () => {
    await waitForEventToBeCalled('afterRead', page, square!, async () => {
      await waitForEventToBeCalled('ionAnimationFinished', page, square!, async () => {
        await waitForEventToBeCalled('beforeWrite', page, square!, async () => {
          await waitForEventToBeCalled('beforeRead', page, square!, async () => {
            await page.click('.play');
            await page.waitForSelector('.play');

            // Test beforeRemoveClass and beforeAddClass
            expect(square).not.toHaveClass('hello-world');
            expect(square).toHaveClass('test-class');

            // Test beforeStyles and beforeClearStyles
            const webStylesAgain = await getStyles(page, '.square-a');
            expect(webStylesAgain.paddingBottom).toEqual('0px');
            expect(webStylesAgain.color).toEqual('rgb(128, 0, 128)');
          });
        });
      });
    });
  });

  // Test afterRemoveClass and afterAddClass
  expect(square).toHaveClass('hello-world');
  expect(square).not.toHaveClass('test-class');

  // Test afterStyles and afterClearStyles
  const stylesAgain = await getStyles(page, '.square-a');
  expect(stylesAgain.paddingBottom).toEqual('20px');
  expect(stylesAgain.color).toEqual('rgb(0, 0, 0)');

  screenshotCompares.push(await page.compareScreenshot('end animation'));
});

test(`animation:css: hooks`, async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/hooks?ionic:_forceCSSAnimations=true' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const square = await page.$('.square-a');

  const styles = await getStyles(page, '.square-a');
  expect(styles.paddingBottom).toEqual('20px');
  expect(styles.color).toEqual('rgb(0, 0, 0)');

  expect(square).toHaveClass('hello-world');
  expect(square).not.toHaveClass('test-class');

  await waitForEventToBeCalled('afterWrite', page, square!, async () => {
    await waitForEventToBeCalled('afterRead', page, square!, async () => {
      await waitForEventToBeCalled('ionAnimationFinished', page, square!, async () => {
        await waitForEventToBeCalled('beforeWrite', page, square!, async () => {
          await waitForEventToBeCalled('beforeRead', page, square!, async () => {
            await page.click('.play');
            await page.waitForSelector('.play');

            // Test beforeRemoveClass and beforeAddClass
            expect(square).not.toHaveClass('hello-world');
            expect(square).toHaveClass('test-class');

            // Test beforeStyles and beforeClearStyles
            const cssStylesAgain = await getStyles(page, '.square-a');
            expect(cssStylesAgain.paddingBottom).toEqual('0px');
            expect(cssStylesAgain.color).toEqual('rgb(128, 0, 128)');
          });
        });
      });
    });
  });

  // Test afterRemoveClass and afterAddClass
  expect(square).toHaveClass('hello-world');
  expect(square).not.toHaveClass('test-class');

  // Test afterStyles and afterClearStyles
  const stylesAgain = await getStyles(page, '.square-a');
  expect(stylesAgain.paddingBottom).toEqual('20px');
  expect(stylesAgain.color).toEqual('rgb(0, 0, 0)');

  screenshotCompares.push(await page.compareScreenshot('end animation'));
});

const waitForEventToBeCalled = async (eventName: string, page: any, el: ElementHandle<Element>, fn: any, num = 1) => {
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
};

const getStyles = async (page: any, selector: string) => {
  return page.evaluate((payload: any) => {
    const el = document.querySelector(payload.selector);

    return JSON.parse(JSON.stringify(getComputedStyle(el)));
  }, { selector });
};
