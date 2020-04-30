import { newSpecPage } from '@stencil/core/testing';
import { BackButton } from "../back-button";
import { config } from "../../../global/config";
import { setMode } from '@stencil/core';


describe('back button', () => {
  beforeEach(() => {
    config.reset({});
  });

  const newBackButton = async (mode: string = 'md'): Promise<BackButton> => {
    setMode(() => mode);
    const { rootInstance } = await newSpecPage({
      components: [BackButton],
      html: `<ion-back-button></ion-back-button>`
    })
    return rootInstance;
  };


  describe('backButtonIcon', () => {

    it('set custom icon on the instance, override config', async () => {
      const bb = await newBackButton();
      bb.icon = 'custom-icon-instance';
      config.reset({
        backButtonIcon: 'custom-icon-config'
      });
      expect(bb.backButtonIcon).toBe('custom-icon-instance');
    });

    it('set custom icon in the config', async () => {
      const bb = await newBackButton();
      config.reset({
        backButtonIcon: 'custom-icon-config'
      });
      expect(bb.backButtonIcon).toBe('custom-icon-config');
    });

    it('set custom icon on the instance', async () => {
      const bb = await newBackButton();
      bb.icon = 'custom-icon-instance';
      expect(bb.backButtonIcon).toBe('custom-icon-instance');
    });

    it('default icon for ios mode', async () => {
      const bb = await newBackButton('ios');
      expect(bb.backButtonIcon).toBe('chevron-back');
    });

    it('default icon', async () => {
      const bb = await newBackButton();
      expect(bb.backButtonIcon).toBe('arrow-back-sharp');
    });

  });

  describe('backButtonText', () => {

    it('default text for ios mode', async () => {
      const bb = await newBackButton('ios');
      expect(bb.backButtonText).toBe('Back');
    });

    it('default text', async () => {
      const bb = await newBackButton();
      expect(bb.backButtonText).toBe(null);
    });

  });

  describe('backButtonDefaultHref', () => {

    it('set custom defaultHref in the config', async () => {
      config.reset({
        backButtonDefaultHref: 'custom-default-href-config'
      });
      const bb = await newBackButton();
      expect(bb.defaultHref).toBe('custom-default-href-config');
    });

    it('set custom defaultHref on the instance', async () => {
      const bb = await newBackButton();
      bb.defaultHref = 'custom-default-href';
      expect(bb.defaultHref).toBe('custom-default-href');
    });

    it('set custom defaultHref on the instance, override config', async () => {
      const bb = await newBackButton();
      bb.defaultHref = 'custom-default-href';

      config.reset({
        backButtonDefaultHref: 'custom-default-href-config'
      });

      expect(bb.defaultHref).toBe('custom-default-href');

      const bb2 = await newBackButton();
      bb2.defaultHref = 'custom-default-href-second';
      expect(bb2.defaultHref).toBe('custom-default-href-second');
    });

  });

});
