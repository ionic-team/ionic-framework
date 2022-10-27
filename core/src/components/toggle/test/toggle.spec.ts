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
});
