import { addIcons } from 'ionicons';
import { arrowBackSharp, caretBackSharp, chevronBack, chevronDown, chevronForward, close, closeCircle, closeSharp, menuOutline, menuSharp, reorderThreeOutline, reorderTwoSharp, searchOutline, searchSharp } from 'ionicons/icons';

export * from './proxies';

export { UseBackButtonResult, useBackButton } from './hooks/back-button';
export { UseKeyboardResult, useKeyboard } from './hooks/keyboard';
export { onIonViewWillEnter, onIonViewDidEnter, onIonViewWillLeave, onIonViewDidLeave } from './hooks/lifecycle';
export { UseIonRouterResult, useIonRouter } from './hooks/router';

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

export * from './components/Overlays';

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
  // UTILS
  createAnimation,
  createGesture,
  iosTransitionAnimation,
  mdTransitionAnimation,
  setupConfig,
  IonicSwiper,
  getPlatforms,
  isPlatform,
  menuController,
  getTimeGivenProgression,

  // TYPES
  Animation,
  AnimationBuilder,
  AnimationCallbackOptions,
  AnimationDirection,
  AnimationFill,
  AnimationKeyFrames,
  AnimationLifecycle,
  Gesture,
  GestureConfig,
  GestureDetail,
  NavComponentWithProps,

  SpinnerTypes,

  AccordionGroupCustomEvent,
  AccordionGroupChangeEventDetail,

  BreadcrumbCustomEvent,
  BreadcrumbCollapsedClickEventDetail,

  ActionSheetOptions,
  ActionSheetButton,

  AlertOptions,
  AlertInput,
  AlertTextareaAttributes,
  AlertInputAttributes,
  AlertButton,

  BackButtonEvent,

  CheckboxCustomEvent,
  CheckboxChangeEventDetail,

  DatetimeCustomEvent,
  DatetimeChangeEventDetail,

  InfiniteScrollCustomEvent,

  InputCustomEvent,
  InputChangeEventDetail,

  ItemReorderEventDetail,
  ItemReorderCustomEvent,

  ItemSlidingCustomEvent,

  IonicSafeString,

  LoadingOptions,

  MenuCustomEvent,

  ModalOptions,

  NavCustomEvent,

  PickerOptions,
  PickerButton,
  PickerColumn,
  PickerColumnOption,

  Platforms,
  PlatformConfig,

  PopoverOptions,

  RadioGroupCustomEvent,
  RadioGroupChangeEventDetail,

  RefresherCustomEvent,
  RefresherEventDetail,

  RouterEventDetail,
  RouterCustomEvent,

  ScrollBaseCustomEvent,
  ScrollBaseDetail,
  ScrollDetail,
  ScrollCustomEvent,

  SearchbarCustomEvent,
  SearchbarChangeEventDetail,

  SegmentChangeEventDetail,
  SegmentCustomEvent,

  SelectChangeEventDetail,
  SelectCustomEvent,

  TabsCustomEvent,

  TextareaChangeEventDetail,
  TextareaCustomEvent,

  ToastOptions,
  ToastButton,

  ToggleChangeEventDetail,
  ToggleCustomEvent,
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
