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
