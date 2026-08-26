import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
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
import {
  isNavigationFailure,
  NavigationFailureType,
  onBeforeRouteLeave
} from 'vue-router';
import { inject } from 'vue';
import { waitForRouter } from './utils';

enableAutoUnmount(afterEach);

const BasePage = {
  template: '<ion-page :data-pageid="name"></ion-page>',
  components: { IonPage },
}

/*
 * Kept separate from BasePage because BasePage binds `:data-pageid="name"`, and
 * a component's name option is not reachable from its template in Vue 3, so
 * that attribute renders empty.
 */
const createPage = (id: string) => ({
  components: { IonPage },
  name: id,
  template: `<ion-page data-pageid="${id}"></ion-page>`
});

/*
 * Ionic keeps previously visited pages mounted so they can be animated back to,
 * hiding the inactive ones with `ion-page-hidden`. Asserting on the whole stack
 * catches both a wrong visible page and a page that was destroyed when it
 * should have been kept.
 */
const viewStack = (wrapper: any) =>
  wrapper.findAll('.ion-page').map((page: any) => ({
    id: page.attributes('data-pageid'),
    hidden: page.classes('ion-page-hidden')
  }));

const currentRoute = (navManager: any) => {
  const routeInfo = navManager.getCurrentRouteInfo();

  return {
    pathname: routeInfo.pathname,
    routerAction: routeInfo.routerAction,
    routerDirection: routeInfo.routerDirection
  };
};

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
            <IonRouterOutlet />
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

    router.push('/tabs/tab1');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
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

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/25013
  it('should run beforeRouteEnter next() callback with the component instance', async () => {
    const enterCallbackSpy = vi.fn();
    const Page = {
      data() {
        return { member: 0 };
      },
      beforeRouteEnter(_to: any, _from: any, next: (cb: (vm: any) => void) => void) {
        next((vm: any) => {
          enterCallbackSpy(vm);
          vm.member = 5;
        });
      },
      name: 'PageWithEnterCb',
      components: { IonPage },
      template: `<ion-page><span data-test="member">{{ member }}</span></ion-page>`
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: { template: '<ion-page></ion-page>', components: { IonPage } } },
        { path: '/page', component: Page },
      ]
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/page');
    await waitForRouter();

    expect(enterCallbackSpy).toHaveBeenCalledTimes(1);
    const instance = enterCallbackSpy.mock.calls[0][0];
    expect(instance).toBeDefined();
    expect(instance.member).toBe(5);
    expect(wrapper.find('[data-test="member"]').text()).toBe('5');
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

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/29721
  it('should keep the previous page when pushing after a guard blocks going back', async () => {
    /*
     * The pages are rendered inside the outlet, so injecting from one of them
     * reaches the router the same way useIonRouter does, without wrapping the
     * outlet in another component.
     */
    let navManager: any;
    const Home = {
      ...createPage('home'),
      setup() {
        navManager = inject('navManager');
      }
    };
    const Register = createPage('register');
    const Profile = createPage('profile');

    let isLoggedIn = false;

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/register', component: Register },
        { path: '/profile', component: Profile }
      ]
    });

    /*
     * Leaving the authenticated route while still logged in is blocked, which
     * aborts the navigation. An aborted back navigation used to leave stale
     * navigation info behind, which then made the next navigation look like
     * history traversal.
     */
    router.beforeEach((to, from) => {
      if (from.path === '/profile' && to.path !== '/profile' && isLoggedIn) {
        return false;
      }

      return true;
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/register');
    await waitForRouter();

    isLoggedIn = true;
    router.replace('/profile');
    await waitForRouter();

    expect(viewStack(wrapper)).toEqual([
      { id: 'home', hidden: true },
      { id: 'profile', hidden: false }
    ]);

    // The guard blocks this, so the stack should be untouched.
    router.back();
    await waitForRouter();

    expect(viewStack(wrapper)).toEqual([
      { id: 'home', hidden: true },
      { id: 'profile', hidden: false }
    ]);

    /*
     * Logging out is a push, so Profile stays in the stack behind Home and the
     * route is recorded as a forward push. The stale delta from the blocked
     * back navigation used to make this look like history traversal, which
     * recorded it as a pop going back and destroyed the Profile view.
     */
    isLoggedIn = false;
    router.push('/home');
    await waitForRouter();

    expect(viewStack(wrapper)).toEqual([
      { id: 'home', hidden: false },
      { id: 'profile', hidden: true }
    ]);
    expect(currentRoute(navManager)).toEqual({
      pathname: '/home',
      routerAction: 'push',
      routerDirection: 'forward'
    });

    router.push('/profile');
    await waitForRouter();

    expect(viewStack(wrapper)).toEqual([
      { id: 'home', hidden: true },
      { id: 'profile', hidden: false }
    ]);
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/29721
  it('should keep canGoBack accurate after a guard blocks a programmatic back', async () => {
    const Home = createPage('home');
    const Profile = createPage('profile');
    const Settings = createPage('settings');

    const AppWithInject = {
      components: { IonApp, IonRouterOutlet },
      name: 'AppWithInject',
      template: '<ion-app><ion-router-outlet /></ion-app>',
      setup() {
        const ionRouter = useIonRouter();
        return { ionRouter };
      }
    };

    let isLoggedIn = false;

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/profile', component: Profile },
        { path: '/settings', component: Settings }
      ]
    });

    router.beforeEach((to, from) => {
      if (from.path === '/profile' && to.path !== '/profile' && isLoggedIn) {
        return false;
      }

      return true;
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(AppWithInject, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const ionRouter = wrapper.vm.ionRouter;

    router.push('/profile');
    await waitForRouter();

    expect(ionRouter.canGoBack()).toEqual(true);

    /*
     * useIonRouter's back() stages route params before handing off to the
     * router. The guard blocks the navigation, so those params used to be left
     * behind and then applied to the next route instead.
     */
    isLoggedIn = true;
    ionRouter.back();
    await waitForRouter();

    /*
     * Navigating with vue-router rather than useIonRouter matters here. The
     * useIonRouter helpers stage their own route params, which would overwrite
     * the leftovers and hide the problem.
     */
    isLoggedIn = false;
    router.push('/settings');
    await waitForRouter();

    expect(ionRouter.canGoBack()).toEqual(true);
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/29721
  it('should not apply a cancelled back navigation to the navigation that replaced it', async () => {
    let navManager: any;
    const Home = {
      ...createPage('home'),
      setup() {
        navManager = inject('navManager');
      }
    };
    const Profile = createPage('profile');
    const Settings = createPage('settings');

    let racing = false;
    let releaseBack!: () => void;
    let releasePush!: () => void;
    let backReachedGuard: () => void;
    let cancelReported: () => void;

    const backStarted = new Promise((resolve) => {
      backReachedGuard = resolve as () => void;
    });
    const backCancelled = new Promise((resolve) => {
      cancelReported = resolve as () => void;
    });

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/home', component: Home },
        { path: '/profile', component: Profile },
        { path: '/settings', component: Settings }
      ]
    });

    /*
     * Both navigations are held inside their guards so the test controls the
     * order they finish in, rather than relying on timing. The back navigation
     * is released first so it reports its cancellation before the push that
     * replaced it completes.
     */
    router.beforeEach(async (to) => {
      if (!racing) {
        return true;
      }

      if (to.path === '/home') {
        backReachedGuard();
        await new Promise((resolve) => {
          releaseBack = resolve as () => void;
        });
      }

      if (to.path === '/settings') {
        await new Promise((resolve) => {
          releasePush = resolve as () => void;
        });
      }

      return true;
    });

    router.afterEach((_to, _from, failure) => {
      if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
        cancelReported();
      }
    });

    router.push('/home');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/profile');
    await waitForRouter();

    racing = true;

    // Start going back, and wait until it is actually in flight.
    router.back();
    await backStarted;

    // Replace it with a push while it is still in flight.
    router.push('/settings');
    await flushPromises();

    // Let the back navigation finish, which reports it as cancelled.
    releaseBack();
    await backCancelled;

    // Only now let the push finish, so it is the one reading any staged state.
    releasePush();
    await waitForRouter();

    expect(viewStack(wrapper)).toEqual([
      { id: 'home', hidden: true },
      { id: 'profile', hidden: true },
      { id: 'settings', hidden: false }
    ]);
    expect(currentRoute(navManager)).toEqual({
      pathname: '/settings',
      routerAction: 'push',
      routerDirection: 'forward'
    });
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/29721
  it('should not reuse the previous route after a guard blocks a back button navigation', async () => {
    let navManager: any;
    const Home = {
      ...createPage('home'),
      setup() {
        navManager = inject('navManager');
      }
    };
    const Profile = createPage('profile');
    const Settings = createPage('settings');

    let isLoggedIn = false;

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/profile', component: Profile },
        { path: '/settings', component: Settings }
      ]
    });

    router.beforeEach((to, from) => {
      if (from.path === '/profile' && to.path !== '/profile' && isLoggedIn) {
        return false;
      }

      return true;
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/profile');
    await waitForRouter();

    /*
     * ion-back-button calls handleNavigateBack, which stages the whole previous
     * route rather than just an action and direction. Those params carry an id,
     * and a staged id makes handleHistoryChange reuse the params wholesale, so
     * a stale set would report the previous route's pathname for whatever is
     * navigated to next.
     */
    isLoggedIn = true;
    navManager.handleNavigateBack();
    await waitForRouter();

    isLoggedIn = false;
    router.push('/settings');
    await waitForRouter();

    expect(currentRoute(navManager)).toEqual({
      pathname: '/settings',
      routerAction: 'push',
      routerDirection: 'forward'
    });
  });

  // Guards against clearing params that belong to another navigation still in flight.
  it('should keep the route params of a navigation that replaced a cancelled one', async () => {
    let navManager: any;

    const Home = {
      ...createPage('home'),
      setup() {
        navManager = inject('navManager');
      }
    };
    const Slow = createPage('slow');
    const Login = createPage('login');

    let racing = false;
    let releaseSlow!: () => void;
    let releaseLogin!: () => void;
    let slowReachedGuard: () => void;
    let loginReachedGuard: () => void;
    let cancelReported: () => void;

    const slowStarted = new Promise((resolve) => {
      slowReachedGuard = resolve as () => void;
    });
    const loginStarted = new Promise((resolve) => {
      loginReachedGuard = resolve as () => void;
    });
    const pushCancelled = new Promise((resolve) => {
      cancelReported = resolve as () => void;
    });

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/slow', component: Slow },
        { path: '/login', component: Login }
      ]
    });

    /*
     * Neither navigation here is a history traversal, so no delta is ever
     * staged. The staged params are the only state in play, which is why they
     * need a target of their own to be told apart.
     */
    router.beforeEach(async (to) => {
      if (!racing) {
        return true;
      }

      if (to.path === '/slow') {
        slowReachedGuard();
        await new Promise((resolve) => {
          releaseSlow = resolve as () => void;
        });
      }

      if (to.path === '/login') {
        loginReachedGuard();
        await new Promise((resolve) => {
          releaseLogin = resolve as () => void;
        });
      }

      return true;
    });

    router.afterEach((_to, _from, failure) => {
      if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
        cancelReported();
      }
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    racing = true;

    /*
     * These are what useIonRouter's push and replace call through to, used
     * directly so the outlet can stay the mounted component.
     */
    navManager.handleNavigate('/slow', 'push', 'forward');
    await slowStarted;

    // Logging out replaces it, staging its own params on the way.
    navManager.handleNavigate('/login', 'replace', 'root');
    await loginStarted;

    // Let the push finish, which reports it as cancelled.
    releaseSlow();
    await pushCancelled;

    // Only now let the replace finish, so it is the one reading staged params.
    releaseLogin();
    await waitForRouter();

    expect(currentRoute(navManager)).toEqual({
      pathname: '/login',
      routerAction: 'replace',
      routerDirection: 'root'
    });

    /*
     * A root replace clears the history, so Login is the only page left. Losing
     * the staged params drops the root direction, and the pages behind it stay.
     */
    expect(viewStack(wrapper)).toEqual([{ id: 'login', hidden: false }]);
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/29721
  it('should not apply the params of a blocked replace to the next navigation', async () => {
    let navManager: any;

    const Home = {
      ...createPage('home'),
      setup() {
        navManager = inject('navManager');
      }
    };
    const Blocked = createPage('blocked');
    const Other = createPage('other');

    let blocking = false;

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/blocked', component: Blocked },
        { path: '/other', component: Other }
      ]
    });

    router.beforeEach((to) => {
      if (blocking && to.path === '/blocked') {
        return false;
      }

      return true;
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    /*
     * A root replace stages its own params and records where they were meant
     * for, then the guard blocks it. Leaving those behind hands a root replace
     * to the next navigation, which clears the history it should have kept.
     */
    blocking = true;
    navManager.handleNavigate('/blocked', 'replace', 'root');
    await waitForRouter();

    router.push('/other');
    await waitForRouter();

    expect(currentRoute(navManager)).toEqual({
      pathname: '/other',
      routerAction: 'push',
      routerDirection: 'forward'
    });

    // A leaked root replace clears the history, which would drop Home.
    expect(viewStack(wrapper)).toEqual([
      { id: 'home', hidden: true },
      { id: 'other', hidden: false }
    ]);
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/29721
  it('should show the correct view after a guard rejects instead of returning false', async () => {
    let navManager: any;

    const Home = {
      ...createPage('home'),
      setup() {
        navManager = inject('navManager');
      }
    };
    const Profile = createPage('profile');
    const Settings = createPage('settings');

    let sessionValid = true;

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/profile', component: Profile },
        { path: '/settings', component: Settings }
      ]
    });

    /*
     * A session check that rejects rather than returning false. vue-router
     * rejects the navigation promise for this, so afterEach never runs and the
     * staged state has to be discarded through onError instead.
     */
    router.beforeEach(async (to, from) => {
      if (from.path === '/profile' && to.path !== '/profile' && !sessionValid) {
        await Promise.reject(new Error('session check failed'));
      }

      return true;
    });

    // Stands in for an app that handles its own navigation errors.
    router.onError(() => {});

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/profile');
    await waitForRouter();

    // Going back rejects inside the guard.
    sessionValid = false;
    router.back();
    await waitForRouter();

    sessionValid = true;
    router.push('/settings');
    await waitForRouter();

    expect(currentRoute(navManager)).toEqual({
      pathname: '/settings',
      routerAction: 'push',
      routerDirection: 'forward'
    });
    expect(viewStack(wrapper)).toEqual([
      { id: 'home', hidden: true },
      { id: 'profile', hidden: true },
      { id: 'settings', hidden: false }
    ]);
  });

  // Guards against clearing params that belong to another navigation still in flight.
  it('should keep the tab params of a tab change that replaced a cancelled push', async () => {
    let navManager: any;

    const TabOne = {
      ...createPage('tabone'),
      setup() {
        navManager = inject('navManager');
      }
    };
    const TabTwo = createPage('tabtwo');
    const Details = createPage('details');

    let guardDelay = 0;

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', redirect: '/tabs/tab1' },
        { path: '/tabs/tab1', component: TabOne },
        { path: '/tabs/tab2', component: TabTwo },
        { path: '/details', component: Details }
      ]
    });

    // A global async guard, the session check kind.
    router.beforeEach(async () => {
      if (guardDelay) {
        await new Promise((resolve) => setTimeout(resolve, guardDelay));
      }

      return true;
    });

    router.push('/');
    await router.isReady();
    mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    /*
     * Both tabs need a routeInfo before changeTab will stage params itself
     * rather than delegating to handleNavigate.
     */
    navManager.changeTab('tab1', '/tabs/tab1');
    await waitForRouter();
    navManager.changeTab('tab2', '/tabs/tab2');
    await waitForRouter();
    navManager.changeTab('tab1', '/tabs/tab1');
    await waitForRouter();

    guardDelay = 400;

    /*
     * Tapping a link and then Tab 2 before the first one finishes. The push
     * is cancelled, and its params used to be cleared along with the tab's,
     * which cost the tab its direction and its tab name.
     */
    navManager.handleNavigate('/details', 'push', 'forward');
    await new Promise((resolve) => setTimeout(resolve, 50));
    navManager.changeTab('tab2', '/tabs/tab2');
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const routeInfo = navManager.getCurrentRouteInfo();

    expect(routeInfo.pathname).toEqual('/tabs/tab2');
    expect(routeInfo.routerDirection).toEqual('none');
    expect(routeInfo.tab).toEqual('tab2');
    // Losing the tab takes the pushed branch, which borrows the previous tab.
    expect(routeInfo.pushedByRoute).toEqual(undefined);
  });

  // Guards against clearing a delta that belongs to another navigation still in flight.
  it('should keep the delta of a back navigation that replaced a cancelled one', async () => {
    let navManager: any;
    const Home = {
      ...createPage('home'),
      setup() {
        navManager = inject('navManager');
      }
    };
    const First = createPage('first');
    const Second = createPage('second');

    let racing = false;
    let releaseFirstBack!: () => void;
    let releaseSecondBack!: () => void;
    let firstBackReachedGuard: () => void;
    let secondBackReachedGuard: () => void;
    let cancelReported: () => void;

    const firstBackStarted = new Promise((resolve) => {
      firstBackReachedGuard = resolve as () => void;
    });
    const secondBackStarted = new Promise((resolve) => {
      secondBackReachedGuard = resolve as () => void;
    });
    const firstBackCancelled = new Promise((resolve) => {
      cancelReported = resolve as () => void;
    });

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/first', component: First },
        { path: '/second', component: Second }
      ]
    });

    /*
     * Both back navigations are held inside their guards so the test controls
     * which one settles first. The second one stages its own navigation info as
     * soon as its popstate lands, which is why the first one must not clear it.
     */
    router.beforeEach(async (to) => {
      if (!racing) {
        return true;
      }

      if (to.path === '/first') {
        firstBackReachedGuard();
        await new Promise((resolve) => {
          releaseFirstBack = resolve as () => void;
        });
      }

      if (to.path === '/home') {
        secondBackReachedGuard();
        await new Promise((resolve) => {
          releaseSecondBack = resolve as () => void;
        });
      }

      return true;
    });

    router.afterEach((_to, _from, failure) => {
      if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
        cancelReported();
      }
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/first');
    await waitForRouter();
    router.push('/second');
    await waitForRouter();

    racing = true;

    // First back, held until the second one is also in flight.
    router.back();
    await firstBackStarted;

    // Second back, which replaces the first and stages its own info.
    router.back();
    await secondBackStarted;

    // Let the first back finish, which reports it as cancelled.
    releaseFirstBack();
    await firstBackCancelled;

    // Only now let the second back finish.
    releaseSecondBack();
    await waitForRouter();

    expect(currentRoute(navManager)).toEqual({
      pathname: '/home',
      routerAction: 'pop',
      routerDirection: 'back'
    });
    expect(viewStack(wrapper)).toEqual([
      { id: 'home', hidden: false },
      { id: 'first', hidden: true }
    ]);
  });
});
