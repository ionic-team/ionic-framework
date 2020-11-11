import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage, IonTabs, IonTabBar, IonTabButton, IonLabel } from '@ionic/vue';

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
}

const Tabs = {
  components: { IonPage, IonTabs, IonTabBar, IonTabButton, IonLabel },
  template: `
    <ion-page>
      <ion-tabs>
        <ion-tab-bar slot="top">
          <ion-tab-button tab="tab1" href="/tab1">
            <ion-label>Tab 1</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="tab2" href="/tab2">
            <ion-label>Tab 2</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  `,
}

const Tab1 = {
  components: { IonPage },
  template: `<ion-page>Tab 1</ion-page>`
}
const Tab2 = {
  components: { IonPage },
  template: `<ion-page>Tab 2</ion-page>`
}

describe('ion-tabs', () => {
  it('should emit will change and did change events when changing tab', async () => {
    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        {
          path: '/',
          component: Tabs,
          children: [
            {
              path: '',
              redirect: 'tab1'
            },
            {
              path: 'tab1',
              component: Tab1,
            },
            {
              path: 'tab2',
              component: Tab2
            }
          ]
        }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const tabs = wrapper.findComponent(IonTabs);
    expect(tabs.emitted().ionTabsWillChange.length).toEqual(1);
    expect(tabs.emitted().ionTabsWillChange[0]).toEqual([{ tab: 'tab1' }]);
    expect(tabs.emitted().ionTabsDidChange.length).toEqual(1);
    expect(tabs.emitted().ionTabsDidChange[0]).toEqual([{ tab: 'tab1' }]);

    router.push('/tab2')
    await flushPromises()

    expect(tabs.emitted().ionTabsWillChange.length).toEqual(2);
    expect(tabs.emitted().ionTabsWillChange[1]).toEqual([{ tab: 'tab2' }]);
    expect(tabs.emitted().ionTabsDidChange.length).toEqual(2);
    expect(tabs.emitted().ionTabsDidChange[1]).toEqual([{ tab: 'tab2' }]);
  });

  it('should not emit will change and did change events when going to same tab again', async () => {
    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        {
          path: '/',
          component: Tabs,
          children: [
            {
              path: '',
              redirect: 'tab1'
            },
            {
              path: 'tab1',
              component: Tab1,
            },
            {
              path: 'tab2',
              component: Tab2
            }
          ]
        }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const tabs = wrapper.findComponent(IonTabs);
    expect(tabs.emitted().ionTabsWillChange.length).toEqual(1);
    expect(tabs.emitted().ionTabsWillChange[0]).toEqual([{ tab: 'tab1' }]);
    expect(tabs.emitted().ionTabsDidChange.length).toEqual(1);
    expect(tabs.emitted().ionTabsDidChange[0]).toEqual([{ tab: 'tab1' }]);

    router.push('/tab1')
    await flushPromises()

    expect(tabs.emitted().ionTabsWillChange.length).toEqual(1);
    expect(tabs.emitted().ionTabsDidChange.length).toEqual(1);
  });

  it('should emit will change and did change events when getting redirected', async () => {
    const Tab3 = {
      components: { IonPage },
      template: `<ion-page>Tab 3</ion-page>`
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        {
          path: '/',
          component: Tabs,
          children: [
            {
              path: '',
              redirect: 'tab1'
            },
            {
              path: 'tab1',
              component: Tab1,
            },
            {
              path: 'tab2',
              component: Tab2
            },
            {
              path: 'tab3',
              component: Tab3,
              beforeEnter: (to, from, next) => {
                next({ path: '/tab2' });
              },
            }
          ]
        }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const tabs = wrapper.findComponent(IonTabs);
    expect(tabs.emitted().ionTabsWillChange.length).toEqual(1);
    expect(tabs.emitted().ionTabsWillChange[0]).toEqual([{ tab: 'tab1' }]);
    expect(tabs.emitted().ionTabsDidChange.length).toEqual(1);
    expect(tabs.emitted().ionTabsDidChange[0]).toEqual([{ tab: 'tab1' }]);

    router.push('/tab3')
    await flushPromises()

    expect(tabs.emitted().ionTabsWillChange.length).toEqual(2);
    expect(tabs.emitted().ionTabsWillChange[1]).toEqual([{ tab: 'tab2' }]);
    expect(tabs.emitted().ionTabsDidChange.length).toEqual(2);
    expect(tabs.emitted().ionTabsDidChange[1]).toEqual([{ tab: 'tab2' }]);
  });
});
