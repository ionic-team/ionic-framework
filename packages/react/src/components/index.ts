import { initialize } from '@ionic/core/components';
import { addIcons } from 'ionicons';
import {
  arrowBackSharp,
  caretBackSharp,
  chevronBack,
  chevronDown,
  chevronForward,
  close,
  closeCircle,
  closeSharp,
  menuOutline,
  menuSharp,
  reorderThreeOutline,
  reorderTwoSharp,
  searchOutline,
  searchSharp,
} from 'ionicons/icons';

export {
  // UTILS
  createAnimation,
  createGesture,
  iosTransitionAnimation,
  mdTransitionAnimation,
  setupConfig,
  IonicSwiper,
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

export * from './proxies';
export * from './routing-proxies';

// createControllerComponent
export { IonAlert } from './IonAlert';
export { IonLoading } from './IonLoading';
export * from './IonToast';
export { IonPicker } from './IonPicker';

// createOverlayComponent
export * from './IonActionSheet';
export { IonModal } from './IonModal';
export { IonPopover } from './IonPopover';

// Custom Components
export { IonPage } from './IonPage';
export { IonTabsContext, IonTabsContextState } from './navigation/IonTabsContext';
export { IonTabs } from './navigation/IonTabs';
export { IonTabBar } from './navigation/IonTabBar';
export { IonTabButton } from './navigation/IonTabButton';
export { IonBackButton } from './navigation/IonBackButton';
export { IonRouterOutlet } from './IonRouterOutlet';
export { IonIcon } from './IonIcon';
export * from './IonRoute';
export * from './IonRedirect';
export * from './IonRouterContext';

// Utils
export { isPlatform, getPlatforms, getConfig } from './utils';
export * from './hrefprops';

// Ionic Animations
export { CreateAnimation } from './CreateAnimation';

// Hooks
export { useIonActionSheet, UseIonActionSheetResult } from '../hooks/useIonActionSheet';
export { useIonAlert, UseIonAlertResult } from '../hooks/useIonAlert';
export { useIonToast, UseIonToastResult } from '../hooks/useIonToast';
export { useIonModal, UseIonModalResult } from '../hooks/useIonModal';
export { useIonPopover, UseIonPopoverResult } from '../hooks/useIonPopover';
export { useIonPicker, UseIonPickerResult } from '../hooks/useIonPicker';
export { useIonLoading, UseIonLoadingResult } from '../hooks/useIonLoading';

// Icons that are used by internal components
addIcons({
  'arrow-back-sharp': arrowBackSharp,
  'caret-back-sharp': caretBackSharp,
  'chevron-back': chevronBack,
  'chevron-down': chevronDown,
  'chevron-forward': chevronForward,
  close,
  'close-circle': closeCircle,
  'close-sharp': closeSharp,
  'menu-outline': menuOutline,
  'menu-sharp': menuSharp,
  'reorder-two-sharp': reorderTwoSharp,
  'reorder-three-outline': reorderThreeOutline,
  'search-outline': searchOutline,
  'search-sharp': searchSharp,
});

/**
 * By default Ionic Framework hides elements that
 * are not hydrated, but in the CE build there is no
 * hydration.
 * TODO: Remove when all integrations have been
 * migrated to CE build.
 */
document.documentElement.classList.add('ion-ce');

initialize();
