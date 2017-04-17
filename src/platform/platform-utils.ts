import { Platform } from './platform';


export function isCordova(plt: Platform): boolean {
  const win: any = plt.win();
  return !!(win['cordova'] || win['PhoneGap'] || win['phonegap']);
}

export function isElectron(plt: Platform): boolean {
  return plt.testUserAgent('Electron');
}

export function isIos(plt: Platform): boolean {
  // shortcut function to be reused internally
  // checks navigator.platform to see if it's an actual iOS device
  // this does not use the user-agent string because it is often spoofed
  // an actual iPad will return true, a chrome dev tools iPad will return false
  return plt.testNavigatorPlatform('iphone|ipad|ipod');
}

export function isSafari(plt: Platform): boolean {
  return plt.testUserAgent('Safari');
}


export function isWKWebView(plt: Platform): boolean {
  return isIos(plt) && !!(<any>plt.win())['webkit'];
}

export function isIosUIWebView(plt: Platform): boolean {
  return isIos(plt) && !isWKWebView(plt) && !isSafari(plt);
}

