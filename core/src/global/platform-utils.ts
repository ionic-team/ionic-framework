
export function isCordova(): boolean {
  const win = window as any;
  return !!(win[CORDOVA] || win[PHONEGAP_CAMELCASE] || win[PHONEGAP] || win[CAPACITOR]);
}

export function isElectron(): boolean {
  return testUserAgent(getUserAgent(), ELECTRON);
}

export function getUserAgent(): string {
  return window.navigator.userAgent;
}

export function testUserAgent(userAgent: string, expression: string): boolean {
  return userAgent ? userAgent.indexOf(expression) >= 0 : false;
}

export const ANDROID = 'android';
export const CORDOVA = 'cordova';
export const CORE = 'core';
export const ELECTRON = 'electron';
export const IOS = 'ios';
export const IPAD = 'ipad';
export const IPHONE = 'iphone';
export const MOBILE = 'mobile';
export const MOBILE_WEB = 'mobileweb';
export const PHABLET = 'phablet';
export const TABLET = 'tablet';
export const WINDOWS_PHONE = ['windows phone'];

export const PHONEGAP = 'phonegap';
export const PHONEGAP_CAMELCASE = 'PhoneGap';
export const CAPACITOR = 'Capacitor';

