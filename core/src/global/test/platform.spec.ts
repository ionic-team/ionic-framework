import { getIonBehavior } from '../ionic-global';

describe('getIonBehavior()', () => {
  it('should return the component platform', () => {
    const iosEl = document.createElement('ion-badge');
    iosEl.platform = 'ios';

    expect(getIonBehavior({ el: iosEl })).toBe('ios');

    const androidEl = document.createElement('ion-badge');
    androidEl.platform = 'android';

    expect(getIonBehavior({ el: androidEl })).toBe('android');
  });
});
