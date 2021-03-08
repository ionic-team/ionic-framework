import { h, defineComponent, getCurrentInstance, inject, VNode } from 'vue';

interface TabState {
  activeTab?: string;
  tabs: { [k: string]: Tab };
}

interface Tab {
  originalHref: string;
  currentHref: string,
  ref: VNode
}

export const IonTabBar = defineComponent({
  name: 'IonTabBar',
  props: {
    _tabsWillChange: { type: Function, default: () => {} },
    _tabsDidChange: { type: Function, default: () => {} }
  },
  mounted() {
    const ionRouter: any = inject('navManager');
    const tabState: TabState = {
        activeTab: undefined,
        tabs: {}
    };
    const currentInstance = getCurrentInstance();
    const isTabButton = (child: any) => child.type?.name === 'IonTabButton';
    /**
     * For each tab, we need to keep track of its
     * base href as well as any child page that
     * is active in its stack so that when we go back
     * to a tab from another tab, we can correctly
     * show any child pages if necessary.
     */
    const children = (currentInstance.subTree.children || []) as VNode[];
    children.forEach((child: VNode) => {
      if (isTabButton(child)) {
        tabState.tabs[child.props.tab] = {
          originalHref: child.props.href,
          currentHref: child.props.href,
          ref: child
        }

        /**
         * Passing this prop to each tab button
         * lets it be aware of the state that
         * ion-tab-bar is managing for it.
         */
        child.component.props._getTabState = () => tabState;
      }
    });

    const checkActiveTab = (currentRoute: any) => {
      const childNodes = (currentInstance.subTree.children || []) as VNode[];
      const { tabs, activeTab: prevActiveTab } = tabState;
      const tabKeys = Object.keys(tabs);
      const activeTab = tabKeys
        .find(key => {
          const href = tabs[key].originalHref;
          return currentRoute.pathname.startsWith(href);
        });

      /**
       * For each tab, check to see if the
       * base href has changed. If so, update
       * it in the tabs state.
       */
      childNodes.forEach((child: VNode) => {
        if (isTabButton(child)) {
          const tab = tabs[child.props.tab];
          if (!tab || (tab.originalHref !== child.props.href)) {

            tabs[child.props.tab] = {
              originalHref: child.props.href,
              currentHref: child.props.href,
              ref: child
            }
          }
        }
      });

      if (activeTab && prevActiveTab) {
        const prevHref = tabState.tabs[prevActiveTab].currentHref;
        /**
         * If the tabs change or the url changes,
         * update the currentHref for the active tab.
         * Ex: url changes from /tabs/tab1 --> /tabs/tab1/child
         * If we went to tab2 then back to tab1, we should
         * land on /tabs/tab1/child instead of /tabs/tab1.
         */
        if (activeTab !== prevActiveTab || (prevHref !== currentRoute.pathname)) {
          tabs[activeTab] = {
            ...tabs[activeTab],
            currentHref: currentRoute.pathname + (currentRoute.search || '')
          }
        }

        /**
         * If navigating back and the tabs change,
         * set the previous tab back to its original href.
         */
        if (currentRoute.routerAction === 'pop' && (activeTab !== prevActiveTab)) {
          tabs[prevActiveTab] = {
            ...tabs[prevActiveTab],
            currentHref: tabs[prevActiveTab].originalHref
          }
        }
      }

      const activeChild = childNodes.find((child: VNode) => isTabButton(child) && child.props?.tab === activeTab);
      const tabBar = this.$refs.ionTabBar;
      const tabDidChange = activeTab !== prevActiveTab;
      if (tabBar) {
        if (activeChild) {
          tabDidChange && this.$props._tabsWillChange(activeTab);

          ionRouter.handleSetCurrentTab(activeTab);
          tabBar.selectedTab = tabState.activeTab = activeTab;

          tabDidChange && this.$props._tabsDidChange(activeTab);
        /**
         * When going to a tab that does
         * not have an associated ion-tab-button
         * we need to remove the selected state from
        * the old tab.
         */
        } else {
          tabBar.selectedTab = tabState.activeTab = '';
        }
      }
    };

    ionRouter.registerHistoryChangeListener(checkActiveTab.bind(this));
    checkActiveTab(ionRouter.getCurrentRouteInfo());
  },
  setup(_, { slots }) {
    return () => {
      return h(
        'ion-tab-bar',
        { ref: 'ionTabBar' },
        slots.default && slots.default()
      )
    }
  }
});
