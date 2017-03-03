

/**
 * Import Angular
 */
import { ANALYZE_FOR_ENTRY_COMPONENTS, APP_INITIALIZER, ComponentFactoryResolver, Inject, Injector, ModuleWithProviders, NgModule, NgZone, Optional } from '@angular/core';
import { APP_BASE_HREF, Location, LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

/**
 * Import Other
 */
import { DeepLinkConfig } from './navigation/nav-util';

/**
 * Import Providers
 */
import { ActionSheetController } from './components/action-sheet/action-sheet-controller';
import { AlertController } from './components/alert/alert-controller';
import { App } from './components/app/app';
import { AppRootToken } from './components/app/app-root';
import { Config, setupConfig, ConfigToken } from './config/config';
import { DeepLinker, setupDeepLinker } from './navigation/deep-linker';
import { DomController } from './platform/dom-controller';
import { Events, setupProvideEvents } from './util/events';
import { Form } from './util/form';
import { GestureController } from './gestures/gesture-controller';
import { Haptic } from './tap-click/haptic';
import { Keyboard } from './platform/keyboard';
import { LoadingController } from './components/loading/loading-controller';
import { MenuController } from './components/menu/menu-controller';
import { ModalController } from './components/modal/modal-controller';
import { ModuleLoader, provideModuleLoader, setupPreloading, LAZY_LOADED_TOKEN } from './util/module-loader';
import { NgModuleLoader } from './util/ng-module-loader';
import { PickerController } from './components/picker/picker-controller';
import { Platform, setupPlatform } from './platform/platform';
import { PlatformConfigToken, providePlatformConfigs } from './platform/platform-registry';
import { PopoverController } from './components/popover/popover-controller';
import { TapClick, setupTapClick } from './tap-click/tap-click';
import { ToastController } from './components/toast/toast-controller';
import { registerModeConfigs } from './config/mode-registry';
import { TransitionController } from './transitions/transition-controller';
import { UrlSerializer, setupUrlSerializer, DeepLinkConfigToken } from './navigation/url-serializer';


/**
 * Import Overlay Entry Components
 */
import { ActionSheetCmp } from './components/action-sheet/action-sheet-component';
import { AlertCmp } from './components/alert/alert-component';
import { IonicApp } from './components/app/app-root';
import { LoadingCmp } from './components/loading/loading-component';
import { ModalCmp } from './components/modal/modal-component';
import { PickerCmp } from './components/picker/picker-component';
import { PopoverCmp } from './components/popover/popover-component';
import { ToastCmp } from './components/toast/toast-component';


/**
 * Import Components
 */
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
import { ClickBlock } from './util/click-block';
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
import { Item } from './components/item/item';
import { ItemContent } from './components/item/item-content';
import { ItemDivider } from './components/item/item-divider';
import { ItemGroup } from './components/item/item-group';
import { ItemReorder } from './components/item/item-reorder';
import { Reorder } from './components/item/reorder';
import { ItemSliding } from './components/item/item-sliding';
import { ItemOptions } from './components/item/item-options';
import { Label } from './components/label/label';
import { List } from './components/list/list';
import { ListHeader } from './components/list/list-header';
import { Menu } from './components/menu/menu';
import { MenuClose } from './components/menu/menu-close';
import { MenuToggle } from './components/menu/menu-toggle';
import { NativeInput } from './components/input/native-input';
import { NextInput } from './components/input/next-input';
import { Nav } from './components/nav/nav';
import { NavPop } from './components/nav/nav-pop';
import { NavPopAnchor } from './components/nav/nav-pop-anchor';
import { NavPush } from './components/nav/nav-push';
import { NavPushAnchor } from './components/nav/nav-push-anchor';
import { Navbar } from './components/navbar/navbar';
import { Note } from './components/note/note';
import { Option } from './components/option/option';
import { OverlayPortal } from './components/nav/overlay-portal';
import { PickerColumnCmp } from './components/picker/picker-column';
import { RadioButton } from './components/radio/radio-button';
import { RadioGroup } from './components/radio/radio-group';
import { Range } from './components/range/range';
import { RangeKnob } from './components/range/range-knob';
import { Refresher } from './components/refresher/refresher';
import { RefresherContent } from './components/refresher/refresher-content';
import { Scroll } from './components/scroll/scroll';
import { Searchbar } from './components/searchbar/searchbar';
import { Segment } from './components/segment/segment';
import { SegmentButton } from './components/segment/segment-button';
import { Select } from './components/select/select';
import { ShowWhen } from './components/show-hide-when/show-hide-when';
import { HideWhen } from './components/show-hide-when/hide-when';
import { Slide } from './components/slides/slide';
import { Slides } from './components/slides/slides';
import { Spinner } from './components/spinner/spinner';
import { Tab } from './components/tabs/tab';
import { Tabs } from './components/tabs/tabs';
import { TabButton } from './components/tabs/tab-button';
import { TabHighlight } from './components/tabs/tab-highlight';
import { TextInput } from './components/input/input';
import { Thumbnail } from './components/thumbnail/thumbnail';
import { Toggle } from './components/toggle/toggle';
import { Toolbar } from './components/toolbar/toolbar';
import { Header } from './components/toolbar/toolbar-header';
import { Footer } from './components/toolbar/toolbar-footer';
import { ToolbarItem } from './components/toolbar/toolbar-item';
import { ToolbarTitle } from './components/toolbar/toolbar-title';
import { Typography } from './components/typography/typography';
import { VirtualScroll } from './components/virtual-scroll/virtual-scroll';

import { VirtualItem } from './components/virtual-scroll/virtual-item';
import { VirtualHeader } from './components/virtual-scroll/virtual-header';
import { VirtualFooter } from './components/virtual-scroll/virtual-footer';


/**
 * Export Components/Directives
 */
export { ActionSheet } from './components/action-sheet/action-sheet';
export { ActionSheetController } from './components/action-sheet/action-sheet-controller';
export { ActionSheetOptions } from './components/action-sheet/action-sheet-options';
export { AlertController } from './components/alert/alert-controller';
export { Alert } from './components/alert/alert';
export { AlertOptions, AlertInputOptions } from './components/alert/alert-options';
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
export { ClickBlock } from './util/click-block';
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
export { IonicApp } from './components/app/app-root';

export { Item } from './components/item/item';
export { ItemContent } from './components/item/item-content';
export { ItemDivider } from './components/item/item-divider';
export { ItemGroup } from './components/item/item-group';
export { ItemReorder } from './components/item/item-reorder';
export { Reorder } from './components/item/reorder';
export { ItemSliding } from './components/item/item-sliding';
export { ItemOptions } from './components/item/item-options';

export { Label } from './components/label/label';
export { List } from './components/list/list';
export { ListHeader } from './components/list/list-header';
export { Loading } from './components/loading/loading';
export { LoadingController } from './components/loading/loading-controller';
export { LoadingOptions } from './components/loading/loading-options';
export { Menu } from './components/menu/menu';
export { MenuClose } from './components/menu/menu-close';
export { MenuController } from './components/menu/menu-controller';
export { MenuToggle } from './components/menu/menu-toggle';
export { MenuType } from './components/menu/menu-types';
export { Modal } from './components/modal/modal';
export { ModalController } from './components/modal/modal-controller';
export { ModalOptions } from './components/modal/modal-options';
export { Nav } from './components/nav/nav';
export { NavPop } from './components/nav/nav-pop';
export { NavPopAnchor } from './components/nav/nav-pop-anchor';
export { NavPush } from './components/nav/nav-push';
export { NavPushAnchor } from './components/nav/nav-push-anchor';
export { Navbar } from './components/navbar/navbar';
export { NativeInput } from './components/input/native-input';
export { NextInput } from './components/input/next-input';
export { Note } from './components/note/note';
export { Option } from './components/option/option';
export { OverlayPortal } from './components/nav/overlay-portal';
export { Picker } from './components/picker/picker';
export { PickerController }  from './components/picker/picker-controller';
export { PickerOptions, PickerColumn, PickerColumnOption } from './components/picker/picker-options';
export { Popover } from './components/popover/popover';
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
export { ShowWhen } from './components/show-hide-when/show-hide-when';
export { DisplayWhen } from './components/show-hide-when/show-hide-when';
export { HideWhen } from './components/show-hide-when/hide-when';
export { Slide } from './components/slides/slide';
export { Slides } from './components/slides/slides';
export { Spinner } from './components/spinner/spinner';
export { Tab } from './components/tabs/tab';
export { TabButton } from './components/tabs/tab-button';
export { TabHighlight } from './components/tabs/tab-highlight';
export { Tabs } from './components/tabs/tabs';
export { TapClick, setupTapClick, isActivatable } from './tap-click/tap-click';
export { Toast } from './components/toast/toast';
export { ToastController } from './components/toast/toast-controller';
export { ToastOptions } from './components/toast/toast-options';
export { Toggle } from './components/toggle/toggle';
export { ToolbarBase } from './components/toolbar/toolbar-base';
export { Toolbar } from './components/toolbar/toolbar';
export { Header } from './components/toolbar/toolbar-header';
export { Footer } from './components/toolbar/toolbar-footer';
export { ToolbarItem } from './components/toolbar/toolbar-item';
export { ToolbarTitle } from'./components/toolbar/toolbar-title';
export { Thumbnail } from './components/thumbnail/thumbnail';
export { Typography } from './components/typography/typography';
export { VirtualScroll } from './components/virtual-scroll/virtual-scroll';


/**
 * Export Providers
 */
export { Config, setupConfig, ConfigToken } from './config/config';
export { DomController, DomCallback } from './platform/dom-controller';
export { Platform, setupPlatform } from './platform/platform';
export { Haptic } from './tap-click/haptic';
export { DeepLinker } from './navigation/deep-linker';
export { NavController } from './navigation/nav-controller';
export { NavControllerBase } from './navigation/nav-controller-base';
export { NavParams } from './navigation/nav-params';
export { NavLink, NavOptions, DeepLink, DeepLinkConfig, DeepLinkMetadata, DeepLinkMetadataFactory, DeepLinkMetadataType } from './navigation/nav-util';
export { UrlSerializer, DeepLinkConfigToken } from './navigation/url-serializer';
export { ViewController } from './navigation/view-controller';
export { ActionSheetCmp } from './components/action-sheet/action-sheet-component';
export { AlertCmp } from './components/alert/alert-component';
export { LoadingCmp } from './components/loading/loading-component';
export { ModalCmp } from './components/modal/modal-component';
export { PickerCmp } from './components/picker/picker-component';
export { PickerColumnCmp } from './components/picker/picker-column';
export { PopoverCmp } from './components/popover/popover-component';
export { ToastCmp } from './components/toast/toast-component';


/**
 * Export Utils
 */
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



/**
 * @name IonicModule
 * @description
 * IonicModule is an NgModule that helps bootstrap a whole Ionic App. By passing a root component, IonicModule will make sure that all the components and directives from the framework are provided. This includes components such as Tabs, Menus, and Slides, as well as classes like AlertController.
 *
 *
 * We're also able to pass any configuration to our app as a second argument for `.forRoot`. This is any valid config property from [the Config Class](/docs/v2/api/config/Config/).
 *
 * The last functionality that IonicModule allows you to configure is optional routes for DeepLinker. For more information on DeepLinker, please see the [DeepLinker Docs](/docs/v2/api/navigation/DeepLinker/)
 *
 * @usage
 * ```ts
 * import { NgModule } from '@angular/core';
 * import { IonicApp, IonicModule } from 'ionic-angular';
 * import { MyApp } from './app.component';
 * import { HomePage } from '../pages/home/home';
 * @NgModule({
 *   declarations: [
 *     MyApp,
 *     HomePage
 *   ],
 *   imports: [
 *     IonicModule.forRoot(MyApp)
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
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,


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
    ClickBlock,
    Col,
    Content,
    DateTime,
    FabContainer,
    FabButton,
    FabList,
    Footer,
    Grid,
    Header,
    HideWhen,
    Icon,
    Img,
    InfiniteScroll,
    InfiniteScrollContent,
    IonicApp,
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
    Menu,
    MenuClose,
    MenuToggle,
    NativeInput,
    Nav,
    Navbar,
    NavPop,
    NavPopAnchor,
    NavPush,
    NavPushAnchor,
    NextInput,
    Note,
    Option,
    OverlayPortal,
    PickerColumnCmp,
    RadioButton,
    RadioGroup,
    Range,
    RangeKnob,
    Refresher,
    RefresherContent,
    Reorder,
    Row,
    Scroll,
    Searchbar,
    Segment,
    SegmentButton,
    Select,
    ShowWhen,
    Slide,
    Slides,
    Spinner,
    Tab,
    Tabs,
    TabButton,
    TabHighlight,
    TextInput,
    Thumbnail,
    Toggle,
    Toolbar,
    ToolbarItem,
    ToolbarTitle,
    Typography,
    VirtualFooter,
    VirtualHeader,
    VirtualItem,
    VirtualScroll,
  ],
  declarations: [
    ActionSheetCmp,
    AlertCmp,
    ClickBlock,
    LoadingCmp,
    ModalCmp,
    PickerCmp,
    PopoverCmp,
    ToastCmp,

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
    ClickBlock,
    Col,
    Content,
    DateTime,
    FabContainer,
    FabButton,
    FabList,
    Footer,
    Grid,
    Header,
    HideWhen,
    Icon,
    Img,
    InfiniteScroll,
    InfiniteScrollContent,
    IonicApp,
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
    Menu,
    MenuClose,
    MenuToggle,
    NativeInput,
    Nav,
    Navbar,
    NavPop,
    NavPopAnchor,
    NavPush,
    NavPushAnchor,
    NextInput,
    Note,
    Option,
    OverlayPortal,
    PickerColumnCmp,
    RadioButton,
    RadioGroup,
    Range,
    RangeKnob,
    Refresher,
    RefresherContent,
    Reorder,
    Row,
    Scroll,
    Searchbar,
    Segment,
    SegmentButton,
    Select,
    ShowWhen,
    Slide,
    Slides,
    Spinner,
    Tab,
    Tabs,
    TabButton,
    TabHighlight,
    TextInput,
    Thumbnail,
    Toggle,
    Toolbar,
    ToolbarItem,
    ToolbarTitle,
    Typography,
    VirtualFooter,
    VirtualHeader,
    VirtualItem,
    VirtualScroll,
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

  static forChild(cls: any) {
    return {
      ngModule: DeepLinkModule,
      providers: [
        { provide: <any>LAZY_LOADED_TOKEN, useValue: cls }
      ]
    };
  }

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
        { provide: APP_INITIALIZER, useFactory: setupPreloading, deps: [ DeepLinkConfigToken, ModuleLoader ], multi: true },

        // useClass
        // { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },

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
        PickerController,
        PopoverController,
        NgModuleLoader,
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

@NgModule({
  imports: [IonicModule],
  exports: [IonicModule]
})
export class DeepLinkModule {

  static forChild(page: any): ModuleWithProviders {
    return {
      ngModule: DeepLinkModule,
      providers: [
        { provide: <any>LAZY_LOADED_TOKEN, useValue: page },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: page, multi: true },
      ]
    };
  }

}

/**
 * @private
 */
export function provideLocationStrategy(platformLocationStrategy: PlatformLocation,
                                        baseHref: string, config: Config) {
  return config.get('locationStrategy') === 'path' ?
         new PathLocationStrategy(platformLocationStrategy, baseHref) :
         new HashLocationStrategy(platformLocationStrategy, baseHref);
}
