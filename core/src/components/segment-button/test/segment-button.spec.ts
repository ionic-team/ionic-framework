import { newSpecPage } from '@stencil/core/testing';

import { SegmentButton } from '../segment-button';

describe('segment button: tabindex', () => {
  it('should move tabindex from the host to the native button', async () => {
    const page = await newSpecPage({
      components: [SegmentButton],
      html: '<ion-segment-button value="a" tabindex="0">A</ion-segment-button>',
    });

    const segmentButton = page.body.querySelector('ion-segment-button')!;
    const nativeEl = segmentButton.shadowRoot!.querySelector('button')!;

    expect(segmentButton.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });
});
