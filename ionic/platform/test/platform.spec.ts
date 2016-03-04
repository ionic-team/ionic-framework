import {Platform} from '../../../ionic';

export function run() {

  it('should set core as the fallback', () => {
    let platform = new Platform();
    platform.setUserAgent('idk');
    platform.load();

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
    expect(platform.is('core')).toEqual(true);
  });

  it('should set android via platformOverride, despite ios user agent', () => {
    let platform = new Platform();
    platform.setUserAgent(IPAD_UA);
    platform.load('android');

    expect(platform.is('android')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should get case insensitive querystring value', () => {
    let platform = new Platform();
    platform.setUrl('/?KEY=value');

    expect(platform.query('key')).toEqual('value');
  });

  it('should get querystring value', () => {
    let platform = new Platform();
    platform.setUrl('/?key=value');

    expect(platform.query('key')).toEqual('value');
  });

  it('should set ios via platformOverride, despite android querystring', () => {
    let platform = new Platform();
    platform.setUrl('/?ionicplatform=android');
    platform.load('ios');

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
  });

  it('should set windows via platformOverride, despite android querystring', () => {
    let platform = new Platform();
    platform.setUrl('/?ionicplatform=android');
    platform.load('windows');

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set ios via platformOverride', () => {
    let platform = new Platform();
    platform.load('ios');

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
  });

  it('should set android via platformOverride', () => {
    let platform = new Platform();
    platform.load('android');

    expect(platform.is('android')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set windows via querystring', () => {
    let platform = new Platform();
    platform.setUrl('/?ionicplatform=windows');
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set ios via querystring', () => {
    let platform = new Platform();
    platform.setUrl('/?ionicplatform=ios');
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
  });

  it('should set windows via querystring, even with android user agent', () => {
    let platform = new Platform();
    platform.setUrl('/?ionicplatform=windows');
    platform.setUserAgent(ANDROID_UA);
    platform.load();

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set ios via querystring, even with android user agent', () => {
    let platform = new Platform();
    platform.setUrl('/?ionicplatform=ios');
    platform.setUserAgent(ANDROID_UA);
    platform.load();

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
  });

  it('should set android via querystring', () => {
    let platform = new Platform();
    platform.setUrl('/?ionicplatform=android');
    platform.load();

    expect(platform.is('android')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set android via querystring, even with ios user agent', () => {
    let platform = new Platform();
    platform.setUrl('/?ionicplatform=android');
    platform.setUserAgent(IPHONE_UA);
    platform.load();

    expect(platform.is('android')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set windows via user agent', () => {
    let platform = new Platform();
    platform.setUserAgent(WINDOWS_UA);
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set windows8 via user agent', () => {
    let platform = new Platform();
    platform.setUserAgent(WINDOWS8_UA);
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set windows7 via user agent', () => {
    let platform = new Platform();
    platform.setUserAgent(WINDOWS7_UA);
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set android via user agent', () => {
    let platform = new Platform();
    platform.setUserAgent(ANDROID_UA);
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set iphone via user agent', () => {
    let platform = new Platform();
    platform.setUserAgent(IPHONE_UA);
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
    expect(platform.is('iphone')).toEqual(true);
    expect(platform.is('tablet')).toEqual(false);
  });

  it('should set ipad via user agent', () => {
    let platform = new Platform();
    platform.setUserAgent(IPAD_UA);
    platform.load();

    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
    expect(platform.is('ipad')).toEqual(true);
    expect(platform.is('tablet')).toEqual(true);
  });

}

const WINDOWS_UA = 'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 930) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537';
const WINDOWS8_UA = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)';
const WINDOWS7_UA = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; LG; GW910)';
const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.20 Mobile Safari/537.36';
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
