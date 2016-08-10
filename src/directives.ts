
/**
 * Import Components
 */
import { ActionSheetCmp } from './components/action-sheet/action-sheet-component';
import { AlertCmp } from './components/alert/alert-component';
import { LoadingCmp } from './components/loading/loading-component';
import { ModalCmp } from './components/modal/modal-component';
import { PickerCmp } from './components/picker/picker-component';
import { PopoverCmp } from './components/popover/popover-component';
import { ToastCmp } from './components/toast/toast-component';
import { Menu } from './components/menu/menu';
import { MenuToggle } from './components/menu/menu-toggle';
import { MenuClose } from './components/menu/menu-close';
import { Backdrop } from './components/backdrop/backdrop';
import { Badge } from './components/badge/badge';
import { Button } from './components/button/button';
import { Content } from './components/content/content';
import { Img } from './components/img/img';
import { Scroll } from './components/scroll/scroll';
import { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
import { InfiniteScrollContent } from './components/infinite-scroll/infinite-scroll-content';
import { Refresher } from './components/refresher/refresher';
import { RefresherContent } from './components/refresher/refresher-content';
import { Slides, Slide, SlideLazy } from './components/slides/slides';
import { Tabs } from './components/tabs/tabs';
import { Tab } from './components/tabs/tab';
import { List } from './components/list/list';
import { ListHeader } from './components/list/list-header';
import { IonicApp } from './components/app/app-root';
import { Item, ItemContent } from './components/item/item';
import { ItemReorder } from './components/item/item-reorder';
import { ItemSliding, ItemOptions } from './components/item/item-sliding';
import { VirtualScroll } from './components/virtual-scroll/virtual-scroll';
import { VirtualItem, VirtualHeader, VirtualFooter } from './components/virtual-scroll/virtual-item';
import { Toolbar, Header, Footer } from './components/toolbar/toolbar';
import { ToolbarItem } from './components/toolbar/toolbar-item';
import { ToolbarTitle } from './components/toolbar/toolbar-title';
import { Icon } from './components/icon/icon';
import { Spinner } from './components/spinner/spinner';
import { Checkbox } from './components/checkbox/checkbox';
import { Select } from './components/select/select';
import { Option } from './components/option/option';
import { DateTime } from './components/datetime/datetime';
import { Toggle } from './components/toggle/toggle';
import { TextInput, TextArea } from './components/input/input';
import { Label } from './components/label/label';
import { Segment, SegmentButton } from './components/segment/segment';
import { RadioButton } from './components/radio/radio-button';
import { RadioGroup } from './components/radio/radio-group';
import { Range } from './components/range/range';
import { Searchbar } from './components/searchbar/searchbar';
import { Nav } from './components/nav/nav';
import { NavPop } from './components/nav/nav-pop';
import { NavPush } from './components/nav/nav-push';
import { Navbar } from './components/navbar/navbar';
import { ShowWhen, HideWhen } from './components/show-hide-when/show-hide-when';


/**
 * Export Components
 */
export { ActionSheet, ActionSheetController } from './components/action-sheet/action-sheet';
export { ActionSheetOptions } from './components/action-sheet/action-sheet-options';
export { Alert, AlertController } from './components/alert/alert';
export { AlertOptions, AlertInputOptions } from './components/alert/alert-options';
export { App } from './components/app/app';
export { Backdrop } from './components/backdrop/backdrop';
export { Badge } from './components/badge/badge';
export { Button } from './components/button/button';
export { Checkbox } from './components/checkbox/checkbox';
export { Content } from './components/content/content';
export { DateTime } from './components/datetime/datetime';
export { Icon } from './components/icon/icon';
export { Img } from './components/img/img';
export { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
export { InfiniteScrollContent } from './components/infinite-scroll/infinite-scroll-content';
export { TextArea, TextInput } from './components/input/input';
export { IonicApp } from './components/app/app-root';
export { Item } from './components/item/item';
export { ItemReorder } from './components/item/item-reorder';
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
export { NavPop } from './components/nav/nav-pop';
export { NavPush } from './components/nav/nav-push';
export { Navbar } from './components/navbar/navbar';
export { Option } from './components/option/option';
export { Picker, PickerController } from './components/picker/picker';
export { PickerOptions } from './components/picker/picker-options';
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
export { Tabs } from './components/tabs/tabs';
export { TapClick, isActivatable } from './components/tap-click/tap-click';
export { Toast, ToastController } from './components/toast/toast';
export { ToastOptions } from './components/toast/toast-options';
export { Toggle } from './components/toggle/toggle';
export { Toolbar, ToolbarBase, Header, Footer } from './components/toolbar/toolbar';
export { ToolbarTitle } from'./components/toolbar/toolbar-title';
export { VirtualScroll } from './components/virtual-scroll/virtual-scroll';


/**
 * @private
 * @name IONIC_DIRECTIVES
 * @description
 * The core Ionic directives are automatically available when you bootstrap your app
 * with the `IonicModule`. This means if you are using custom components you do not
 * need to import `IONIC_DIRECTIVES` as they are part of the app's default directives.
 */
export const IONIC_DIRECTIVES: any[] = [
  ActionSheetCmp,
  AlertCmp,
  Backdrop,
  Badge,
  Button,
  Checkbox,
  Content,
  DateTime,
  Footer,
  Header,
  HideWhen,
  Icon,
  Img,
  InfiniteScroll,
  InfiniteScrollContent,
  IonicApp,
  Item,
  ItemContent,
  ItemOptions,
  ItemReorder,
  ItemSliding,
  Label,
  List,
  ListHeader,
  LoadingCmp,
  Menu,
  MenuClose,
  MenuToggle,
  ModalCmp,
  Nav,
  Navbar,
  NavPop,
  NavPush,
  Option,
  PickerCmp,
  PopoverCmp,
  RadioButton,
  RadioGroup,
  Range,
  Refresher,
  RefresherContent,
  Scroll,
  Searchbar,
  Segment,
  SegmentButton,
  Select,
  ShowWhen,
  Slide,
  Slides,
  SlideLazy,
  Spinner,
  Tab,
  Tabs,
  TextArea,
  TextInput,
  ToastCmp,
  Toggle,
  Toolbar,
  ToolbarItem,
  ToolbarTitle,
  VirtualFooter,
  VirtualHeader,
  VirtualItem,
  VirtualScroll,
];
