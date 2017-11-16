
export function isCordova(): boolean {
  return !!(window['cordova'] || window['PhoneGap'] || window['phonegap']);
}
