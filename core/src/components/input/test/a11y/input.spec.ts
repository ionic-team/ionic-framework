import { newSpecPage } from '@stencil/core/testing';
import { Input } from '../../input';
import { Item } from '../../../item/item';
import { Label } from '../../../label/label';

describe('Input a11y', () => {
  it('does not set a default aria-labelledby when there is not a neighboring ion-label', async () => {
    const page = await newSpecPage({
      components: [Input, Item, Label],
      html: `<ion-input></ion-input>`
    })
 
    const ariaLabelledBy = page.body.querySelector('ion-input > input').getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBe(null);
  });

  it('set a default aria-labelledby when a neighboring ion-label exists', async () => {
    const page = await newSpecPage({
      components: [Input, Item, Label],
      html: `<ion-item>
        <ion-label>A11y Test</ion-label>
        <ion-input></ion-input>
      </ion-item>`
    })

    const label = page.body.querySelector('ion-label'); 
    const ariaLabelledBy = page.body.querySelector('ion-input > input').getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBe(label.id);
  });
});
