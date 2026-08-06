import { newSpecPage } from '@stencil/core/testing';

import type { FrameworkDelegate } from '../../../interface';
import { Tab } from '../tab';

const mockDelegate = (attachViewToDom: FrameworkDelegate['attachViewToDom']): FrameworkDelegate => ({
  attachViewToDom,
  removeViewFromDom: jest.fn().mockResolvedValue(undefined),
});

const createTab = async (html = '<ion-tab tab="home" component="ion-content"></ion-tab>') => {
  const page = await newSpecPage({
    components: [Tab],
    html,
  });

  return { page, tabEl: page.body.querySelector<HTMLIonTabElement>('ion-tab')! };
};

describe('ion-tab: lazy loading', () => {
  it('should attach the component only once across multiple setActive calls', async () => {
    const { tabEl } = await createTab();
    const attachViewToDom = jest.fn().mockResolvedValue(document.createElement('div'));
    tabEl.delegate = mockDelegate(attachViewToDom);

    await tabEl.setActive();
    await tabEl.setActive();

    expect(attachViewToDom).toHaveBeenCalledTimes(1);
  });

  it('should share one attach attempt across concurrent setActive calls', async () => {
    const { tabEl } = await createTab();
    const attachViewToDom = jest.fn().mockResolvedValue(document.createElement('div'));
    tabEl.delegate = mockDelegate(attachViewToDom);

    await Promise.all([tabEl.setActive(), tabEl.setActive()]);

    expect(attachViewToDom).toHaveBeenCalledTimes(1);
  });

  it('should make a later setActive wait for the in-flight attach', async () => {
    const { tabEl } = await createTab();
    let resolveAttach!: (el: HTMLElement) => void;
    const attachViewToDom = jest.fn(() => new Promise<HTMLElement>((resolve) => (resolveAttach = resolve)));
    tabEl.delegate = mockDelegate(attachViewToDom);

    const first = tabEl.setActive();
    const second = tabEl.setActive();
    let secondSettled = false;
    second.then(() => (secondSettled = true));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(secondSettled).toBe(false);

    resolveAttach(document.createElement('div'));
    await Promise.all([first, second]);

    expect(secondSettled).toBe(true);
    expect(attachViewToDom).toHaveBeenCalledTimes(1);
  });

  it('should retry the attach after a failed first attempt', async () => {
    const { tabEl } = await createTab();
    const attachViewToDom = jest
      .fn()
      .mockRejectedValueOnce(new Error('attach failed'))
      .mockResolvedValue(document.createElement('div'));
    tabEl.delegate = mockDelegate(attachViewToDom);

    await expect(tabEl.setActive()).rejects.toThrow('attach failed');
    await expect(tabEl.setActive()).resolves.toBeUndefined();

    expect(attachViewToDom).toHaveBeenCalledTimes(2);
  });

  it('should not activate the tab when the attach fails', async () => {
    const { tabEl } = await createTab();
    tabEl.delegate = mockDelegate(jest.fn().mockRejectedValue(new Error('attach failed')));

    await expect(tabEl.setActive()).rejects.toThrow('attach failed');

    expect(tabEl.active).toBe(false);
  });

  it('should activate the tab once a retried attach succeeds', async () => {
    const { page, tabEl } = await createTab();
    const attachViewToDom = jest
      .fn()
      .mockRejectedValueOnce(new Error('attach failed'))
      .mockResolvedValue(document.createElement('div'));
    tabEl.delegate = mockDelegate(attachViewToDom);

    await expect(tabEl.setActive()).rejects.toThrow('attach failed');
    await tabEl.setActive();
    await page.waitForChanges();

    expect(attachViewToDom).toHaveBeenCalledTimes(2);
    expect(tabEl.active).toBe(true);
    expect(tabEl.classList.contains('tab-hidden')).toBe(false);
  });

  it('should attach the component when the tab starts active', async () => {
    const { page, tabEl } = await createTab('<ion-tab tab="home" component="ion-content" active="true"></ion-tab>');

    await page.waitForChanges();

    expect(tabEl.querySelector('ion-content.ion-page')).not.toBeNull();
    expect(tabEl.classList.contains('tab-hidden')).toBe(false);
  });

  it('should not attach anything when no component is provided', async () => {
    const { tabEl } = await createTab('<ion-tab tab="home"></ion-tab>');
    const attachViewToDom = jest.fn().mockResolvedValue(document.createElement('div'));
    tabEl.delegate = mockDelegate(attachViewToDom);

    await expect(tabEl.setActive()).resolves.toBeUndefined();

    expect(attachViewToDom).not.toHaveBeenCalled();
    expect(tabEl.active).toBe(true);
  });

  describe('when the attach fails on the active watcher path', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error');
      // Suppress console.error output from polluting the test output
      consoleErrorSpy.mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    // Jest fails a test on an unhandled rejection, so the watcher swallowing the
    // rejection is covered without an explicit unhandledRejection listener.
    it('should log the error', async () => {
      const { page, tabEl } = await createTab();
      tabEl.delegate = mockDelegate(jest.fn().mockRejectedValue(new Error('attach failed')));

      // ion-tabs activates a tab by setting `active`, it does not await setActive().
      tabEl.active = true;
      await page.waitForChanges();
      // Give the rejected attach a turn to settle so the watcher can log it.
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Ionic Error]: [ion-tab] - Exception in prepareLazyLoaded:',
        expect.any(Error)
      );
    });

    it('should retry on the next activation, as ion-tabs reactivates tabs', async () => {
      const { page, tabEl } = await createTab();
      const attachViewToDom = jest
        .fn()
        .mockRejectedValueOnce(new Error('attach failed'))
        .mockImplementation(() => {
          const el = document.createElement('div');
          el.classList.add('attached-page');
          tabEl.appendChild(el);
          return Promise.resolve(el);
        });
      tabEl.delegate = mockDelegate(attachViewToDom);

      tabEl.active = true;
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(tabEl.querySelector('.attached-page')).toBeNull();

      // ion-tabs deactivates the leaving tab, so returning to it is a false -> true change.
      tabEl.active = false;
      await page.waitForChanges();
      tabEl.active = true;
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(attachViewToDom).toHaveBeenCalledTimes(2);
      expect(tabEl.querySelector('.attached-page')).not.toBeNull();
    });
  });
});
