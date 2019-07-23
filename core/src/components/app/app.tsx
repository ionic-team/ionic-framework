import { Component, ComponentInterface, Element } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { rIC } from '../../utils/helpers';
import { isPlatform } from '../../utils/platform';

@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss'
})
export class App implements ComponentInterface {

  @Element() el!: HTMLElement;

  componentDidLoad() {
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
      import('../../utils/focus-visible').then(module => module.startFocusVisible());

    });
  }

  hostData() {
    const mode = getIonMode(this);

    return {
      class: {
        [mode]: true,
        'ion-page': true,
        'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding')
      }
    };
  }
}

const needInputShims = () => {
  return isPlatform(window, 'ios') && isPlatform(window, 'mobile');
};
