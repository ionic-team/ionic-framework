import { Build, Component, ComponentInterface, Element, Host, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { isPlatform } from '../../utils/platform';

@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss',
})
export class App implements ComponentInterface {
  @Element() el!: HTMLElement;

  componentDidLoad() {
    if (Build.isBrowser) {
      rIC(() => {
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
        if (config.getBoolean('hardwareBackButton', isHybrid)) {
          import('../../utils/hardware-back-button').then(module => module.startHardwareBackButton());
        }
        if (typeof (window as any) !== 'undefined') {
          import('../../utils/keyboard/keyboard').then(module => module.startKeyboardAssist(window));
        }
        import('../../utils/focus-visible').then(module => module.startFocusVisible());
      });
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
