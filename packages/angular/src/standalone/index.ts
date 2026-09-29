export { IonBackButton } from './navigation/back-button';
export { IonModal } from './overlays/modal';
export { IonPopover } from './overlays/popover';
export { IonRouterOutlet } from './navigation/router-outlet';
export { IonRouterLink, IonRouterLinkWithHref } from './navigation/router-link-delegate';
export { IonTabs } from './navigation/tabs';
export { provideIonicAngular } from './providers/ionic-angular';
export { ActionSheetController } from './providers/action-sheet-controller';
export { AlertController } from './providers/alert-controller';
export { AnimationController } from './providers/animation-controller';
export { GestureController } from './providers/gesture-controller';
export { LoadingController } from './providers/loading-controller';
export { MenuController } from './providers/menu-controller';
export { ModalController } from './providers/modal-controller';
export { PopoverController } from './providers/popover-controller';
export { ToastController } from './providers/toast-controller';
export { IonModalToken } from './providers/modal-token';
export { DomController, NavController, Config, Platform, NavParams, IonicRouteStrategy } from '@ionic/angular/common';
export type {
  ViewWillEnter,
  ViewDidEnter,
  ViewWillLeave,
  ViewDidLeave,
  ModalOptions,
  PopoverOptions,
} from '@ionic/angular/common';
export { IonNav } from './navigation/nav';
export {
  IonCheckbox,
  IonDatetime,
  IonInput,
  IonInputOtp,
  IonIcon,
  IonRadioGroup,
  IonRange,
  IonSearchbar,
  IonSegment,
  IonSelect,
  IonTextarea,
  IonToggle,
} from './directives';
export * from './directives/proxies';

export {
  // UTILS
  createAnimation,
  createGesture,
  iosTransitionAnimation,
  mdTransitionAnimation,
  IonicSafeString,
  IonicSlides,
  getPlatforms,
  isPlatform,
  getTimeGivenProgression,
} from '@ionic/core/components';
export type {
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
  InputOtpCustomEvent,
  InputOtpChangeEventDetail,
  InputOtpCompleteEventDetail,
  InputOtpInputEventDetail,
  // TODO(FW-6590): Remove the next two lines once the deprecated event is removed
  ItemReorderEventDetail,
  ItemReorderCustomEvent,
  ItemSlidingCustomEvent,
  LoadingOptions,
  MenuCustomEvent,
  ModalDragEventDetail,
  NavCustomEvent,
  PlatformConfig,
  RadioGroupCustomEvent,
  RadioGroupChangeEventDetail,
  RangeCustomEvent,
  RangeChangeEventDetail,
  RangeKnobMoveStartEventDetail,
  RangeKnobMoveEndEventDetail,
  RefresherCustomEvent,
  RefresherEventDetail,
  RefresherPullEndCustomEvent,
  RefresherPullEndEventDetail,
  ReorderMoveCustomEvent,
  ReorderMoveEventDetail,
  ReorderEndCustomEvent,
  ReorderEndEventDetail,
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
} from '@ionic/core/components';
