import { Build, Component, ComponentInterface, Element, Host, Method, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { isPlatform } from '../../utils/platform';

@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss',
})
export class App implements ComponentInterface {
  private focusVisible?: any;

  @Element() el!: HTMLElement;

  componentDidLoad() {
    if (Build.isBrowser) {
      rIC(async () => {
        const isHybrid = isPlatform(window, 'hybrid');
        if (!config.getBoolean('_testing')) {
          import('../../utils/tap-click').then(module => module.startTapClick(config));
        }
        if (config.getBoolean('statusTap', isHybrid)) {
          import('../../utils/status-tap').then(module => module.startStatusTap());
        }
        if (config.getBoolean('inputShims', needInputShims())) {
          import('../../utils/input-shims/input-shims').then(module => module.startInputShims(config));
        }
        const hardwareBackButtonModule = await import('../../utils/hardware-back-button');
        if (config.getBoolean('hardwareBackButton', isHybrid)) {
          hardwareBackButtonModule.startHardwareBackButton();
        } else {
          hardwareBackButtonModule.blockHardwareBackButton();
        }
        if (typeof (window as any) !== 'undefined') {
          import('../../utils/keyboard/keyboard').then(module => module.startKeyboardAssist(window));
        }
        import('../../utils/focus-visible').then(module => this.focusVisible = module.startFocusVisible());
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
    const mode = getIonMode(this);
    return (
      <Host
        class={{
          [mode]: true,
          'ion-page': true,
          'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding'),
        }}
      >
      </Host>
    );
  }
}

const needInputShims = () => {
  return isPlatform(window, 'ios') && isPlatform(window, 'mobile');
};

const rIC = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 32);
  }
};
