import { newSpecPage } from '@stencil/core/testing';

import { SegmentButton } from '../../segment-button/segment-button';
import { Segment } from '../segment';

it('should disable segment buttons added to disabled segment async', async () => {
  const page = await newSpecPage({
    components: [Segment, SegmentButton],
    html: `<ion-segment disabled="true"></ion-segment>`,
  });

  const segment = page.body.querySelector('ion-segment');
  segment.innerHTML = `<ion-segment-button>Segment Button</ion-segment-button>`;
  await page.waitForChanges();

  const segmentButton = page.body.querySelector('ion-segment-button');
  expect(segmentButton.disabled).toBe(true);
});
