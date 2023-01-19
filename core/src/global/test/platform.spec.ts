import { getIonPlatform } from '../ionic-global';

describe('getIonPlatform()', () => {
  it('should return the component platform', () => {
    const iosEl = document.createElement('ion-badge');
    iosEl.platform = 'ios';

    expect(getIonPlatform({ el: iosEl })).toBe('ios');

    const androidEl = document.createElement('ion-badge');
    androidEl.platform = 'android';

    expect(getIonPlatform({ el: androidEl })).toBe('android');
  });
});
