import { testUserAgent, getPlatforms, isPlatform } from '../platform';

enum PlatformConfiguration {
  AndroidTablet = {
    navigator: {
      userAgent: 'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36'
    },
    innerWidth: 800,
    innerHeight: 1200
  },
  Capacitor = {
    Capacitor: {
      isNative: true
    }
  },
  Cordova = {
    cordova: true
  },
  DesktopSafari = {
    navigator: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
    },
    innerWidth: 1920,
    innerHeight: 1080
  },
  iPhone = {
    navigator: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
    },
    innerWidth: 375,
    innerHeight: 812
  }
}

describe('Platform Tests', () => {
  /**
   * The `window` object is not reset
   * after each test, so we need to do
   * that manually otherwise tests will
   * interefere with each other
   */
   
  let sharedWindow;
  beforeEach(() => {
    sharedWindow = Object.create(window);
  });
  
  describe('testUserAgent()', () => {
    it('should return true when testing if user agent is an iPhone', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.iPhone);
      expect(testUserAgent(sharedWindow, /iPhone/)).toEqual(true);
    })
    
    it('should return false when testing if user agent is an iPad', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.iPhone);
      expect(testUserAgent(sharedWindow, /iPad/)).toEqual(false);
    })
    
    it('should return false when testing if user agent is an Android', () => {
     configureBrowser(sharedWindow, PlatformConfiguration.iPhone);
      expect(testUserAgent(sharedWindow, /android|sink/i)).toEqual(false);
    })
    
    it('should return true when testing if user agent is an Android', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.AndroidTablet);
      expect(testUserAgent(sharedWindow, /android|sink/i)).toEqual(true);
    })
  });
  
  describe('getPlatforms()', () => {
    it('should contain "desktop" platform', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.DesktopSafari);    
      expect(getPlatforms(sharedWindow)).toContain('desktop');
    });
    
    it('should contain "android" and "tablet" platforms', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.AndroidTablet);
      
      const platforms = getPlatforms(sharedWindow);
      expect(platforms).toContain('android');
      expect(platforms).toContain('tablet');
    })
    
    it('should contain "capacitor" platform', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.Capacitor);    
      expect(getPlatforms(sharedWindow)).toContain('capacitor');
    })
  });
  
  describe('isPlatform()', () => {
    it('should return true for "capacitor" and "hybrid" in a Capacitor app', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.Capacitor);    
      expect(isPlatform(sharedWindow, 'capacitor')).toEqual(true);
      expect(isPlatform(sharedWindow, 'hybrid')).toEqual(true);
    });
    
    it('should return false for "capacitor" on desktop safari', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.DesktopSafari);    
      expect(isPlatform(sharedWindow, 'capacitor')).toEqual(false);
    });
    
    it('should return true for "android" and "tablet" on an android tablet', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.AndroidTablet);    
      expect(isPlatform(sharedWindow, 'android')).toEqual(true);
      expect(isPlatform(sharedWindow, 'tablet')).toEqual(true);
    });
    
    it('should return true for "cordova" and "hybrid" in a Cordova app', () => {
      configureBrowser(sharedWindow, PlatformConfiguration.Cordova);    
      expect(isPlatform(sharedWindow, 'cordova')).toEqual(true);
      expect(isPlatform(sharedWindow, 'hybrid')).toEqual(true);
    });

  })
});

function configureBrowser(win: Window, config: PlatformConfiguration): void {
  for (let attributeKey in config) {
    win[attributeKey] = config[attributeKey];
  }
}