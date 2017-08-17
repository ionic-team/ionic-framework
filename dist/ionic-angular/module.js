/**
 * Import Angular
 */
import { ANALYZE_FOR_ENTRY_COMPONENTS, APP_INITIALIZER, ComponentFactoryResolver, Inject, Injector, NgModule, NgZone, Optional } from '@angular/core';
import { APP_BASE_HREF, HashLocationStrategy, Location, LocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { DOCUMENT, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
/**
 * Global Providers
 */
import { App } from './components/app/app';
import { AppRootToken } from './components/app/app-root';
import { Config, ConfigToken, setupConfig } from './config/config';
import { DeepLinker, setupDeepLinker } from './navigation/deep-linker';
import { DomController } from './platform/dom-controller';
import { Events, setupProvideEvents } from './util/events';
import { Form } from './util/form';
import { GestureController } from './gestures/gesture-controller';
import { IonicGestureConfig } from './gestures/gesture-config';
import { Haptic } from './tap-click/haptic';
import { Keyboard } from './platform/keyboard';
import { LAZY_LOADED_TOKEN, ModuleLoader, provideModuleLoader, setupPreloading } from './util/module-loader';
import { NgModuleLoader } from './util/ng-module-loader';
import { Platform, setupPlatform } from './platform/platform';
import { PlatformConfigToken, providePlatformConfigs } from './platform/platform-registry';
import { TapClick, setupTapClick } from './tap-click/tap-click';
import { registerModeConfigs } from './config/mode-registry';
import { TransitionController } from './transitions/transition-controller';
import { DeepLinkConfigToken, UrlSerializer, setupUrlSerializer } from './navigation/url-serializer';
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
import { SelectPopover } from './components/select/select-popover-component';
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
 * \@name IonicModule
 * \@description
 * IonicModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that bootstraps
 * an Ionic App. By passing a root component, IonicModule will make sure that all of the components,
 * directives, and providers from the framework are imported.
 *
 * Any configuration for the app can be passed as the second argument to `forRoot`. This can be any
 * valid property from the [Config](/docs/api/config/Config/).
 *
 * \@usage
 * ```ts
 * import { NgModule } from '\@angular/core';
 *
 * import { IonicApp, IonicModule } from 'ionic-angular';
 *
 * import { MyApp } from './app.component';
 * import { HomePage } from '../pages/home/home';
 *
 * \@NgModule({
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
var IonicModule = (function () {
    function IonicModule() {
    }
    /**
     * Set the root app component for you IonicModule
     * @param {?} appRoot
     * @param {?=} config
     * @param {?=} deepLinkConfig
     * @return {?}
     */
    IonicModule.forRoot = function (appRoot, config, deepLinkConfig) {
        if (config === void 0) { config = null; }
        if (deepLinkConfig === void 0) { deepLinkConfig = null; }
        return {
            ngModule: IonicModule,
            providers: [
                // useValue: bootstrap values
                { provide: AppRootToken, useValue: appRoot },
                { provide: ConfigToken, useValue: config },
                { provide: DeepLinkConfigToken, useValue: deepLinkConfig },
                { provide: APP_BASE_HREF, useValue: '/' },
                // useFactory: user values
                { provide: PlatformConfigToken, useFactory: providePlatformConfigs },
                // useFactory: ionic core providers
                { provide: Platform, useFactory: setupPlatform, deps: [DOCUMENT, PlatformConfigToken, NgZone] },
                { provide: Config, useFactory: setupConfig, deps: [ConfigToken, Platform] },
                // useFactory: ionic app initializers
                { provide: APP_INITIALIZER, useFactory: registerModeConfigs, deps: [Config], multi: true },
                { provide: APP_INITIALIZER, useFactory: setupProvideEvents, deps: [Platform, DomController], multi: true },
                { provide: APP_INITIALIZER, useFactory: setupTapClick, deps: [Config, Platform, DomController, App, GestureController], multi: true },
                { provide: APP_INITIALIZER, useFactory: setupPreloading, deps: [Config, DeepLinkConfigToken, ModuleLoader, NgZone], multi: true },
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
                { provide: ModuleLoader, useFactory: provideModuleLoader, deps: [NgModuleLoader, Injector] },
                { provide: LocationStrategy, useFactory: provideLocationStrategy, deps: [PlatformLocation, [new Inject(APP_BASE_HREF), new Optional()], Config] },
                { provide: UrlSerializer, useFactory: setupUrlSerializer, deps: [App, DeepLinkConfigToken] },
                { provide: DeepLinker, useFactory: setupDeepLinker, deps: [App, UrlSerializer, Location, ModuleLoader, ComponentFactoryResolver] },
            ]
        };
    };
    return IonicModule;
}());
export { IonicModule };
IonicModule.decorators = [
    { type: NgModule, args: [{
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
                    SelectPopover,
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
                    SelectPopover,
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
                    SelectPopover,
                    ToastCmp
                ]
            },] },
];
/**
 * @nocollapse
 */
IonicModule.ctorParameters = function () { return []; };
function IonicModule_tsickle_Closure_declarations() {
    /** @type {?} */
    IonicModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    IonicModule.ctorParameters;
}
/**
 * \@name IonicPageModule
 * \@description
 * IonicPageModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that
 * bootstraps a child [IonicPage](../navigation/IonicPage/) in order to set up routing.
 *
 * \@usage
 * ```ts
 * import { NgModule } from '\@angular/core';
 *
 * import { IonicPageModule } from 'ionic-angular';
 *
 * import { HomePage } from './home';
 *
 * \@NgModule({
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
var IonicPageModule = (function () {
    function IonicPageModule() {
    }
    /**
     * @param {?} page
     * @return {?}
     */
    IonicPageModule.forChild = function (page) {
        return {
            ngModule: IonicPageModule,
            providers: [
                { provide: /** @type {?} */ (LAZY_LOADED_TOKEN), useValue: page },
                { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: page, multi: true },
            ]
        };
    };
    return IonicPageModule;
}());
export { IonicPageModule };
IonicPageModule.decorators = [
    { type: NgModule, args: [{
                imports: [IonicModule],
                exports: [IonicModule]
            },] },
];
/**
 * @nocollapse
 */
IonicPageModule.ctorParameters = function () { return []; };
function IonicPageModule_tsickle_Closure_declarations() {
    /** @type {?} */
    IonicPageModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    IonicPageModule.ctorParameters;
}
/**
 * @hidden
 * @param {?} platformLocationStrategy
 * @param {?} baseHref
 * @param {?} config
 * @return {?}
 */
export function provideLocationStrategy(platformLocationStrategy, baseHref, config) {
    return config.get('locationStrategy') === 'path' ?
        new PathLocationStrategy(platformLocationStrategy, baseHref) :
        new HashLocationStrategy(platformLocationStrategy, baseHref);
}
//# sourceMappingURL=module.js.map