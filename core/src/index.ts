
// lifecycle
export const enum ViewLifecycle {
  WillEnter = 'ionViewWillEnter',
  DidEnter = 'ionViewDidEnter',
  WillLeave = 'ionViewWillLeave',
  DidLeave = 'ionViewDidLeave',
  WillUnload = 'ionViewWillUnload',
}

// util functions
export * from './utils/platform';
export * from './utils/config';

// for testing purposes
export { startHardwareBackButton } from './utils/hardware-back-button';
