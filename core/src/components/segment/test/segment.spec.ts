import { newSpecPage } from '@stencil/core/testing';
import { Segment } from '../segment';
import { SegmentButton } from '../../segment-button/segment-button';

it('should set checked state when value is set asynchronously', async () => {
  const page = await newSpecPage({
    components: [Segment, SegmentButton],
    html: `
      <ion-segment value="first">
        <ion-segment-button>First</ion-segment-button>
      </ion-segment>
    `,
  });

  const segmentButton = page.root.querySelector('ion-segment-button');

  expect(segmentButton.classList.contains('segment-button-checked')).toBe(false);

  segmentButton.value = 'first';
  await page.waitForChanges();

  expect(segmentButton.classList.contains('segment-button-checked')).toBe(true);
});
