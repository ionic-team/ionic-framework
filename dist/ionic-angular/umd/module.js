/**
 * Import Angular
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "@angular/common", "@angular/platform-browser", "@angular/forms", "@angular/common", "./components/app/app", "./components/app/app-root", "./config/config", "./navigation/deep-linker", "./platform/dom-controller", "./util/events", "./util/form", "./gestures/gesture-controller", "./gestures/gesture-config", "./tap-click/haptic", "./platform/keyboard", "./util/module-loader", "./util/ng-module-loader", "./platform/platform", "./platform/platform-registry", "./tap-click/tap-click", "./config/mode-registry", "./transitions/transition-controller", "./navigation/url-serializer", "./components/action-sheet/action-sheet-component", "./components/action-sheet/action-sheet-controller", "./components/alert/alert-component", "./components/alert/alert-controller", "./components/app/click-block", "./components/app/app-root", "./components/app/overlay-portal", "./components/avatar/avatar", "./components/backdrop/backdrop", "./components/badge/badge", "./components/button/button", "./components/card/card", "./components/card/card-content", "./components/card/card-header", "./components/card/card-title", "./components/checkbox/checkbox", "./components/chip/chip", "./components/content/content", "./components/datetime/datetime", "./components/fab/fab", "./components/fab/fab-container", "./components/fab/fab-list", "./components/grid/col", "./components/grid/grid", "./components/grid/row", "./components/icon/icon", "./components/img/img", "./components/infinite-scroll/infinite-scroll", "./components/infinite-scroll/infinite-scroll-content", "./components/input/input", "./components/item/item", "./components/item/item-content", "./components/item/item-divider", "./components/item/item-group", "./components/item/item-options", "./components/item/item-reorder", "./components/item/item-sliding", "./components/item/reorder", "./components/label/label", "./components/list/list", "./components/list/list-header", "./components/loading/loading-component", "./components/loading/loading-controller", "./components/menu/menu", "./components/menu/menu-close", "./components/app/menu-controller", "./components/menu/menu-toggle", "./components/modal/modal-component", "./components/modal/modal-controller", "./components/nav/nav", "./components/nav/nav-pop", "./components/nav/nav-pop-anchor", "./components/nav/nav-push", "./components/nav/nav-push-anchor", "./components/note/note", "./components/option/option", "./components/picker/picker-component", "./components/picker/picker-column", "./components/picker/picker-controller", "./components/popover/popover-component", "./components/popover/popover-controller", "./components/radio/radio-button", "./components/radio/radio-group", "./components/range/range", "./components/range/range-knob", "./components/refresher/refresher", "./components/refresher/refresher-content", "./components/scroll/scroll", "./components/searchbar/searchbar", "./components/segment/segment", "./components/select/select", "./components/select/select-popover-component", "./components/segment/segment-button", "./components/show-hide-when/show-when", "./components/show-hide-when/hide-when", "./components/slides/slide", "./components/slides/slides", "./components/spinner/spinner", "./components/split-pane/split-pane", "./components/tabs/tab", "./components/tabs/tab-button", "./components/tabs/tab-highlight", "./components/tabs/tabs", "./components/thumbnail/thumbnail", "./components/toast/toast-component", "./components/toast/toast-controller", "./components/toggle/toggle", "./components/toolbar/toolbar-footer", "./components/toolbar/toolbar-header", "./components/toolbar/toolbar", "./components/toolbar/toolbar-item", "./components/toolbar/toolbar-title", "./components/toolbar/navbar", "./components/typography/typography", "./components/virtual-scroll/virtual-footer", "./components/virtual-scroll/virtual-header", "./components/virtual-scroll/virtual-item", "./components/virtual-scroll/virtual-scroll"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var common_1 = require("@angular/common");
    var platform_browser_1 = require("@angular/platform-browser");
    var forms_1 = require("@angular/forms");
    var common_2 = require("@angular/common");
    /**
     * Global Providers
     */
    var app_1 = require("./components/app/app");
    var app_root_1 = require("./components/app/app-root");
    var config_1 = require("./config/config");
    var deep_linker_1 = require("./navigation/deep-linker");
    var dom_controller_1 = require("./platform/dom-controller");
    var events_1 = require("./util/events");
    var form_1 = require("./util/form");
    var gesture_controller_1 = require("./gestures/gesture-controller");
    var gesture_config_1 = require("./gestures/gesture-config");
    var haptic_1 = require("./tap-click/haptic");
    var keyboard_1 = require("./platform/keyboard");
    var module_loader_1 = require("./util/module-loader");
    var ng_module_loader_1 = require("./util/ng-module-loader");
    var platform_1 = require("./platform/platform");
    var platform_registry_1 = require("./platform/platform-registry");
    var tap_click_1 = require("./tap-click/tap-click");
    var mode_registry_1 = require("./config/mode-registry");
    var transition_controller_1 = require("./transitions/transition-controller");
    var url_serializer_1 = require("./navigation/url-serializer");
    /**
     * Import Components/Directives/Etc
     */
    var action_sheet_component_1 = require("./components/action-sheet/action-sheet-component");
    var action_sheet_controller_1 = require("./components/action-sheet/action-sheet-controller");
    var alert_component_1 = require("./components/alert/alert-component");
    var alert_controller_1 = require("./components/alert/alert-controller");
    var click_block_1 = require("./components/app/click-block");
    var app_root_2 = require("./components/app/app-root");
    var overlay_portal_1 = require("./components/app/overlay-portal");
    var avatar_1 = require("./components/avatar/avatar");
    var backdrop_1 = require("./components/backdrop/backdrop");
    var badge_1 = require("./components/badge/badge");
    var button_1 = require("./components/button/button");
    var card_1 = require("./components/card/card");
    var card_content_1 = require("./components/card/card-content");
    var card_header_1 = require("./components/card/card-header");
    var card_title_1 = require("./components/card/card-title");
    var checkbox_1 = require("./components/checkbox/checkbox");
    var chip_1 = require("./components/chip/chip");
    var content_1 = require("./components/content/content");
    var datetime_1 = require("./components/datetime/datetime");
    var fab_1 = require("./components/fab/fab");
    var fab_container_1 = require("./components/fab/fab-container");
    var fab_list_1 = require("./components/fab/fab-list");
    var col_1 = require("./components/grid/col");
    var grid_1 = require("./components/grid/grid");
    var row_1 = require("./components/grid/row");
    var icon_1 = require("./components/icon/icon");
    var img_1 = require("./components/img/img");
    var infinite_scroll_1 = require("./components/infinite-scroll/infinite-scroll");
    var infinite_scroll_content_1 = require("./components/infinite-scroll/infinite-scroll-content");
    var input_1 = require("./components/input/input");
    var item_1 = require("./components/item/item");
    var item_content_1 = require("./components/item/item-content");
    var item_divider_1 = require("./components/item/item-divider");
    var item_group_1 = require("./components/item/item-group");
    var item_options_1 = require("./components/item/item-options");
    var item_reorder_1 = require("./components/item/item-reorder");
    var item_sliding_1 = require("./components/item/item-sliding");
    var reorder_1 = require("./components/item/reorder");
    var label_1 = require("./components/label/label");
    var list_1 = require("./components/list/list");
    var list_header_1 = require("./components/list/list-header");
    var loading_component_1 = require("./components/loading/loading-component");
    var loading_controller_1 = require("./components/loading/loading-controller");
    var menu_1 = require("./components/menu/menu");
    var menu_close_1 = require("./components/menu/menu-close");
    var menu_controller_1 = require("./components/app/menu-controller");
    var menu_toggle_1 = require("./components/menu/menu-toggle");
    var modal_component_1 = require("./components/modal/modal-component");
    var modal_controller_1 = require("./components/modal/modal-controller");
    var nav_1 = require("./components/nav/nav");
    var nav_pop_1 = require("./components/nav/nav-pop");
    var nav_pop_anchor_1 = require("./components/nav/nav-pop-anchor");
    var nav_push_1 = require("./components/nav/nav-push");
    var nav_push_anchor_1 = require("./components/nav/nav-push-anchor");
    var note_1 = require("./components/note/note");
    var option_1 = require("./components/option/option");
    var picker_component_1 = require("./components/picker/picker-component");
    var picker_column_1 = require("./components/picker/picker-column");
    var picker_controller_1 = require("./components/picker/picker-controller");
    var popover_component_1 = require("./components/popover/popover-component");
    var popover_controller_1 = require("./components/popover/popover-controller");
    var radio_button_1 = require("./components/radio/radio-button");
    var radio_group_1 = require("./components/radio/radio-group");
    var range_1 = require("./components/range/range");
    var range_knob_1 = require("./components/range/range-knob");
    var refresher_1 = require("./components/refresher/refresher");
    var refresher_content_1 = require("./components/refresher/refresher-content");
    var scroll_1 = require("./components/scroll/scroll");
    var searchbar_1 = require("./components/searchbar/searchbar");
    var segment_1 = require("./components/segment/segment");
    var select_1 = require("./components/select/select");
    var select_popover_component_1 = require("./components/select/select-popover-component");
    var segment_button_1 = require("./components/segment/segment-button");
    var show_when_1 = require("./components/show-hide-when/show-when");
    var hide_when_1 = require("./components/show-hide-when/hide-when");
    var slide_1 = require("./components/slides/slide");
    var slides_1 = require("./components/slides/slides");
    var spinner_1 = require("./components/spinner/spinner");
    var split_pane_1 = require("./components/split-pane/split-pane");
    var tab_1 = require("./components/tabs/tab");
    var tab_button_1 = require("./components/tabs/tab-button");
    var tab_highlight_1 = require("./components/tabs/tab-highlight");
    var tabs_1 = require("./components/tabs/tabs");
    var thumbnail_1 = require("./components/thumbnail/thumbnail");
    var toast_component_1 = require("./components/toast/toast-component");
    var toast_controller_1 = require("./components/toast/toast-controller");
    var toggle_1 = require("./components/toggle/toggle");
    var toolbar_footer_1 = require("./components/toolbar/toolbar-footer");
    var toolbar_header_1 = require("./components/toolbar/toolbar-header");
    var toolbar_1 = require("./components/toolbar/toolbar");
    var toolbar_item_1 = require("./components/toolbar/toolbar-item");
    var toolbar_title_1 = require("./components/toolbar/toolbar-title");
    var navbar_1 = require("./components/toolbar/navbar");
    var typography_1 = require("./components/typography/typography");
    var virtual_footer_1 = require("./components/virtual-scroll/virtual-footer");
    var virtual_header_1 = require("./components/virtual-scroll/virtual-header");
    var virtual_item_1 = require("./components/virtual-scroll/virtual-item");
    var virtual_scroll_1 = require("./components/virtual-scroll/virtual-scroll");
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
                    { provide: app_root_1.AppRootToken, useValue: appRoot },
                    { provide: config_1.ConfigToken, useValue: config },
                    { provide: url_serializer_1.DeepLinkConfigToken, useValue: deepLinkConfig },
                    { provide: common_1.APP_BASE_HREF, useValue: '/' },
                    // useFactory: user values
                    { provide: platform_registry_1.PlatformConfigToken, useFactory: platform_registry_1.providePlatformConfigs },
                    // useFactory: ionic core providers
                    { provide: platform_1.Platform, useFactory: platform_1.setupPlatform, deps: [platform_browser_1.DOCUMENT, platform_registry_1.PlatformConfigToken, core_1.NgZone] },
                    { provide: config_1.Config, useFactory: config_1.setupConfig, deps: [config_1.ConfigToken, platform_1.Platform] },
                    // useFactory: ionic app initializers
                    { provide: core_1.APP_INITIALIZER, useFactory: mode_registry_1.registerModeConfigs, deps: [config_1.Config], multi: true },
                    { provide: core_1.APP_INITIALIZER, useFactory: events_1.setupProvideEvents, deps: [platform_1.Platform, dom_controller_1.DomController], multi: true },
                    { provide: core_1.APP_INITIALIZER, useFactory: tap_click_1.setupTapClick, deps: [config_1.Config, platform_1.Platform, dom_controller_1.DomController, app_1.App, gesture_controller_1.GestureController], multi: true },
                    { provide: core_1.APP_INITIALIZER, useFactory: module_loader_1.setupPreloading, deps: [config_1.Config, url_serializer_1.DeepLinkConfigToken, module_loader_1.ModuleLoader, core_1.NgZone], multi: true },
                    // useClass
                    { provide: platform_browser_1.HAMMER_GESTURE_CONFIG, useClass: gesture_config_1.IonicGestureConfig },
                    // useValue
                    { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, useValue: appRoot, multi: true },
                    // ionic providers
                    action_sheet_controller_1.ActionSheetController,
                    alert_controller_1.AlertController,
                    app_1.App,
                    dom_controller_1.DomController,
                    events_1.Events,
                    form_1.Form,
                    gesture_controller_1.GestureController,
                    haptic_1.Haptic,
                    keyboard_1.Keyboard,
                    loading_controller_1.LoadingController,
                    common_1.Location,
                    menu_controller_1.MenuController,
                    modal_controller_1.ModalController,
                    ng_module_loader_1.NgModuleLoader,
                    picker_controller_1.PickerController,
                    popover_controller_1.PopoverController,
                    tap_click_1.TapClick,
                    toast_controller_1.ToastController,
                    transition_controller_1.TransitionController,
                    { provide: module_loader_1.ModuleLoader, useFactory: module_loader_1.provideModuleLoader, deps: [ng_module_loader_1.NgModuleLoader, core_1.Injector] },
                    { provide: common_1.LocationStrategy, useFactory: provideLocationStrategy, deps: [common_1.PlatformLocation, [new core_1.Inject(common_1.APP_BASE_HREF), new core_1.Optional()], config_1.Config] },
                    { provide: url_serializer_1.UrlSerializer, useFactory: url_serializer_1.setupUrlSerializer, deps: [app_1.App, url_serializer_1.DeepLinkConfigToken] },
                    { provide: deep_linker_1.DeepLinker, useFactory: deep_linker_1.setupDeepLinker, deps: [app_1.App, url_serializer_1.UrlSerializer, common_1.Location, module_loader_1.ModuleLoader, core_1.ComponentFactoryResolver] },
                ]
            };
        };
        return IonicModule;
    }());
    IonicModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        action_sheet_component_1.ActionSheetCmp,
                        alert_component_1.AlertCmp,
                        click_block_1.ClickBlock,
                        app_root_2.IonicApp,
                        overlay_portal_1.OverlayPortal,
                        avatar_1.Avatar,
                        backdrop_1.Backdrop,
                        badge_1.Badge,
                        button_1.Button,
                        card_1.Card,
                        card_content_1.CardContent,
                        card_header_1.CardHeader,
                        card_title_1.CardTitle,
                        checkbox_1.Checkbox,
                        chip_1.Chip,
                        col_1.Col,
                        content_1.Content,
                        datetime_1.DateTime,
                        fab_1.FabButton,
                        fab_container_1.FabContainer,
                        fab_list_1.FabList,
                        grid_1.Grid,
                        img_1.Img,
                        icon_1.Icon,
                        infinite_scroll_1.InfiniteScroll,
                        infinite_scroll_content_1.InfiniteScrollContent,
                        item_1.Item,
                        item_content_1.ItemContent,
                        item_divider_1.ItemDivider,
                        item_group_1.ItemGroup,
                        item_options_1.ItemOptions,
                        item_reorder_1.ItemReorder,
                        item_sliding_1.ItemSliding,
                        label_1.Label,
                        list_1.List,
                        list_header_1.ListHeader,
                        reorder_1.Reorder,
                        loading_component_1.LoadingCmp,
                        menu_1.Menu,
                        menu_close_1.MenuClose,
                        menu_toggle_1.MenuToggle,
                        modal_component_1.ModalCmp,
                        nav_1.Nav,
                        nav_pop_1.NavPop,
                        nav_pop_anchor_1.NavPopAnchor,
                        nav_push_1.NavPush,
                        nav_push_anchor_1.NavPushAnchor,
                        note_1.Note,
                        option_1.Option,
                        picker_component_1.PickerCmp,
                        picker_column_1.PickerColumnCmp,
                        popover_component_1.PopoverCmp,
                        radio_button_1.RadioButton,
                        radio_group_1.RadioGroup,
                        range_1.Range,
                        range_knob_1.RangeKnob,
                        refresher_1.Refresher,
                        refresher_content_1.RefresherContent,
                        row_1.Row,
                        scroll_1.Scroll,
                        searchbar_1.Searchbar,
                        segment_1.Segment,
                        segment_button_1.SegmentButton,
                        select_1.Select,
                        select_popover_component_1.SelectPopover,
                        show_when_1.ShowWhen,
                        hide_when_1.HideWhen,
                        slide_1.Slide,
                        slides_1.Slides,
                        spinner_1.Spinner,
                        split_pane_1.SplitPane,
                        tab_1.Tab,
                        tab_button_1.TabButton,
                        tab_highlight_1.TabHighlight,
                        tabs_1.Tabs,
                        input_1.TextInput,
                        thumbnail_1.Thumbnail,
                        toast_component_1.ToastCmp,
                        toggle_1.Toggle,
                        toolbar_footer_1.Footer,
                        toolbar_header_1.Header,
                        toolbar_1.Toolbar,
                        toolbar_item_1.ToolbarItem,
                        toolbar_title_1.ToolbarTitle,
                        navbar_1.Navbar,
                        typography_1.Typography,
                        virtual_footer_1.VirtualFooter,
                        virtual_header_1.VirtualHeader,
                        virtual_item_1.VirtualItem,
                        virtual_scroll_1.VirtualScroll
                    ],
                    imports: [
                        common_2.CommonModule,
                        forms_1.FormsModule,
                        forms_1.ReactiveFormsModule,
                    ],
                    exports: [
                        common_2.CommonModule,
                        forms_1.FormsModule,
                        forms_1.ReactiveFormsModule,
                        action_sheet_component_1.ActionSheetCmp,
                        alert_component_1.AlertCmp,
                        click_block_1.ClickBlock,
                        app_root_2.IonicApp,
                        overlay_portal_1.OverlayPortal,
                        avatar_1.Avatar,
                        backdrop_1.Backdrop,
                        badge_1.Badge,
                        button_1.Button,
                        card_1.Card,
                        card_content_1.CardContent,
                        card_header_1.CardHeader,
                        card_title_1.CardTitle,
                        checkbox_1.Checkbox,
                        chip_1.Chip,
                        col_1.Col,
                        content_1.Content,
                        datetime_1.DateTime,
                        fab_1.FabButton,
                        fab_container_1.FabContainer,
                        fab_list_1.FabList,
                        grid_1.Grid,
                        img_1.Img,
                        icon_1.Icon,
                        infinite_scroll_1.InfiniteScroll,
                        infinite_scroll_content_1.InfiniteScrollContent,
                        item_1.Item,
                        item_content_1.ItemContent,
                        item_divider_1.ItemDivider,
                        item_group_1.ItemGroup,
                        item_options_1.ItemOptions,
                        item_reorder_1.ItemReorder,
                        item_sliding_1.ItemSliding,
                        label_1.Label,
                        list_1.List,
                        list_header_1.ListHeader,
                        reorder_1.Reorder,
                        loading_component_1.LoadingCmp,
                        menu_1.Menu,
                        menu_close_1.MenuClose,
                        menu_toggle_1.MenuToggle,
                        modal_component_1.ModalCmp,
                        nav_1.Nav,
                        nav_pop_1.NavPop,
                        nav_pop_anchor_1.NavPopAnchor,
                        nav_push_1.NavPush,
                        nav_push_anchor_1.NavPushAnchor,
                        note_1.Note,
                        option_1.Option,
                        picker_component_1.PickerCmp,
                        picker_column_1.PickerColumnCmp,
                        popover_component_1.PopoverCmp,
                        radio_button_1.RadioButton,
                        radio_group_1.RadioGroup,
                        range_1.Range,
                        range_knob_1.RangeKnob,
                        refresher_1.Refresher,
                        refresher_content_1.RefresherContent,
                        row_1.Row,
                        scroll_1.Scroll,
                        searchbar_1.Searchbar,
                        segment_1.Segment,
                        segment_button_1.SegmentButton,
                        select_1.Select,
                        select_popover_component_1.SelectPopover,
                        show_when_1.ShowWhen,
                        hide_when_1.HideWhen,
                        slide_1.Slide,
                        slides_1.Slides,
                        spinner_1.Spinner,
                        split_pane_1.SplitPane,
                        tab_1.Tab,
                        tab_button_1.TabButton,
                        tab_highlight_1.TabHighlight,
                        tabs_1.Tabs,
                        input_1.TextInput,
                        thumbnail_1.Thumbnail,
                        toast_component_1.ToastCmp,
                        toggle_1.Toggle,
                        toolbar_footer_1.Footer,
                        toolbar_header_1.Header,
                        toolbar_1.Toolbar,
                        toolbar_item_1.ToolbarItem,
                        toolbar_title_1.ToolbarTitle,
                        navbar_1.Navbar,
                        typography_1.Typography,
                        virtual_footer_1.VirtualFooter,
                        virtual_header_1.VirtualHeader,
                        virtual_item_1.VirtualItem,
                        virtual_scroll_1.VirtualScroll
                    ],
                    entryComponents: [
                        action_sheet_component_1.ActionSheetCmp,
                        alert_component_1.AlertCmp,
                        app_root_2.IonicApp,
                        loading_component_1.LoadingCmp,
                        modal_component_1.ModalCmp,
                        picker_component_1.PickerCmp,
                        popover_component_1.PopoverCmp,
                        select_popover_component_1.SelectPopover,
                        toast_component_1.ToastCmp
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    IonicModule.ctorParameters = function () { return []; };
    exports.IonicModule = IonicModule;
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
                    { provide: /** @type {?} */ (module_loader_1.LAZY_LOADED_TOKEN), useValue: page },
                    { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, useValue: page, multi: true },
                ]
            };
        };
        return IonicPageModule;
    }());
    IonicPageModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [IonicModule],
                    exports: [IonicModule]
                },] },
    ];
    /**
     * @nocollapse
     */
    IonicPageModule.ctorParameters = function () { return []; };
    exports.IonicPageModule = IonicPageModule;
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
    function provideLocationStrategy(platformLocationStrategy, baseHref, config) {
        return config.get('locationStrategy') === 'path' ?
            new common_1.PathLocationStrategy(platformLocationStrategy, baseHref) :
            new common_1.HashLocationStrategy(platformLocationStrategy, baseHref);
    }
    exports.provideLocationStrategy = provideLocationStrategy;
});
//# sourceMappingURL=module.js.map