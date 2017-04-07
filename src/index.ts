

/**
 * Import Angular
 */
import { ANALYZE_FOR_ENTRY_COMPONENTS, APP_INITIALIZER, ComponentFactoryResolver, Inject, Injector, ModuleWithProviders, NgModule, NgZone, Optional } from '@angular/core';
import { APP_BASE_HREF, Location, LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Import Other
 */
import { DeepLinkConfig } from './navigation/nav-util';

/**
 * Import Providers
 */

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
import { ModuleLoader, provideModuleLoader, setupPreloading, LAZY_LOADED_TOKEN } from './util/module-loader';
import { NgModuleLoader } from './util/ng-module-loader';
import { Platform, setupPlatform } from './platform/platform';
import { PlatformConfigToken, providePlatformConfigs } from './platform/platform-registry';
import { TapClick, setupTapClick } from './tap-click/tap-click';
import { registerModeConfigs } from './config/mode-registry';
import { TransitionController } from './transitions/transition-controller';
import { UrlSerializer, setupUrlSerializer, DeepLinkConfigToken } from './navigation/url-serializer';

import { MenuController } from './components/menu/menu-controller';


/**
 * Import Modules
 */
import { AppModule } from './components/app/app.module';

//import { AvatarModule } from './components/avatar/avatar.module';
//import { BackdropModule } from './components/backdrop/backdrop.module';
//import { BadgeModule } from './components/badge/badge.module';
//import { ButtonModule } from './components/button/button.module';
//import { CardModule } from './components/card/card.module';
//import { CheckboxModule } from './components/checkbox/checkbox.module';
//import { ChipModule } from './components/chip/chip.module';
//import { ClickBlockModule } from './components/click-block/click-block.module';
//import { ContentModule } from './components/content/content.module';
//import { FabModule } from './components/fab/fab.module';
//import { GridModule } from './components/grid/grid.module';
//import { IconModule } from './components/icon/icon.module';
//import { ImgModule } from './components/img/img.module';
//import { InfiniteScrollModule } from './components/infinite-scroll/infinite-scroll.module';
//import { InputModule } from './components/input/input.module';
//import { ItemModule } from './components/item/item.module';
//import { LabelModule } from './components/label/label.module';
//import { ListModule } from './components/list/list.module';
//import { NavModule } from './components/nav/nav.module';
//import { NavbarModule } from './components/navbar/navbar.module';
//import { NoteModule } from './components/note/note.module';
//import { OptionModule } from './components/option/option.module';
//import { RadioModule } from './components/radio/radio.module';
//import { RangeModule } from './components/range/range.module';
//import { RefresherModule } from './components/refresher/refresher.module';
//import { ScrollModule } from './components/scroll/scroll.module';
//import { SearchbarModule } from './components/searchbar/searchbar.module';
//import { SegmentModule } from './components/segment/segment.module';
//import { ShowHideWhenModule } from './components/show-hide-when/show-hide-when.module';
//import { SlidesModule } from './components/slides/slides.module';
//import { SpinnerModule } from './components/spinner/spinner.module';
//import { SplitPaneModule } from './components/split-pane/split-pane.module';
//import { TabsModule } from './components/tabs/tabs.module';
//import { ThumbnailModule } from './components/thumbnail/thumbnail.module';
//import { ToggleModule } from './components/toggle/toggle.module';
//import { ToolbarModule } from './components/toolbar/toolbar.module';
//import { TypographyModule } from './components/typography/typography.module';
//import { VirtualScrollModule } from './components/virtual-scroll/virtual-scroll.module';


/**
 * Export Modules
 */
export { AppModule } from './components/app/app.module';

//export { AvatarModule } from './components/avatar/avatar.module';
//export { BackdropModule } from './components/backdrop/backdrop.module';
//export { BadgeModule } from './components/badge/badge.module';
//export { ButtonModule } from './components/button/button.module';
//export { CardModule } from './components/card/card.module';
//export { CheckboxModule } from './components/checkbox/checkbox.module';
//export { ChipModule } from './components/chip/chip.module';
//export { ClickBlockModule } from './components/click-block/click-block.module';
//export { ContentModule } from './components/content/content.module';
//export { FabModule } from './components/fab/fab.module';
//export { GridModule } from './components/grid/grid.module';
//export { IconModule } from './components/icon/icon.module';
//export { ImgModule } from './components/img/img.module';
//export { InfiniteScrollModule } from './components/infinite-scroll/infinite-scroll.module';
//export { InputModule } from './components/input/input.module';
//export { ItemModule } from './components/item/item.module';
//export { LabelModule } from './components/label/label.module';
//export { ListModule } from './components/list/list.module';

//export { NavModule } from './components/nav/nav.module';
//export { NavbarModule } from './components/navbar/navbar.module';
//export { NoteModule } from './components/note/note.module';
//export { OptionModule } from './components/option/option.module';
//export { RadioModule } from './components/radio/radio.module';
//export { RangeModule } from './components/range/range.module';
//export { RefresherModule } from './components/refresher/refresher.module';
//export { ScrollModule } from './components/scroll/scroll.module';
//export { SearchbarModule } from './components/searchbar/searchbar.module';
//export { SegmentModule } from './components/segment/segment.module';
//export { ShowHideWhenModule } from './components/show-hide-when/show-hide-when.module';
//export { SlidesModule } from './components/slides/slides.module';
//export { SpinnerModule } from './components/spinner/spinner.module';
//export { SplitPaneModule } from './components/split-pane/split-pane.module';
//export { TabsModule } from './components/tabs/tabs.module';
//export { ThumbnailModule } from './components/thumbnail/thumbnail.module';
//export { ToggleModule } from './components/toggle/toggle.module';
//export { ToolbarModule } from './components/toolbar/toolbar.module';
//export { TypographyModule } from './components/typography/typography.module';
//export { VirtualScrollModule } from './components/virtual-scroll/virtual-scroll.module';

/**
 * Export Components/Directives
 */

export { IonicApp } from './components/app/app-root';
export { App } from './components/app/app';
//export { Avatar } from './components/avatar/avatar';
//export { Backdrop } from './components/backdrop/backdrop';
//export { Badge } from './components/badge/badge';
//export { Button } from './components/button/button';
//export { Card } from './components/card/card';
//export { CardContent } from './components/card/card-content';
//export { CardHeader } from './components/card/card-header';
//export { CardTitle } from './components/card/card-title';
//export { Checkbox } from './components/checkbox/checkbox';
//export { Chip } from './components/chip/chip';
//export { ClickBlock } from './components/click-block/click-block';
//export { Content, ScrollEvent } from './components/content/content';
//export { FabButton } from './components/fab/fab';
//export { FabContainer } from './components/fab/fab-container';
//export { FabList } from './components/fab/fab-list';
//export { Col } from './components/grid/col';
//export { Grid } from './components/grid/grid';
//export { Row } from './components/grid/row';
//export { Ion } from './components/ion';
//export { Icon } from './components/icon/icon';
//export { Img } from './components/img/img';
//export { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
//export { InfiniteScrollContent } from './components/infinite-scroll/infinite-scroll-content';
//export { TextInput } from './components/input/input';


//export { Item } from './components/item/item';
//export { ItemContent } from './components/item/item-content';
//export { ItemDivider } from './components/item/item-divider';
//export { ItemGroup } from './components/item/item-group';
//export { ItemReorder } from './components/item/item-reorder';
//export { Reorder } from './components/item/reorder';
//export { ItemSliding } from './components/item/item-sliding';
//export { ItemOptions } from './components/item/item-options';
//export { Label } from './components/label/label';
//export { List } from './components/list/list';
//export { ListHeader } from './components/list/list-header';
//export { Nav } from './components/nav/nav';
//export { NavPop } from './components/nav/nav-pop';
//export { NavPopAnchor } from './components/nav/nav-pop-anchor';
//export { NavPush } from './components/nav/nav-push';
//export { NavPushAnchor } from './components/nav/nav-push-anchor';
//export { Navbar } from './components/navbar/navbar';
//export { NativeInput } from './components/input/native-input';
//export { NextInput } from './components/input/next-input';
//export { Note } from './components/note/note';
//export { Option } from './components/option/option';
//export { RadioButton } from './components/radio/radio-button';
//export { RadioGroup } from './components/radio/radio-group';
//export { Range } from './components/range/range';
//export { RangeKnob } from './components/range/range-knob';
//export { Refresher } from './components/refresher/refresher';
//export { RefresherContent } from './components/refresher/refresher-content';
//export { Scroll } from './components/scroll/scroll';
//export { Searchbar } from './components/searchbar/searchbar';
//export { Segment } from './components/segment/segment';
//export { SegmentButton } from './components/segment/segment-button';
//export { ShowWhen } from './components/show-hide-when/show-when';
//export { DisplayWhen } from './components/show-hide-when/display-when';
//export { HideWhen } from './components/show-hide-when/hide-when';
//export { Slide } from './components/slides/slide';
//export { Slides } from './components/slides/slides';
//export { Spinner } from './components/spinner/spinner';
//export { SplitPane, RootNode } from './components/split-pane/split-pane';
//export { Tab } from './components/tabs/tab';
//export { TabButton } from './components/tabs/tab-button';
//export { TabHighlight } from './components/tabs/tab-highlight';
//export { Tabs } from './components/tabs/tabs';
//export { Toggle } from './components/toggle/toggle';
//export { ToolbarBase } from './components/toolbar/toolbar-base';
//export { Toolbar } from './components/toolbar/toolbar';
//export { Header } from './components/toolbar/toolbar-header';
//export { Footer } from './components/toolbar/toolbar-footer';
//export { ToolbarItem } from './components/toolbar/toolbar-item';
//export { ToolbarTitle } from'./components/toolbar/toolbar-title';
//export { Thumbnail } from './components/thumbnail/thumbnail';
//export { Typography } from './components/typography/typography';
//export { VirtualScroll } from './components/virtual-scroll/virtual-scroll';


/**
 * Export Providers
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
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AppModule.forRoot(),

    //AvatarModule.forRoot(),
    //BackdropModule.forRoot(),
    //BadgeModule.forRoot(),
    //ButtonModule.forRoot(),
    //CardModule.forRoot(),
    //CheckboxModule.forRoot(),
    //ChipModule.forRoot(),
    //ClickBlockModule.forRoot(),
    //ContentModule.forRoot(),
    //FabModule.forRoot(),
    //GridModule.forRoot(),
    //IconModule.forRoot(),
    //ImgModule.forRoot(),
    //InfiniteScrollModule.forRoot(),
    //InputModule.forRoot(),
    //ItemModule.forRoot(),
    //LabelModule.forRoot(),
    //ListModule.forRoot(),
    //NavbarModule.forRoot(),
    //NoteModule.forRoot(),
    //OptionModule.forRoot(),
    //RadioModule.forRoot(),
    //RangeModule.forRoot(),
    //RefresherModule.forRoot(),
    //ScrollModule.forRoot(),
    //SearchbarModule.forRoot(),
    //SegmentModule.forRoot(),
    //ShowHideWhenModule.forRoot(),
    //SlidesModule.forRoot(),
    //SpinnerModule.forRoot(),
    //TabsModule.forRoot(),
    //ThumbnailModule.forRoot(),
    //ToggleModule.forRoot(),
    //ToolbarModule.forRoot(),
    //TypographyModule.forRoot(),
    //VirtualScrollModule.forRoot()

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AppModule,
    //AvatarModule,
    //BackdropModule,
    //BadgeModule,
    //ButtonModule,
    //CardModule,
    //CheckboxModule,
    //ChipModule,
    //ClickBlockModule,
    //ContentModule,
    //FabModule,
    //GridModule,
    //IconModule,
    //ImgModule,
    //InfiniteScrollModule,
    //InputModule,
    //ItemModule,
    //LabelModule,
    //ListModule,
    //NavbarModule,
    //NoteModule,
    //OptionModule,
    //RadioModule,
    //RangeModule,
    //RefresherModule,
    //ScrollModule,
    //SearchbarModule,
    //SegmentModule,
    //ShowHideWhenModule,
    //SlidesModule,
    //SpinnerModule,
    //TabsModule,
    //ThumbnailModule,
    //ToggleModule,
    //ToolbarModule,
    //TypographyModule,
    //VirtualScrollModule
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
        // { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },

        // useValue
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: appRoot, multi: true },

        // ionic providers
        App,
        DomController,
        Events,
        Form,
        GestureController,
        Haptic,
        Keyboard,
        Location,
        NgModuleLoader,
        TapClick,
        TransitionController,
        MenuController,

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
