import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage } from '@ionic/vue';
import { waitForRouter } from './utils';

/**
 * Hash history is a public export of @ionic/vue-router but had no direct
 * test coverage. These tests pin its behavior so the vue-router v4 -> v5
 * upgrade can be verified against a known baseline. Includes a regression
 * check that percent-encoded query values are decoded exactly once.
 */

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
};

const PageOne = {
  components: { IonPage },
  name: 'PageOne',
  template: '<ion-page data-pageid="page-one">Page 1</ion-page>',
};

const PageTwo = {
  components: { IonPage },
  name: 'PageTwo',
  template: '<ion-page data-pageid="page-two">Page 2</ion-page>',
};

describe('createWebHashHistory', () => {
  it('mounts an outlet and renders the initial route', async () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes: [
        { path: '/', component: PageOne },
        { path: '/page-two', component: PageTwo },
      ],
    });

    router.push('/');
    await router.isReady();

    const wrapper = mount(App, {
      global: { plugins: [router, IonicVue] },
    });
    await waitForRouter();

    expect(wrapper.findComponent(PageOne).exists()).toBe(true);
    expect(wrapper.findComponent(PageTwo).exists()).toBe(false);
  });

  it('navigates between routes via push and back', async () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes: [
        { path: '/', component: PageOne },
        { path: '/page-two', component: PageTwo },
      ],
    });

    router.push('/');
    await router.isReady();

    const wrapper = mount(App, {
      global: { plugins: [router, IonicVue] },
    });
    await waitForRouter();

    router.push('/page-two');
    await waitForRouter();
    expect(wrapper.findComponent(PageTwo).exists()).toBe(true);

    router.back();
    await waitForRouter();
    expect(wrapper.findComponent(PageTwo).exists()).toBe(false);
    expect(wrapper.findComponent(PageOne).exists()).toBe(true);
  });

  it('preserves percent-encoded query values without double decoding', async () => {
    // %2520 must decode exactly once to %20, never to a literal space.
    // @ionic/vue-router re-exports vue-router's parser, so this pins
    // consumer-visible query semantics across the upgrade.
    const router = createRouter({
      history: createWebHashHistory(),
      routes: [
        { path: '/', component: PageOne },
        { path: '/page-two', component: PageTwo },
      ],
    });

    router.push('/');
    await router.isReady();
    mount(App, { global: { plugins: [router, IonicVue] } });
    await waitForRouter();

    router.push('/page-two?q=%2520');
    await waitForRouter();

    expect(router.currentRoute.value.query.q).toBe('%20');
  });

  it('supports query objects on push', async () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes: [
        { path: '/', component: PageOne },
        { path: '/page-two', component: PageTwo },
      ],
    });

    router.push('/');
    await router.isReady();
    mount(App, { global: { plugins: [router, IonicVue] } });
    await waitForRouter();

    router.push({ path: '/page-two', query: { foo: 'bar baz', list: ['a', 'b'] } });
    await waitForRouter();

    expect(router.currentRoute.value.query.foo).toBe('bar baz');
    expect(router.currentRoute.value.query.list).toEqual(['a', 'b']);
  });
});
