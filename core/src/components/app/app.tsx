import { Build, Component, ComponentInterface, Element, Host, h } from '@stencil/core';

import { config } from '../../global/ionic-global';
import { rIC } from '../../utils/helpers';
import { isPlatform } from '../../utils/platform';

@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss'
})
export class App implements ComponentInterface {

  @Element() el!: HTMLElement;

  componentDidLoad() {
    if (Build.isBrowser) {
      rIC(() => {
        const win = window;
        const needInputShims = isPlatform(win, 'ios') && isPlatform(win, 'mobile');
        const inputShims = config.getBoolean('inputShims', needInputShims);
        const statusTap = config.getBoolean('statusTap', isPlatform(win, 'hybrid'));
        const hardwareBackConfig = config.getBoolean('hardwareBackButton', isPlatform(win, 'hybrid'));

        if (!config.getBoolean('_testing')) {
          import('../../utils/tap-click').then(module => module.startTapClick(config));
        }

        if (inputShims) {
          import('../../utils/input-shims/input-shims').then(module => module.startInputShims(config));
        }

        if (statusTap) {
          import('../../utils/status-tap').then(module => module.startStatusTap());
        }

        if (hardwareBackConfig) {
          import('../../utils/hardware-back-button').then(module => module.startHardwareBackButton());
        }

        import('../../utils/focus-visible').then(module => module.startFocusVisible());
      });
    }
  }

  render() {
    return (
      <Host
        class={{
          'ion-page': true,
          'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding') }}
      >
      </Host>
    );
  }
}
