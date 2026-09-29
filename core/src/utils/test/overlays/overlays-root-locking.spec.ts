import { newSpecPage } from '@stencil/core/testing';

import type { HTMLIonOverlayElement } from '../../overlays-interface';

import { ActionSheet } from '../../../components/action-sheet/action-sheet';
import { Alert } from '../../../components/alert/alert';
import { Loading } from '../../../components/loading/loading';
import { Modal } from '../../../components/modal/modal';
import { Popover } from '../../../components/popover/popover';

// A presented overlay locks the app root with `aria-hidden` on the view
// container and `backdrop-no-scroll` on the body, and being taken out and put
// back must not drop it. mock-doc's `appendChild` removes before it inserts, so
// the disconnect fires while detached, which a browser only does across tasks.
// Fixes https://github.com/ionic-team/ionic-framework/issues/31389
describe('overlays: root locking across a move', () => {
  const overlays = [
    { tag: 'ion-modal', component: Modal },
    { tag: 'ion-popover', component: Popover },
    { tag: 'ion-alert', component: Alert },
    { tag: 'ion-action-sheet', component: ActionSheet },
    { tag: 'ion-loading', component: Loading },
  ];

  overlays.forEach(({ tag, component }) => {
    it(`should keep the app root locked when a presented ${tag} is moved`, async () => {
      const page = await newSpecPage({
        components: [component],
        html: `
          <div id="ion-view-container-root"></div>
          <div id="destination"></div>
          <${tag}></${tag}>
        `,
      });

      const overlay = page.body.querySelector(tag) as HTMLIonOverlayElement;
      const viewContainer = page.body.querySelector('#ion-view-container-root')!;
      const destination = page.body.querySelector('#destination')!;
      const body = page.doc.querySelector('body')!;

      await overlay.present();

      expect(viewContainer.getAttribute('aria-hidden')).toBe('true');
      expect(body).toHaveClass('backdrop-no-scroll');

      destination.appendChild(overlay);
      await page.waitForChanges();

      expect(viewContainer.getAttribute('aria-hidden')).toBe('true');
      expect(body).toHaveClass('backdrop-no-scroll');
    });
  });

  it('should release the app root when a moved overlay is later dismissed', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <div id="ion-view-container-root"></div>
        <div id="destination"></div>
        <ion-modal></ion-modal>
      `,
    });

    const modal = page.body.querySelector('ion-modal')!;
    const viewContainer = page.body.querySelector('#ion-view-container-root')!;
    const destination = page.body.querySelector('#destination')!;
    const body = page.doc.querySelector('body')!;

    await modal.present();

    destination.appendChild(modal);
    await page.waitForChanges();

    await modal.dismiss();

    expect(viewContainer.hasAttribute('aria-hidden')).toBe(false);
    expect(body).not.toHaveClass('backdrop-no-scroll');
  });

  it('should not lock the app root for a moved overlay that opted out of the focus trap', async () => {
    // The overlay never locked the root, so a move must not start locking it.
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <div id="ion-view-container-root"></div>
        <div id="destination"></div>
        <ion-modal></ion-modal>
      `,
    });

    const modal = page.body.querySelector('ion-modal')!;
    modal.focusTrap = false;
    const viewContainer = page.body.querySelector('#ion-view-container-root')!;
    const destination = page.body.querySelector('#destination')!;
    const body = page.doc.querySelector('body')!;

    await modal.present();

    expect(viewContainer.hasAttribute('aria-hidden')).toBe(false);

    destination.appendChild(modal);
    await page.waitForChanges();

    expect(viewContainer.hasAttribute('aria-hidden')).toBe(false);
    expect(body).not.toHaveClass('backdrop-no-scroll');
  });

  it('should not aria-hide the view container an overlay was re-inserted into', async () => {
    /**
     * Presenting skips `aria-hidden` when the overlay ends up inside the view
     * container, since hiding it would hide the overlay too. A re-insert has to
     * reach the same conclusion while still restoring the scroll block.
     */
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <div id="ion-view-container-root"></div>
        <ion-modal></ion-modal>
      `,
    });

    const modal = page.body.querySelector('ion-modal')!;
    const viewContainer = page.body.querySelector('#ion-view-container-root')!;
    const body = page.doc.querySelector('body')!;

    await modal.present();
    expect(viewContainer.getAttribute('aria-hidden')).toBe('true');

    viewContainer.appendChild(modal);
    await page.waitForChanges();

    expect(viewContainer.hasAttribute('aria-hidden')).toBe(false);
    // The scroll block still has to come back, or this would pass on the
    // teardown alone and never see the restore run.
    expect(body).toHaveClass('backdrop-no-scroll');
  });

  it('should not stack parent-removal observers when a modal is moved while presenting', async () => {
    // Both `present()` and the reconnect init the observer, so a move between
    // the two must not leave an orphan that nothing ever disconnects.
    const NativeMutationObserver = (global as any).MutationObserver;
    const live = new Set<unknown>();
    (global as any).MutationObserver = class {
      constructor() {
        live.add(this);
      }
      observe() {}
      disconnect() {
        live.delete(this);
      }
    };

    try {
      const page = await newSpecPage({
        components: [Modal],
        html: `
          <div id="parent"><ion-modal></ion-modal></div>
          <div id="destination"></div>
        `,
      });

      const modal = page.body.querySelector('ion-modal')!;
      const destination = page.body.querySelector('#destination')!;

      modal.addEventListener('ionModalWillPresent', () => destination.appendChild(modal), { once: true });

      await modal.present();
      await page.waitForChanges();

      expect(live.size).toBe(1);

      await modal.dismiss();
      await page.waitForChanges();

      expect(live.size).toBe(0);
    } finally {
      (global as any).MutationObserver = NativeMutationObserver;
    }
  });
});
