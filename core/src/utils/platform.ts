
export type Platforms = keyof typeof PLATFORMS_MAP;

export const getPlatforms = (win: any) => setupPlatforms(win);

export const isPlatform = (win: Window, platform: Platforms) =>
  getPlatforms(win).indexOf(platform) > -1;

export const setupPlatforms = (win: any) => {
  win.Ionic = win.Ionic || {};

  let platforms: string[] | undefined | null = win.Ionic.platforms;
  if (platforms == null) {
    platforms = win.Ionic.platforms = detectPlatforms(win);
    platforms.forEach(p => win.document.documentElement.classList.add(`plt-${p}`));
  }
  return platforms;
};

const isMobileWeb = (win: Window): boolean =>
  isMobile(win) && !isHybrid(win);

const detectPlatforms = (win: Window): string[] =>
  Object.keys(PLATFORMS_MAP).filter(p => (PLATFORMS_MAP as any)[p](win));

const isIpad = (win: Window) =>
  testUserAgent(win, /iPad/i);

const isIphone = (win: Window) =>
  testUserAgent(win, /iPhone/i);

const isIOS = (win: Window) =>
  testUserAgent(win, /iPad|iPhone|iPod/i);

const isAndroid = (win: Window) =>
  testUserAgent(win, /android|sink/i);

const isAndroidTablet = (win: Window) => {
  return isAndroid(win) && !testUserAgent(win, /mobile/i);
};

const isPhablet = (win: Window) => {
  const width = win.innerWidth;
  const height = win.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);

  return (smallest > 390 && smallest < 520) &&
    (largest > 620 && largest < 800);
};

const isTablet = (win: Window) => {
  const width = win.innerWidth;
  const height = win.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);

  return (
    isIpad(win) ||
    isAndroidTablet(win) ||
    (
      (smallest > 460 && smallest < 820) &&
      (largest > 780 && largest < 1400)
    )
  );
};

const isMobile = (win: Window) =>
  matchMedia(win, '(any-pointer:coarse)');

const isDesktop = (win: Window) =>
  !isMobile(win);

const isHybrid = (win: Window) =>
  isCordova(win) || isCapacitorNative(win);

const isCordova = (win: any): boolean =>
  !!(win['cordova'] || win['phonegap'] || win['PhoneGap']);

const isCapacitorNative = (win: any): boolean => {
  const capacitor = win['Capacitor'];
  return !!(capacitor && capacitor.isNative);
};

const isElectron = (win: Window): boolean =>
  testUserAgent(win, /electron/);

const isPWA = (win: Window): boolean =>
  (win as any).matchMedia ? (win.matchMedia('(display-mode: standalone)').matches || (win.navigator as any).standalone) : false;

export const testUserAgent = (win: Window, expr: RegExp) =>
  (win as any).navigator && (win.navigator as any).userAgent ? expr.test(win.navigator.userAgent) : false;

const matchMedia = (win: any, query: string): boolean =>
  (win as any).matchMedia ? win.matchMedia(query).matches : false;

export const PLATFORMS_MAP = {
  'ipad': isIpad,
  'iphone': isIphone,
  'ios': isIOS,
  'android': isAndroid,
  'phablet': isPhablet,
  'tablet': isTablet,
  'cordova': isCordova,
  'capacitor': isCapacitorNative,
  'electron': isElectron,
  'pwa': isPWA,
  'mobile': isMobile,
  'mobileweb': isMobileWeb,
  'desktop': isDesktop,
  'hybrid': isHybrid
};
