import { testUserAgent, getPlatforms, isPlatform } from '../platform';
import { PlatformConfiguration, configureBrowser } from './platform.utils';

describe('Platform Tests', () => {
  describe('testUserAgent()', () => {
    it('should return true when testing if user agent is an iPhone', () => {
      const win = configureBrowser(PlatformConfiguration.iPhone);
      expect(testUserAgent(win, /iPhone/)).toEqual(true);
    })

    it('should return false when testing if user agent is an iPad', () => {
      const win = configureBrowser(PlatformConfiguration.iPhone);
      expect(testUserAgent(win, /iPad/)).toEqual(false);
    })

    it('should return false when testing if user agent is an Android', () => {
      const win = configureBrowser(PlatformConfiguration.iPhone);
      expect(testUserAgent(win, /android|sink/i)).toEqual(false);
    })

    it('should return true when testing if user agent is an Android', () => {
      const win = configureBrowser(PlatformConfiguration.AndroidTablet);
      expect(testUserAgent(win, /android|sink/i)).toEqual(true);
    })
  });

  describe('getPlatforms()', () => {
    it('should contain "desktop" platform', () => {
      const win = configureBrowser(PlatformConfiguration.DesktopSafari);
      expect(getPlatforms(win)).toContain('desktop');
    });

    it('should contain "android" and "tablet" platforms', () => {
      const win = configureBrowser(PlatformConfiguration.AndroidTablet);

      const platforms = getPlatforms(win);
      expect(platforms).toContain('android');
      expect(platforms).toContain('tablet');
    })

    it('should contain "capacitor" platform', () => {
      const win = configureBrowser(PlatformConfiguration.Capacitor);
      expect(getPlatforms(win)).toContain('capacitor');
    })
  });

  describe('isPlatform()', () => {
    it('should return true for "capacitor" and "hybrid" in a Capacitor app', () => {
      const win = configureBrowser(PlatformConfiguration.Capacitor);
      expect(isPlatform(win, 'capacitor')).toEqual(true);
      expect(isPlatform(win, 'hybrid')).toEqual(true);
    });

    it('should return false for "capacitor" and true for "desktop" on desktop safari', () => {
      const win = configureBrowser(PlatformConfiguration.DesktopSafari);
      expect(isPlatform(win, 'capacitor')).toEqual(false);
      expect(isPlatform(win, 'desktop')).toEqual(true);
    });

    it('should return true for "android" and "tablet" on an android tablet', () => {
      const win = configureBrowser(PlatformConfiguration.AndroidTablet);
      expect(isPlatform(win, 'android')).toEqual(true);
      expect(isPlatform(win, 'tablet')).toEqual(true);
    });

    it('should return true for "cordova" and "hybrid" in a Cordova app', () => {
      const win = configureBrowser(PlatformConfiguration.Cordova);
      expect(isPlatform(win, 'cordova')).toEqual(true);
      expect(isPlatform(win, 'hybrid')).toEqual(true);
    });

    it('should return true for "ipad" and "tablet" on an iPad Pro', () => {
      const win = configureBrowser(PlatformConfiguration.iPadPro);
      expect(isPlatform(win, 'ipad')).toEqual(true);
      expect(isPlatform(win, 'tablet')).toEqual(true);
    });

    it('should return true for "android", false for "tablet, and false for "desktop"" on a Pixel 2 XL', () => {
      const win = configureBrowser(PlatformConfiguration.Pixel2XL);
      expect(isPlatform(win, 'android')).toEqual(true);
      expect(isPlatform(win, 'tablet')).toEqual(false);
      expect(isPlatform(win, 'desktop')).toEqual(false);
    });

    it('should return true for "android" and "tablet" and false for "desktop" on a Galaxy View', () => {
      const win = configureBrowser(PlatformConfiguration.GalaxyView);
      expect(isPlatform(win, 'android')).toEqual(true);
      expect(isPlatform(win, 'tablet')).toEqual(true);
      expect(isPlatform(win, 'desktop')).toEqual(false);
    });

    it('should return false for "android" and "tablet" on desktop Safari', () => {
      const win = configureBrowser(PlatformConfiguration.DesktopSafari);
      expect(isPlatform(win, 'android')).toEqual(false);
      expect(isPlatform(win, 'tablet')).toEqual(false);
    });

    it('should return false for "android" and "tablet" and false for "desktop" on iPhone', () => {
      const win = configureBrowser(PlatformConfiguration.iPhone);
      expect(isPlatform(win, 'android')).toEqual(false);
      expect(isPlatform(win, 'tablet')).toEqual(false);
      expect(isPlatform(win, 'desktop')).toEqual(false);
    });

    it('should return true for "android", false for "tablet", and false for "desktop" on Galaxy S9 Plus', () => {
      const win = configureBrowser(PlatformConfiguration.GalaxyS9Plus);
      expect(isPlatform(win, 'android')).toEqual(true);
      expect(isPlatform(win, 'tablet')).toEqual(false);
      expect(isPlatform(win, 'desktop')).toEqual(false);
    });

    it('should return true for "pwa" and false for "cordova"', () => {
      const win = configureBrowser(PlatformConfiguration.PWA);
      expect(isPlatform(win, 'pwa')).toEqual(true);
      expect(isPlatform(win, 'cordova')).toEqual(false);
    });
  })
});