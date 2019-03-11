import { testUserAgent, getPlatforms, isPlatform } from '../platform';
import { PlatformConfiguration, configureBrowser } from './platform.utils';

describe('Platform Tests', () => {  
  describe('testUserAgent()', () => {
    it('should return true when testing if user agent is an iPhone', () => {
      const window = configureBrowser(PlatformConfiguration.iPhone);
      expect(testUserAgent(window, /iPhone/)).toEqual(true);
    })
    
    it('should return false when testing if user agent is an iPad', () => {
      const window = configureBrowser(PlatformConfiguration.iPhone);
      expect(testUserAgent(window, /iPad/)).toEqual(false);
    })
    
    it('should return false when testing if user agent is an Android', () => {
      const window = configureBrowser(PlatformConfiguration.iPhone);
      expect(testUserAgent(window, /android|sink/i)).toEqual(false);
    })
    
    it('should return true when testing if user agent is an Android', () => {
      const window = configureBrowser(PlatformConfiguration.AndroidTablet);
      expect(testUserAgent(window, /android|sink/i)).toEqual(true);
    })
  });
  
  describe('getPlatforms()', () => {
    it('should contain "desktop" platform', () => {
      const window = configureBrowser(PlatformConfiguration.DesktopSafari);    
      expect(getPlatforms(window)).toContain('desktop');
    });
    
    it('should contain "android" and "tablet" platforms', () => {
      const window = configureBrowser(PlatformConfiguration.AndroidTablet);
      
      const platforms = getPlatforms(window);
      expect(platforms).toContain('android');
      expect(platforms).toContain('tablet');
    })
    
    it('should contain "capacitor" platform', () => {
      const window = configureBrowser(PlatformConfiguration.Capacitor);    
      expect(getPlatforms(window)).toContain('capacitor');
    })
  });
  
  describe('isPlatform()', () => {
    it('should return true for "capacitor" and "hybrid" in a Capacitor app', () => {
      const window = configureBrowser(PlatformConfiguration.Capacitor);    
      expect(isPlatform(window, 'capacitor')).toEqual(true);
      expect(isPlatform(window, 'hybrid')).toEqual(true);
    });
    
    it('should return false for "capacitor" and true for "desktop" on desktop safari', () => {
      const window = configureBrowser(PlatformConfiguration.DesktopSafari);    
      expect(isPlatform(window, 'capacitor')).toEqual(false);
      expect(isPlatform(window, 'desktop')).toEqual(true);
    });
    
    it('should return true for "android" and "tablet" on an android tablet', () => {
      const window = configureBrowser(PlatformConfiguration.AndroidTablet);    
      expect(isPlatform(window, 'android')).toEqual(true);
      expect(isPlatform(window, 'tablet')).toEqual(true);
    });
    
    it('should return true for "cordova" and "hybrid" in a Cordova app', () => {
      const window = configureBrowser(PlatformConfiguration.Cordova);    
      expect(isPlatform(window, 'cordova')).toEqual(true);
      expect(isPlatform(window, 'hybrid')).toEqual(true);
    });
    
    it('should return true for "ipad" and "tablet" on an iPad Pro', () => {
      const window = configureBrowser(PlatformConfiguration.iPadPro);    
      expect(isPlatform(window, 'ipad')).toEqual(true);
      expect(isPlatform(window, 'tablet')).toEqual(true);
    });
    
    it('should return true for "android" and false for "tablet" on a Pixel 2 XL', () => {
      const window = configureBrowser(PlatformConfiguration.Pixel2XL);    
      expect(isPlatform(window, 'android')).toEqual(true);
      expect(isPlatform(window, 'tablet')).toEqual(false);
    });
    
    it('should return true for "android" and "tablet" on a Galaxy View', () => {
      const window = configureBrowser(PlatformConfiguration.GalaxyView);    
      expect(isPlatform(window, 'android')).toEqual(true);
      expect(isPlatform(window, 'tablet')).toEqual(true);
    });
    
    it('should return false for "android" and "tablet" on desktop Safari', () => {
      const window = configureBrowser(PlatformConfiguration.DesktopSafari);    
      expect(isPlatform(window, 'android')).toEqual(false);
      expect(isPlatform(window, 'tablet')).toEqual(false);
    });
    
    it('should return false for "android" and "tablet" on iPhone', () => {
      const window = configureBrowser(PlatformConfiguration.iPhone);    
      expect(isPlatform(window, 'android')).toEqual(false);
      expect(isPlatform(window, 'tablet')).toEqual(false);
    });
    
    it('should return true for "android", false for "tablet", and false for "desktop" on Galaxy S9 Plus', () => {
      const window = configureBrowser(PlatformConfiguration.GalaxyS9Plus);    
      expect(isPlatform(window, 'android')).toEqual(true);
      expect(isPlatform(window, 'tablet')).toEqual(false);
      expect(isPlatform(window, 'mobile')).toEqual(true);
    });
    
    it('should return true for "pwa" and false for "cordova"', () => {
      const window = configureBrowser(PlatformConfiguration.PWA);    
      expect(isPlatform(window, 'pwa')).toEqual(true);
      expect(isPlatform(window, 'cordova')).toEqual(false);
    });
  })
});