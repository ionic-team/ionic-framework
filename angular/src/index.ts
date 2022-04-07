// DIRECTIVES
export { BooleanValueAccessorDirective as BooleanValueAccessor } from './directives/control-value-accessors/boolean-value-accessor';
export { NumericValueAccessorDirective as NumericValueAccessor } from './directives/control-value-accessors/numeric-value-accesssor';
export { RadioValueAccessorDirective as RadioValueAccessor } from './directives/control-value-accessors/radio-value-accessor';
export { SelectValueAccessorDirective as SelectValueAccessor } from './directives/control-value-accessors/select-value-accessor';
export { TextValueAccessorDirective as TextValueAccessor } from './directives/control-value-accessors/text-value-accessor';
export { IonTabs } from './directives/navigation/ion-tabs';
export { IonBackButtonDelegateDirective as IonBackButtonDelegate } from './directives/navigation/ion-back-button';
export { NavDelegate } from './directives/navigation/nav-delegate';
export { IonRouterOutlet } from './directives/navigation/ion-router-outlet';
export {
  RouterLinkDelegateDirective as RouterLinkDelegate,
  RouterLinkWithHrefDelegateDirective as RouterLinkWithHrefDelegate,
} from './directives/navigation/router-link-delegate';

export { NavParams } from './directives/navigation/nav-params';
export { IonVirtualScroll } from './directives/virtual-scroll/virtual-scroll';
export { VirtualItem } from './directives/virtual-scroll/virtual-item';
export { VirtualHeader } from './directives/virtual-scroll/virtual-header';
export { VirtualFooter } from './directives/virtual-scroll/virtual-footer';
export { IonModal } from './directives/overlays/modal';
export { IonPopover } from './directives/overlays/popover';
export * from './directives/proxies';

// PROVIDERS
export { AngularDelegate } from './providers/angular-delegate';
export { ActionSheetController } from './providers/action-sheet-controller';
export { AlertController } from './providers/alert-controller';
export { LoadingController } from './providers/loading-controller';
export { MenuController } from './providers/menu-controller';
export { PickerController } from './providers/picker-controller';
export { ModalController } from './providers/modal-controller';
export { Platform } from './providers/platform';
export { PopoverController } from './providers/popover-controller';
export { ToastController } from './providers/toast-controller';
export { NavController } from './providers/nav-controller';
export { DomController } from './providers/dom-controller';
export { Config } from './providers/config';
export { AnimationController } from './providers/animation-controller';
export { GestureController } from './providers/gesture-controller';

// ROUTER STRATEGY
export { IonicRouteStrategy } from './util/ionic-router-reuse-strategy';

// TYPES
export * from './types/ionic-lifecycle-hooks';

// PACKAGE MODULE
export { IonicModule } from './ionic-module';

export {
  // UTILS
  createAnimation,
  createGesture,
  iosTransitionAnimation,
  mdTransitionAnimation,
  IonicSwiper,
  IonicSlides,
  getPlatforms,
  isPlatform,
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
} from '@ionic/core';
