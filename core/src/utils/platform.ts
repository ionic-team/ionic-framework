
export function isIpad(win: Window) {
  return testUserAgent(win, /iPad/i);
}

export function isIphone(win: Window) {
  return testUserAgent(win, /iPhone/i);
}

export function isIOS(win: Window) {
  return testUserAgent(win, /iPad|iPhone|iPod/i);
}

export function isAndroid(win: Window) {
  return !isIOS(win);
}

export function isPhablet(win: Window) {
  const width = win.innerWidth;
  const height = win.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);

  return (smallest > 390 && smallest < 520) &&
    (largest > 620 && largest < 800);
}

export function isTablet(win: Window) {
  const width = win.innerWidth;
  const height = win.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);
  return (smallest > 460 && smallest < 820) &&
    (largest > 780 && largest < 1400);
}

export function isDevice(win: Window) {
  return matchMedia(win, '(any-pointer:coarse)');
}

export function isHybrid(win: Window) {
  return isCordova(win) || isCapacitor(win);
}

export function isCordova(window: Window): boolean {
  const win = window as any;
  return !!(win['cordova'] || win['phonegap'] || win['PhoneGap']);
}

export function isCapacitor(window: Window): boolean {
  const win = window as any;
  return !!(win['Capacitor']);
}

export function isElectron(win: Window): boolean {
  return testUserAgent(win, /electron/);
}

export function needInputShims(win: Window) {
  return isIOS(win) && isDevice(win);
}

export function testUserAgent(win: Window, expr: RegExp) {
  return expr.test(win.navigator.userAgent);
}

export function matchMedia(win: Window, query: string, fallback = false): boolean {
  return win.matchMedia
    ? win.matchMedia(query).matches
    : fallback;
}
