import { newE2EPage } from '@stencil/core/testing';
import { dragElementBy } from '@utils/test';

test('range: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/range/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('range:rtl: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/range/test/basic?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('range: start/end events', async () => {
  const page = await newE2EPage({
    url: '/src/components/range/test/basic?ionic:_testing=true'
  });

  const rangeStart = await page.spyOnEvent('ionKnobMoveStart');
  const rangeEnd = await page.spyOnEvent('ionKnobMoveEnd');
  const rangeEl = await page.$('#basic');

  await dragElementBy(rangeEl, page, 300, 0);

  /**
   * dragElementBy defaults to starting the drag from the middle of the el,
   * so the start value should jump to 50 despite the range defaulting to 20.
   */
  expect(rangeStart).toHaveReceivedEventDetail({ value: 50 });
  expect(rangeEnd).toHaveReceivedEventDetail({ value: 91 });

  /**
   * Verify both events fire if range is clicked without dragging.
   */
  await dragElementBy(rangeEl, page, 0, 0);

  expect(rangeStart).toHaveReceivedEventDetail({ value: 50 });
  expect(rangeEnd).toHaveReceivedEventDetail({ value: 50 })
});

test('range: start/end events, keyboard', async () => {
  const page = await newE2EPage({
    url: '/src/components/range/test/basic?ionic:_testing=true'
  });

  const rangeStart = await page.spyOnEvent('ionKnobMoveStart');
  const rangeEnd = await page.spyOnEvent('ionKnobMoveEnd');
  
  await page.keyboard.press('Tab'); // focus first range
  await page.keyboard.press('ArrowRight');

  expect(rangeStart).toHaveReceivedEventDetail({ value: 20 });
  expect(rangeEnd).toHaveReceivedEventDetail({ value: 21 });
});