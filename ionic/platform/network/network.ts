import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Access Network information and respond to changes in network state.
 *
 * @usage
 * ```js
 * let networkInfo = Network.getNetwork()
 * let isOnline = Network.isOnline()
 * let isOffline = Network.isOffline()
 * ```
 */
@NativePlugin({
  name: 'Network',
  platforms: ['ios', 'android'],
  engines: {
    cordova: 'cordova-plugin-network-information'
  },
  pluginCheck: () => {
    return !!navigator.connection;
  }
})
@Injectable()
export class Network {
  /**
   * Return network info.
   */
  static info() {
    this.ifPlugin(() => {
      return navigator.connection.type;
    });
  }

  /**
   * @return whether the device is online
   */
  static isOnline() {
    this.ifPlugin(() => {
      var networkState = navigator.connection.type;
      return networkState !== window.Connection.UNKNOWN && networkState !== window.Connection.NONE;
    });
  }
}
