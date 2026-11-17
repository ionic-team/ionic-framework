import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createRouter, createMemoryHistory } from '@ionic/vue-router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonicVue,
  IonApp,
  IonRouterOutlet,
  IonPage,
  IonTabs,
  IonTabBar,
  IonTabButton,
} from '@ionic/vue';
import { waitForRouter } from './utils';

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
}

describe('createMemoryHistory', () => {
  it('should not error when going back with memory router', async () => {
    const PageTemplate = {
      template: `
        <ion-page>
          <ion-header>
            <ion-toolbar>
              <ion-back-button></ion-back-button>
            </ion-toolbar>
          </ion-header>
          <ion-content></ion-content>
        </ion-page>
      `,
      components: { IonPage, IonContent, IonHeader, IonToolbar, IonBackButton }
    }

    const router = createRouter({
      history: createMemoryHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: PageTemplate },
        { path: '/page2', component: PageTemplate },
        { path: '/page3', component: PageTemplate }
      ]
    });
    const push = vi.spyOn(router, 'back');

    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/page2');
    await waitForRouter();

    router.push('/page3');
    await waitForRouter();


    const backButtons = wrapper.findAllComponents(IonBackButton);
    const pageTwoButton = backButtons[1];
    const pageThreeButton = backButtons[2];

    await pageThreeButton.trigger('click');
    await waitForRouter();

    await pageTwoButton.trigger('click');
    await waitForRouter();

    expect(push).toHaveBeenCalledTimes(2);
  });

  // Pins multi-step go(±n) round-trips on memory history. canGoBack() is
  // intentionally not asserted: with memory history, the wrapper's
  // currentHistoryPosition tracking lags behind in ways that are out of
  // scope for the v5 upgrade. useIonRouter()'s back semantics are covered
  // indirectly by the spy test above.
  it('round-trips multi-step go() across memory history', async () => {
    const Page = {
      components: { IonPage },
      template: '<ion-page></ion-page>',
    };

    const router = createRouter({
      history: createMemoryHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Page },
        { path: '/page2', component: Page },
        { path: '/page3', component: Page },
      ],
    });

    router.push('/');
    await router.isReady();
    mount(IonRouterOutlet, {
      global: { plugins: [router, IonicVue] },
    });

    router.push('/page2');
    await waitForRouter();
    router.push('/page3');
    await waitForRouter();
    expect(router.currentRoute.value.path).toBe('/page3');

    router.go(-2);
    await waitForRouter();
    expect(router.currentRoute.value.path).toBe('/');

    router.go(2);
    await waitForRouter();
    expect(router.currentRoute.value.path).toBe('/page3');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/29785
  describe('tapping the active tab', () => {
    const Tabs = {
      components: { IonPage, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet },
      template: `
        <ion-page>
          <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom">
              <ion-tab-button tab="tab1" href="/tabs/tab1">Tab 1</ion-tab-button>
              <ion-tab-button tab="tab2" href="/tabs/tab2">Tab 2</ion-tab-button>
            </ion-tab-bar>
          </ion-tabs>
        </ion-page>
      `,
    };
    const Tab1 = {
      components: { IonPage },
      template: '<ion-page>Tab 1</ion-page>',
    };
    const Tab1Child = {
      components: { IonPage },
      template: '<ion-page>Tab 1 Child</ion-page>',
    };
    const Tab2 = {
      components: { IonPage },
      template: '<ion-page>Tab 2</ion-page>',
    };

    const createTabsRouter = () =>
      createRouter({
        history: createMemoryHistory(process.env.BASE_URL),
        routes: [
          { path: '/', redirect: '/tabs/tab1' },
          {
            path: '/tabs/',
            component: Tabs,
            children: [
              { path: 'tab1', component: Tab1 },
              { path: 'tab1/child', component: Tab1Child },
              { path: 'tab2', component: Tab2 },
            ],
          },
        ],
      });

    const tapTab = async (wrapper: ReturnType<typeof mount>, tab: string) => {
      const button = wrapper
        .findAllComponents(IonTabButton)
        .find((b) => b.props('tab') === tab)!;
      await button.trigger('click');
      await waitForRouter();
    };

    it('should return to the tab root from a child page', async () => {
      const router = createTabsRouter();

      router.push('/tabs/tab1');
      await router.isReady();
      const wrapper = mount(App, {
        global: { plugins: [router, IonicVue] },
      });
      await waitForRouter();

      router.push('/tabs/tab1/child');
      await waitForRouter();
      expect(router.currentRoute.value.path).toBe('/tabs/tab1/child');

      await tapTab(wrapper, 'tab1');

      expect(router.currentRoute.value.path).toBe('/tabs/tab1');
    });

    it('should return to the tab root when the app started on a child page', async () => {
      const router = createTabsRouter();

      router.push('/tabs/tab1/child');
      await router.isReady();
      const wrapper = mount(App, {
        global: { plugins: [router, IonicVue] },
      });
      await waitForRouter();

      await tapTab(wrapper, 'tab1');

      expect(router.currentRoute.value.path).toBe('/tabs/tab1');
    });

    it('should replace the child page entry rather than push over it', async () => {
      const router = createTabsRouter();

      router.push('/tabs/tab1');
      await router.isReady();
      const wrapper = mount(App, {
        global: { plugins: [router, IonicVue] },
      });
      await waitForRouter();

      router.push('/tabs/tab1/child');
      await waitForRouter();

      await tapTab(wrapper, 'tab1');
      expect(router.currentRoute.value.path).toBe('/tabs/tab1');

      router.back();
      await waitForRouter();

      expect(router.currentRoute.value.path).toBe('/tabs/tab1');
    });
  });
})
