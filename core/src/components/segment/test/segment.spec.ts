import { newSpecPage } from '@stencil/core/testing';

import { SegmentButton } from '../../segment-button/segment-button';
import { Segment } from '../segment';

it('should disable segment buttons added to disabled segment async', async () => {
  const page = await newSpecPage({
    components: [Segment, SegmentButton],
    html: `<ion-segment disabled="true"></ion-segment>`,
  });

  const segment = page.body.querySelector('ion-segment');
  segment.innerHTML = `
    <ion-segment-button>
      <ion-label>Segment Button</ion-label>
    </ion-segment-button>`;
  await page.waitForChanges();

  const segmentButton = page.body.querySelector('ion-segment-button');
  expect(segmentButton.disabled).toBe(true);
});

it('should set checked state when value is set asynchronously', async () => {
  const page = await newSpecPage({
    components: [Segment, SegmentButton],
    html: `
      <ion-segment value="first">
        <ion-segment-button>
          <ion-label>First</ion-label>
        </ion-segment-button>
      </ion-segment>
    `,
  });

  const segmentButton = page.root.querySelector('ion-segment-button');

  expect(segmentButton.classList.contains('segment-button-checked')).toBe(false);

  segmentButton.value = 'first';
  await page.waitForChanges();

  expect(segmentButton.classList.contains('segment-button-checked')).toBe(true);
});
