import type { ComponentInterface } from '@stencil/core';
import { Build, Component, Element, Host, Method, h } from '@stencil/core';
import type { FocusVisibleUtility } from '@utils/focus-visible';
import { shoudUseCloseWatcher } from '@utils/hardware-back-button';
import { printIonWarning } from '@utils/logging';
import { isPlatform } from '@utils/platform';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss',
})
export class App implements ComponentInterface {
  private focusVisible?: FocusVisibleUtility;

  @Element() el!: HTMLElement;

  componentDidLoad() {
    if (Build.isBrowser) {
      rIC(async () => {
        const isHybrid = isPlatform(window, 'hybrid');
        if (!config.getBoolean('_testing')) {
          import('../../utils/tap-click').then((module) => module.startTapClick(config));
        }
        if (config.getBoolean('statusTap', isHybrid)) {
          import('../../utils/status-tap').then((module) => module.startStatusTap());
        }
        if (config.getBoolean('inputShims', needInputShims())) {
          /**
           * needInputShims() ensures that only iOS and Android
           * platforms proceed into this block.
           */
          const platform = isPlatform(window, 'ios') ? 'ios' : 'android';
          import('../../utils/input-shims/input-shims').then((module) => module.startInputShims(config, platform));
        }
        const hardwareBackButtonModule = await import('../../utils/hardware-back-button');
        const supportsHardwareBackButtonEvents = isHybrid || shoudUseCloseWatcher();
        if (config.getBoolean('hardwareBackButton', supportsHardwareBackButtonEvents)) {
          hardwareBackButtonModule.startHardwareBackButton();
        } else {
          /**
           * If an app sets hardwareBackButton: false and experimentalCloseWatcher: true
           * then the close watcher will not be used.
           */
          if (shoudUseCloseWatcher()) {
            printIonWarning(
              'experimentalCloseWatcher was set to `true`, but hardwareBackButton was set to `false`. Both config options must be `true` for the Close Watcher API to be used.'
            );
          }

          hardwareBackButtonModule.blockHardwareBackButton();
        }
        if (typeof (window as any) !== 'undefined') {
          import('../../utils/keyboard/keyboard').then((module) => module.startKeyboardAssist(window));
        }
        import('../../utils/focus-visible').then((module) => (this.focusVisible = module.startFocusVisible()));
      });
    }
  }

  /**
   * @internal
   * Used to set focus on an element that uses `ion-focusable`.
   * Do not use this if focusing the element as a result of a keyboard
   * event as the focus utility should handle this for us. This method
   * should be used when we want to programmatically focus an element as
   * a result of another user action. (Ex: We focus the first element
   * inside of a popover when the user presents it, but the popover is not always
   * presented as a result of keyboard action.)
   */
  @Method()
  async setFocus(elements: HTMLElement[]) {
    if (this.focusVisible) {
      this.focusVisible.setFocus(elements);
    }
  }

  render() {
    const theme = getIonTheme(this);
    return (
      <Host
        class={{
          [theme]: true,
          'ion-page': true,
          'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding'),
        }}
      ></Host>
    );
  }
}

const needInputShims = () => {
  /**
   * iOS always needs input shims
   */
  const needsShimsIOS = isPlatform(window, 'ios') && isPlatform(window, 'mobile');
  if (needsShimsIOS) {
    return true;
  }

  /**
   * Android only needs input shims when running
   * in the browser and only if the browser is using the
   * new Chrome 108+ resize behavior: https://developer.chrome.com/blog/viewport-resize-behavior/
   */
  const isAndroidMobileWeb = isPlatform(window, 'android') && isPlatform(window, 'mobileweb');
  if (isAndroidMobileWeb) {
    return true;
  }

  return false;
};

const rIC = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 32);
  }
};
