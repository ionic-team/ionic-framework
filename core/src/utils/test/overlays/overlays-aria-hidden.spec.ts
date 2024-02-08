import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../../../components/modal/modal';

/**
 * These tests are put in a separate file from overlays.spec.ts
 * as a workaround to a Stencil issue where setTimeouts in other
 * components can hang around and execute after their relevant
 * tests have finished, causing errors.
 */
describe('aria-hidden on individual overlays', () => {
  it('should hide non-topmost overlays from screen readers', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <ion-modal id="one"></ion-modal>
        <ion-modal id="two"></ion-modal>
      `,
    });

    const modalOne = page.body.querySelector<HTMLIonModalElement>('ion-modal#one')!;
    const modalTwo = page.body.querySelector<HTMLIonModalElement>('ion-modal#two')!;

    await modalOne.present();
    await modalTwo.present();

    expect(modalOne.hasAttribute('aria-hidden')).toEqual(true);
    expect(modalTwo.hasAttribute('aria-hidden')).toEqual(false);
  });

  it('should unhide new topmost overlay from screen readers when topmost is dismissed', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <ion-modal id="one"></ion-modal>
        <ion-modal id="two"></ion-modal>
      `,
    });

    const modalOne = page.body.querySelector<HTMLIonModalElement>('ion-modal#one')!;
    const modalTwo = page.body.querySelector<HTMLIonModalElement>('ion-modal#two')!;

    await modalOne.present();
    await modalTwo.present();

    // dismiss modalTwo so that modalOne becomes the new topmost overlay
    await modalTwo.dismiss();

    expect(modalOne.hasAttribute('aria-hidden')).toEqual(false);
  });

  it('should not keep overlays hidden from screen readers if presented after being dismissed while non-topmost', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <ion-modal id="one"></ion-modal>
        <ion-modal id="two"></ion-modal>
      `,
    });

    const modalOne = page.body.querySelector<HTMLIonModalElement>('ion-modal#one')!;
    const modalTwo = page.body.querySelector<HTMLIonModalElement>('ion-modal#two')!;

    await modalOne.present();
    await modalTwo.present();

    // modalOne is not the topmost overlay at this point and is hidden from screen readers
    await modalOne.dismiss();

    // modalOne will become the topmost overlay; ensure it isn't still hidden from screen readers
    await modalOne.present();
    expect(modalOne.hasAttribute('aria-hidden')).toEqual(false);
  });
});
