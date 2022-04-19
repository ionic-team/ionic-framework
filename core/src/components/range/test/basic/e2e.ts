import { newE2EPage } from '@stencil/core/testing';
import { dragElementBy } from '@utils/test';

test('range: start/end events', async () => {
  for(let i = 0; i < 25; i++) {
    console.log(i);
    const page = await newE2EPage({
      url: '/src/components/range/test/basic?ionic:_testing=true',
    });

    const rangeStart = await page.spyOnEvent('ionKnobMoveStart');
    const rangeEnd = await page.spyOnEvent('ionKnobMoveEnd');
    const rangeEl = await page.$('#basic');

    await dragElementBy(rangeEl, page, 300, 0);
    await page.waitForChanges();

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
    await page.waitForChanges();

    expect(rangeStart).toHaveReceivedEventDetail({ value: 50 });
    expect(rangeEnd).toHaveReceivedEventDetail({ value: 50 });
  }
});
