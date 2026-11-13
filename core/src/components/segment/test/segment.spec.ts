import { newSpecPage } from '@stencil/core/testing';

import { SegmentButton } from '../../segment-button/segment-button';
import { Segment } from '../segment';

describe('segment button accessibility', () => {
  const html = `
    <ion-segment>
      <ion-segment-button value="day">Day</ion-segment-button>
      <ion-segment-button value="week">Week</ion-segment-button>
      <ion-segment-button value="month">Month</ion-segment-button>
    </ion-segment>
  `;

  const expectButtonPositions = (segment: HTMLIonSegmentElement, setSize: number) => {
    const buttons = segment.querySelectorAll('ion-segment-button');
    expect(buttons.length).toBe(setSize);
    buttons.forEach((button, index) => {
      const nativeButton = button.shadowRoot!.querySelector('button')!;
      expect(nativeButton.getAttribute('role')).toBe('tab');
      expect(nativeButton.getAttribute('aria-posinset')).toBe(`${index + 1}`);
      expect(nativeButton.getAttribute('aria-setsize')).toBe(`${setSize}`);
    });
  };

  it('should expose the position and count of initially rendered buttons', async () => {
    const page = await newSpecPage({ components: [Segment, SegmentButton], html });

    expectButtonPositions(page.body.querySelector('ion-segment')!, 3);
  });

  it('should update positions and count when buttons are added and removed', async () => {
    const page = await newSpecPage({ components: [Segment, SegmentButton], html });
    const segment = page.body.querySelector('ion-segment')!;
    const slot = segment.shadowRoot!.querySelector('slot')!;
    const button = page.doc.createElement('ion-segment-button');
    button.value = 'year';
    button.textContent = 'Year';
    segment.appendChild(button);
    await page.waitForChanges();

    slot.dispatchEvent(new Event('slotchange'));
    await page.waitForChanges();
    await page.waitForChanges();
    expectButtonPositions(segment, 4);

    segment.querySelector('ion-segment-button[value="week"]')!.remove();
    slot.dispatchEvent(new Event('slotchange'));
    await page.waitForChanges();
    await page.waitForChanges();
    expectButtonPositions(segment, 3);
  });
});

it('should disable segment buttons added to disabled segment async', async () => {
  const page = await newSpecPage({
    components: [Segment, SegmentButton],
    html: `<ion-segment disabled="true"></ion-segment>`,
  });

  const segment = page.body.querySelector('ion-segment')!;
  segment.innerHTML = `
    <ion-segment-button>
      <ion-label>Segment Button</ion-label>
    </ion-segment-button>`;
  await page.waitForChanges();

  const segmentButton = page.body.querySelector('ion-segment-button')!;
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

  const segmentButton = page.body.querySelector('ion-segment-button')!;

  expect(segmentButton.classList.contains('segment-button-checked')).toBe(false);

  segmentButton.value = 'first';
  await page.waitForChanges();

  expect(segmentButton.classList.contains('segment-button-checked')).toBe(true);
});
