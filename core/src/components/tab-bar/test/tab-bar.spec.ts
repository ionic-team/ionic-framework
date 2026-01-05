import { newSpecPage } from '@stencil/core/testing';

import { TabBar } from '../tab-bar';
import { TabButton } from '../../tab-button/tab-button';

describe('tab-bar', () => {
  describe('basic rendering', () => {
    it('should render with tab buttons', async () => {
      const page = await newSpecPage({
        components: [TabBar, TabButton],
        html: `
          <ion-tab-bar>
            <ion-tab-button tab="tab1">
              <ion-label>Tab 1</ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        `,
      });

      expect(page.root).toBeTruthy();
      expect(page.root?.tagName).toBe('ION-TAB-BAR');
    });

    it('should have correct role attribute', async () => {
      const page = await newSpecPage({
        components: [TabBar],
        html: `<ion-tab-bar></ion-tab-bar>`,
      });

      expect(page.root?.getAttribute('role')).toBe('tablist');
    });
  });

  describe('lifecycle', () => {
    it('should handle removal without errors', async () => {
      const page = await newSpecPage({
        components: [TabBar],
        html: `<ion-tab-bar></ion-tab-bar>`,
      });

      page.root?.remove();
      await page.waitForChanges();

      expect(page.body.querySelector('ion-tab-bar')).toBeNull();
    });

    it('should handle rapid mount/unmount without errors', async () => {
      const page = await newSpecPage({
        components: [TabBar],
        html: `<div id="container"></div>`,
      });

      const container = page.body.querySelector('#container')!;

      for (let i = 0; i < 3; i++) {
        const tabBar = page.doc.createElement('ion-tab-bar');
        container.appendChild(tabBar);
        await page.waitForChanges();
        tabBar.remove();
        await page.waitForChanges();
      }

      expect(container.children.length).toBe(0);
    });
  });
});
