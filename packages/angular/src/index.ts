// DIRECTIVES
export { BooleanValueAccessorDirective as BooleanValueAccessor } from './directives/control-value-accessors/boolean-value-accessor';
export { NumericValueAccessorDirective as NumericValueAccessor } from './directives/control-value-accessors/numeric-value-accessor';
export { RadioValueAccessorDirective as RadioValueAccessor } from './directives/control-value-accessors/radio-value-accessor';
export { SelectValueAccessorDirective as SelectValueAccessor } from './directives/control-value-accessors/select-value-accessor';
export { TextValueAccessorDirective as TextValueAccessor } from './directives/control-value-accessors/text-value-accessor';
export { IonTabs } from './directives/navigation/ion-tabs';
export { IonBackButton } from './directives/navigation/ion-back-button';
export { IonNav } from './directives/navigation/ion-nav';
export { IonRouterOutlet } from './directives/navigation/ion-router-outlet';
export {
  RouterLinkDelegateDirective as RouterLinkDelegate,
  RouterLinkWithHrefDelegateDirective as RouterLinkWithHrefDelegate,
} from './directives/navigation/router-link-delegate';

export { IonModal } from './directives/overlays/modal';
export { IonPopover } from './directives/overlays/popover';
export * from './directives/proxies';
export * from './directives/validators';

// PROVIDERS
export {
  ActionSheetController,
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  PickerController,
  PopoverController,
  ToastController,
  AnimationController,
  GestureController,
  DomController,
  NavController,
  Config,
  Platform,
  AngularDelegate,
  NavParams,
  IonicRouteStrategy,
} from '@ionic/angular/common';

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
} from '@ionic/core';
