import { h, defineComponent, inject } from 'vue';

export const IonTabBar = defineComponent({
  name: 'IonTabBar',
  mounted() {
    const ionRouter: any = inject('navManager');

    const checkActiveTab = (currentRoute: any) => {
      // TODO types
      const tabs = Array.from(this.$el.querySelectorAll('ion-tab-button')) as any[];
      const activeTab = tabs.find(tab => currentRoute.pathname.startsWith(tab.href));
      const tabBar = this.$refs.ionTabBar;

      if (activeTab && tabBar) {
        ionRouter.handleSetCurrentTab(activeTab.tab);
        tabBar.selectedTab = activeTab.tab;
      }
    }

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
