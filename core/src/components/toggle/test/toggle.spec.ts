import { newSpecPage } from '@stencil/core/testing';
import { checkmarkOutline, ellipseOutline, removeOutline } from 'ionicons/icons';

import { config } from '../../../global/config';
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
    it('should set custom checked icon on the instance, overriding config', async () => {
      const t = await newToggle();
      t.checkedIcon = 'custom-checked-icon-instance';
      config.reset({
        toggleCheckedIcon: 'custom-checked-icon-config',
      });

      expect((t as any).getSwitchLabelIcon('md', true)).toBe('custom-checked-icon-instance');
    });

    it('should set custom unchecked icon on the instance, overriding config', async () => {
      const t = await newToggle();
      t.uncheckedIcon = 'custom-unchecked-icon-instance';
      config.reset({
        toggleUncheckedIcon: 'custom-unchecked-icon-config',
      });

      expect((t as any).getSwitchLabelIcon('md', false)).toBe('custom-unchecked-icon-instance');
    });

    it('should set custom checked icon in the config', async () => {
      const t = await newToggle();
      config.reset({
        toggleCheckedIcon: 'custom-checked-icon-config',
      });

      expect((t as any).getSwitchLabelIcon('md', true)).toBe('custom-checked-icon-config');
    });

    it('should set custom unchecked icon in the config', async () => {
      const t = await newToggle();
      config.reset({
        toggleUncheckedIcon: 'custom-unchecked-icon-config',
      });

      expect((t as any).getSwitchLabelIcon('md', false)).toBe('custom-unchecked-icon-config');
    });

    it('should use default icons in md mode', async () => {
      const t = await newToggle();
      expect((t as any).getSwitchLabelIcon('md', true)).toBe(checkmarkOutline);
      expect((t as any).getSwitchLabelIcon('md', false)).toBe(removeOutline);
    });

    it('should use default icons in ios mode', async () => {
      const t = await newToggle();
      expect((t as any).getSwitchLabelIcon('ios', true)).toBe(removeOutline);
      expect((t as any).getSwitchLabelIcon('ios', false)).toBe(ellipseOutline);
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
