import { newSpecPage } from '@stencil/core/testing';
import { Datetime } from '../../datetime';
import { Item } from '../../../item/item';
import { Label } from '../../../label/label';

describe('Datetime a11y', () => {
  it('does not set a default aria-labelledby when there is not a neighboring ion-label', async () => {
    const page = await newSpecPage({
      components: [Datetime, Item, Label],
      html: `<ion-datetime></ion-datetime>`
    })

    const ariaLabelledBy = page.root.getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBe(null);
  });

  it('set a default aria-labelledby when a neighboring ion-label exists', async () => {
    const page = await newSpecPage({
      components: [Datetime, Item, Label],
      html: `<ion-item>
        <ion-label>A11y Test</ion-label>
        <ion-datetime></ion-datetime>
      </ion-item>`
    })

    const label = page.body.querySelector('ion-label');
    const ariaLabelledBy = page.body.querySelector('ion-datetime').getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBe(label.id);
  });
});
