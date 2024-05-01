import type { IonicConfig } from '@ionic/core/components';
import { initialize } from '@ionic/core/components';

export {
  // UTILS
  createAnimation,
  createGesture,
  iosTransitionAnimation,
  mdTransitionAnimation,
  IonicSlides,
  getTimeGivenProgression,
  getIonPageElement,
  openURL,

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
  RangeCustomEvent,
  RangeChangeEventDetail,
  RangeKnobMoveStartEventDetail,
  RangeKnobMoveEndEventDetail,
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
  SearchbarInputEventDetail,
  SegmentChangeEventDetail,
  SegmentCustomEvent,
  SegmentValue,
  SelectChangeEventDetail,
  SelectCustomEvent,
  TabsCustomEvent,
  TextareaChangeEventDetail,
  TextareaCustomEvent,
  ToastOptions,
  ToastButton,
  ToastLayout,
  ToggleChangeEventDetail,
  ToggleCustomEvent,
  TransitionOptions,
} from '@ionic/core/components';

export * from './proxies';
export * from './routing-proxies';

// createControllerComponent
export { IonAlert } from './IonAlert';
export { IonLoading } from './IonLoading';
export * from './IonToast';
export { IonPickerLegacy } from './IonPickerLegacy';

// createOverlayComponent
export * from './IonActionSheet';
export { IonModal } from './IonModal';
export { IonPopover } from './IonPopover';

// Custom Components
export { IonApp } from './IonApp';
export { IonPage } from './IonPage';
export { IonNav } from './navigation/IonNav';
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

export const setupIonicReact = (config: IonicConfig = {}) => {
  /**
   * By default Ionic Framework hides elements that
   * are not hydrated, but in the CE build there is no
   * hydration.
   * TODO FW-2797: Remove when all integrations have been
   * migrated to CE build.
   */
  if (typeof (document as any) !== 'undefined') {
    document.documentElement.classList.add('ion-ce');
  }

  initialize({
    ...config,
  });
};
