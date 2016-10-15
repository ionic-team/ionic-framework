import { Config } from '../../config/config';
import { Platform } from '../platform';
import { QueryParams } from '../query-params';
import { PLATFORM_CONFIGS } from '../platform-registry';
import { registerModeConfigs } from '../../config/mode-registry';


describe('Platform', () => {

  describe('registerBackButtonAction', () => {

    it('should register two actions with different priorities, call the highest one', () => {
      let ranAction1 = false;
      let action1 = () => {
        ranAction1 = true;
      };

      let ranAction2 = false;
      let action2 = () => {
        ranAction2 = true;
      };

      platform.registerBackButtonAction(action1, 200);
      platform.registerBackButtonAction(action2, 100);
      platform.runBackButtonAction();

      expect(ranAction1).toEqual(true);
      expect(ranAction2).toEqual(false);
    });

    it('should register two actions with the same priority, call the second one', () => {
      let ranAction1 = false;
      let action1 = () => {
        ranAction1 = true;
      };

      let ranAction2 = false;
      let action2 = () => {
        ranAction2 = true;
      };

      platform.registerBackButtonAction(action1, 100);
      platform.registerBackButtonAction(action2, 100);
      platform.runBackButtonAction();

      expect(ranAction1).toEqual(false);
      expect(ranAction2).toEqual(true);
    });

    it('should register a default action', () => {
      let ranAction1 = false;
      let action1 = () => {
        ranAction1 = true;
      };

      platform.registerBackButtonAction(action1);
      platform.runBackButtonAction();

      expect(ranAction1).toEqual(true);
    });

    it('should not run any actions when none registered', () => {
      platform.runBackButtonAction();
    });

  });

  it('should set core as the fallback', () => {
    let qp = new QueryParams('');
    platform.setDefault('core');
    platform.setQueryParams(qp);
    platform.setUserAgent('idk');
    platform.init();

    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
    expect(platform.is('core')).toEqual(true);
  });

  it('should set windows via querystring', () => {
    let qp = new QueryParams('/?ionicplatform=windows');
    platform.setQueryParams(qp);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set ios via querystring', () => {
    let qp = new QueryParams('/?ionicplatform=ios');
    platform.setQueryParams(qp);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
  });

  it('should set windows via querystring, even with android user agent', () => {
    let qp = new QueryParams('/?ionicplatform=windows');
    platform.setQueryParams(qp);
    platform.setUserAgent(ANDROID_UA);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set ios via querystring, even with android user agent', () => {
    let qp = new QueryParams('/?ionicplatform=ios');
    platform.setQueryParams(qp);
    platform.setUserAgent(ANDROID_UA);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
  });

  it('should set android via querystring', () => {
    let qp = new QueryParams('/?ionicplatform=android');
    platform.setQueryParams(qp);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('android')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set android via querystring, even with ios user agent', () => {
    let qp = new QueryParams('/?ionicplatform=android');
    platform.setQueryParams(qp);
    platform.setUserAgent(IPHONE_UA);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('android')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set windows platform via user agent', () => {
    let qp = new QueryParams('');
    platform.setQueryParams(qp);
    platform.setUserAgent(WINDOWS_PHONE_UA);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set windows platform via windows8 mobile user agent', () => {
    let qp = new QueryParams('');
    platform.setQueryParams(qp);
    platform.setUserAgent(WINDOWS8_PHONE_UA);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set windows platform via windows7 mobile user agent', () => {
    let qp = new QueryParams('');
    platform.setQueryParams(qp);
    platform.setUserAgent(WINDOWS7_PHONE_UA);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(true);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set android via user agent', () => {
    let qp = new QueryParams('');
    platform.setQueryParams(qp);
    platform.setUserAgent(ANDROID_UA);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(true);
    expect(platform.is('ios')).toEqual(false);
  });

  it('should set iphone via user agent', () => {
    let qp = new QueryParams('');
    platform.setQueryParams(qp);
    platform.setUserAgent(IPHONE_UA);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
    expect(platform.is('iphone')).toEqual(true);
    expect(platform.is('tablet')).toEqual(false);
  });

  it('should set ipad via user agent', () => {
    let qp = new QueryParams('');
    platform.setQueryParams(qp);
    platform.setUserAgent(IPAD_UA);
    platform.init();

    expect(platform.is('core')).toEqual(false);
    expect(platform.is('mobile')).toEqual(true);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(true);
    expect(platform.is('ipad')).toEqual(true);
    expect(platform.is('tablet')).toEqual(true);
  });

  it('should set core platform for osx desktop firefox', () => {
    let qp = new QueryParams('');
    platform.setDefault('core');
    platform.setQueryParams(qp);
    platform.setUserAgent(OSX_10_FIREFOX_43_UA);
    platform.init();

    expect(platform.is('core')).toEqual(true);
    expect(platform.is('mobile')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
    expect(platform.is('ipad')).toEqual(false);
    expect(platform.is('tablet')).toEqual(false);
  });

  it('should set core platform for osx desktop safari', () => {
    let qp = new QueryParams('');
    platform.setDefault('core');
    platform.setQueryParams(qp);
    platform.setUserAgent(OSX_10_SAFARI_9_UA);
    platform.init();

    expect(platform.is('core')).toEqual(true);
    expect(platform.is('mobile')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
    expect(platform.is('ipad')).toEqual(false);
    expect(platform.is('tablet')).toEqual(false);
  });

  it('should set core platform for osx desktop chrome', () => {
    let qp = new QueryParams('');
    platform.setDefault('core');
    platform.setQueryParams(qp);
    platform.setUserAgent(OSX_10_CHROME_49_UA);
    platform.init();

    expect(platform.is('core')).toEqual(true);
    expect(platform.is('mobile')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
    expect(platform.is('ipad')).toEqual(false);
    expect(platform.is('tablet')).toEqual(false);
  });

  it('should set core platform for windows desktop chrome', () => {
    let qp = new QueryParams('');
    platform.setDefault('core');
    platform.setQueryParams(qp);
    platform.setUserAgent(WINDOWS_10_CHROME_40_UA);
    platform.init();

    expect(platform.is('core')).toEqual(true);
    expect(platform.is('mobile')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
    expect(platform.is('ipad')).toEqual(false);
    expect(platform.is('tablet')).toEqual(false);
  });

  it('should set core platform for windows desktop edge', () => {
    let qp = new QueryParams('');
    platform.setDefault('core');
    platform.setQueryParams(qp);
    platform.setUserAgent(WINDOWS_10_EDGE_12_UA);
    platform.init();

    expect(platform.is('core')).toEqual(true);
    expect(platform.is('mobile')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
    expect(platform.is('ipad')).toEqual(false);
    expect(platform.is('tablet')).toEqual(false);
  });

  it('should set core platform for windows desktop IE', () => {
    let qp = new QueryParams('');
    platform.setDefault('core');
    platform.setQueryParams(qp);
    platform.setUserAgent(WINDOWS_8_IE_11_UA);
    platform.init();

    expect(platform.is('core')).toEqual(true);
    expect(platform.is('mobile')).toEqual(false);
    expect(platform.is('windows')).toEqual(false);
    expect(platform.is('android')).toEqual(false);
    expect(platform.is('ios')).toEqual(false);
    expect(platform.is('ipad')).toEqual(false);
    expect(platform.is('tablet')).toEqual(false);
  });

  let platform: Platform;

  beforeEach(() => {
    platform = new Platform();
    platform.setPlatformConfigs(PLATFORM_CONFIGS);
    registerModeConfigs(new Config())();
  });

});

const OSX_10_FIREFOX_43_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0';
const OSX_10_SAFARI_9_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/601.4.4 (KHTML, like Gecko) Version/9.0.3 Safari/601.4.4';
const OSX_10_CHROME_49_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36';

const WINDOWS_10_CHROME_40_UA = 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36';
const WINDOWS_10_EDGE_12_UA = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
const WINDOWS_8_IE_11_UA = 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko';

const WINDOWS_PHONE_UA = 'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 930) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537';
const WINDOWS8_PHONE_UA = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)';
const WINDOWS7_PHONE_UA = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; LG; GW910)';

const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.20 Mobile Safari/537.36';
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
