import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../../../components/modal/modal';
import { Toast } from '../../../components/toast/toast';
import { Nav } from '../../../components/nav/nav';
import { RouterOutlet } from '../../../components/router-outlet/router-outlet';
import { setRootAriaHidden } from '../../overlays';

describe('setRootAriaHidden()', () => {
  it('should correctly remove and re-add router outlet from accessibility tree', async () => {
    const page = await newSpecPage({
      components: [RouterOutlet],
      html: `
        <ion-router-outlet></ion-router-outlet>
      `,
    });

    const routerOutlet =
      page.body.querySelector(
        'ion-router-outlet'
      )!;

    expect(
      routerOutlet.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);

    setRootAriaHidden(true);
    expect(
      routerOutlet.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);

    setRootAriaHidden(false);
    expect(
      routerOutlet.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
  });

  it('should correctly remove and re-add nav from accessibility tree', async () => {
    const page = await newSpecPage({
      components: [Nav],
      html: `
        <ion-nav></ion-nav>
      `,
    });

    const nav =
      page.body.querySelector(
        'ion-nav'
      )!;

    expect(
      nav.hasAttribute('aria-hidden')
    ).toEqual(false);

    setRootAriaHidden(true);
    expect(
      nav.hasAttribute('aria-hidden')
    ).toEqual(true);

    setRootAriaHidden(false);
    expect(
      nav.hasAttribute('aria-hidden')
    ).toEqual(false);
  });

  it('should correctly remove and re-add custom container from accessibility tree', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
        <div id="ion-view-container-root"></div>
        <div id="not-container-root"></div>
      `,
    });

    const containerRoot =
      page.body.querySelector(
        '#ion-view-container-root'
      )!;
    const notContainerRoot =
      page.body.querySelector(
        '#not-container-root'
      )!;

    expect(
      containerRoot.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
    expect(
      notContainerRoot.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);

    setRootAriaHidden(true);
    expect(
      containerRoot.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);
    expect(
      notContainerRoot.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);

    setRootAriaHidden(false);
    expect(
      containerRoot.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
    expect(
      notContainerRoot.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
  });

  it('should not error if router outlet was not found', async () => {
    await newSpecPage({
      components: [],
      html: `
        <div></div>
      `,
    });

    setRootAriaHidden(true);
  });

  it('should remove router-outlet from accessibility tree when overlay is presented', async () => {
    const page = await newSpecPage({
      components: [RouterOutlet, Modal],
      html: `
        <ion-router-outlet>
          <ion-modal></ion-modal>
        </ion-router-outlet>
      `,
    });

    const routerOutlet =
      page.body.querySelector(
        'ion-router-outlet'
      )!;
    const modal =
      page.body.querySelector(
        'ion-modal'
      )!;

    await modal.present();

    expect(
      routerOutlet.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);
  });

  it('should add router-outlet from accessibility tree when then final overlay is dismissed', async () => {
    const page = await newSpecPage({
      components: [RouterOutlet, Modal],
      html: `
        <ion-router-outlet>
          <ion-modal id="one"></ion-modal>
          <ion-modal id="two"></ion-modal>
        </ion-router-outlet>
      `,
    });

    const routerOutlet =
      page.body.querySelector(
        'ion-router-outlet'
      )!;
    const modalOne =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#one'
      )!;
    const modalTwo =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#two'
      )!;

    await modalOne.present();

    expect(
      routerOutlet.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);

    await modalTwo.present();

    expect(
      routerOutlet.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);

    await modalOne.dismiss();

    expect(
      routerOutlet.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);

    await modalTwo.dismiss();

    expect(
      routerOutlet.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
  });
});

describe('aria-hidden on individual overlays', () => {
  it('should hide non-topmost overlays from screen readers', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <ion-modal id="one"></ion-modal>
        <ion-modal id="two"></ion-modal>
      `,
    });

    const modalOne =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#one'
      )!;
    const modalTwo =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#two'
      )!;

    await modalOne.present();
    await modalTwo.present();

    expect(
      modalOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);
    expect(
      modalTwo.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
  });

  it('should unhide new topmost overlay from screen readers when topmost is dismissed', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <ion-modal id="one"></ion-modal>
        <ion-modal id="two"></ion-modal>
      `,
    });

    const modalOne =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#one'
      )!;
    const modalTwo =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#two'
      )!;

    await modalOne.present();
    await modalTwo.present();

    // dismiss modalTwo so that modalOne becomes the new topmost overlay
    await modalTwo.dismiss();

    expect(
      modalOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
  });

  it('should not keep overlays hidden from screen readers if presented after being dismissed while non-topmost', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <ion-modal id="one"></ion-modal>
        <ion-modal id="two"></ion-modal>
      `,
    });

    const modalOne =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#one'
      )!;
    const modalTwo =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#two'
      )!;

    await modalOne.present();
    await modalTwo.present();

    // modalOne is not the topmost overlay at this point and is hidden from screen readers
    await modalOne.dismiss();

    // modalOne will become the topmost overlay; ensure it isn't still hidden from screen readers
    await modalOne.present();
    expect(
      modalOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
  });

  it('should not hide previous overlay if top-most overlay is toast', async () => {
    const page = await newSpecPage({
      components: [Modal, Toast],
      html: `
        <ion-modal id="m-one"></ion-modal>
        <ion-modal id="m-two"></ion-modal>
        <ion-toast id="t-one"></ion-toast>
        <ion-toast id="t-two"></ion-toast>
      `,
    });

    const modalOne =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#m-one'
      )!;
    const modalTwo =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#m-two'
      )!;
    const toastOne =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-toast#t-one'
      )!;
    const toastTwo =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-toast#t-two'
      )!;

    await modalOne.present();
    await modalTwo.present();
    await toastOne.present();
    await toastTwo.present();

    expect(
      modalOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);
    expect(
      modalTwo.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
    expect(
      toastOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
    expect(
      toastTwo.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);

    await toastTwo.dismiss();

    expect(
      modalOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);
    expect(
      modalTwo.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
    expect(
      toastOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);

    await toastOne.dismiss();

    expect(
      modalOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);
    expect(
      modalTwo.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
  });

  it('should hide previous overlay even with a toast that is not the top-most overlay', async () => {
    const page = await newSpecPage({
      components: [Modal, Toast],
      html: `
        <ion-modal id="m-one"></ion-modal>
        <ion-toast id="t-one"></ion-toast>
        <ion-modal id="m-two"></ion-modal>
      `,
    });

    const modalOne =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#m-one'
      )!;
    const modalTwo =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-modal#m-two'
      )!;
    const toastOne =
      page.body.querySelector<HTMLIonModalElement>(
        'ion-toast#t-one'
      )!;

    await modalOne.present();
    await toastOne.present();
    await modalTwo.present();

    expect(
      modalOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);
    expect(
      toastOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(true);
    expect(
      modalTwo.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);

    await modalTwo.dismiss();

    expect(
      modalOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
    expect(
      toastOne.hasAttribute(
        'aria-hidden'
      )
    ).toEqual(false);
  });
});
