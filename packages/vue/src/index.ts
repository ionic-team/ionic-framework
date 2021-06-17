import { addIcons } from 'ionicons';
import { arrowBackSharp, caretBackSharp, chevronBack, chevronDown, chevronForward, close, closeCircle, closeSharp, menuOutline, menuSharp, reorderThreeOutline, reorderTwoSharp, searchOutline, searchSharp } from 'ionicons/icons';

export * from './proxies';
export { IonicVue } from './ionic-vue';

export { IonBackButton } from './components/IonBackButton';
export { IonPage } from './components/IonPage';
export { IonRouterOutlet } from './components/IonRouterOutlet';
export { IonTabButton } from './components/IonTabButton';
export { IonTabs } from './components/IonTabs';
export { IonTabBar } from './components/IonTabBar';
export { IonNav } from './components/IonNav';
export { IonIcon } from './components/IonIcon';
export { IonApp } from './components/IonApp';
export { IonPopover } from './components/IonPopover';
export { IonModal } from './components/IonModal';

export * from './components/Overlays';

export {
  IonKeyboardRef,
  IonRouter,
  useBackButton,
  useIonRouter,
  useKeyboard,
  onIonViewWillEnter,
  onIonViewDidEnter,
  onIonViewWillLeave,
  onIonViewDidLeave
} from './hooks';

export {
  modalController,
  popoverController,
  alertController,
  actionSheetController,
  loadingController,
  pickerController,
  toastController
} from './controllers';

export * from './globalExtensions';

export {
  menuController,

  // Security
  IonicSafeString,

  // Platform
  isPlatform, Platforms, getPlatforms,

  // Gesture
  Gesture,
  GestureConfig,
  GestureDetail,
  createGesture,

  // Animations
  Animation,
  AnimationBuilder,
  AnimationCallbackOptions,
  AnimationDirection,
  AnimationFill,
  AnimationKeyFrames,
  AnimationLifecycle,
  createAnimation,
  iosTransitionAnimation,
  mdTransitionAnimation,
  getTimeGivenProgression,

  // Hardware Back Button
  BackButtonEvent,

  // Swiper
  IonicSwiper
} from '@ionic/core/components';

// Icons that are used by internal components
addIcons({
  'arrow-back-sharp': arrowBackSharp,
  'caret-back-sharp': caretBackSharp,
  'chevron-back': chevronBack,
  'chevron-forward': chevronForward,
  'chevron-down': chevronDown,
  'close': close,
  'close-circle': closeCircle,
  'close-sharp': closeSharp,
  'menu-outline': menuOutline,
  'menu-sharp': menuSharp,
  'reorder-two-sharp': reorderTwoSharp,
  'reorder-three-outline': reorderThreeOutline,
  'search-outline': searchOutline,
  'search-sharp': searchSharp,
});
