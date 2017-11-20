// Components
export {
  ActionSheet,
  ActionSheetButton,
  ActionSheetEvent,
  ActionSheetOptions,
  iOSEnterAnimation as ActionSheetIOSEnterAnimation,
  iOSLeaveAnimation as ActionSheetIOSLeaveAnimation
} from './components/action-sheet/action-sheet';

export { ActionSheetController } from './components/action-sheet-controller/action-sheet-controller';
export {
  Alert,
  AlertButton,
  AlertEvent,
  AlertInput,
  AlertOptions,
  iOSEnterAnimation as AlertIOSEnterAnimation,
  iOSLeaveAnimation as AlertIOSLeaveAnimation
} from './components/alert/alert';
export { AlertController } from './components/alert-controller/alert-controller';
export {
  Animation,
  AnimationBuilder,
  AnimationController,
  AnimationOptions
} from './components/animation-controller/animation-interface';
export { App } from './components/app/app';
export { Avatar } from './components/avatar/avatar';
export { Backdrop } from './components/backdrop/backdrop';
export { Badge } from './components/badge/badge';
export { Button } from './components/button/button';
export { Buttons } from './components/buttons/buttons';
export { Card } from './components/card/card';
export { CardContent } from './components/card-content/card-content';
export { CardHeader } from './components/card-header/card-header';
export { CardTitle } from './components/card-title/card-title';
export { Checkbox } from './components/checkbox/checkbox';
export { Chip } from './components/chip/chip';
export { ChipButton } from './components/chip-button/chip-button';
export { Content } from './components/content/content';
export { Datetime } from './components/datetime/datetime';
export { FabContainer } from './components/fab/fab-container';
export { FabList } from './components/fab/fab-list';
export { FabButton } from './components/fab/fab';
export { Footer } from './components/footer/footer';
export { Gesture, GestureCallback, GestureDetail } from './components/gesture/gesture';
export { PanRecognizer } from './components/gesture/recognizers';
export {
  BLOCK_ALL,
  BlockerDelegate,
  BlockerOptions,
  GestureController,
  GestureDelegate
} from './components/gesture-controller/gesture-controller';
export { Column } from './components/grid/col';
export { Grid } from './components/grid/grid';
export { Row } from './components/grid/row';
export { Header } from './components/header/header';
export { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
export { InfiniteScrollContent } from './components/infinite-scroll/infinite-scroll-content';
export { Input } from './components/input/input';
export { Item } from './components/item/item';
export { ItemDivider } from './components/item-divider/item-divider';
export { ItemOption } from './components/item-sliding/item-option';
export { ItemSliding } from './components/item-sliding/item-sliding';
export { KeyboardController } from './components/keyboard-controller/keyboard-controller';
export * from './components/keyboard-controller/keys';
export { Label } from './components/label/label';
export { List } from './components/list/list';
export { ListHeader } from './components/list-header/list-header';
export {
  Loading,
  LoadingEvent,
  LoadingOptions,
  iOSEnterAnimation as LoadingIOSEnterAnimation,
  iOSLeaveAnimation as LoadingIOSLeaveAnimation
} from './components/loading/loading';
export { LoadingController } from './components/loading-controller/loading-controller';
export { Menu } from './components/menu/menu';
export {
  MenuController,
  MenuOverlayAnimation,
  MenuPushAnimation,
  MenuRevealAnimation
} from './components/menu-controller/menu-controller';
export {
  Modal,
  ModalOptions,
  ModalEvent,
  iOSEnterAnimation as ModalIOSEnterAnimation,
  iOSLeaveAnimation as ModalIOSLeaveAnimation
} from './components/modal/modal';
export { ModalController } from './components/modal-controller/modal-controller';
export { Nav } from './components/nav/nav';
export { NavController } from './components/nav-controller/nav-controller';
export { Note } from './components/note/note';
export { Page } from './components/page/page';
export { PickerColumnCmp } from './components/picker/picker-column';
export {
  Picker,
  PickerButton,
  PickerColumn,
  PickerColumnOption,
  PickerEvent,
  PickerOptions,
  iOSEnterAnimation as PickerIOSEnterAnimation,
  iOSLeaveAnimation as PickerIOSLeaveAnimation
} from './components/picker/picker';
export { PickerController } from './components/picker-controller/picker-controller';
export {
  Popover,
  PopoverEvent,
  PopoverOptions,
  iOSEnterAnimation as PopoverIOSEnterAnimation,
  iOSLeaveAnimation as PopoverIOSLeaveAnimation
} from './components/popover/popover';
export { PopoverController } from './components/popover-controller/popover-controller';
export { RadioGroup } from './components/radio/radio-group';
export { Radio, RadioEvent } from './components/radio/radio';
export { RangeKnob } from './components/range/range-knob';
export { Range, RangeEvent } from './components/range/range';
export { ReorderGroup } from './components/reorder/reorder-group';
export {
  RouterEntry,
  RouterEntries,
  NavState,
} from './components/router/router-utils';
export { ItemReorder } from './components/reorder/reorder';
export { Scroll, ScrollCallback, ScrollDetail } from './components/scroll/scroll';
export { Searchbar } from './components/searchbar/searchbar';
export { Segment, SegmentEvent } from './components/segment/segment';
export { SegmentButton, SegmentButtonEvent } from './components/segment-button/segment-button';
export { SelectPopoverOption, SelectPopover } from './components/select/select-popover';
export { Select } from './components/select/select';
export { SelectOption } from './components/select-option/select-option';
export { SkeletonText } from './components/skeleton-text/skeleton-text';
export { Slide } from './components/slides/slide';
export { Slides } from './components/slides/slides';
export * from './components/spinner/spinner-configs';
export { Spinner } from './components/spinner/spinner';
export { SplitPane, SplitPaneAlert } from './components/split-pane/split-pane';
export { Tab } from './components/tabs/tab';
export { Tabs } from './components/tabs/tabs';
export { Thumbnail } from './components/thumbnail/thumbnail';
export { ToolbarTitle } from './components/title/title';
export {
  Toast,
  ToastEvent,
  ToastOptions,
  iOSEnterAnimation as ToastIOSEnterAnimation,
  iOSLeaveAnimation as ToastIOSLeaveAnimation
} from './components/toast/toast';
export { ToastController } from './components/toast-controller/toast-controller';
export { Toggle } from './components/toggle/toggle';
export { Navbar } from './components/toolbar/navbar';
export { Toolbar } from './components/toolbar/toolbar';

export * from './navigation/nav-interfaces';
export { ViewController } from './navigation/view-controller';

// export all of the component declarations that are dynamically created
export * from './components';

export interface Config {
  get: (key: string, fallback?: any) => any;
  getBoolean: (key: string, fallback?: boolean) => boolean;
  getNumber: (key: string, fallback?: number) => number;
}

export type CssClassMap = { [className: string]: boolean };

export interface BaseInputComponent {
  disabled: boolean;
  hasFocus: boolean;
  value: string;

  fireFocus: () => void;
  fireBlur: () => void;
}

export interface StencilElement extends HTMLElement {
  componentOnReady(): Promise<HTMLElement>;
  componentOnReady(done: (cmp?: HTMLElement) => void): void;
}