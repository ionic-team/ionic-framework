import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { ActionSheet } from '../../action-sheet';

describe('action sheet: htmlAttributes inheritance', () => {
  it('should correctly inherit attributes on host', async () => {
    const page = await newSpecPage({
      components: [ActionSheet],
      template: () => (
        <ion-action-sheet
          htmlAttributes={{
            'data-testid': 'basic-action-sheet',
          }}
          overlayIndex={1}
        ></ion-action-sheet>
      ),
    });

    const actionSheet = page.body.querySelector('ion-action-sheet')!;

    await expect(actionSheet.getAttribute('data-testid')).toBe('basic-action-sheet');
  });
});

describe('action sheet: disabled buttons', () => {
  it('regular button should be disabled', async () => {
    const page = await newSpecPage({
      components: [ActionSheet],
      template: () => (
        <ion-action-sheet buttons={[{ text: 'cancel', disabled: true }]} overlayIndex={1}></ion-action-sheet>
      ),
    });

    const actionSheet = page.body.querySelector('ion-action-sheet')!;

    await actionSheet.present();

    const button = actionSheet.querySelector<HTMLButtonElement>('.action-sheet-button')!;
    await expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('cancel button should not be disabled', async () => {
    const page = await newSpecPage({
      components: [ActionSheet],
      template: () => (
        <ion-action-sheet
          buttons={[{ text: 'cancel', role: 'cancel', disabled: true }]}
          overlayIndex={1}
        ></ion-action-sheet>
      ),
    });

    const actionSheet = page.body.querySelector('ion-action-sheet')!;

    await actionSheet.present();

    const cancelButton = actionSheet.querySelector<HTMLButtonElement>('.action-sheet-cancel')!;
    await expect(cancelButton.hasAttribute('disabled')).toBe(false);
  });
});
