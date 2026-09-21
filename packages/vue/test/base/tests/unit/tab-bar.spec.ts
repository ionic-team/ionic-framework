import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonRouterOutlet, IonPage, IonTabs, IonTabBar, IonTabButton } from '@ionic/vue';

describe('ion-tab-bar', () => {
  // Verifies the fix for https://github.com/ionic-team/ionic-framework/issues/22642
  it('should not fail on non tab button elements', async () => {
    const Tabs = {
      components: { IonPage, IonTabs, IonTabBar, IonRouterOutlet },
      template: `
        <ion-page>
          <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar>
              <!-- my comment -->
            </ion-tab-bar>
          </ion-tabs>
        </ion-page>
      `,
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Tabs }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(Tabs, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const tabs = wrapper.findComponent(IonTabs);
    const tabbar = tabs.vm.$el.children[1];
    const children = tabbar.childNodes;

    // 8 is a comment node: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    expect(children[0].nodeType).toEqual(8);
  })

  // Verifies the fix for FW-7656
  it('should set up tab state when used standalone, without ion-tabs', async () => {
    // PascalCase tags here: kebab-case does not resolve to the Vue wrappers
    // in this test.
    const Page = {
      components: { IonPage, IonTabBar, IonTabButton },
      template: `
        <IonPage>
          <IonTabBar>
            <IonTabButton tab="tab1">Tab 1</IonTabButton>
            <IonTabButton tab="tab2">Tab 2</IonTabButton>
          </IonTabBar>
        </IonPage>
      `,
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Page }
      ]
    });

    router.push('/');
    await router.isReady();

    const errors: unknown[] = [];
    const wrapper = mount(Page, {
      global: {
        plugins: [router, IonicVue],
        config: {
          errorHandler: (err: unknown) => errors.push(err)
        }
      }
    });

    expect(errors).toEqual([]);

    // With no router outlet the first tab is selected during setup.
    const tabBar = wrapper.find('ion-tab-bar').element as HTMLIonTabBarElement;
    expect(tabBar.selectedTab).toEqual('tab1');
    expect(wrapper.findAll('ion-tab-button')).toHaveLength(2);
  })
});
