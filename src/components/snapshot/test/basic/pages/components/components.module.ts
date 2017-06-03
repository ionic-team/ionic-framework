import {NgModule} from '@angular/core';
import {IonicPageModule} from '../../../../../../';

import {ComponentsPage} from './components';

import {AppModule as ActionSheetBasic} from '../../../../../action-sheet/test/basic/app/app.module';

import {AppModule as AlertBasic} from '../../../../../alert/test/basic/app/app.module';
import {AppModule as AlertDismiss} from '../../../../../alert/test/dismiss/app.module';

import {AppModule as AppAnimations} from '../../../../../app/test/animations/app.module';
import {AppModule as AppCordova} from '../../../../../app/test/cordova/app/app.module';
import {AppModule as AppGestureCollision} from '../../../../../app/test/gesture-collision/app/app.module';
import {AppModule as AppGestures} from '../../../../../app/test/gestures/app.module';
import {AppModule as AppTypography} from '../../../../../app/test/typography/app/app.module';
import {AppModule as AppUtilities} from '../../../../../app/test/utilities/app/app.module';

import {AppModule as BadgeBasic} from '../../../../../badge/test/basic/app/app.module';

import {AppModule as ButtonAnchors} from '../../../../../button/test/anchors/app/app.module';
import {AppModule as ButtonAttributes} from '../../../../../button/test/attributes/app/app.module';
import {AppModule as ButtonBasic} from '../../../../../button/test/basic/app/app.module';
import {AppModule as ButtonBlock} from '../../../../../button/test/block/app/app.module';
import {AppModule as ButtonClear} from '../../../../../button/test/clear/app/app.module';
import {AppModule as ButtonDecorator} from '../../../../../button/test/decorator/app/app.module';
import {AppModule as ButtonDynamic} from '../../../../../button/test/dynamic/app/app.module';
import {AppModule as ButtonFull} from '../../../../../button/test/full/app/app.module';
import {AppModule as ButtonIcons} from '../../../../../button/test/icons/app/app.module';
import {AppModule as ButtonOutline} from '../../../../../button/test/outline/app/app.module';
import {AppModule as ButtonRaised} from '../../../../../button/test/raised/app.module';
import {AppModule as ButtonRound} from '../../../../../button/test/round/app/app.module';
import {AppModule as ButtonSizes} from '../../../../../button/test/sizes/app/app.module';

import {AppModule as CardAdvanced} from '../../../../../card/test/advanced/app/app.module';
import {AppModule as CardBasic} from '../../../../../card/test/basic/app/app.module';
import {AppModule as CardColors} from '../../../../../card/test/colors/app/app.module';
import {AppModule as CardImages} from '../../../../../card/test/images/app/app.module';
import {AppModule as CardList} from '../../../../../card/test/list/app/app.module';
import {AppModule as CardMap} from '../../../../../card/test/map/app.module';
import {AppModule as CardSocial} from '../../../../../card/test/social/app.module';

import {AppModule as CheckboxBasic} from '../../../../../checkbox/test/basic/app/app.module';

import {AppModule as ChipBasic} from '../../../../../chip/test/basic/app/app.module';

import {AppModule as ContentBasic} from '../../../../../content/test/basic/app/app.module';
import {AppModule as ContentFullscreen} from '../../../../../content/test/fullscreen/app/app.module';
import {AppModule as ContentHeaderScroll} from '../../../../../content/test/header-scroll/app.module';
import {AppModule as ContentNoBounce} from '../../../../../content/test/no-bounce/app/app.module';
import {AppModule as ContentScrollDownOnLoad} from '../../../../../content/test/scroll-down-on-load/app/app.module';

import {AppModule as DatetimeBasic} from '../../../../../datetime/test/basic/app/app.module';
import {AppModule as DatetimeForm} from '../../../../../datetime/test/form/app.module';
import {AppModule as DatetimeIssues} from '../../../../../datetime/test/issues/app/app.module';
import {AppModule as DatetimeLabels} from '../../../../../datetime/test/labels/app/app.module';

import {AppModule as FabBasic} from '../../../../../fab/test/basic/app/app.module';

import {AppModule as GridAlignment} from '../../../../../grid/test/alignment/app.module';
import {AppModule as GridBasic} from '../../../../../grid/test/basic/app/app.module';
import {AppModule as GridCard} from '../../../../../grid/test/card/app.module';
import {AppModule as GridFull} from '../../../../../grid/test/full/app.module';
import {AppModule as GridResponsive} from '../../../../../grid/test/responsive/app.module';

import {AppModule as IconBasic} from '../../../../../icon/test/basic/app/app.module';

import {AppModule as ImgBasic} from '../../../../../img/test/basic/app/app.module';
import {AppModule as ImgCards} from '../../../../../img/test/cards/app.module';
import {AppModule as ImgLazyLoad} from '../../../../../img/test/lazy-load/app.module';
import {AppModule as ImgList} from '../../../../../img/test/list/app.module';

import {AppModule as InfiniteScrollBasic} from '../../../../../infinite-scroll/test/basic/app.module';
import {AppModule as InfiniteScrollPositionTop} from '../../../../../infinite-scroll/test/position-top/app/app.module';
import {AppModule as InfiniteScrollShortList} from '../../../../../infinite-scroll/test/short-list/app.module';

import {AppModule as InputBasicForm} from '../../../../../input/test/basic-form/app/app.module';
import {AppModule as InputClearAfterEdit} from '../../../../../input/test/clear-after-edit/app/app.module';
import {AppModule as InputClearInput} from '../../../../../input/test/clear-input/app/app.module';
import {AppModule as InputEvents} from '../../../../../input/test/events/app/app.module';
import {AppModule as InputFixedInlineLabels} from '../../../../../input/test/fixed-inline-labels/app/app.module';
import {AppModule as InputFloatingLabels} from '../../../../../input/test/floating-labels/app/app.module';
import {AppModule as InputFooterInputs} from '../../../../../input/test/footer-inputs/app/app.module';
import {AppModule as InputFormInputs} from '../../../../../input/test/form-inputs/app/app.module';
import {AppModule as InputHighlight} from '../../../../../input/test/highlight/app/app.module';
import {AppModule as InputInlineLabels} from '../../../../../input/test/inline-labels/app/app.module';
import {AppModule as InputInputFocus} from '../../../../../input/test/input-focus/app/app.module';
import {AppModule as InputInsetInputs} from '../../../../../input/test/inset-inputs/app/app.module';
import {AppModule as InputPlaceholderLabels} from '../../../../../input/test/placeholder-labels/app/app.module';
import {AppModule as InputStackedLabels} from '../../../../../input/test/stacked-labels/app/app.module';

import {AppModule as ItemButtons} from '../../../../../item/test/buttons/app/app.module';
import {AppModule as ItemColors} from '../../../../../item/test/colors/app/app.module';
import {AppModule as ItemDividers} from '../../../../../item/test/dividers/app/app.module';
import {AppModule as ItemGroups} from '../../../../../item/test/groups/app/app.module';
import {AppModule as ItemIcons} from '../../../../../item/test/icons/app/app.module';
import {AppModule as ItemImages} from '../../../../../item/test/images/app/app.module';
import {AppModule as ItemInputs} from '../../../../../item/test/inputs/app/app.module';
import {AppModule as ItemMedia} from '../../../../../item/test/media/app/app.module';
import {AppModule as ItemReorder} from '../../../../../item/test/reorder/app/app.module';
import {AppModule as ItemSliding} from '../../../../../item/test/sliding/app/app.module';
import {AppModule as ItemText} from '../../../../../item/test/text/app/app.module';

import {AppModule as ListChatList} from '../../../../../list/test/chat-list/app.module';
import {AppModule as ListHeaderScenarios} from '../../../../../list/test/header-scenarios/app/app.module';
import {AppModule as ListHeaders} from '../../../../../list/test/headers/app/app.module';
import {AppModule as ListInset} from '../../../../../list/test/inset/app/app.module';
import {AppModule as ListNoLines} from '../../../../../list/test/no-lines/app/app.module';
import {AppModule as ListRepeatHeaders} from '../../../../../list/test/repeat-headers/app.module';
import {AppModule as ListSticky} from '../../../../../list/test/sticky/app.module';

import {AppModule as LoadingBasic} from '../../../../../loading/test/basic/app/app.module';
import {AppModule as LoadingTabs} from '../../../../../tabs/test/basic/app/app.module';

import {AppModule as MenuBasic} from '../../../../../menu/test/basic/app/app.module';
// import {AppModule as MenuDisableSwipe} from '../../../../../menu/test/disable-swipe/app.module'; TODO
// import {AppModule as MenuEnableDisable} from '../../../../../menu/test/enable-disable/app.module'; TODO
import {AppModule as MenuMultiple} from '../../../../../menu/test/multiple/app/app.module';
import {AppModule as MenuOverlay} from '../../../../../menu/test/overlay/app.module';
import {AppModule as MenuPush} from '../../../../../menu/test/push/app.module';
import {AppModule as MenuReveal} from '../../../../../menu/test/reveal/app.module';

import {AppModule as ModalBasic} from '../../../../../modal/test/basic/app/app.module';

import {AppModule as NavBasic} from '../../../../../nav/test/basic/app/app.module';
import {AppModule as NavChildNavs} from '../../../../../nav/test/child-navs/app/app.module';
import {AppModule as NavInitAsync} from '../../../../../nav/test/init-async/app.module';
import {AppModule as NavInsertViews} from '../../../../../nav/test/insert-views/app.module';
import {AppModule as NavMemory} from '../../../../../nav/test/memory/app.module';
import {AppModule as NavNavPushPop} from '../../../../../nav/test/nav-push-pop/app.module';
import {AppModule as NavWorstCase} from '../../../../../nav/test/worst-case/app.module';

import {AppModule as PickerBasic} from '../../../../../picker/test/basic/app/app.module';

import {AppModule as PopoverBasic} from '../../../../../popover/test/basic/app/app.module';

import {AppModule as RadioBasic} from '../../../../../radio/test/basic/app/app.module';

import {AppModule as RangeBasic} from '../../../../../range/test/basic/app/app.module';

import {AppModule as RefresherBasic} from '../../../../../refresher/test/basic/app.module';
// import {AppModule as RefresherNavigation} from '../../../../../refresher/test/navigation/app.module'; TODO

import {AppModule as ScrollBasic} from '../../../../../scroll/test/basic/app.module';

import {AppModule as SearchbarBasic} from '../../../../../searchbar/test/basic/app/app.module';
import {AppModule as SearchbarNav} from '../../../../../searchbar/test/nav/app/app.module';
import {AppModule as SearchbarToolbar} from '../../../../../searchbar/test/toolbar/app/app.module';

import {AppModule as SegmentBasic} from '../../../../../segment/test/basic/app/app.module';
import {AppModule as SegmentNav} from '../../../../../segment/test/nav/app/app.module';
import {AppModule as SegmentSwipe} from '../../../../../segment/test/swipe/app/app.module';

import {AppModule as SelectMultipleValue} from '../../../../../select/test/multiple-value/app/app.module';
import {AppModule as SelectSingleValue} from '../../../../../select/test/single-value/app/app.module';

import {AppModule as ShowHideWhenBasic} from '../../../../../show-hide-when/test/basic/app.module';

import {AppModule as SlidesBasic} from '../../../../../slides/test/basic/app.module';
import {AppModule as SlidesControl} from '../../../../../slides/test/control/app.module';
import {AppModule as SlidesController} from '../../../../../slides/test/controller/app.module';
import {AppModule as SlidesImages} from '../../../../../slides/test/images/app.module';
import {AppModule as SlidesIntro} from '../../../../../slides/test/intro/app.module';
import {AppModule as SlidesLoop} from '../../../../../slides/test/loop/app.module';
import {AppModule as SlidesOptions} from '../../../../../slides/test/options/app.module';
import {AppModule as SlidesRTL} from '../../../../../slides/test/rtl/app.module';
import {AppModule as SlidesScroll} from '../../../../../slides/test/scroll/app.module';

import {AppModule as SpinnerBasic} from '../../../../../spinner/test/basic/app.module';
import {AppModule as SpinnerColors} from '../../../../../spinner/test/colors/app.module';

import {AppModule as SplitPaneBasic} from '../../../../../split-pane/test/basic/app/app.module';
import {AppModule as SplitPaneMenus} from '../../../../../split-pane/test/menus/app/app.module';
import {AppModule as SplitPaneNested} from '../../../../../split-pane/test/nested/app/app.module';
import {AppModule as SplitPaneTabs} from '../../../../../split-pane/test/tabs/app/app.module';

import {AppModule as TabsAdvanced} from '../../../../../tabs/test/advanced/app/app.module';
import {AppModule as TabsBadges} from '../../../../../tabs/test/badges/app/app.module';
import {AppModule as TabsBasic} from '../../../../../tabs/test/basic/app/app.module';
import {AppModule as TabsColors} from '../../../../../tabs/test/colors/app/app.module';
import {AppModule as TabsEvents} from '../../../../../tabs/test/events/app.module';
import {AppModule as TabsGhost} from '../../../../../tabs/test/ghost/app.module';
import {AppModule as TabsLifecycle} from '../../../../../tabs/test/lifecyles/app.module';
import {AppModule as TabsTabBarScenarios} from '../../../../../tabs/test/tab-bar-scenarios/app/app.module';
import {AppModule as TabsTop} from '../../../../../tabs/test/top/app.module';

import {AppModule as ToastBasic} from '../../../../../toast/test/basic/app/app.module';

import {AppModule as ToggleBasic} from '../../../../../toggle/test/basic/app/app.module';

import {AppModule as ToolbarBasic} from '../../../../../toolbar/test/basic/app/app.module';
import {AppModule as ToolbarColors} from '../../../../../toolbar/test/colors/app/app.module';
import {AppModule as ToolbarScenarios} from '../../../../../toolbar/test/scenarios/app/app.module';

import {AppModule as TypographyBasic} from '../../../../../typography/test/basic/app/app.module';

import {AppModule as VirtualScrollBasic} from '../../../../../virtual-scroll/test/basic/app.module';
import {AppModule as VirtualScrollCards} from '../../../../../virtual-scroll/test/cards/app.module';
import {AppModule as VirtualScrollImageGallery} from '../../../../../virtual-scroll/test/image-gallery/app.module';
import {AppModule as VirtualScrollInfiniteScroll} from '../../../../../virtual-scroll/test/infinite-scroll/app.module';
import {AppModule as VirtualScrollList} from '../../../../../virtual-scroll/test/list/app.module';
import {AppModule as VirtualScrollMedia} from '../../../../../virtual-scroll/test/media/app/app.module';
import {AppModule as VirtualScrollSlidingItem} from '../../../../../virtual-scroll/test/sliding-item/app.module';
import {AppModule as VirtualScrollVariableSize} from '../../../../../virtual-scroll/test/variable-size/app.module';


@NgModule({
  declarations: [
    ComponentsPage
  ],
  imports: [
    IonicPageModule.forChild(ComponentsPage),

    ActionSheetBasic,

    AlertBasic,
    AlertDismiss,

    AppAnimations,
    AppCordova,
    AppGestureCollision,
    AppGestures,
    AppTypography,
    AppUtilities,

    BadgeBasic,

    ButtonAnchors,
    ButtonAttributes,
    ButtonBasic,
    ButtonBlock,
    ButtonClear,
    ButtonDecorator,
    ButtonDynamic,
    ButtonFull,
    ButtonIcons,
    ButtonOutline,
    ButtonRaised,
    ButtonRound,
    ButtonSizes,

    CardAdvanced,
    CardBasic,
    CardColors,
    CardImages,
    CardList,
    CardMap,
    CardSocial,

    CheckboxBasic,

    ChipBasic,

    ContentBasic,
    ContentFullscreen,
    ContentHeaderScroll,
    ContentNoBounce,
    ContentScrollDownOnLoad,

    DatetimeBasic,
    DatetimeForm,
    DatetimeIssues,
    DatetimeLabels,

    FabBasic,

    GridAlignment,
    GridBasic,
    GridCard,
    GridFull,
    GridResponsive,

    IconBasic,

    ImgBasic,
    ImgCards,
    ImgLazyLoad,
    ImgList,

    InfiniteScrollBasic,
    InfiniteScrollPositionTop,
    InfiniteScrollShortList,

    InputBasicForm,
    InputClearAfterEdit,
    InputClearInput,
    InputEvents,
    InputFixedInlineLabels,
    InputFloatingLabels,
    InputFooterInputs,
    InputFormInputs,
    InputHighlight,
    InputInlineLabels,
    InputInputFocus,
    InputInsetInputs,
    InputPlaceholderLabels,
    InputStackedLabels,

    ItemButtons,
    ItemColors,
    ItemDividers,
    ItemGroups,
    ItemIcons,
    ItemImages,
    ItemInputs,
    ItemMedia,
    ItemReorder,
    ItemSliding,
    ItemText,

    ListChatList,
    ListHeaderScenarios,
    ListHeaders,
    ListInset,
    ListNoLines,
    ListRepeatHeaders,
    ListSticky,

    LoadingBasic,
    LoadingTabs,

    MenuBasic,
    // MenuDisableSwipe, TODO
    // MenuEnableDisable, TODO
    MenuMultiple,
    MenuOverlay,
    MenuPush,
    MenuReveal,

    ModalBasic,

    NavBasic,
    NavChildNavs,
    NavInitAsync,
    NavInsertViews,
    NavMemory,
    NavNavPushPop,
    NavWorstCase,

    PickerBasic,

    PopoverBasic,

    RadioBasic,

    RangeBasic,

    RefresherBasic,
    // RefresherNavigation, TODO

    ScrollBasic,

    SearchbarBasic,
    SearchbarNav,
    SearchbarToolbar,

    SegmentBasic,
    SegmentNav,
    SegmentSwipe,

    SelectMultipleValue,
    SelectSingleValue,

    ShowHideWhenBasic,

    SlidesBasic,
    SlidesControl,
    SlidesController,
    SlidesImages,
    SlidesIntro,
    SlidesLoop,
    SlidesOptions,
    SlidesRTL,
    SlidesScroll,

    SpinnerBasic,
    SpinnerColors,

    SplitPaneBasic,
    SplitPaneMenus,
    SplitPaneNested,
    SplitPaneTabs,

    TabsAdvanced,
    TabsBadges,
    TabsBasic,
    TabsColors,
    TabsEvents,
    TabsGhost,
    TabsLifecycle,
    TabsTabBarScenarios,
    TabsTop,

    ToastBasic,

    ToggleBasic,

    ToolbarBasic,
    ToolbarColors,
    ToolbarScenarios,

    TypographyBasic,

    VirtualScrollBasic,
    VirtualScrollCards,
    VirtualScrollImageGallery,
    VirtualScrollInfiniteScroll,
    VirtualScrollList,
    VirtualScrollMedia,
    VirtualScrollSlidingItem,
    VirtualScrollVariableSize,
  ],
  entryComponents: [
    ComponentsPage
  ]
})
export class ComponentsModule {
}
