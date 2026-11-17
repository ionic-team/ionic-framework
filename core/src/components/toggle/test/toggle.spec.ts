import { newSpecPage } from '@stencil/core/testing';
import { checkmarkOutline, ellipseOutline, removeOutline } from 'ionicons/icons';

import { config } from '../../../global/config';
import { initialize } from '../../../global/ionic-global';
import type { IonicConfig } from '../../../interface';
import { Toggle } from '../toggle';

describe('toggle', () => {
  beforeEach(() => {
    config.reset({});
  });

  const newToggle = async (): Promise<Toggle> => {
    const { rootInstance } = await newSpecPage({
      components: [Toggle],
      html: `<ion-toggle></ion-toggle>`,
    });
    return rootInstance;
  };

  describe('enableOnOffLabels', () => {
    it('should disable on/off labels when setting to false on component', async () => {
      const t = await newToggle();
      t.enableOnOffLabels = false;
      config.reset({
        toggleOnOffLabels: true,
      });
      expect(t.enableOnOffLabels).toBe(false);
    });

    it('should enable on/off labels when setting to true on global config', async () => {
      config.reset({
        toggleOnOffLabels: true,
      });
      const t = await newToggle();
      expect(t.enableOnOffLabels).toBe(true);
    });

    it('should enable on/off labels when setting to true on component', async () => {
      const t = await newToggle();
      t.enableOnOffLabels = true;
      expect(t.enableOnOffLabels).toBe(true);
    });
  });

  describe('checkedIcon and uncheckedIcon', () => {
    /**
     * Renders a toggle with on/off labels enabled and returns the
     * icons drawn in its shadow root.
     */
    const renderIcons = async (attrs: string, mode: 'ios' | 'md', userConfig: IonicConfig = {}) => {
      // Lets getIonMode read the mode attribute; this also resets the config.
      initialize(userConfig);
      const page = await newSpecPage({
        components: [Toggle],
        html: `<ion-toggle mode="${mode}" enable-on-off-labels="true" ${attrs}>Label</ion-toggle>`,
      });
      const toggle = page.body.querySelector('ion-toggle')!;
      return Array.from(toggle.shadowRoot!.querySelectorAll('ion-icon'));
    };

    const iconNames = (icons: Element[]) => icons.map((icon) => icon.getAttribute('icon'));

    it('should render the checkedIcon prop over the config value', async () => {
      const icons = await renderIcons('checked checked-icon="prop-icon"', 'md', { toggleCheckedIcon: 'config-icon' });

      expect(iconNames(icons)).toEqual(['prop-icon']);
    });

    it('should render the uncheckedIcon prop over the config value', async () => {
      const icons = await renderIcons('unchecked-icon="prop-icon"', 'md', { toggleUncheckedIcon: 'config-icon' });

      expect(iconNames(icons)).toEqual(['prop-icon']);
    });

    it('should render the config icons when no prop is set', async () => {
      const icons = await renderIcons('', 'ios', {
        toggleCheckedIcon: 'config-checked',
        toggleUncheckedIcon: 'config-unchecked',
      });

      expect(iconNames(icons)).toEqual(['config-checked', 'config-unchecked']);
    });

    it('should render the default md icons', async () => {
      expect(iconNames(await renderIcons('checked', 'md'))).toEqual([checkmarkOutline]);
      expect(iconNames(await renderIcons('', 'md'))).toEqual([removeOutline]);
    });

    it('should render the default ios icons', async () => {
      expect(iconNames(await renderIcons('', 'ios'))).toEqual([removeOutline, ellipseOutline]);
    });

    it('should mark only custom icons with the custom class', async () => {
      const icons = await renderIcons('checked-icon="prop-icon"', 'ios');

      expect(icons[0]).toHaveClass('toggle-switch-icon-custom');
      expect(icons[1]).not.toHaveClass('toggle-switch-icon-custom');
    });

    it('should mark config icons with the custom class', async () => {
      const icons = await renderIcons('', 'ios', { toggleCheckedIcon: 'config-icon' });

      expect(icons[0]).toHaveClass('toggle-switch-icon-custom');
      expect(icons[1]).not.toHaveClass('toggle-switch-icon-custom');
    });

    it('should not render custom icons when on/off labels are disabled', async () => {
      const page = await newSpecPage({
        components: [Toggle],
        html: `<ion-toggle checked checked-icon="moon" unchecked-icon="sunny">Label</ion-toggle>`,
      });
      const toggle = page.body.querySelector('ion-toggle')!;

      expect(toggle.shadowRoot!.querySelectorAll('ion-icon').length).toBe(0);
    });
  });

  describe('shadow parts', () => {
    it('should have shadow parts', async () => {
      const page = await newSpecPage({
        components: [Toggle],
        html: `<ion-toggle>Label</ion-toggle>`,
      });
      const toggle = page.body.querySelector('ion-toggle')!;
      expect(toggle).toHaveShadowPart('label');
      expect(toggle).toHaveShadowPart('track');
      expect(toggle).toHaveShadowPart('handle');
    });
  });
});

describe('ion-toggle: disabled', () => {
  it('clicking disabled toggle should not toggle checked state', async () => {
    const page = await newSpecPage({
      components: [Toggle],
      html: `
        <ion-toggle disabled="true">Toggle</ion-toggle>
      `,
    });

    const toggle = page.body.querySelector('ion-toggle')!;

    expect(toggle.checked).toBe(false);

    toggle.click();

    await page.waitForChanges();

    expect(toggle.checked).toBe(false);
  });
});

describe('ion-toggle: required', () => {
  it('should have a required attribute in inner input when true', async () => {
    const page = await newSpecPage({
      components: [Toggle],
      html: `
        <ion-toggle required="true">Toggle</ion-toggle>
      `,
    });

    const toggle = page.body.querySelector('ion-toggle')!;
    const nativeInput = toggle.shadowRoot?.querySelector('input[role=switch]')!;

    expect(nativeInput.hasAttribute('required')).toBeTruthy();
  });

  it('should not have a required attribute in inner input when false', async () => {
    const page = await newSpecPage({
      components: [Toggle],
      html: `
        <ion-toggle required="false">Toggle</ion-toggle>
      `,
    });

    const toggle = page.body.querySelector('ion-toggle')!;
    const nativeInput = toggle.shadowRoot?.querySelector('input[role=switch]')!;

    expect(nativeInput.hasAttribute('required')).toBeFalsy();
  });
});

describe('ion-toggle: haptics', () => {
  let impact: jest.Mock;

  beforeEach(() => {
    impact = jest.fn();
    config.reset({});
  });

  afterEach(() => {
    delete (window as any).Capacitor;
    config.reset({});
  });

  const clickToggleOnIOS = async () => {
    const page = await newSpecPage({
      components: [Toggle],
      html: `<ion-toggle>Toggle</ion-toggle>`,
    });
    const win = page.win as any;
    win.Ionic = { ...win.Ionic, platforms: ['ios'] };
    // newSpecPage resets the window, so stub Capacitor after it
    win.Capacitor = {
      isPluginAvailable: (name: string) => name === 'Haptics',
      getPlatform: () => 'ios',
      Plugins: { Haptics: { impact } },
    };

    page.body.querySelector('ion-toggle')!.click();
    await page.waitForChanges();
  };

  it('should trigger haptics when clicked', async () => {
    await clickToggleOnIOS();

    expect(impact).toHaveBeenCalledTimes(1);
  });

  it('should not trigger haptics when clicked and the haptics config is false', async () => {
    config.reset({ haptics: false });

    await clickToggleOnIOS();

    expect(impact).not.toHaveBeenCalled();
  });
});
