import { newSpecPage } from '@stencil/core/testing';

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
    it('set custom attribute on the instance, override config', async () => {
      const t = await newToggle();
      t.enableOnOffLabels = false;
      config.reset({
        onOffLabelsEnabled: true,
      });
      expect(t.onOffLabelsEnabled).toBe(false);
    });

    it('set custom attribute in the config', async () => {
      config.reset({
        onOffLabelsEnabled: true,
      });
      const t = await newToggle();
      expect(t.onOffLabelsEnabled).toBe(true);
    });

    it('set custom icon on the instance', async () => {
      const t = await newToggle();
      t.enableOnOffLabels = true;
      expect(t.onOffLabelsEnabled).toBe(true);
    });
  });
});
