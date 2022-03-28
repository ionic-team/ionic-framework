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

  const rangeStart = await page.spyOnEvent('ionChangeStart');
  const rangeEnd = await page.spyOnEvent('ionChangeEnd');
  const rangeEl = await page.find('#basic');

  await dragElementBy(rangeEl, page, 300, 0, { x: 0, y: 0 });

  // TODO: these values might not be right, rangeEnd definitely isn't
  // run the test locally and see what you actually get
  expect(rangeStart).toHaveReceivedEventDetail({ data: { value: '0' } });
  expect(rangeEnd).toHaveReceivedEventDetail({ data: { value: '50' } });
});

test('range: start/end events, keyboard', async () => {
  const page = await newE2EPage({
    url: '/src/components/range/test/basic?ionic:_testing=true'
  });

  const rangeStart = await page.spyOnEvent('ionChangeStart');
  const rangeEnd = await page.spyOnEvent('ionChangeEnd');
  const rangeEl = await page.find('#basic');

  // TODO: start should be whatever the value is set to in the HTML, end should be 1 more/less
});