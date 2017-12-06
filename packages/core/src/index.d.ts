// Components
export * from './components/action-sheet/action-sheet';

export { ActionSheetController } from './components/action-sheet-controller/action-sheet-controller';
export * from './components/alert/alert';
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
export { Col } from './components/col/col';
export { Content } from './components/content/content';
export { Datetime } from './components/datetime/datetime';
export { Fab } from './components/fab/fab';
export { FabList } from './components/fab-list/fab-list';
export { FabButton } from './components/fab-button/fab-button';
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
export { Grid } from './components/grid/grid';
export { Header } from './components/header/header';
export { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
export { InfiniteScrollContent } from './components/infinite-scroll-content/infinite-scroll-content';
export { Input } from './components/input/input';
export { Item } from './components/item/item';
export { ItemDivider } from './components/item-divider/item-divider';
export { ItemOption } from './components/item-option/item-option';
export { ItemSliding } from './components/item-sliding/item-sliding';
export { KeyboardController } from './components/keyboard-controller/keyboard-controller';
export * from './components/keyboard-controller/keys';
export { Label } from './components/label/label';
export { List } from './components/list/list';
export { ListHeader } from './components/list-header/list-header';
export * from './components/loading/loading';
export { LoadingController } from './components/loading-controller/loading-controller';
export { Menu } from './components/menu/menu';
export {
  MenuController,
  MenuOverlayAnimation,
  MenuPushAnimation,
  MenuRevealAnimation
} from './components/menu-controller/menu-controller';
export * from './components/modal/modal';
export { ModalController } from './components/modal-controller/modal-controller';
export { Nav } from './components/nav/nav';
export { PublicNav } from './components/nav/nav-interface';
export { Navbar } from './components/navbar/navbar';
export { NavController } from './components/nav-controller/nav-controller';
export { Note } from './components/note/note';
export { Page } from './components/page/page';
export { PickerColumnCmp } from './components/picker-column/picker-column';
export * from './components/picker/picker';
export { PickerController } from './components/picker-controller/picker-controller';
export * from './components/popover/popover';
export { PopoverController } from './components/popover-controller/popover-controller';
export { RadioGroup } from './components/radio-group/radio-group';
export { Radio, HTMLIonRadioElementEvent } from './components/radio/radio';
export { Range, RangeEvent } from './components/range/range';
export { RangeKnob } from './components/range-knob/range-knob';
export { ReorderGroup } from './components/reorder-group/reorder-group';
export {
  RouterEntry,
  RouterEntries,
  NavState,
} from './components/router-controller/router-utils';
export { Row } from './components/row/row';
export { Reorder } from './components/reorder/reorder';
export { Scroll, ScrollCallback, ScrollDetail } from './components/scroll/scroll';
export { Searchbar } from './components/searchbar/searchbar';
export { Segment, SegmentEvent } from './components/segment/segment';
export { SegmentButton, SegmentButtonEvent } from './components/segment-button/segment-button';
export { SelectPopoverOption, SelectPopover } from './components/select-popover/select-popover';
export { Select } from './components/select/select';
export { SelectOption } from './components/select-option/select-option';
export { SkeletonText } from './components/skeleton-text/skeleton-text';
export { Slide } from './components/slide/slide';
export { Slides } from './components/slides/slides';
export * from './components/spinner/spinner-configs';
export { Spinner } from './components/spinner/spinner';
export { SplitPane, SplitPaneAlert } from './components/split-pane/split-pane';
export { Tab } from './components/tab/tab';
export { TabButton } from './components/tab-button/tab-button';
export { Tabs } from './components/tabs/tabs';
export { Thumbnail } from './components/thumbnail/thumbnail';
export { ToolbarTitle } from './components/title/title';
export * from './components/toast/toast';
export { ToastController } from './components/toast-controller/toast-controller';
export { Toggle } from './components/toggle/toggle';
export { Toolbar } from './components/toolbar/toolbar';

export * from './navigation/nav-interfaces';
export { ViewController } from './navigation/view-controller';

// export all of the component declarations that are dynamically created
export * from './components';

export { DomController, RafCallback } from './global/dom-controller';

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

export interface OverlayDismissEvent extends CustomEvent {
  detail: OverlayDismissEventDetail;
}

export interface OverlayDismissEventDetail {
  data?: any;
  role?: string;
}

export interface OverlayController {
  create(): HTMLElement;
}
