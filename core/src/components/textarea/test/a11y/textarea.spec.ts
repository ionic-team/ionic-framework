import { newSpecPage } from '@stencil/core/testing';

import { Item } from '../../../item/item';
import { Label } from '../../../label/label';
import { Textarea } from '../../textarea';

describe('Textarea a11y', () => {
  it('does not set a default aria-labelledby when there is not a neighboring ion-label', async () => {
    const page = await newSpecPage({
      components: [Textarea, Item, Label],
      html: `<ion-textarea></ion-textarea>`,
    });

    const ariaLabelledBy = page.body.querySelector('ion-textarea textarea').getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBe(null);
  });

  it('set a default aria-labelledby when a neighboring ion-label exists', async () => {
    const page = await newSpecPage({
      components: [Textarea, Item, Label],
      html: `<ion-item>
        <ion-label>A11y Test</ion-label>
        <ion-textarea></ion-textarea>
      </ion-item>`,
    });

    const label = page.body.querySelector('ion-label');
    const ariaLabelledBy = page.body.querySelector('ion-textarea textarea').getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBe(label.id);
  });
});
