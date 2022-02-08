import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage, IonTabs, IonTabBar } from '@ionic/vue';

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
}

describe('ion-tab-bar', () => {
  it('should render in the top slot', async () => {
    const Tabs = {
      components: { IonPage, IonTabs, IonTabBar, IonRouterOutlet },
      template: `
        <ion-page>
          <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="top"></ion-tab-bar>
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
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const tabs = wrapper.findComponent(IonTabs);
    const children = tabs.vm.$el.children;
    expect(children[0].tagName).toEqual('ION-TAB-BAR');
    expect(children[1].tagName).toEqual('DIV');
    expect(children[1].className).toEqual('tabs-inner');

  });

  it('should render in the bottom slot', async () => {
    const Tabs = {
      components: { IonPage, IonTabs, IonTabBar, IonRouterOutlet },
      template: `
        <ion-page>
          <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom"></ion-tab-bar>
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
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const tabs = wrapper.findComponent(IonTabs);
    const children = tabs.vm.$el.children;
    expect(children[0].tagName).toEqual('DIV');
    expect(children[0].className).toEqual('tabs-inner');
    expect(children[1].tagName).toEqual('ION-TAB-BAR');
  });

  it('should render in the default slot', async () => {
    const Tabs = {
      components: { IonPage, IonTabs, IonTabBar, IonRouterOutlet },
      template: `
        <ion-page>
          <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar></ion-tab-bar>
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
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const tabs = wrapper.findComponent(IonTabs);
    const children = tabs.vm.$el.children;
    const tabsInner = children[0];
    expect(tabsInner.tagName).toEqual('DIV');
    expect(tabsInner.className).toEqual('tabs-inner');
    expect(tabsInner.children[0].tagName).toEqual('ION-ROUTER-OUTLET');
  });

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
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const innerHTML = wrapper.find('ion-tabs').html();

    const tabs = wrapper.findComponent(IonTabBar);
    const children = tabs.vm.$el.childNodes;

    // 8 is a comment node: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    expect(children[0].nodeType).toEqual(8);
  })
});
