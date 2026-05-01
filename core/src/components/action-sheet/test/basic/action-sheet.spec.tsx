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

describe('action sheet: role="selected"', () => {
  // Regression test for https://github.com/ionic-team/ionic-framework/issues/31090
  // Buttons with `role: "selected"` must render the `action-sheet-selected`
  // class so that userland CSS targeting the active option keeps working.
  it('should add the action-sheet-selected class to a button with role="selected"', async () => {
    const page = await newSpecPage({
      components: [ActionSheet],
      template: () => (
        <ion-action-sheet
          buttons={[
            { text: 'Option A' },
            { text: 'Option B', role: 'selected' },
            { text: 'Option C' },
            { text: 'Cancel', role: 'cancel' },
          ]}
          overlayIndex={1}
        ></ion-action-sheet>
      ),
    });

    const actionSheet = page.body.querySelector('ion-action-sheet')!;

    await actionSheet.present();

    const buttons = Array.from(actionSheet.querySelectorAll<HTMLButtonElement>('.action-sheet-button'));
    const selectedButton = buttons.find((btn) => btn.textContent?.trim() === 'Option B');

    await expect(selectedButton).toBeDefined();
    await expect(selectedButton!.classList.contains('action-sheet-selected')).toBe(true);

    const optionA = buttons.find((btn) => btn.textContent?.trim() === 'Option A');
    await expect(optionA!.classList.contains('action-sheet-selected')).toBe(false);
  });
});
