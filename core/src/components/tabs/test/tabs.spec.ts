import { newSpecPage } from '@stencil/core/testing';

import { Tab } from '../../tab/tab';
import { Tabs } from '../tabs';

const HTML = `
  <ion-tabs>
    <ion-tab tab="tab-one"></ion-tab>
    <ion-tab tab="tab-two"></ion-tab>
  </ion-tabs>
`;

describe('ion-tabs', () => {
  describe('getSelected()', () => {
    it('should return the name of the initially selected tab', async () => {
      const page = await newSpecPage({
        components: [Tabs, Tab],
        html: HTML,
      });

      const tabsEl = page.body.querySelector('ion-tabs')!;
      expect(await tabsEl.getSelected()).toBe('tab-one');
    });
  });

  describe('getTab()', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      // getTab() calls printIonError when the tab id is not found, suppress to keep test output clean
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should return the element for an existing tab id', async () => {
      const page = await newSpecPage({
        components: [Tabs, Tab],
        html: HTML,
      });

      const tabsEl = page.body.querySelector('ion-tabs')!;
      const tabEl = page.body.querySelector('ion-tab[tab="tab-two"]')!;
      expect(await tabsEl.getTab('tab-two')).toBe(tabEl);
    });

    it('should return undefined for a non-existent tab id', async () => {
      const page = await newSpecPage({
        components: [Tabs, Tab],
        html: HTML,
      });

      const tabsEl = page.body.querySelector('ion-tabs')!;
      expect(await tabsEl.getTab('does-not-exist')).toBeUndefined();
    });
  });

  describe('select()', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      // select() calls printIonError when the tab id is not found, suppress to keep test output clean
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should switch to the specified tab and return true', async () => {
      const page = await newSpecPage({
        components: [Tabs, Tab],
        html: HTML,
      });

      const tabsEl = page.body.querySelector('ion-tabs')!;
      const result = await tabsEl.select('tab-two');

      expect(result).toBe(true);
      expect(await tabsEl.getSelected()).toBe('tab-two');
    });

    it('should return false when selecting the already active tab', async () => {
      const page = await newSpecPage({
        components: [Tabs, Tab],
        html: HTML,
      });

      const tabsEl = page.body.querySelector('ion-tabs')!;
      const result = await tabsEl.select('tab-one');

      expect(result).toBe(false);
    });

    it('should return false when selecting a non-existent tab id', async () => {
      const page = await newSpecPage({
        components: [Tabs, Tab],
        html: HTML,
      });

      const tabsEl = page.body.querySelector('ion-tabs')!;
      const result = await tabsEl.select('does-not-exist');

      expect(result).toBe(false);
    });
  });

  describe('events', () => {
    it('should emit ionTabsWillChange and ionTabsDidChange when switching tabs', async () => {
      const page = await newSpecPage({
        components: [Tabs, Tab],
        html: HTML,
      });

      const tabsEl = page.body.querySelector('ion-tabs')!;

      const willChangeSpy = jest.fn();
      const didChangeSpy = jest.fn();
      tabsEl.addEventListener('ionTabsWillChange', willChangeSpy);
      tabsEl.addEventListener('ionTabsDidChange', didChangeSpy);

      await tabsEl.select('tab-two');
      await page.waitForChanges();

      expect(willChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { tab: 'tab-two' } }));
      expect(didChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { tab: 'tab-two' } }));
    });

    it('should not emit ionTabsDidChange when selecting the already active tab', async () => {
      const page = await newSpecPage({
        components: [Tabs, Tab],
        html: HTML,
      });

      const tabsEl = page.body.querySelector('ion-tabs')!;

      const didChangeSpy = jest.fn();
      tabsEl.addEventListener('ionTabsDidChange', didChangeSpy);

      await tabsEl.select('tab-one');

      expect(didChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      // select() calls printIonError when the tab id is not found, suppress to keep test output clean
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should log the correct tab id when selecting a non-existent tab', async () => {
      const page = await newSpecPage({
        components: [Tabs, Tab],
        html: HTML,
      });

      const tabsEl = page.body.querySelector('ion-tabs')!;
      await tabsEl.select('does-not-exist');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Ionic Error]: [ion-tabs] - Tab with id: "does-not-exist" does not exist'
      );
    });
  });
});
