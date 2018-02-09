
export function isCordova(): boolean {
  const win = window as any;
  return !!(win['cordova'] || win['PhoneGap'] || win['phonegap'] || win['Capacitor']);
}
