import { newSpecPage } from '@stencil/core/testing';

import { Backdrop } from '../../../components/backdrop/backdrop';
import { Modal } from '../../../components/modal/modal';
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

    const routerOutlet = page.body.querySelector('ion-router-outlet');

    expect(routerOutlet.hasAttribute('aria-hidden')).toEqual(false);

    setRootAriaHidden(true);
    expect(routerOutlet.hasAttribute('aria-hidden')).toEqual(true);

    setRootAriaHidden(false);
    expect(routerOutlet.hasAttribute('aria-hidden')).toEqual(false);
  });

  it('should correctly remove and re-add nav from accessibility tree', async () => {
    const page = await newSpecPage({
      components: [Nav],
      html: `
        <ion-nav></ion-nav>
      `,
    });

    const nav = page.body.querySelector('ion-nav');

    expect(nav.hasAttribute('aria-hidden')).toEqual(false);

    setRootAriaHidden(true);
    expect(nav.hasAttribute('aria-hidden')).toEqual(true);

    setRootAriaHidden(false);
    expect(nav.hasAttribute('aria-hidden')).toEqual(false);
  });

  it('should correctly remove and re-add custom container from accessibility tree', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
        <div id="ion-view-container-root"></div>
        <div id="not-container-root"></div>
      `,
    });

    const containerRoot = page.body.querySelector('#ion-view-container-root');
    const notContainerRoot = page.body.querySelector('#not-container-root');

    expect(containerRoot.hasAttribute('aria-hidden')).toEqual(false);
    expect(notContainerRoot.hasAttribute('aria-hidden')).toEqual(false);

    setRootAriaHidden(true);
    expect(containerRoot.hasAttribute('aria-hidden')).toEqual(true);
    expect(notContainerRoot.hasAttribute('aria-hidden')).toEqual(false);

    setRootAriaHidden(false);
    expect(containerRoot.hasAttribute('aria-hidden')).toEqual(false);
    expect(notContainerRoot.hasAttribute('aria-hidden')).toEqual(false);
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
      components: [RouterOutlet, Modal, Backdrop],
      html: `
        <ion-router-outlet>
          <ion-modal></ion-modal>
        </ion-router-outlet>
      `,
    });

    const routerOutlet = page.body.querySelector('ion-router-outlet');
    const modal = page.body.querySelector('ion-modal');

    await modal.present();

    expect(routerOutlet.hasAttribute('aria-hidden')).toEqual(true);
  });

  it('should add router-outlet from accessibility tree when then final overlay is dismissed', async () => {
    const page = await newSpecPage({
      components: [RouterOutlet, Modal, Backdrop],
      html: `
        <ion-router-outlet>
          <ion-modal id="one"></ion-modal>
          <ion-modal id="two"></ion-modal>
        </ion-router-outlet>
      `,
    });

    const routerOutlet = page.body.querySelector('ion-router-outlet');
    const modalOne = page.body.querySelector('ion-modal#one');
    const modalTwo = page.body.querySelector('ion-modal#two');

    await modalOne.present();

    expect(routerOutlet.hasAttribute('aria-hidden')).toEqual(true);

    await modalTwo.present();

    expect(routerOutlet.hasAttribute('aria-hidden')).toEqual(true);

    await modalOne.dismiss();

    expect(routerOutlet.hasAttribute('aria-hidden')).toEqual(true);

    await modalTwo.dismiss();

    expect(routerOutlet.hasAttribute('aria-hidden')).toEqual(false);
  });
});
