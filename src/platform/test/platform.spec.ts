import { Config } from '../../config/config';
import { Platform } from '../platform';
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

      plt.registerBackButtonAction(action1, 200);
      plt.registerBackButtonAction(action2, 100);
      plt.runBackButtonAction();

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

      plt.registerBackButtonAction(action1, 100);
      plt.registerBackButtonAction(action2, 100);
      plt.runBackButtonAction();

      expect(ranAction1).toEqual(false);
      expect(ranAction2).toEqual(true);
    });

    it('should register a default action', () => {
      let ranAction1 = false;
      let action1 = () => {
        ranAction1 = true;
      };

      plt.registerBackButtonAction(action1);
      plt.runBackButtonAction();

      expect(ranAction1).toEqual(true);
    });

    it('should not run any actions when none registered', () => {
      plt.runBackButtonAction();
    });

  });

  it('should set core as the fallback', () => {
    plt.setDefault('core');
    plt.setQueryParams('');
    plt.setUserAgent('idk');
    plt.init();

    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
    expect(plt.is('core')).toEqual(true);
  });

  it('should set windows via querystring', () => {
    plt.setQueryParams('/?ionicplatform=windows');
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('mobile')).toEqual(true);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('windows')).toEqual(true);
    expect(plt.is('ios')).toEqual(false);
  });

  it('should set ios via querystring', () => {
    plt.setQueryParams('/?ionicplatform=ios');
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('mobile')).toEqual(true);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('ios')).toEqual(true);
  });

  it('should set windows via querystring, even with android user agent', () => {
    plt.setQueryParams('/?ionicplatform=windows');
    plt.setUserAgent(ANDROID_UA);
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('windows')).toEqual(true);
    expect(plt.is('ios')).toEqual(false);
  });

  it('should set ios via querystring, even with android user agent', () => {
    plt.setQueryParams('/?ionicplatform=ios');
    plt.setUserAgent(ANDROID_UA);
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('ios')).toEqual(true);
  });

  it('should set android via querystring', () => {
    plt.setQueryParams('/?ionicplatform=android');
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('android')).toEqual(true);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
  });

  it('should set android via querystring, even with ios user agent', () => {
    plt.setQueryParams('/?ionicplatform=android');
    plt.setUserAgent(IPHONE_UA);
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('android')).toEqual(true);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
  });

  it('should set windows platform via user agent', () => {
    plt.setQueryParams('');
    plt.setUserAgent(WINDOWS_PHONE_UA);
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('mobile')).toEqual(true);
    expect(plt.is('windows')).toEqual(true);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
  });

  it('should set windows platform via windows8 mobile user agent', () => {
    plt.setQueryParams('');
    plt.setUserAgent(WINDOWS8_PHONE_UA);
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('mobile')).toEqual(true);
    expect(plt.is('windows')).toEqual(true);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
  });

  it('should set windows platform via windows7 mobile user agent', () => {
    plt.setQueryParams('');
    plt.setUserAgent(WINDOWS7_PHONE_UA);
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('mobile')).toEqual(true);
    expect(plt.is('windows')).toEqual(true);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
  });

  it('should set android via user agent', () => {
    plt.setQueryParams('');
    plt.setUserAgent(ANDROID_UA);
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('mobile')).toEqual(true);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('android')).toEqual(true);
    expect(plt.is('ios')).toEqual(false);
  });

  it('should set iphone via user agent', () => {
    plt.setQueryParams('');
    plt.setUserAgent(IPHONE_UA);
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('mobile')).toEqual(true);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(true);
    expect(plt.is('iphone')).toEqual(true);
    expect(plt.is('tablet')).toEqual(false);
  });

  it('should set ipad via user agent', () => {
    plt.setQueryParams('');
    plt.setUserAgent(IPAD_UA);
    plt.init();

    expect(plt.is('core')).toEqual(false);
    expect(plt.is('mobile')).toEqual(true);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(true);
    expect(plt.is('ipad')).toEqual(true);
    expect(plt.is('tablet')).toEqual(true);
  });

  it('should set core platform for osx desktop firefox', () => {
    plt.setQueryParams('');
    plt.setDefault('core');
    plt.setUserAgent(OSX_10_FIREFOX_43_UA);
    plt.init();

    expect(plt.is('core')).toEqual(true);
    expect(plt.is('mobile')).toEqual(false);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
    expect(plt.is('ipad')).toEqual(false);
    expect(plt.is('tablet')).toEqual(false);
  });

  it('should set core platform for osx desktop safari', () => {
    plt.setQueryParams('');
    plt.setDefault('core');
    plt.setUserAgent(OSX_10_SAFARI_9_UA);
    plt.init();

    expect(plt.is('core')).toEqual(true);
    expect(plt.is('mobile')).toEqual(false);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
    expect(plt.is('ipad')).toEqual(false);
    expect(plt.is('tablet')).toEqual(false);
  });

  it('should set core platform for osx desktop chrome', () => {
    plt.setQueryParams('');
    plt.setDefault('core');
    plt.setUserAgent(OSX_10_CHROME_49_UA);
    plt.init();

    expect(plt.is('core')).toEqual(true);
    expect(plt.is('mobile')).toEqual(false);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
    expect(plt.is('ipad')).toEqual(false);
    expect(plt.is('tablet')).toEqual(false);
  });

  it('should set core platform for windows desktop chrome', () => {
    plt.setQueryParams('');
    plt.setDefault('core');
    plt.setUserAgent(WINDOWS_10_CHROME_40_UA);
    plt.init();

    expect(plt.is('core')).toEqual(true);
    expect(plt.is('mobile')).toEqual(false);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
    expect(plt.is('ipad')).toEqual(false);
    expect(plt.is('tablet')).toEqual(false);
  });

  it('should set core platform for windows desktop edge', () => {
    plt.setQueryParams('');
    plt.setDefault('core');
    plt.setUserAgent(WINDOWS_10_EDGE_12_UA);
    plt.init();

    expect(plt.is('core')).toEqual(true);
    expect(plt.is('mobile')).toEqual(false);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
    expect(plt.is('ipad')).toEqual(false);
    expect(plt.is('tablet')).toEqual(false);
  });

  it('should set core platform for windows desktop IE', () => {
    plt.setQueryParams('');
    plt.setDefault('core');
    plt.setUserAgent(WINDOWS_8_IE_11_UA);
    plt.init();

    expect(plt.is('core')).toEqual(true);
    expect(plt.is('mobile')).toEqual(false);
    expect(plt.is('windows')).toEqual(false);
    expect(plt.is('android')).toEqual(false);
    expect(plt.is('ios')).toEqual(false);
    expect(plt.is('ipad')).toEqual(false);
    expect(plt.is('tablet')).toEqual(false);
  });

  let plt: Platform;

  beforeEach(() => {
    plt = new Platform();
    plt.setWindow(window);
    plt.setDocument(document);
    plt.setPlatformConfigs(PLATFORM_CONFIGS);
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
