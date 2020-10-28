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
  mounted() {
    const ionRouter: any = inject('navManager');
    const tabState: TabState = {
        activeTab: undefined,
        tabs: {}
    };
    const currentInstance = getCurrentInstance();
    (currentInstance.subTree.children as VNode[]).forEach((child: VNode) => {
      if (child.type && (child.type as any).name === 'IonTabButton') {
        tabState.tabs[child.props.tab] = {
          originalHref: child.props.href,
          currentHref: child.props.href,
          ref: child
        }

        child.component.props._getTabState = () => tabState;
      }
    });

    const checkActiveTab = (currentRoute: any) => {
      const childNodes = currentInstance.subTree.children as VNode[];
      const { tabs, activeTab: prevActiveTab } = tabState;
      const tabKeys = Object.keys(tabs);
      const activeTab = tabKeys
        .find(key => {
          const href = tabs[key].originalHref;
          return currentRoute.pathname.startsWith(href);
        });

      childNodes.forEach((child: VNode) => {
        if (child.type && (child.type as any).name === 'IonTabButton') {
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
        if (activeTab !== prevActiveTab || (prevHref !== currentRoute.pathname)) {
          tabs[activeTab] = {
            ...tabs[activeTab],
            currentHref: currentRoute.pathname + (currentRoute.search || '')
          }
        }

        if (currentRoute.routerAction === 'pop' && (activeTab !== prevActiveTab)) {
          tabs[prevActiveTab] = {
            ...tabs[prevActiveTab],
            currentHref: tabs[prevActiveTab].originalHref
          }
        }
      }

      const activeChild = childNodes.find((child: VNode) => child.el.tab === activeTab);
      const tabBar = this.$refs.ionTabBar;

      if (activeChild && tabBar) {
        ionRouter.handleSetCurrentTab(activeTab);
        tabBar.selectedTab = tabState.activeTab = activeTab;
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
