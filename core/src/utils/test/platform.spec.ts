import { testUserAgent, getPlatforms, matchMedia, isAndroid } from '../platform';

enum PlatformConfiguration {
  iPhone = {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
    properties: {
      innerWidth: 375,
      innerHeight: 812
    }
  },
  DesktopSafari = {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
    properties: {
      innerWidth: 1920,
      innerHeight: 1080
    }
  },
  AndroidTablet = {
    userAgent: 'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36',
    properties: {
      innerWidth: 800,
      innerHeight: 1200
    }
  }
}

describe('testUserAgent()', () => {
  it('should return true when testing if user agent is an iPhone', () => {
    configureBrowser(window, PlatformConfiguration.iPhone);
    expect(testUserAgent(window, /iPhone/)).toEqual(true);
  })
  
  it('should return false when testing if user agent is an iPad', () => {
    configureBrowser(window, PlatformConfiguration.iPhone);
    expect(testUserAgent(window, /iPad/)).toEqual(false);
  })
  
  it('should return false when testing if user agent is an Android', () => {
   configureBrowser(window, PlatformConfiguration.iPhone);
    expect(testUserAgent(window, /android/i)).toEqual(false);
  })
  
  it('should return true when testing if user agent is an Android', () => {
    configureBrowser(window, PlatformConfiguration.AndroidTablet);
    expect(testUserAgent(window, /android/i)).toEqual(true);
  })
});

describe('getPlatforms()', () => {
/*
  it('should return a list of all platforms for desktop', () => {
    configureBrowser(window, PlatformConfiguration.DesktopSafari);
    expect(getPlatforms(window).length).toEqual(1)
  });
*/
  
  it('should return a list of all platforms for tablet', () => {
    configureBrowser(window, PlatformConfiguration.AndroidTablet);
    console.log(window.navigator.userAgent, window.innerWidth, window.innerHeight)
    expect(getPlatforms(window).length).toEqual(3)
  })
});

function configureBrowser(window: Window, config: PlatformConfiguration): void {
  window.navigator.userAgent = config.userAgent;

  for (let propertyKey in config.properties) {
    window[propertyKey] = config.properties[propertyKey];
  }
}