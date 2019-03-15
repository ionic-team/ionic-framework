export const configureBrowser = (config: any, win: any = Object.create(window)) => {
  for (const attributeKey in config) {
    if (config.hasOwnProperty(attributeKey)) {
      win[attributeKey] = config[attributeKey];
    }
  }

  return win;
};

export const mockMatchMedia = (media: string[] = []) => {
  return jest.fn().mockImplementation(query => {
    return {
      matches: media.includes(query)
    };
  });
};

export const PlatformConfiguration = {
  AndroidTablet: {
    navigator: {
      userAgent: 'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36'
    },
    innerWidth: 800,
    innerHeight: 1200,
    matchMedia: mockMatchMedia(['(any-pointer:coarse)'])
  },
  Capacitor: {
    Capacitor: {
      isNative: true
    }
  },
  PWA: {
    navigator: {
      standalone: true
    },
    matchMedia: mockMatchMedia(['(display-mode: standalone)'])
  },
  Cordova: {
    cordova: true
  },
  DesktopSafari: {
    navigator: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
    },
    innerWidth: 1920,
    innerHeight: 1080
  },
  iPhone: {
    navigator: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
    },
    innerWidth: 375,
    innerHeight: 812,
    matchMedia: mockMatchMedia(['(any-pointer:coarse)'])
  },
  iPadPro: {
    navigator: {
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
    },
    innerWidth: 1024,
    innerHeight: 1366,
    matchMedia: mockMatchMedia(['(any-pointer:coarse)'])
  },
  Pixel2XL: {
    navigator: {
      userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Mobile Safari/537.36'
    },
    innerWidth: 411,
    innerHeight: 823,
    matchMedia: mockMatchMedia(['(any-pointer:coarse)'])
  },
  GalaxyView: {
    navigator: {
      userAgent: 'Mozilla/5.0 (Linux; Android 5.1.1; SM-T670 Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'
    },
    innerWidth: 1920,
    innerHeight: 1080,
    matchMedia: mockMatchMedia(['(any-pointer:coarse)'])
  },
  GalaxyS9Plus: {
    navigator: {
      userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G965F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.109 Mobile Safari/537.36'
    },
    innerWidth: 360,
    innerHeight: 740,
    matchMedia: mockMatchMedia(['(any-pointer:coarse)'])
  }
};
