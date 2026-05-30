import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonRouterOutlet, IonPage, IonTabs, IonTabBar } from '@ionic/vue';

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
});
