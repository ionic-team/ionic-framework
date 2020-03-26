import 'ionicons';

export { createAnimation } from './utils/animation/animation';
export { iosTransitionAnimation } from './utils/transition/ios.transition';
export { mdTransitionAnimation } from './utils/transition/md.transition';
export { getTimeGivenProgression } from './utils/animation/cubic-bezier';
export { createGesture } from './utils/gesture';
export { isPlatform, Platforms, getPlatforms } from './utils/platform';
export { IonicSafeString } from './utils/sanitization';

export * from './utils/config';
export * from './components/nav/constants';
export { menuController } from './utils/menu-controller';
export { alertController, actionSheetController, modalController, loadingController, pickerController, popoverController, toastController } from './utils/overlays';
