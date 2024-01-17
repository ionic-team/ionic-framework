import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import {
  IonicVue,
  IonApp,
  IonRouterOutlet,
  IonPage,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  useIonRouter
} from '@ionic/vue';
import { onBeforeRouteLeave } from 'vue-router';
import { waitForRouter } from './utils';

enableAutoUnmount(afterEach);

const BasePage = {
  template: '<ion-page :data-pageid="name"></ion-page>',
  components: { IonPage },
}

describe('Routing', () => {
  it('should pass no props', async () => {
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      props: {
        title: { type: String, default: 'Default Title' }
      }
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Page1 }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const cmp = wrapper.findComponent(Page1);
    expect(cmp.props()).toEqual({ title: 'Default Title' });
  });

  it('should pass route props as an object', async () => {
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      props: {
        title: { type: String, default: 'Default Title' }
      }
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Page1, props: { title: 'Page 1 Title' } }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const cmp = wrapper.findComponent(Page1);
    expect(cmp.props()).toEqual({ title: 'Page 1 Title' });
  });

  it('should pass route props as a function', async () => {
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      props: {
        title: { type: String, default: 'Default Title' }
      }
    };

    const propsFn = vi.fn((route) => {
      return { title: `${route.params.id} Title` }
    });

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/myPath/:id', component: Page1, props: propsFn },
        { path: '/otherPage', component: Page1 }
      ]
    });

    router.push('/myPath/123');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const cmp = wrapper.findComponent(Page1);
    expect(cmp.props()).toEqual({ title: '123 Title' });

    router.push('/otherPage');
    await waitForRouter();

    expect(propsFn.mock.calls.length).toBe(1);

    router.back();
    await waitForRouter();

    expect(propsFn.mock.calls.length).toBe(1);

    expect(cmp.props()).toEqual({ title: '123 Title' });
  });

  it('should pass route params as props', async () => {
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      props: {
        title: { type: String, default: 'Default Title' }
      }
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/:title', component: Page1, props: true }
      ]
    });

    router.push('/myPath');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const cmp = wrapper.findComponent(Page1);
    expect(cmp.props()).toEqual({ title: 'myPath' });
  });

  it('should call vue router hooks properly', async () => {
    const leaveHook = vi.fn();
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      setup() {
        onBeforeRouteLeave(leaveHook);
      }
    };

    const Page2 = {
      ...BasePage,
      name: 'Page2',
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Page1 },
        { path: '/page2', component: Page2 }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    // Navigate to 2nd page
    router.push('/page2');
    await waitForRouter();

    expect(leaveHook).toBeCalled();
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22492
  it('should show correct view when replacing', async () => {
    const Tabs = {
      components: { IonPage, IonTabs, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet },
      name: 'Tabs',
      template: `
        <ion-page>
          <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="top">
              <ion-tab-button tab="tab1" href="/tabs/tab1">
                <ion-label>Tab 1</ion-label>
              </ion-tab-button>
              <ion-tab-button tab="tab2" href="/tabs/tab2">
                <ion-label>Tab 2</ion-label>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-tabs>
        </ion-page>
      `,
    }
    const Tab1 = {
      components: { IonPage },
      name: 'Tab1',
      template: `<ion-page>Tab 1</ion-page>`
    }
    const Tab2 = {
      components: { IonPage },
      name: 'Tab2',
      template: `<ion-page>Tab 2</ion-page>`
    }
    const Parent = {
      ...BasePage,
      name: 'Parent',
      template: `<ion-page>Parent Page</ion-page>`
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', redirect: '/tabs/tab1' },
        { path: '/parent', component: Parent },
        {
          path: '/tabs/', component: Tabs, children: [
            { path: '/', redirect: 'tab1' },
            { path: 'tab1', component: Tab1 },
            { path: 'tab2', component: Tab2 }
          ]
        }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(Tabs, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    // Go to Tab 2
    const tabButtons = wrapper.findAllComponents(IonTabButton);
    tabButtons[1].trigger('click');
    await waitForRouter();

    expect(wrapper.findComponent(Tab2).exists()).toBe(true);
    expect(wrapper.findComponent(Parent).exists()).toBe(false);

    router.replace('/parent')
    await waitForRouter();

    expect(wrapper.findComponent(Parent).exists()).toBe(true);
    expect(wrapper.findComponent(Tabs).exists()).toBe(false);

    router.replace('/tabs/tab1');
    await waitForRouter();

    expect(wrapper.findComponent(Parent).exists()).toBe(false);
    expect(wrapper.findComponent(Tab1).exists()).toBe(true);
    expect(wrapper.findComponent(Tab2).exists()).toBe(false);
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23043
  it('should show the latest props passed to a route', async () => {
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      props: {
        title: { type: String, default: 'Default Title' }
      }
    };

    const Home = {
      ...BasePage,
      name: 'Home',
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Home },
        { path: '/:title', component: Page1, props: true }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/abc');
    await waitForRouter();

    const cmp = wrapper.findComponent(Page1);
    expect(cmp.props()).toEqual({ title: 'abc' });

    router.back();
    await waitForRouter();

    router.push('/xyz');
    await waitForRouter();

    const cmpAgain = wrapper.findAllComponents(Page1);

    expect(cmpAgain.length).toEqual(1);
    expect(cmpAgain[0].props()).toEqual({ title: 'xyz' });
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23043
  it('should call the props function again when params change', async () => {
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      props: {
        title: { type: String, default: 'Default Title' }
      }
    };

    const Home = {
      ...BasePage,
      name: 'Home',
    }

    const propsFn = vi.fn((route) => {
      return { title: `${route.params.id} Title` }
    });

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/myPath/:id', component: Page1, props: propsFn },
        { path: '/', component: Home }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/myPath/123');
    await waitForRouter();

    const cmp = wrapper.findComponent(Page1);
    expect(propsFn.mock.calls.length).toBe(1);
    expect(cmp.props()).toEqual({ title: '123 Title' });

    router.back();
    await waitForRouter();

    router.push('/myPath/abc');
    await waitForRouter();

    expect(propsFn.mock.calls.length).toBe(2);
    const cmpAgain = wrapper.findAllComponents(Page1);

    expect(cmpAgain.length).toEqual(1);
    expect(cmpAgain[0].props()).toEqual({ title: 'abc Title' });
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/pull/23189
  it('should update props on a parameterized url', async () => {
    const Page = {
      name: 'Page',
      props: {
        id: { type: String, default: 'Default ID' }
      },
      components: { IonPage },
      template: `<ion-page>{{ $props.id }}</ion-page>`
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/page/:id', component: Page, props: true },
        { path: '/', redirect: '/page/1' }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const page = wrapper.findComponent(Page);
    expect(page.props()).toEqual({ id: '1' });

    router.push('/page/2');
    await waitForRouter();

    const pageAgain = wrapper.findAllComponents(Page);
    expect(pageAgain[0].props()).toEqual({ id: '1' });
    expect(pageAgain[1].props()).toEqual({ id: '2' });
  });

  it('should fire guard written in a component', async () => {
    const beforeRouteEnterSpy = vi.fn();
    const beforeRouteLeaveSpy = vi.fn();
    const Page = {
      beforeRouteEnter() {
        beforeRouteEnterSpy();
      },
      beforeRouteLeave() {
        beforeRouteLeaveSpy();
      },
      name: 'Page',
      components: { IonPage },
      template: `<ion-page></ion-page>`
    }
    const Page2 = {
      components: { IonPage },
      name: 'Page2',
      template: `<ion-page></ion-page>`
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/page', component: Page },
        { path: '/page2', component: Page2 },
        { path: '/', redirect: '/page' }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    expect(beforeRouteEnterSpy).toHaveBeenCalledTimes(1);

    router.push('/page2');
    await waitForRouter();

    expect(beforeRouteLeaveSpy).toHaveBeenCalledTimes(1);

    router.back();
    await waitForRouter();

    expect(beforeRouteEnterSpy).toHaveBeenCalledTimes(2);
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24109
  it('canGoBack() should return the correct value', async () => {
    const Page = {
      components: { IonPage },
      name: 'Page',
      template: `<ion-page></ion-page>`
    }
    const Page2 = {
      components: { IonPage },
      name: 'Page2',
      template: `<ion-page></ion-page>`
    }
    const AppWithInject = {
      components: { IonApp, IonRouterOutlet },
      name: 'AppWithInject',
      template: '<ion-app><ion-router-outlet /></ion-app>',
      setup() {
        const ionRouter = useIonRouter();
        return { ionRouter }
      }
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Page },
        { path: '/page2', component: Page2 }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(AppWithInject, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const ionRouter = wrapper.vm.ionRouter;
    expect(ionRouter.canGoBack()).toEqual(false);

    router.push('/page2');
    await waitForRouter();

    expect(ionRouter.canGoBack()).toEqual(true);

    router.back();
    await waitForRouter();

    expect(ionRouter.canGoBack()).toEqual(false);
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24109
  it('canGoBack() should return the correct value when using router.go', async () => {
    const Page = {
      components: { IonPage },
      name: 'Page',
      template: `<ion-page></ion-page>`
    }
    const Page2 = {
      components: { IonPage },
      name: 'Page2',
      template: `<ion-page></ion-page>`
    }
    const Page3 = {
      components: { IonPage },
      name: 'Page3',
      template: `<ion-page></ion-page>`
    }
    const AppWithInject = {
      components: { IonApp, IonRouterOutlet },
      name: 'AppWithInject',
      template: '<ion-app><ion-router-outlet /></ion-app>',
      setup() {
        const ionRouter = useIonRouter();
        return { ionRouter }
      }
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Page },
        { path: '/page2', component: Page2 },
        { path: '/page3', component: Page3 },
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(AppWithInject, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const ionRouter = wrapper.vm.ionRouter;
    expect(ionRouter.canGoBack()).toEqual(false);

    router.push('/page2');
    await waitForRouter();

    expect(ionRouter.canGoBack()).toEqual(true);

    router.push('/page3');
    await waitForRouter();

    expect(ionRouter.canGoBack()).toEqual(true);

    router.go(-2);
    await waitForRouter();

    expect(ionRouter.canGoBack()).toEqual(false);

    router.go(2);
    await waitForRouter();

    expect(ionRouter.canGoBack()).toEqual(true);
  });

  it('should not mount intermediary components when delta is 1', async () => {
    const Page = {
      components: { IonPage },
      name: 'Page',
      template: `<ion-page></ion-page>`
    }
    const Page2 = {
      components: { IonPage },
      name: 'Page2',
      template: `<ion-page></ion-page>`
    }
    const Page3 = {
      components: { IonPage },
      name: 'Page3',
      template: `<ion-page></ion-page>`
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/page', component: Page },
        { path: '/page2', component: Page2 },
        { path: '/page3', component: Page3 },
        { path: '/', redirect: '/page' }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    expect(wrapper.findComponent(Page).exists()).toBe(true);

    router.push('/page2');
    await waitForRouter();

    expect(wrapper.findComponent(Page2).exists()).toBe(true);

    router.back();
    await waitForRouter();

    expect(wrapper.findComponent(Page2).exists()).toBe(false);

    router.push('/page3');
    await waitForRouter();

    expect(wrapper.findComponent(Page2).exists()).toBe(false);
    expect(wrapper.findComponent(Page3).exists()).toBe(true);
  });

  it('should unmount intermediary components when using router.go', async () => {
    const Page = {
      components: { IonPage },
      name: 'Page',
      template: `<ion-page></ion-page>`
    }
    const Page2 = {
      components: { IonPage },
      name: 'Page2',
      template: `<ion-page></ion-page>`
    }
    const Page3 = {
      components: { IonPage },
      name: 'Page3',
      template: `<ion-page></ion-page>`
    }

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/page', component: Page },
        { path: '/page2', component: Page2 },
        { path: '/page3', component: Page3 },
        { path: '/', redirect: '/page' }
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/page2');
    await waitForRouter();

    router.push('/page3');
    await waitForRouter();

    expect(wrapper.findComponent(Page2).exists()).toBe(true);
    expect(wrapper.findComponent(Page3).exists()).toBe(true);

    router.go(-2);
    await waitForRouter();

    expect(wrapper.findComponent(Page).exists()).toBe(true);
    expect(wrapper.findComponent(Page2).exists()).toBe(false);
    expect(wrapper.findComponent(Page3).exists()).toBe(false);
  });
});
