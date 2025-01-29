import { defineCustomElement } from "@ionic/core/components/ion-tab-bar.js";
import type { VNode, Ref } from "vue";
import { h, defineComponent, getCurrentInstance, inject } from "vue";

// TODO(FW-2969): types

interface TabState {
  activeTab?: string;
  tabs: { [k: string]: Tab };
  hasRouterOutlet?: boolean;
}

interface Tab {
  originalHref: string;
  currentHref: string;
  ref: VNode;
}

interface TabBarData {
  hasRouterOutlet: boolean;
  _tabsWillChange: Function;
  _tabsDidChange: Function;
}

const isTabButton = (child: any) => child.type?.name === "IonTabButton";

const getTabs = (nodes: VNode[]) => {
  let tabs: VNode[] = [];
  nodes.forEach((node: VNode) => {
    if (isTabButton(node)) {
      tabs.push(node);
    } else if (Array.isArray(node.children) && node.children.length > 1) {
      const childTabs = getTabs(node.children as VNode[]);
      tabs = [...tabs, ...childTabs];
    }
  });

  return tabs;
};

export const IonTabBar = defineComponent({
  name: "IonTabBar",
  data() {
    return {
      tabState: {
        activeTab: undefined as string | undefined,
        tabs: {},
        /**
         * Passing this prop to each tab button
         * lets it be aware of the presence of
         * the router outlet.
         */
        hasRouterOutlet: false,
      },
      tabVnodes: [] as VNode[],
      /* eslint-disable @typescript-eslint/no-empty-function */
      _tabsWillChange: { type: Function, default: () => {} },
      _tabsDidChange: { type: Function, default: () => {} },
      /* eslint-enable @typescript-eslint/no-empty-function */
    };
  },
  updated() {
    this.setupTabState(inject("navManager", null));
  },
  methods: {
    setupTabState(ionRouter: any) {
      const hasRouterOutlet = this.$data.tabState.hasRouterOutlet;
      /**
       * For each tab, we need to keep track of its
       * base href as well as any child page that
       * is active in its stack so that when we go back
       * to a tab from another tab, we can correctly
       * show any child pages if necessary.
       */
      const tabState: TabState = this.$data.tabState;
      const currentInstance = getCurrentInstance();
      const tabs = (this.$data.tabVnodes = getTabs(
        (currentInstance.subTree.children || []) as VNode[]
      ));
      tabs.forEach((child) => {
        tabState.tabs[child.props.tab] = {
          originalHref: child.props.href,
          currentHref: child.props.href,
          ref: child,
        };

        /**
         * Passing this prop to each tab button
         * lets it be aware of the state that
         * ion-tab-bar is managing for it.
         */
        child.component.props._getTabState = () => tabState;

        /**
         * If the router outlet is not defined, then the tabs are being used
         * as a basic tab navigation without the router. In this case, the
         * tabs will not emit the `ionTabsDidChange` and `ionTabsWillChange`
         * events through the `checkActiveTab` method. Instead, we need to
         * handle those events through the tab buttons.
         */
        if (!hasRouterOutlet) {
          child.component.props._onClick = (
            event: CustomEvent<{
              href: string;
              selected: boolean;
              tab: string;
            }>
          ) => {
            this.handleIonTabButtonClick(event);
          };
        }
      });

      this.checkActiveTab(ionRouter);
    },
    /**
     * This method is called upon setup and when the
     * history changes. It checks the current route
     * and updates the active tab accordingly.
     *
     * History changes only occur when the router
     * outlet is present. Due to this, the
     * `ionTabsDidChange` and `ionTabsWillChange`
     * events are only emitted when the router
     * outlet is present. A different approach must
     * be taken for tabs without a router outlet.
     *
     * @param ionRouter
     */
    checkActiveTab(ionRouter: any) {
      const hasRouterOutlet = this.$data.tabState.hasRouterOutlet;
      const currentRoute = ionRouter?.getCurrentRouteInfo();
      const childNodes = this.$data.tabVnodes;
      const { tabs, activeTab: prevActiveTab } = this.$data.tabState;
      const tabKeys = Object.keys(tabs);
      let activeTab = tabKeys.find((key) => {
        const href = tabs[key].originalHref;
        return currentRoute?.pathname.startsWith(href);
      });

      /**
       * Tabs is being used as a basic tab navigation,
       * so we need to set the first tab as active since
       * `checkActiveTab` will not be called after setup.
       */
      if (!activeTab && !hasRouterOutlet) {
        activeTab = tabKeys[0];
      }

      /**
       * For each tab, check to see if the
       * base href has changed. If so, update
       * it in the tabs state.
       */
      childNodes.forEach((child: VNode) => {
        const tab = tabs[child.props.tab];
        if (!tab || tab.originalHref !== child.props.href) {
          tabs[child.props.tab] = {
            originalHref: child.props.href,
            currentHref: child.props.href,
            ref: child,
          };
        }
      });

      if (activeTab && prevActiveTab) {
        const prevHref = this.$data.tabState.tabs[prevActiveTab].currentHref;
        /**
         * If the tabs change or the url changes,
         * update the currentHref for the active tab.
         * Ex: url changes from /tabs/tab1 --> /tabs/tab1/child
         * If we went to tab2 then back to tab1, we should
         * land on /tabs/tab1/child instead of /tabs/tab1.
         */
        if (
          activeTab !== prevActiveTab ||
          prevHref !== currentRoute?.pathname
        ) {
          /**
           * By default the search is `undefined` in Ionic Vue,
           * but Vue Router can set the search to the empty string.
           * We check for truthy here because empty string is falsy
           * and currentRoute.search cannot ever be a boolean.
           */
          const search = currentRoute?.search ? `?${currentRoute.search}` : "";
          tabs[activeTab] = {
            ...tabs[activeTab],
            currentHref: currentRoute?.pathname + search,
          };
        }

        /**
         * If navigating back and the tabs change,
         * set the previous tab back to its original href.
         */
        if (
          currentRoute?.routerAction === "pop" &&
          activeTab !== prevActiveTab
        ) {
          tabs[prevActiveTab] = {
            ...tabs[prevActiveTab],
            currentHref: tabs[prevActiveTab].originalHref,
          };
        }
      }

      this.tabSwitch(activeTab, ionRouter);
    },
    handleIonTabButtonClick(
      event: CustomEvent<{
        href: string;
        selected: boolean;
        tab: string;
      }>
    ) {
      const activeTab = event.detail.tab;

      this.tabSwitch(activeTab);
    },
    tabSwitch(activeTab: string, ionRouter?: any) {
      const hasRouterOutlet = this.$data.tabState.hasRouterOutlet;
      const childNodes = this.$data.tabVnodes;
      const { activeTab: prevActiveTab } = this.$data.tabState;
      const tabState = this.$data.tabState;
      const activeChild = childNodes.find(
        (child: VNode) => isTabButton(child) && child.props?.tab === activeTab
      );
      const tabBar = this.$refs.ionTabBar;
      const tabDidChange = activeTab !== prevActiveTab;
      if (tabBar) {
        if (activeChild) {
          tabDidChange && this.$data._tabsWillChange(activeTab);

          if (hasRouterOutlet && ionRouter !== null) {
            ionRouter.handleSetCurrentTab(activeTab);
          }

          tabBar.selectedTab = tabState.activeTab = activeTab;

          tabDidChange && this.$data._tabsDidChange(activeTab);
        } else {
          /**
           * When going to a tab that does
           * not have an associated ion-tab-button
           * we need to remove the selected state from
           * the old tab.
           */
          tabBar.selectedTab = tabState.activeTab = "";
        }
      }
    },
  },
  mounted() {
    const ionRouter: any = inject("navManager", null);
    /**
     * Tab bar can be used as a standalone component,
     * so it cannot be modified directly through
     * IonTabs. Instead, data will be passed through
     * the provide/inject.
     */
    const tabBarData = inject<Ref<TabBarData>>("tabBarData");

    this.$data.tabState.hasRouterOutlet = tabBarData.value.hasRouterOutlet;
    this.$data._tabsWillChange = tabBarData.value._tabsWillChange;
    this.$data._tabsDidChange = tabBarData.value._tabsDidChange;

    this.setupTabState(ionRouter);

    ionRouter?.registerHistoryChangeListener(() =>
      this.checkActiveTab(ionRouter)
    );
  },
  setup(_, { slots }) {
    defineCustomElement();

    return () => {
      return h(
        "ion-tab-bar",
        { ref: "ionTabBar" },
        slots.default && slots.default()
      );
    };
  },
});
