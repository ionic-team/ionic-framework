
export function isCordova(): boolean {
  return !!(window as any)['cordova'] || (window as any)['PhoneGap'] || (window as any)['phonegap'];
}
