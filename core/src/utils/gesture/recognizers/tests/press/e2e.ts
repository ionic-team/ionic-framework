import { newE2EPage } from '@stencil/core/testing';

test(`gesture: press`, async () => {
  const page = await newE2EPage({ url: '/src/utils/gesture/recognizers/tests/press' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const square = await page.$('.square');
  const { x, y } = await coords(square);

  page.mouse.move(x, y);
  page.mouse.down();
  await page.waitFor(300);
  page.mouse.up();

  const squareAgain = await page.find('.square');
  expect(squareAgain).toHaveClass('pressed');

  screenshotCompares.push(await page.compareScreenshot('end press'));

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

test(`gesture: press:short press`, async () => {
  const page = await newE2EPage({ url: '/src/utils/gesture/recognizers/tests/press' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const square = await page.$('.square');
  const { x, y } = await coords(square);

  page.mouse.move(x, y);
  page.mouse.down();
  await page.waitFor(50);
  page.mouse.up();

  const squareAgain = await page.find('.square');
  expect(squareAgain).not.toHaveClass('pressed');

  screenshotCompares.push(await page.compareScreenshot('end press'));

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

test(`gesture: press:click`, async () => {
  const page = await newE2EPage({ url: '/src/utils/gesture/recognizers/tests/press' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  await page.click('.square');

  const square = await page.find('.square');
  expect(square).not.toHaveClass('pressed');

  screenshotCompares.push(await page.compareScreenshot('end press'));

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

const coords = async el => {
  const box = await el.boundingBox();

  return {
    x: Math.floor(box.x + (box.width / 2)),
    y: Math.floor(box.y + (box.height / 2))
  };
};
