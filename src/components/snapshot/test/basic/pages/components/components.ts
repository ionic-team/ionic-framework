import { Component } from '@angular/core';
import { IonicPage } from '../../../../../../';

import { AssistiveTouchProvider } from '../../providers/assistive-touch/assistive-touch';
import { NavController } from '../../../../../../navigation/nav-controller';

import { AppComponent as ActionSheetBasic } from '../../../../../action-sheet/test/basic/app/app.component';

import { AppComponent as AlertBasic } from '../../../../../alert/test/basic/app/app.component';
import { AppComponent as AlertDismiss } from '../../../../../alert/test/dismiss/app.module';

import { AppComponent as AppAnimations } from '../../../../../app/test/animations/app.module';
import { AppComponent as AppCordova } from '../../../../../app/test/cordova/app/app.component';
import { AppComponent as AppGestureCollision } from '../../../../../app/test/gesture-collision/app/app.component';
import { AppComponent as AppGestures } from '../../../../../app/test/gestures/app.module';
import { AppComponent as AppTypography } from '../../../../../app/test/typography/app/app.component';
import { AppComponent as AppUtilities } from '../../../../../app/test/utilities/app/app.component';

import { AppComponent as BadgeBasic } from '../../../../../badge/test/basic/app/app.component';

import { AppComponent as ButtonAnchors } from '../../../../../button/test/anchors/app/app.component';
import { AppComponent as ButtonAttributes } from '../../../../../button/test/attributes/app/app.component';
import { AppComponent as ButtonBasic } from '../../../../../button/test/basic/app/app.component';
import { AppComponent as ButtonBlock } from '../../../../../button/test/block/app/app.component';
import { AppComponent as ButtonClear } from '../../../../../button/test/clear/app/app.component';
import { AppComponent as ButtonDecorator } from '../../../../../button/test/decorator/app/app.component';
import { AppComponent as ButtonDynamic } from '../../../../../button/test/dynamic/app/app.component';
import { AppComponent as ButtonFull } from '../../../../../button/test/full/app/app.component';
import { AppComponent as ButtonIcons } from '../../../../../button/test/icons/app/app.component';
import { AppComponent as ButtonOutline } from '../../../../../button/test/outline/app/app.component';
import { AppComponent as ButtonRaised } from '../../../../../button/test/raised/app.module';
import { AppComponent as ButtonRound } from '../../../../../button/test/round/app/app.component';
import { AppComponent as ButtonSizes } from '../../../../../button/test/sizes/app/app.component';

import { AppComponent as CardAdvanced } from '../../../../../card/test/advanced/app/app.component';
import { AppComponent as CardBasic } from '../../../../../card/test/basic/app/app.component';
import { AppComponent as CardColors } from '../../../../../card/test/colors/app/app.component';
import { AppComponent as CardImages } from '../../../../../card/test/images/app/app.component';
import { AppComponent as CardList } from '../../../../../card/test/list/app/app.component';
import { AppComponent as CardMap } from '../../../../../card/test/map/app.module';
import { AppComponent as CardSocial } from '../../../../../card/test/social/app.module';

import { AppComponent as CheckboxBasic } from '../../../../../checkbox/test/basic/app/app.component';

import { AppComponent as ChipBasic } from '../../../../../chip/test/basic/app/app.component';

import { AppComponent as ContentBasic } from '../../../../../content/test/basic/app/app.component';
import { AppComponent as ContentFullscreen } from '../../../../../content/test/fullscreen/app/app.component';
import { AppComponent as ContentHeaderScroll } from '../../../../../content/test/header-scroll/app.module';
import { AppComponent as ContentNoBounce } from '../../../../../content/test/no-bounce/app/app.component';
import { AppComponent as ContentScrollDownOnLoad } from '../../../../../content/test/scroll-down-on-load/app/app.component';

import { AppComponent as DatetimeBasic } from '../../../../../datetime/test/basic/app/app.component';
import { AppComponent as DatetimeForm } from '../../../../../datetime/test/form/app.module';
import { AppComponent as DatetimeIssues } from '../../../../../datetime/test/issues/app/app.component';
import { AppComponent as DatetimeLabels } from '../../../../../datetime/test/labels/app/app.component';

import { AppComponent as FabBasic } from '../../../../../fab/test/basic/app/app.component';

import { AppComponent as GridAlignment } from '../../../../../grid/test/alignment/app.module';
import { AppComponent as GridBasic } from '../../../../../grid/test/basic/app/app.component';
import { AppComponent as GridCard } from '../../../../../grid/test/card/app.module';
import { AppComponent as GridFull } from '../../../../../grid/test/full/app.module';
import { AppComponent as GridResponsive } from '../../../../../grid/test/responsive/app.module';

import { AppComponent as IconBasic } from '../../../../../icon/test/basic/app/app.component';

import { AppComponent as ImgBasic } from '../../../../../img/test/basic/app/app.component';
import { AppComponent as ImgCards } from '../../../../../img/test/cards/app.module';
import { AppComponent as ImgLazyLoad } from '../../../../../img/test/lazy-load/app.module';
import { AppComponent as ImgList } from '../../../../../img/test/list/app.module';

import { AppComponent as InfiniteScrollBasic } from '../../../../../infinite-scroll/test/basic/app.module';
import { AppComponent as InfiniteScrollPositionTop } from '../../../../../infinite-scroll/test/position-top/app/app.component';
import { AppComponent as InfiniteScrollShortList } from '../../../../../infinite-scroll/test/short-list/app.module';

import { AppComponent as InputBasicForm } from '../../../../../input/test/basic-form/app/app.component';
import { AppComponent as InputClearAfterEdit } from '../../../../../input/test/clear-after-edit/app/app.component';
import { AppComponent as InputClearInput } from '../../../../../input/test/clear-input/app/app.component';
import { AppComponent as InputEvents } from '../../../../../input/test/events/app/app.component';
import { AppComponent as InputFixedInlineLabels } from '../../../../../input/test/fixed-inline-labels/app/app.component';
import { AppComponent as InputFloatingLabels } from '../../../../../input/test/floating-labels/app/app.component';
import { AppComponent as InputFooterInputs } from '../../../../../input/test/footer-inputs/app/app.component';
import { AppComponent as InputFormInputs } from '../../../../../input/test/form-inputs/app/app.component';
import { AppComponent as InputHighlight } from '../../../../../input/test/highlight/app/app.component';
import { AppComponent as InputInlineLabels } from '../../../../../input/test/inline-labels/app/app.component';
import { AppComponent as InputInputFocus } from '../../../../../input/test/input-focus/app/app.module';
import { AppComponent as InputInsetInputs } from '../../../../../input/test/inset-inputs/app/app.component';
import { AppComponent as InputPlaceholderLabels } from '../../../../../input/test/placeholder-labels/app/app.component';
import { AppComponent as InputStackedLabels } from '../../../../../input/test/stacked-labels/app/app.component';

import { AppComponent as ItemButtons } from '../../../../../item/test/buttons/app/app.component';
import { AppComponent as ItemColors } from '../../../../../item/test/colors/app/app.component';
import { AppComponent as ItemDividers } from '../../../../../item/test/dividers/app/app.component';
import { AppComponent as ItemGroups } from '../../../../../item/test/groups/app/app.component';
import { AppComponent as ItemIcons } from '../../../../../item/test/icons/app/app.component';
import { AppComponent as ItemImages } from '../../../../../item/test/images/app/app.component';
import { AppComponent as ItemInputs } from '../../../../../item/test/inputs/app/app.component';
import { AppComponent as ItemMedia } from '../../../../../item/test/media/app/app.component';
import { AppComponent as ItemReorder } from '../../../../../item/test/reorder/app/app.module';
import { AppComponent as ItemSliding } from '../../../../../item/test/sliding/app/app.component';
import { AppComponent as ItemText } from '../../../../../item/test/text/app/app.component';

import { AppComponent as ListChatList } from '../../../../../list/test/chat-list/app.module';
import { AppComponent as ListHeaderScenarios } from '../../../../../list/test/header-scenarios/app/app.component';
import { AppComponent as ListHeaders } from '../../../../../list/test/headers/app/app.component';
import { AppComponent as ListInset } from '../../../../../list/test/inset/app/app.component';
import { AppComponent as ListNoLines } from '../../../../../list/test/no-lines/app/app.component';
import { AppComponent as ListRepeatHeaders } from '../../../../../list/test/repeat-headers/app.module';
import { AppComponent as ListSticky } from '../../../../../list/test/sticky/app.module';

import { AppComponent as LoadingBasic } from '../../../../../loading/test/basic/app/app.component';
import { AppComponent as LoadingTabs } from '../../../../../tabs/test/basic/app/app.component';

import { AppComponent as MenuBasic } from '../../../../../menu/test/basic/app/app.component';
// import { AppComponent as MenuDisableSwipe } from '../../../../../menu/test/disable-swipe/app.module';
// import { AppComponent as MenuEnableDisable } from '../../../../../menu/test/enable-disable/app.module';
import { AppComponent as MenuMultiple } from '../../../../../menu/test/multiple/app/app.component';
import { AppComponent as MenuOverlay } from '../../../../../menu/test/overlay/app.module';
import { AppComponent as MenuPush } from '../../../../../menu/test/push/app.module';
import { AppComponent as MenuReveal } from '../../../../../menu/test/reveal/app.module';

import { AppComponent as ModalBasic } from '../../../../../modal/test/basic/app/app.component';

import { AppComponent as NavBasic } from '../../../../../nav/test/basic/app/app.component';
import { AppComponent as NavChildNavs } from '../../../../../nav/test/child-navs/app/app.component';
import { AppComponent as NavInitAsync } from '../../../../../nav/test/init-async/app.module';
import { AppComponent as NavInsertViews } from '../../../../../nav/test/insert-views/app.module';
import { AppComponent as NavMemory } from '../../../../../nav/test/memory/app.module';
import { AppComponent as NavNavPushPop } from '../../../../../nav/test/nav-push-pop/app/app.component';
import { AppComponent as NavWorstCase } from '../../../../../nav/test/worst-case/app.module';

import { AppComponent as PickerBasic } from '../../../../../picker/test/basic/app/app.component';

import { AppComponent as PopoverBasic } from '../../../../../popover/test/basic/app/app.component';

import { AppComponent as RadioBasic } from '../../../../../radio/test/basic/app/app.component';

import { AppComponent as RangeBasic } from '../../../../../range/test/basic/app/app.component';

import { AppComponent as RefresherBasic } from '../../../../../refresher/test/basic/app.module';
// import { AppComponent as RefresherNavigation } from '../../../../../refresher/test/navigation/app.module';

import { AppComponent as ScrollBasic } from '../../../../../scroll/test/basic/app.module';

import { AppComponent as SearchbarBasic } from '../../../../../searchbar/test/basic/app/app.component';
import { AppComponent as SearchbarNav } from '../../../../../searchbar/test/nav/app/app.component';
import { AppComponent as SearchbarToolbar } from '../../../../../searchbar/test/toolbar/app/app.component';

import { AppComponent as SegmentBasic } from '../../../../../segment/test/basic/app/app.component';
import { AppComponent as SegmentNav } from '../../../../../segment/test/nav/app/app.component';
import { AppComponent as SegmentSwipe } from '../../../../../segment/test/swipe/app/app.component';

import { AppComponent as SelectMultipleValue } from '../../../../../select/test/multiple-value/app/app.component';
import { AppComponent as SelectSingleValue } from '../../../../../select/test/single-value/app/app.component';

import { AppComponent as ShowHideWhenBasic } from '../../../../../show-hide-when/test/basic/app.module';

import { AppComponent as SlidesBasic } from '../../../../../slides/test/basic/app.module';
import { AppComponent as SlidesControl } from '../../../../../slides/test/control/app.module';
import { AppComponent as SlidesController } from '../../../../../slides/test/controller/app.module';
import { AppComponent as SlidesImages } from '../../../../../slides/test/images/app.module';
import { AppComponent as SlidesIntro } from '../../../../../slides/test/intro/app.module';
import { AppComponent as SlidesLoop } from '../../../../../slides/test/loop/app.module';
import { AppComponent as SlidesOptions } from '../../../../../slides/test/options/app.module';
import { E2EApp as SlidesRTL } from '../../../../../slides/test/rtl/app.module';
import { AppComponent as SlidesScroll } from '../../../../../slides/test/scroll/app.module';

import { AppComponent as SpinnerBasic } from '../../../../../spinner/test/basic/app.module';
import { AppComponent as SpinnerColors } from '../../../../../spinner/test/colors/app.module';

import { AppComponent as SplitPaneBasic } from '../../../../../split-pane/test/basic/app/app.component';
import { AppComponent as SplitPaneMenus } from '../../../../../split-pane/test/menus/app/app.component';
import { AppComponent as SplitPaneNested } from '../../../../../split-pane/test/nested/app/app.component';
import { AppComponent as SplitPaneTabs } from '../../../../../split-pane/test/tabs/app/app.component';

import { AppComponent as TabsAdvanced } from '../../../../../tabs/test/advanced/app/app.component';
import { AppComponent as TabsBadges } from '../../../../../tabs/test/badges/app/app.component';
import { AppComponent as TabsBasic } from '../../../../../tabs/test/basic/app/app.component';
import { AppComponent as TabsColors } from '../../../../../tabs/test/colors/app/app.component';
import { AppComponent as TabsEvents } from '../../../../../tabs/test/events/app.module';
import { TabsPage as TabsGhost } from '../../../../../tabs/test/ghost/app.module';
import { AppComponent as TabsLifecycle } from '../../../../../tabs/test/lifecyles/app.module';
import { AppComponent as TabsTabBarScenarios } from '../../../../../tabs/test/tab-bar-scenarios/app/app.component';
import { AppComponent as TabsTop } from '../../../../../tabs/test/top/app.module';

import { AppComponent as ToastBasic } from '../../../../../toast/test/basic/app/app.component';

import { AppComponent as ToggleBasic } from '../../../../../toggle/test/basic/app/app.component';

import { AppComponent as ToolbarBasic } from '../../../../../toolbar/test/basic/app/app.component';
import { AppComponent as ToolbarColors } from '../../../../../toolbar/test/colors/app/app.component';
import { AppComponent as ToolbarScenarios } from '../../../../../toolbar/test/scenarios/app/app.component';

import { AppComponent as TypographyBasic } from '../../../../../typography/test/basic/app/app.component';

import { AppComponent as VirtualScrollBasic } from '../../../../../virtual-scroll/test/basic/app.module';
import { AppComponent as VirtualScrollCards } from '../../../../../virtual-scroll/test/cards/app.module';
import { AppComponent as VirtualScrollImageGallery } from '../../../../../virtual-scroll/test/image-gallery/app.module';
import { E2EApp as VirtualScrollInfiniteScroll } from '../../../../../virtual-scroll/test/infinite-scroll/app.module';
import { AppComponent as VirtualScrollList } from '../../../../../virtual-scroll/test/list/app.module';
import { AppComponent as VirtualScrollMedia } from '../../../../../virtual-scroll/test/media/app/app.component';
import { AppComponent as VirtualScrollSlidingItem } from '../../../../../virtual-scroll/test/sliding-item/app.module';
import {  AppComponent as VirtualScrollVariableSize } from '../../../../../virtual-scroll/test/variable-size/app.module';


export type ComponentsGroup = { name: string, components: Array<{ name: string, component: any }> };

@IonicPage()
@Component({
  templateUrl: 'components.html'
})
export class ComponentsPage {
  components: Array<ComponentsGroup> = [
    {
      name: 'Action Sheet',
      components: [
        {name: 'basic', component: ActionSheetBasic}
      ]
    }, {
      name: 'Alert',
      components: [
        {name: 'basic', component: AlertBasic},
        {name: 'dismiss', component: AlertDismiss}
      ]
    }, {
      name: 'App',
      components: [
        {name: 'animations', component: AppAnimations},
        {name: 'cordova', component: AppCordova},
        {name: 'gesture-collision', component: AppGestureCollision},
        {name: 'gestures', component: AppGestures},
        {name: 'typography', component: AppTypography},
        {name: 'utilities', component: AppUtilities}
      ]
    }, {
      name: 'Avatar',
      components: []
    }, {
      name: 'Backdrop',
      components: []
    }, {
      name: 'Badge',
      components: [
        {name: 'basic', component: BadgeBasic}
      ]
    }, {
      name: 'Button',
      components: [
        {name: 'anchors', component: ButtonAnchors},
        {name: 'attributes', component: ButtonAttributes},
        {name: 'basic', component: ButtonBasic},
        {name: 'block', component: ButtonBlock},
        {name: 'clear', component: ButtonClear},
        {name: 'decorator', component: ButtonDecorator},
        {name: 'dynamic', component: ButtonDynamic},
        {name: 'full', component: ButtonFull},
        {name: 'icons', component: ButtonIcons},
        {name: 'outline', component: ButtonOutline},
        {name: 'raised', component: ButtonRaised},
        {name: 'round', component: ButtonRound},
        {name: 'sizes', component: ButtonSizes}
      ]
    }, {
      name: 'Card',
      components: [
        {name: 'advanced', component: CardAdvanced},
        {name: 'basic', component: CardBasic},
        {name: 'colors', component: CardColors},
        {name: 'images', component: CardImages},
        {name: 'list', component: CardList},
        {name: 'map', component: CardMap},
        {name: 'social', component: CardSocial}
      ]
    }, {
      name: 'Checkbox',
      components: [
        {name: 'basic', component: CheckboxBasic}
      ]
    }, {
      name: 'Chip',
      components: [
        {name: 'basic', component: ChipBasic}
      ]
    }, {
      name: 'Content',
      components: [
        {name: 'basic', component: ContentBasic},
        {name: 'fullscreen', component: ContentFullscreen},
        {name: 'header-scroll', component: ContentHeaderScroll},
        {name: 'no-bounce', component: ContentNoBounce},
        {name: 'scroll-down-on-load', component: ContentScrollDownOnLoad}
      ]
    }, {
      name: 'Datetime',
      components: [
        {name: 'basic', component: DatetimeBasic},
        {name: 'form', component: DatetimeForm},
        {name: 'issues', component: DatetimeIssues},
        {name: 'labels', component: DatetimeLabels}
      ]
    }, {
      name: 'Fab',
      components: [
        {name: 'basic', component: FabBasic}
      ]
    }, {
      name: 'Grid',
      components: [
        {name: 'alignment', component: GridAlignment},
        {name: 'basic', component: GridBasic},
        {name: 'card', component: GridCard},
        {name: 'full', component: GridFull},
        {name: 'responsive', component: GridResponsive}
      ]
    }, {
      name: 'Icon',
      components: [
        {name: 'basic', component: IconBasic}
      ]
    }, {
      name: 'Img',
      components: [
        {name: 'basic', component: ImgBasic},
        {name: 'cards', component: ImgCards},
        {name: 'lazy-load', component: ImgLazyLoad},
        {name: 'list', component: ImgList}
      ]
    }, {
      name: 'Infinite Scroll',
      components: [
        {name: 'basic', component: InfiniteScrollBasic},
        {name: 'position-top', component: InfiniteScrollPositionTop},
        {name: 'short-list', component: InfiniteScrollShortList}
      ]
    }, {
      name: 'Inputs',
      components: [
        {name: 'basic-form', component: InputBasicForm},
        {name: 'clear-after-edit', component: InputClearAfterEdit},
        {name: 'clear-input', component: InputClearInput},
        {name: 'events', component: InputEvents},
        {name: 'fixed-inline-labels', component: InputFixedInlineLabels},
        {name: 'floating-labels', component: InputFloatingLabels},
        {name: 'footer-inputs', component: InputFooterInputs},
        {name: 'form-inputs', component: InputFormInputs},
        {name: 'highlight', component: InputHighlight},
        {name: 'inline-labels', component: InputInlineLabels},
        {name: 'input-focus', component: InputInputFocus},
        {name: 'inset-inputs', component: InputInsetInputs},
        {name: 'placeholder-labels', component: InputPlaceholderLabels},
        {name: 'stacked-labels', component: InputStackedLabels}
      ]
    }, {
      name: 'Item',
      components: [
        {name: 'buttons', component: ItemButtons},
        {name: 'colors', component: ItemColors},
        {name: 'dividers', component: ItemDividers},
        {name: 'groups', component: ItemGroups},
        {name: 'icons', component: ItemIcons},
        {name: 'images', component: ItemImages},
        {name: 'inputs', component: ItemInputs},
        {name: 'media', component: ItemMedia},
        {name: 'reorder', component: ItemReorder},
        {name: 'sliding', component: ItemSliding},
        {name: 'text', component: ItemText}
      ]
    }, {
      name: 'Label',
      components: []
    }, {
      name: 'List',
      components: [
        {name: 'chat-list', component: ListChatList},
        {name: 'header-scenarios', component: ListHeaderScenarios},
        {name: 'headers', component: ListHeaders},
        {name: 'inset', component: ListInset},
        {name: 'no-lines', component: ListNoLines},
        {name: 'repeat-headers', component: ListRepeatHeaders},
        {name: 'sticky', component: ListSticky},
      ]
    }, {
      name: 'Loading',
      components: [
        {name: 'basic', component: LoadingBasic},
        {name: 'tabs', component: LoadingTabs}
      ]
    }, {
      name: 'Menu',
      components: [
        {name: 'basic', component: MenuBasic},
        // {name: 'disable-swipe', component: MenuDisableSwipe},
        // {name: 'enable-disable', component: MenuEnableDisable},
        {name: 'multiple', component: MenuMultiple},
        {name: 'overlay', component: MenuOverlay},
        {name: 'push', component: MenuPush},
        {name: 'reveal', component: MenuReveal},
      ]
    }, {
      name: 'Modal',
      components: [
        {name: 'basic', component: ModalBasic}
      ]
    }, {
      name: 'Nav',
      components: [
        {name: 'basic', component: NavBasic},
        {name: 'child-navs', component: NavChildNavs},
        {name: 'init-async', component: NavInitAsync},
        {name: 'insert-views', component: NavInsertViews},
        {name: 'memory', component: NavMemory},
        {name: 'nav-push-pop', component: NavNavPushPop},
        {name: 'worst-case', component: NavWorstCase}
      ]
    }, {
      name: 'Note',
      components: []
    }, {
      name: 'Option',
      components: []
    }, {
      name: 'Picker',
      components: [
        {name: 'basic', component: PickerBasic}
      ]
    }, {
      name: 'Popover',
      components: [
        {name: 'basic', component: PopoverBasic}
      ]
    }, {
      name: 'Radio',
      components: [
        {name: 'basic', component: RadioBasic}
      ]
    }, {
      name: 'Range',
      components: [
        {name: 'basic', component: RangeBasic}
      ]
    }, {
      name: 'Refresher',
      components: [
        {name: 'basic', component: RefresherBasic},
        // {name: 'navigation', component: RefresherNavigation}
      ]
    }, {
      name: 'Scroll',
      components: [
        {name: 'basic', component: ScrollBasic}
      ]
    }, {
      name: 'Searchbar',
      components: [
        {name: 'basic', component: SearchbarBasic},
        {name: 'nav', component: SearchbarNav},
        {name: 'toolbar', component: SearchbarToolbar},
      ]
    }, {
      name: 'Segment',
      components: [
        {name: 'basic', component: SegmentBasic},
        {name: 'nav', component: SegmentNav},
        {name: 'swipe', component: SegmentSwipe},
      ]
    }, {
      name: 'Select',
      components: [
        {name: 'multiple-value', component: SelectMultipleValue},
        {name: 'single-value', component: SelectSingleValue}
      ]
    }, {
      name: 'Show-hide-when',
      components: [
        {name: 'basic', component: ShowHideWhenBasic}
      ]
    }, {
      name: 'Show-hide-when',
      components: [
        {name: 'basic', component: SlidesBasic},
        {name: 'control', component: SlidesControl},
        {name: 'controller', component: SlidesController},
        {name: 'images', component: SlidesImages},
        {name: 'intro', component: SlidesIntro},
        {name: 'loop', component: SlidesLoop},
        {name: 'options', component: SlidesOptions},
        {name: 'rtl', component: SlidesRTL},
        {name: 'scroll', component: SlidesScroll},
      ]
    }, {
      name: 'Spinner',
      components: [
        {name: 'basic', component: SpinnerBasic},
        {name: 'colors', component: SpinnerColors}
      ]
    },  {
      name: 'Split-pane',
      components: [
        {name: 'basic', component: SplitPaneBasic},
        {name: 'menus', component: SplitPaneMenus},
        {name: 'nested', component: SplitPaneNested},
        {name: 'tabs', component: SplitPaneTabs}
      ]
    },  {
      name: 'Tabs',
      components: [
        {name: 'advanced', component: TabsAdvanced},
        {name: 'badges', component: TabsBadges},
        {name: 'basic', component: TabsBasic},
        {name: 'colors', component: TabsColors},
        {name: 'events', component: TabsEvents},
        {name: 'ghost', component: TabsGhost},
        {name: 'lifecyles', component: TabsLifecycle},
        {name: 'tab-bar-scenarios', component: TabsTabBarScenarios},
        {name: 'top', component: TabsTop}
      ]
    },  {
      name: 'Thumbnail',
      components: []
    },  {
      name: 'Toast',
      components: [
        {name: 'basic', component: ToastBasic}
      ]
    },  {
      name: 'Toggle',
      components: [
        {name: 'basic', component: ToastBasic}
      ]
    },  {
      name: 'Toggle',
      components: [
        {name: 'basic', component: ToggleBasic}
      ]
    },  {
      name: 'Toolbar',
      components: [
        {name: 'basic', component: ToolbarBasic},
        {name: 'colors', component: ToolbarColors},
        {name: 'scenarios', component: ToolbarScenarios}
      ]
    },  {
      name: 'Typography',
      components: [
        {name: 'basic', component: TypographyBasic}
      ]
    },  {
      name: 'Virtual-scroll',
      components: [
        {name: 'basic', component: VirtualScrollBasic},
        {name: 'cards', component: VirtualScrollCards},
        {name: 'image-gallery', component: VirtualScrollImageGallery},
        {name: 'infinite-scroll', component: VirtualScrollInfiniteScroll},
        {name: 'list', component: VirtualScrollList},
        {name: 'media', component: VirtualScrollMedia},
        {name: 'sliding-item', component: VirtualScrollSlidingItem},
        {name: 'variable-size', component: VirtualScrollVariableSize},
      ]
    }
  ];

  constructor(private navCtrl: NavController, assistive: AssistiveTouchProvider) {
    assistive.closeButton.subscribe(this.close.bind(this));
  }

  open(component: any) {
    this.navCtrl.push(component);
  }

  close() {
    this.navCtrl.popToRoot();
  }
}
