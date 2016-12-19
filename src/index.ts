
/* mMdule exports start*/
export { Config, setupConfig } from './config/config';
export { DomController, DomCallback } from './platform/dom-controller';
export { Platform, setupPlatform } from './platform/platform';
export { Haptic } from './tap-click/haptic';
export { DeepLinker } from './navigation/deep-linker';
export { NavController } from './navigation/nav-controller';
export { NavParams } from './navigation/nav-params';
export { NavLink, NavOptions, DeepLink, DeepLinkConfig, DeepLinkMetadata, DeepLinkMetadataType } from './navigation/nav-util';
export { UrlSerializer, DeepLinkConfigToken } from './navigation/url-serializer';
export { ViewController } from './navigation/view-controller';
export { ConfigToken, IonicModule, provideLocationStrategy, setupTapClick } from './module';
/* Module exports done

/* Directives exports start */
export { Ion } from './components/ion';

/**
 * Export Components
 */
export { ActionSheet, ActionSheetController } from './components/action-sheet/action-sheet';
export { ActionSheetOptions } from './components/action-sheet/action-sheet-options';
export { Alert, AlertController } from './components/alert/alert';
export { AlertOptions, AlertInputOptions } from './components/alert/alert-options';
export { App } from './components/app/app';
export { Avatar } from './components/avatar/avatar';
export { Backdrop } from './components/backdrop/backdrop';
export { Badge } from './components/badge/badge';
export { Button } from './components/button/button';
export { Card, CardContent, CardHeader, CardTitle } from './components/card/card';
export { Checkbox } from './components/checkbox/checkbox';
export { Chip } from './components/chip/chip';
export { ClickBlock } from './util/click-block';
export { Content, ScrollEvent } from './components/content/content';
export { DateTime } from './components/datetime/datetime';
export { FabContainer, FabButton, FabList } from './components/fab/fab';
export { Grid, Row, Col } from './components/grid/grid';
export { Icon } from './components/icon/icon';
export { Img } from './components/img/img';
export { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
export { InfiniteScrollContent } from './components/infinite-scroll/infinite-scroll-content';
export { TextArea, TextInput } from './components/input/input';
export { IonicApp } from './components/app/app-root';
export { Item, ItemContent, ItemDivider, ItemGroup } from './components/item/item';
export { ItemReorder, Reorder } from './components/item/item-reorder';
export { ItemSliding, ItemOptions, ItemSideFlags } from './components/item/item-sliding';
export { Label } from './components/label/label';
export { List } from './components/list/list';
export { ListHeader } from './components/list/list-header';
export { Loading, LoadingController } from './components/loading/loading';
export { LoadingOptions } from './components/loading/loading-options';
export { Menu } from './components/menu/menu';
export { MenuClose } from './components/menu/menu-close';
export { MenuController } from './components/menu/menu-controller';
export { MenuToggle } from './components/menu/menu-toggle';
export { MenuType } from './components/menu/menu-types';
export { Modal, ModalController } from './components/modal/modal';
export { ModalOptions } from './components/modal/modal-options';
export { Nav } from './components/nav/nav';
export { NavPop, NavPopAnchor } from './components/nav/nav-pop';
export { NavPush, NavPushAnchor } from './components/nav/nav-push';
export { Navbar } from './components/navbar/navbar';
export { NativeInput, NextInput } from './components/input/native-input';
export { Note } from './components/note/note';
export { Option } from './components/option/option';
export { OverlayPortal } from './components/nav/overlay-portal';
export { Picker, PickerController } from './components/picker/picker';
export { PickerOptions, PickerColumn, PickerColumnOption } from './components/picker/picker-options';
export { Popover, PopoverController } from './components/popover/popover';
export { PopoverOptions } from './components/popover/popover-options';
export { RadioButton } from './components/radio/radio-button';
export { RadioGroup } from './components/radio/radio-group';
export { Range, RangeKnob, ClientRect } from './components/range/range';
export { Refresher } from './components/refresher/refresher';
export { RefresherContent } from './components/refresher/refresher-content';
export { Scroll } from './components/scroll/scroll';
export { Searchbar } from './components/searchbar/searchbar';
export { Segment, SegmentButton } from './components/segment/segment';
export { Select } from './components/select/select';
export { ShowWhen, HideWhen, DisplayWhen } from './components/show-hide-when/show-hide-when';
export { Slides, Slide, SlideLazy } from './components/slides/slides';
export { Spinner } from './components/spinner/spinner';
export { Tab } from './components/tabs/tab';
export { TabButton } from './components/tabs/tab-button';
export { TabHighlight } from './components/tabs/tab-highlight';
export { Tabs } from './components/tabs/tabs';
export { TapClick, isActivatable } from './tap-click/tap-click';
export { Toast, ToastController } from './components/toast/toast';
export { ToastOptions } from './components/toast/toast-options';
export { Toggle } from './components/toggle/toggle';
export { Toolbar, ToolbarBase, Header, Footer } from './components/toolbar/toolbar';
export { ToolbarItem } from './components/toolbar/toolbar-item';
export { ToolbarTitle } from'./components/toolbar/toolbar-title';
export { Thumbnail } from './components/thumbnail/thumbnail';
export { Typography } from './components/typography/typography';
export { VirtualScroll } from './components/virtual-scroll/virtual-scroll';


export { ActionSheetCmp } from './components/action-sheet/action-sheet-component';
export { AlertCmp } from './components/alert/alert-component';
export { LoadingCmp } from './components/loading/loading-component';
export { ModalCmp } from './components/modal/modal-component';
export { PickerCmp, PickerColumnCmp } from './components/picker/picker-component';
export { PopoverCmp } from './components/popover/popover-component';
export { ToastCmp } from './components/toast/toast-component';
/* Directives exports end */

export { PanGesture, PanGestureConfig } from './gestures/drag-gesture';
export { Gesture } from './gestures/gesture';
export { SlideEdgeGesture } from './gestures/slide-edge-gesture';
export { SlideData, SlideGesture } from './gestures/slide-gesture';
export {
  BLOCK_ALL,
  BlockerOptions,
  GESTURE_GO_BACK_SWIPE,
  GESTURE_MENU_SWIPE,
  GESTURE_ITEM_SWIPE,
  GESTURE_REFRESHER,
  GESTURE_TOGGLE,
  GesturePriority,
  GestureOptions,
  GestureController,
  GestureDelegate,
  BlockerDelegate,
} from './gestures/gesture-controller';


export { Events, setupEvents, setupProvideEvents } from './util/events';
export { IonicErrorHandler } from './util/ionic-error-handler';
export { Keyboard } from './platform/keyboard';
export { Form, IonicFormInput, IonicTapInput } from './util/form';
export { reorderArray } from './util/util';

export { Animation, AnimationOptions, EffectProperty, EffectState, PlayOptions } from './animations/animation';
export { PageTransition } from './transitions/page-transition';
export { Transition } from './transitions/transition';

export { NavControllerBase } from './navigation/nav-controller-base';
