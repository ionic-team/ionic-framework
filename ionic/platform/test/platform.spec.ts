import {Platform} from 'ionic/ionic';

export function run() {

  it('should set core as the fallback', () => {
    let platform = new Platform();
    platform.userAgent('idk');
    platform.load();

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
    expect(platform.is('core')).toEqual(true);
  });

  it('should set android via platformOverride, despite ios user agent', () => {
    let platform = new Platform();
    platform.userAgent(IPAD_UA);
    platform.load('android');

    expect(platform.is('android')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should get case insensitive querystring value', () => {
    let platform = new Platform();
    platform.url('/?KEY=value');

    expect(platform.query('key')).toEqual('value');
  });

  it('should get querystring value', () => {
    let platform = new Platform();
    platform.url('/?key=value');

    expect(platform.query('key')).toEqual('value');
  });

  it('should set ios via platformOverride, despite android querystring', () => {
    let platform = new Platform();
    platform.url('/?ionicplatform=android');
    platform.load('ios');

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
  });

  it('should set ios via platformOverride', () => {
    let platform = new Platform();
    platform.load('ios');

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
  });

  it('should set android via platformOverride', () => {
    let platform = new Platform();
    platform.load('android');

    expect(platform.is('android')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set ios via querystring', () => {
    let platform = new Platform();
    platform.url('/?ionicplatform=ios');
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
    expect(platform.is('tablet')).toEqual(false);
  });

  it('should set ios via querystring, even with android user agent', () => {
    let platform = new Platform();
    platform.url('/?ionicplatform=ios');
    platform.userAgent(ANDROID_UA);
    platform.load();

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
  });

  it('should set android via querystring', () => {
    let platform = new Platform();
    platform.url('/?ionicplatform=android');
    platform.load();

    expect(platform.is('android')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set android via querystring, even with ios user agent', () => {
    let platform = new Platform();
    platform.url('/?ionicplatform=android');
    platform.userAgent(IPHONE_UA);
    platform.load();

    expect(platform.is('android')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set android via user agent', () => {
    let platform = new Platform();
    platform.userAgent(ANDROID_UA);
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('android')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set iphone via user agent', () => {
    let platform = new Platform();
    platform.userAgent(IPHONE_UA);
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
    expect(platform.is('iphone')).toEqual(true);
    expect(platform.is('tablet')).toEqual(false);
  });

  it('should set ipad via user agent', () => {
    let platform = new Platform();
    platform.userAgent(IPAD_UA);
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
    expect(platform.is('ipad')).toEqual(true);
    expect(platform.is('tablet')).toEqual(true);
  });

}

const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.20 Mobile Safari/537.36';
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
