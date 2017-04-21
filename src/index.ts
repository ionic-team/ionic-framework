

/**
 * Import Angular
 */
import { ANALYZE_FOR_ENTRY_COMPONENTS, APP_INITIALIZER, ComponentFactoryResolver, Inject, Injector, ModuleWithProviders, NgModule, NgZone, Optional } from '@angular/core';
import { APP_BASE_HREF, Location, LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { DOCUMENT, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Import Other
 */
import { DeepLinkConfig } from './navigation/nav-util';

/**
 * Global Providers
 */

import { App } from './components/app/app';
import { AppRootToken } from './components/app/app-root';
import { Config, setupConfig, ConfigToken } from './config/config';
import { DeepLinker, setupDeepLinker } from './navigation/deep-linker';
import { DomController } from './platform/dom-controller';
import { Events, setupProvideEvents } from './util/events';
import { Form } from './util/form';
import { GestureController } from './gestures/gesture-controller';
import { IonicGestureConfig } from './gestures/gesture-config';
import { Haptic } from './tap-click/haptic';
import { Keyboard } from './platform/keyboard';
import { ModuleLoader, provideModuleLoader, setupPreloading, LAZY_LOADED_TOKEN } from './util/module-loader';
import { NgModuleLoader } from './util/ng-module-loader';
import { Platform, setupPlatform } from './platform/platform';
import { PlatformConfigToken, providePlatformConfigs } from './platform/platform-registry';
import { TapClick, setupTapClick } from './tap-click/tap-click';
import { registerModeConfigs } from './config/mode-registry';
import { TransitionController } from './transitions/transition-controller';
import { UrlSerializer, setupUrlSerializer, DeepLinkConfigToken } from './navigation/url-serializer';

/**
 * Import Components/Directives/Etc
 */

import { ActionSheetCmp } from './components/action-sheet/action-sheet-component';
import { ActionSheetController } from './components/action-sheet/action-sheet-controller';
import { AlertCmp } from './components/alert/alert-component';
import { AlertController } from './components/alert/alert-controller';
import { ClickBlock } from './components/app/click-block';
import { IonicApp } from './components/app/app-root';
import { OverlayPortal } from './components/app/overlay-portal';
import { Avatar } from './components/avatar/avatar';
import { Backdrop } from './components/backdrop/backdrop';
import { Badge } from './components/badge/badge';
import { Button } from './components/button/button';
import { Card } from './components/card/card';
import { CardContent } from './components/card/card-content';
import { CardHeader } from './components/card/card-header';
import { CardTitle } from './components/card/card-title';
import { Checkbox } from './components/checkbox/checkbox';
import { Chip } from './components/chip/chip';
import { Content } from './components/content/content';
import { DateTime } from './components/datetime/datetime';
import { FabButton } from './components/fab/fab';
import { FabContainer } from './components/fab/fab-container';
import { FabList } from './components/fab/fab-list';
import { Col } from './components/grid/col';
import { Grid } from './components/grid/grid';
import { Row } from './components/grid/row';
import { Icon } from './components/icon/icon';
import { Img } from './components/img/img';
import { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
import { InfiniteScrollContent } from './components/infinite-scroll/infinite-scroll-content';
import { NativeInput } from './components/input/native-input';
import { NextInput } from './components/input/next-input';
import { TextInput } from './components/input/input';
import { Item } from './components/item/item';
import { ItemContent } from './components/item/item-content';
import { ItemDivider } from './components/item/item-divider';
import { ItemGroup } from './components/item/item-group';
import { ItemOptions } from './components/item/item-options';
import { ItemReorder } from './components/item/item-reorder';
import { ItemSliding } from './components/item/item-sliding';
import { Reorder } from './components/item/reorder';
import { Label } from './components/label/label';
import { List } from './components/list/list';
import { ListHeader } from './components/list/list-header';
import { LoadingCmp } from './components/loading/loading-component';
import { LoadingController } from './components/loading/loading-controller';
import { Menu } from './components/menu/menu';
import { MenuClose } from './components/menu/menu-close';
import { MenuController } from './components/app/menu-controller';
import { MenuToggle } from './components/menu/menu-toggle';
import { ModalCmp } from './components/modal/modal-component';
import { ModalController } from './components/modal/modal-controller';
import { Nav } from './components/nav/nav';
import { NavPop } from './components/nav/nav-pop';
import { NavPopAnchor } from './components/nav/nav-pop-anchor';
import { NavPush } from './components/nav/nav-push';
import { NavPushAnchor } from './components/nav/nav-push-anchor';
import { Note } from './components/note/note';
import { Option } from './components/option/option';
import { PickerCmp } from './components/picker/picker-component';
import { PickerColumnCmp } from './components/picker/picker-column';
import { PickerController } from './components/picker/picker-controller';
import { PopoverCmp } from './components/popover/popover-component';
import { PopoverController } from './components/popover/popover-controller';
import { RadioButton } from './components/radio/radio-button';
import { RadioGroup } from './components/radio/radio-group';
import { Range } from './components/range/range';
import { RangeKnob } from './components/range/range-knob';
import { Refresher } from './components/refresher/refresher';
import { RefresherContent } from './components/refresher/refresher-content';
import { Scroll } from './components/scroll/scroll';
import { Searchbar } from './components/searchbar/searchbar';
import { Segment } from './components/segment/segment';
import { Select } from './components/select/select';
import { SegmentButton } from './components/segment/segment-button';
import { ShowWhen } from './components/show-hide-when/show-when';
import { HideWhen } from './components/show-hide-when/hide-when';
import { Slide } from './components/slides/slide';
import { Slides } from './components/slides/slides';
import { Spinner } from './components/spinner/spinner';
import { SplitPane } from './components/split-pane/split-pane';
import { Tab } from './components/tabs/tab';
import { TabButton } from './components/tabs/tab-button';
import { TabHighlight } from './components/tabs/tab-highlight';
import { Tabs } from './components/tabs/tabs';
import { Thumbnail } from './components/thumbnail/thumbnail';
import { ToastCmp } from './components/toast/toast-component';
import { ToastController } from './components/toast/toast-controller';
import { Toggle } from './components/toggle/toggle';
import { Footer } from './components/toolbar/toolbar-footer';
import { Header } from './components/toolbar/toolbar-header';
import { Toolbar } from './components/toolbar/toolbar';
import { ToolbarItem } from './components/toolbar/toolbar-item';
import { ToolbarTitle } from './components/toolbar/toolbar-title';
import { Navbar } from './components/toolbar/navbar';
import { Typography } from './components/typography/typography';
import { VirtualFooter } from './components/virtual-scroll/virtual-footer';
import { VirtualHeader } from './components/virtual-scroll/virtual-header';
import { VirtualItem } from './components/virtual-scroll/virtual-item';
import { VirtualScroll } from './components/virtual-scroll/virtual-scroll';



/**
 * Export Components/Directives
 */
export { IonicApp } from './components/app/app-root';
export { MenuController } from './components/app/menu-controller';
export { ActionSheet } from './components/action-sheet/action-sheet';
export { ActionSheetController } from './components/action-sheet/action-sheet-controller';
export { ActionSheetOptions } from './components/action-sheet/action-sheet-options';
export { ActionSheetCmp } from './components/action-sheet/action-sheet-component';
export { Alert } from './components/alert/alert';
export { AlertController } from './components/alert/alert-controller';
export { AlertOptions } from './components/alert/alert-options';
export { AlertCmp } from './components/alert/alert-component';
export { App } from './components/app/app';
export { Avatar } from './components/avatar/avatar';
export { Backdrop } from './components/backdrop/backdrop';
export { Badge } from './components/badge/badge';
export { Button } from './components/button/button';
export { Card } from './components/card/card';
export { CardContent } from './components/card/card-content';
export { CardHeader } from './components/card/card-header';
export { CardTitle } from './components/card/card-title';
export { Checkbox } from './components/checkbox/checkbox';
export { Chip } from './components/chip/chip';
export { Content, ScrollEvent } from './components/content/content';
export { DateTime } from './components/datetime/datetime';
export { FabButton } from './components/fab/fab';
export { FabContainer } from './components/fab/fab-container';
export { FabList } from './components/fab/fab-list';
export { Col } from './components/grid/col';
export { Grid } from './components/grid/grid';
export { Row } from './components/grid/row';
export { Ion } from './components/ion';
export { Icon } from './components/icon/icon';
export { Img } from './components/img/img';
export { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
export { InfiniteScrollContent } from './components/infinite-scroll/infinite-scroll-content';
export { TextInput } from './components/input/input';
export { Item } from './components/item/item';
export { ItemContent } from './components/item/item-content';
export { ItemDivider } from './components/item/item-divider';
export { ItemGroup } from './components/item/item-group';
export { ItemOptions } from './components/item/item-options';
export { ItemReorder } from './components/item/item-reorder';
export { ItemSliding } from './components/item/item-sliding';
export { Reorder } from './components/item/reorder';
export { Label } from './components/label/label';
export { List } from './components/list/list';
export { ListHeader } from './components/list/list-header';
export { Loading } from './components/loading/loading';
export { LoadingController } from './components/loading/loading-controller';
export { LoadingOptions } from './components/loading/loading-options';
export { LoadingCmp } from './components/loading/loading-component';
export { Menu } from './components/menu/menu';
export { MenuClose } from './components/menu/menu-close';
export { MenuToggle } from './components/menu/menu-toggle';
export { MenuType } from './components/menu/menu-types';
export { Modal } from './components/modal/modal';
export { ModalCmp } from './components/modal/modal-component';
export { ModalController } from './components/modal/modal-controller';
export { ModalOptions } from './components/modal/modal-options';
export { Nav } from './components/nav/nav';
export { NavPop } from './components/nav/nav-pop';
export { NavPopAnchor } from './components/nav/nav-pop-anchor';
export { NavPush } from './components/nav/nav-push';
export { NavPushAnchor } from './components/nav/nav-push-anchor';
export { NativeInput } from './components/input/native-input';
export { NextInput } from './components/input/next-input';
export { Note } from './components/note/note';
export { Option } from './components/option/option';
export { Picker } from './components/picker/picker';
export { PickerCmp } from './components/picker/picker-component';
export { PickerColumnCmp } from './components/picker/picker-column';
export { PickerController }  from './components/picker/picker-controller';
export { PickerOptions, PickerColumn, PickerColumnOption } from './components/picker/picker-options';
export { Popover } from './components/popover/popover';
export { PopoverCmp } from './components/popover/popover-component';
export { PopoverController } from './components/popover/popover-controller';
export { PopoverOptions } from './components/popover/popover-options';
export { RadioButton } from './components/radio/radio-button';
export { RadioGroup } from './components/radio/radio-group';
export { Range } from './components/range/range';
export { RangeKnob } from './components/range/range-knob';
export { Refresher } from './components/refresher/refresher';
export { RefresherContent } from './components/refresher/refresher-content';
export { Scroll } from './components/scroll/scroll';
export { Searchbar } from './components/searchbar/searchbar';
export { Segment } from './components/segment/segment';
export { SegmentButton } from './components/segment/segment-button';
export { Select } from './components/select/select';
export { SelectPopover } from './components/select/select-popover-component';
export { ShowWhen } from './components/show-hide-when/show-when';
export { DisplayWhen } from './components/show-hide-when/display-when';
export { HideWhen } from './components/show-hide-when/hide-when';
export { Slide } from './components/slides/slide';
export { Slides } from './components/slides/slides';
export { Spinner } from './components/spinner/spinner';
export { SplitPane, RootNode } from './components/split-pane/split-pane';
export { Tab } from './components/tabs/tab';
export { TabButton } from './components/tabs/tab-button';
export { TabHighlight } from './components/tabs/tab-highlight';
export { Tabs } from './components/tabs/tabs';
export { Toast } from './components/toast/toast';
export { ToastCmp } from './components/toast/toast-component';
export { ToastController } from './components/toast/toast-controller';
export { ToastOptions } from './components/toast/toast-options';
export { Toggle } from './components/toggle/toggle';
export { Footer } from './components/toolbar/toolbar-footer';
export { Header } from './components/toolbar/toolbar-header';
export { Toolbar } from './components/toolbar/toolbar';
export { ToolbarItem } from './components/toolbar/toolbar-item';
export { ToolbarTitle } from './components/toolbar/toolbar-title';
export { Navbar } from './components/toolbar/navbar';
export { Thumbnail } from './components/thumbnail/thumbnail';
export { Typography } from './components/typography/typography';
export { VirtualFooter } from './components/virtual-scroll/virtual-footer';
export { VirtualHeader } from './components/virtual-scroll/virtual-header';
export { VirtualItem } from './components/virtual-scroll/virtual-item';
export { VirtualScroll } from './components/virtual-scroll/virtual-scroll';


/**
 * Global Providers
 */
export { Config, setupConfig, ConfigToken } from './config/config';
export { DomController, DomCallback } from './platform/dom-controller';
export { Platform, setupPlatform } from './platform/platform';
export { Haptic } from './tap-click/haptic';
export { DeepLinker } from './navigation/deep-linker';
export { IonicPage, IonicPageMetadata } from './navigation/ionic-page';
export { NavController } from './navigation/nav-controller';
export { NavControllerBase } from './navigation/nav-controller-base';
export { NavParams } from './navigation/nav-params';
export { NavLink, NavOptions, DeepLinkConfig, DeepLinkMetadata, DeepLinkMetadataFactory } from './navigation/nav-util';
export { TapClick, setupTapClick, isActivatable } from './tap-click/tap-click';
export { UrlSerializer, DeepLinkConfigToken } from './navigation/url-serializer';
export { ViewController } from './navigation/view-controller';


/**
 * Export Utils
 */
export { PanGesture, PanGestureConfig } from './gestures/pan-gesture';
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
export { PlatformConfigToken } from './platform/platform-registry';
export { registerModeConfigs } from './config/mode-registry';
export { IonicGestureConfig } from './gestures/gesture-config';



/**
 * @name IonicModule
 * @description
 * IonicModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that bootstraps
 * an Ionic App. By passing a root component, IonicModule will make sure that all of the components,
 * directives, and providers from the framework are imported.
 *
 * Any configuration for the app can be passed as the second argument to `forRoot`. This can be any
 * valid property from the [Config](/docs/api/config/Config/).
 *
 * @usage
 * ```ts
 * import { NgModule } from '@angular/core';
 *
 * import { IonicApp, IonicModule } from 'ionic-angular';
 *
 * import { MyApp } from './app.component';
 * import { HomePage } from '../pages/home/home';
 *
 * @NgModule({
 *   declarations: [
 *     MyApp,
 *     HomePage
 *   ],
 *   imports: [
 *     BrowserModule,
 *     IonicModule.forRoot(MyApp, {
 *
 *     })
 *   ],
 *   bootstrap: [IonicApp],
 *   entryComponents: [
 *     MyApp,
 *     HomePage
 *   ],
 *   providers: []
 * })
 * export class AppModule {}
 * ```
 */
@NgModule({
  declarations: [
    ActionSheetCmp,
    AlertCmp,
    ClickBlock,
    IonicApp,
    OverlayPortal,
    Avatar,
    Backdrop,
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Checkbox,
    Chip,
    Col,
    Content,
    DateTime,
    FabButton,
    FabContainer,
    FabList,
    Grid,
    Img,
    Icon,
    InfiniteScroll,
    InfiniteScrollContent,
    Item,
    ItemContent,
    ItemDivider,
    ItemGroup,
    ItemOptions,
    ItemReorder,
    ItemSliding,
    Label,
    List,
    ListHeader,
    Reorder,
    LoadingCmp,
    NativeInput,
    NextInput,
    Menu,
    MenuClose,
    MenuToggle,
    ModalCmp,
    Nav,
    NavPop,
    NavPopAnchor,
    NavPush,
    NavPushAnchor,
    Note,
    Option,
    PickerCmp,
    PickerColumnCmp,
    PopoverCmp,
    RadioButton,
    RadioGroup,
    Range,
    RangeKnob,
    Refresher,
    RefresherContent,
    Row,
    Scroll,
    Searchbar,
    Segment,
    SegmentButton,
    Select,
    ShowWhen,
    HideWhen,
    Slide,
    Slides,
    Spinner,
    SplitPane,
    Tab,
    TabButton,
    TabHighlight,
    Tabs,
    TextInput,
    Thumbnail,
    ToastCmp,
    Toggle,
    Footer,
    Header,
    Toolbar,
    ToolbarItem,
    ToolbarTitle,
    Navbar,
    Typography,
    VirtualFooter,
    VirtualHeader,
    VirtualItem,
    VirtualScroll
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ActionSheetCmp,
    AlertCmp,
    ClickBlock,
    IonicApp,
    OverlayPortal,
    Avatar,
    Backdrop,
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Checkbox,
    Chip,
    Col,
    Content,
    DateTime,
    FabButton,
    FabContainer,
    FabList,
    Grid,
    Img,
    Icon,
    InfiniteScroll,
    InfiniteScrollContent,
    Item,
    ItemContent,
    ItemDivider,
    ItemGroup,
    ItemOptions,
    ItemReorder,
    ItemSliding,
    Label,
    List,
    ListHeader,
    Reorder,
    LoadingCmp,
    NativeInput,
    NextInput,
    Menu,
    MenuClose,
    MenuToggle,
    ModalCmp,
    Nav,
    NavPop,
    NavPopAnchor,
    NavPush,
    NavPushAnchor,
    Note,
    Option,
    PickerCmp,
    PickerColumnCmp,
    PopoverCmp,
    RadioButton,
    RadioGroup,
    Range,
    RangeKnob,
    Refresher,
    RefresherContent,
    Row,
    Scroll,
    Searchbar,
    Segment,
    SegmentButton,
    Select,
    ShowWhen,
    HideWhen,
    Slide,
    Slides,
    Spinner,
    SplitPane,
    Tab,
    TabButton,
    TabHighlight,
    Tabs,
    TextInput,
    Thumbnail,
    ToastCmp,
    Toggle,
    Footer,
    Header,
    Toolbar,
    ToolbarItem,
    ToolbarTitle,
    Navbar,
    Typography,
    VirtualFooter,
    VirtualHeader,
    VirtualItem,
    VirtualScroll
  ],
  entryComponents: [
    ActionSheetCmp,
    AlertCmp,
    IonicApp,
    LoadingCmp,
    ModalCmp,
    PickerCmp,
    PopoverCmp,
    ToastCmp
  ]
})
export class IonicModule {

    /**
     * Set the root app component for you IonicModule
     * @param {any} appRoot The root AppComponent for this app.
     * @param {any} config Config Options for the app. Accepts any config property.
     * @param {any} deepLinkConfig Any configuration needed for the Ionic Deeplinker.
     */
  static forRoot(appRoot: any, config: any = null, deepLinkConfig: DeepLinkConfig = null): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: [
        // useValue: bootstrap values
        { provide: AppRootToken, useValue: appRoot },
        { provide: ConfigToken, useValue: config },
        { provide: DeepLinkConfigToken, useValue: deepLinkConfig },
        { provide: APP_BASE_HREF, useValue: '/'},

        // useFactory: user values
        { provide: PlatformConfigToken, useFactory: providePlatformConfigs },

        // useFactory: ionic core providers
        { provide: Platform, useFactory: setupPlatform, deps: [ DOCUMENT, PlatformConfigToken, NgZone ] },
        { provide: Config, useFactory: setupConfig, deps: [ ConfigToken, Platform ] },

        // useFactory: ionic app initializers
        { provide: APP_INITIALIZER, useFactory: registerModeConfigs, deps: [ Config ], multi: true },
        { provide: APP_INITIALIZER, useFactory: setupProvideEvents, deps: [ Platform, DomController ], multi: true },
        { provide: APP_INITIALIZER, useFactory: setupTapClick, deps: [ Config, Platform, DomController, App, NgZone, GestureController ], multi: true },
        { provide: APP_INITIALIZER, useFactory: setupPreloading, deps: [ Config, DeepLinkConfigToken, ModuleLoader, NgZone ], multi: true },

        // useClass
        { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },

        // useValue
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: appRoot, multi: true },

        // ionic providers
        ActionSheetController,
        AlertController,
        App,
        DomController,
        Events,
        Form,
        GestureController,
        Haptic,
        Keyboard,
        LoadingController,
        Location,
        MenuController,
        ModalController,
        NgModuleLoader,
        PickerController,
        PopoverController,
        TapClick,
        ToastController,
        TransitionController,

        { provide: ModuleLoader, useFactory: provideModuleLoader, deps: [NgModuleLoader, Injector]},
        { provide: LocationStrategy, useFactory: provideLocationStrategy, deps: [ PlatformLocation, [new Inject(APP_BASE_HREF), new Optional()], Config ] },
        { provide: UrlSerializer, useFactory: setupUrlSerializer, deps: [ DeepLinkConfigToken ] },
        { provide: DeepLinker, useFactory: setupDeepLinker, deps: [ App, UrlSerializer, Location,  ModuleLoader, ComponentFactoryResolver ] },
      ]
    };
  }
}


/**
 * @name IonicPageModule
 * @description
 * IonicPageModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that
 * bootstraps a child [IonicPage](../navigation/IonicPage/) in order to set up routing.
 *
 * @usage
 * ```ts
 * import { NgModule } from '@angular/core';
 *
 * import { IonicPageModule } from 'ionic-angular';
 *
 * import { HomePage } from './home';
 *
 * @NgModule({
 * 	declarations: [
 * 		HomePage
 * 	],
 * 	imports: [
 * 		IonicPageModule.forChild(HomePage)
 * 	],
 * 	entryComponents: [
 * 		HomePage
 * 	]
 * })
 * export class HomePageModule { }
 * ```
 */
@NgModule({
  imports: [IonicModule],
  exports: [IonicModule]
})
export class IonicPageModule {

  static forChild(page: any): ModuleWithProviders {
    return {
      ngModule: IonicPageModule,
      providers: [
        { provide: <any>LAZY_LOADED_TOKEN, useValue: page },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: page, multi: true },
      ]
    };
  }

}

/**
 * @hidden
 */
export function provideLocationStrategy(platformLocationStrategy: PlatformLocation,
                                        baseHref: string, config: Config) {
  return config.get('locationStrategy') === 'path' ?
         new PathLocationStrategy(platformLocationStrategy, baseHref) :
         new HashLocationStrategy(platformLocationStrategy, baseHref);
}
