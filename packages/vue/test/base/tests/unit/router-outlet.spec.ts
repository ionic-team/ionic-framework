import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import {
  IonicVue,
  IonRouterOutlet,
  IonPage,
  useIonRouter,
} from '@ionic/vue';
import { mockAnimation, waitForRouter } from './utils';

enableAutoUnmount(afterEach);

const BasePage = {
  template: '<ion-page :data-pageid="name"></ion-page>',
  components: { IonPage },
}

/**
 * While these tests use useIonRouter,
 * they are different from the tests in hook.spec.ts
 * in that they are testing that the correct parameters
 * are passed to IonRouterOutlet as opposed to hook.spec.ts
 * which makes sure that the animation function is called when
 * specifically using useIonRouter.
 */
describe('Routing', () => {
  it('should have an animation duration of 0 if replacing without an explicit animation', async () => {
    const Page1 = {
      ...BasePage,
      setup() {
        const ionRouter = useIonRouter();
        const redirect = () => {
          ionRouter.replace('/page2')
        }

        return { redirect }
      }
    };

    const Page2 = {
      ...BasePage
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

    /**
     * Mock the commit function on IonRouterOutlet
     */
    const commitFn = vi.fn();
    const routerOutlet = wrapper.findComponent(IonRouterOutlet);
    routerOutlet.vm.$el.commit = commitFn;

    // call redirect method on Page1
    const cmp = wrapper.findComponent(Page1);
    cmp.vm.redirect();
    await waitForRouter();

    expect(commitFn).toBeCalledWith(
      /**
       * We are not checking the first 2
       * params in this test,
       * so we can use expect.anything().
       */
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        direction: "none",
        duration: 0,
        animationBuilder: undefined
      })
    )
  });

  it('should have an animation duration of null if replacing with an explicit animation', async () => {
    const animation = mockAnimation();
    const Page1 = {
      ...BasePage,
      setup() {
        const ionRouter = useIonRouter();
        const redirect = () => {
          ionRouter.replace('/page2', animation)
        }

        return { redirect }
      }
    };

    const Page2 = {
      ...BasePage
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

    /**
     * Mock the commit function on IonRouterOutlet
     */
    const commitFn = vi.fn();
    const routerOutlet = wrapper.findComponent(IonRouterOutlet);
    routerOutlet.vm.$el.commit = commitFn;

    // call redirect method on Page1
    const cmp = wrapper.findComponent(Page1);
    cmp.vm.redirect();
    await waitForRouter();

    expect(commitFn).toBeCalledWith(
      /**
       * We are not checking the first 2
       * params in this test,
       * so we can use expect.anything().
       */
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        direction: "none",
        duration: undefined,
        animationBuilder: animation
      })
    )
  });
});

/**
 * These tests verify that handlePageTransition does not
 * throw when enteringViewItem.ionPageElement is undefined.
 * This can happen when a page component is missing the
 * required <ion-page> wrapper.
 */
describe('handlePageTransition - undefined enteringEl', () => {
  const enteringViewItem = {
    ionPageElement: undefined,
    vueComponent: {},
    vueComponentRef: {},
    routerAnimation: undefined,
    mount: true,
    matchedRoute: { path: '/' },
    pathname: '/',
  };

  const leavingViewItem = {
    ionPageElement: document.createElement('div'),
    vueComponent: {},
    vueComponentRef: {},
    routerAnimation: undefined,
    mount: true,
    matchedRoute: { path: '/page2' },
    pathname: '/page2',
  };

  const mockViewStacks = {
    getViewStack: vi.fn().mockReturnValue([enteringViewItem, leavingViewItem]),
    findViewItemByRouteInfo: vi.fn().mockReturnValue(enteringViewItem),
    findLeavingViewItemByRouteInfo: vi.fn().mockReturnValue(leavingViewItem),
    getChildrenToRender: vi.fn().mockReturnValue([]),
    createViewItem: vi.fn().mockReturnValue(enteringViewItem),
    add: vi.fn(),
    clear: vi.fn(),
    registerIonPage: vi.fn(),
    size: vi.fn().mockReturnValue(1),
    findViewItemByPathname: vi.fn(),
    unmountLeavingViews: vi.fn(),
    mountIntermediaryViews: vi.fn(),
  };

  const mockNavManager = {
    getLeavingRouteInfo: vi.fn().mockReturnValue({
      pathname: '/page2',
      pushedByRoute: '/',
      routerAnimation: undefined,
    }),
    getCurrentRouteInfo: vi.fn().mockReturnValue({
      pathname: '/',
      pushedByRoute: '/',
      routerDirection: 'forward',
      routerAction: 'push',
      routerAnimation: undefined,
      prevRouteLastPathname: '/page2',
      delta: 1,
    }),
    canGoBack: vi.fn().mockReturnValue(false),
    handleNavigateBack: vi.fn(),
  };

  const mountOutlet = async () => {
    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: BasePage },
        { path: '/page2', component: BasePage }
      ]
    });

    router.push('/');
    await router.isReady();

    return mount(IonRouterOutlet, {
      global: {
        plugins: [router, IonicVue],
        provide: {
          navManager: mockNavManager,
          viewStacks: mockViewStacks,
        }
      }
    });
  };

  it('should warn when enteringEl is undefined', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    await mountOutlet();
    await waitForRouter();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('does not have the required <ion-page> component')
    );

    warnSpy.mockRestore();
  });

  it('should not call transition when enteringEl is undefined', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => { });

    const commitFn = vi.fn();
    const wrapper = await mountOutlet();
    wrapper.findComponent(IonRouterOutlet).vm.$el.commit = commitFn;

    await waitForRouter();

    expect(commitFn).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
