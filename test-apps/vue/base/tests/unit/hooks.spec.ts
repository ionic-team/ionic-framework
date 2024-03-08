import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonRouterOutlet, IonPage, useIonRouter } from '@ionic/vue';
import { mockAnimation, waitForRouter } from './utils';

const BasePage = {
  template: '<ion-page></ion-page>',
  components: { IonPage },
}

describe('useIonRouter', () => {
  it('should correctly navigate back', async () => {
    const Page1 = {
      ...BasePage
    };

    const Page2 = {
      ...BasePage,
      name: 'Page2',
      setup() {
        const ionRouter = useIonRouter();

        return { ionRouter };
      }
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

    router.push('/page2');
    await waitForRouter();

    const cmp = wrapper.findComponent(Page2);
    const vm = cmp.vm as any;
    const animFn = mockAnimation();

    vm.ionRouter.back(animFn);
    await waitForRouter();

    expect(router.currentRoute.value.path).toEqual('/');
    expect(animFn).toHaveBeenCalled();
  });

  it('should correctly navigate forward', async () => {
    const Page1 = {
      ...BasePage
    };

    const Page2 = {
      ...BasePage,
      name: 'Page2',
      setup() {
        const ionRouter = useIonRouter();

        return { ionRouter };
      }
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

    router.push('/page2');
    await waitForRouter();

    const cmp = wrapper.findComponent(Page2);
    const vm = cmp.vm as any;
    const animFn = mockAnimation();

    vm.ionRouter.back();
    await waitForRouter();

    expect(router.currentRoute.value.path).toEqual('/');

    vm.ionRouter.forward(animFn);
    await waitForRouter();

    expect(router.currentRoute.value.path).toEqual('/page2');
    expect(animFn).toHaveBeenCalled();
  })

  it('should correctly push a page', async () => {
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      setup() {
        const ionRouter = useIonRouter();

        return { ionRouter };
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

    const cmp = wrapper.findComponent(Page1);
    const vm = cmp.vm as any;
    const animFn = mockAnimation();

    vm.ionRouter.push('/page2', animFn);
    await waitForRouter();

    expect(router.currentRoute.value.path).toEqual('/page2');
    expect(animFn).toHaveBeenCalled();
  });

  it('should correctly replace a page', async () => {
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      setup() {
        const ionRouter = useIonRouter();

        return { ionRouter };
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

    const cmp = wrapper.findComponent(Page1);
    const vm = cmp.vm as any;
    const animFn = mockAnimation();

    vm.ionRouter.replace('/page2', animFn);
    await waitForRouter();

    expect(router.currentRoute.value.path).toEqual('/page2');

    // Animation should still be called even though this is a replace operation
    expect(animFn).toHaveBeenCalled();

    expect(vm.ionRouter.canGoBack()).toEqual(false);
  })

  it('should correctly navigate', async () => {
    const Page1 = {
      ...BasePage,
      name: 'Page1',
      setup() {
        const ionRouter = useIonRouter();

        return { ionRouter };
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

    const cmp = wrapper.findComponent(Page1);
    const vm = cmp.vm as any;
    const animFn = mockAnimation();

    vm.ionRouter.navigate('/page2', 'forward', 'push', animFn);
    await waitForRouter();

    expect(router.currentRoute.value.path).toEqual('/page2');
    expect(animFn).toHaveBeenCalled();
  })
})
