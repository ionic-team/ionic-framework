import { Component, ComponentInterface, Element, Prop, QueueApi } from '@stencil/core';

import { getContext } from '../../global/context';
import { rIC } from '../../utils/helpers';
import { isPlatform } from '../../utils/platform';

@Component({
  tag: 'ion-app',
  styleUrl: 'app.scss'
})
export class App implements ComponentInterface {

  private config = getContext(this, 'config');
  private isServer = getContext(this, 'isServer');

  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;
  @Prop({ context: 'queue' }) queue!: QueueApi;

  componentDidLoad() {
    if (!this.isServer) {
      rIC(() => {
        const { win, queue, config } = this;
        const doc = win.document;
        const needInputShims = isPlatform(win, 'ios') && isPlatform(win, 'mobile');
        const inputShims = config.getBoolean('inputShims', needInputShims);
        const statusTap = config.getBoolean('statusTap', isPlatform(win, 'hybrid'));
        const hardwareBackConfig = config.getBoolean('hardwareBackButton', isPlatform(win, 'hybrid'));

        if (!config.getBoolean('_testing')) {
          import('../../utils/tap-click').then(module => module.startTapClick(config, doc));
        }

        if (inputShims) {
          import('../../utils/input-shims/input-shims').then(module => module.startInputShims(config, doc));
        }

        if (statusTap) {
          import('../../utils/status-tap').then(module => module.startStatusTap(win, queue));
        }

        if (hardwareBackConfig) {
          import('../../utils/hardware-back-button').then(module => module.startHardwareBackButton(win));
        }

        import('../../utils/focus-visible').then(module => module.startFocusVisible(doc));
      });
    }
  }

  hostData() {
    return {
      class: {
        'ion-page': true,
        'force-statusbar-padding': this.config.getBoolean('_forceStatusbarPadding')
      }
    };
  }
}
