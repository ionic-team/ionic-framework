import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage } from '@ionic/vue';
import { onBeforeRouteLeave } from 'vue-router';
import { waitForRouter } from './utils';

/**
 * vue-router 5.0.3 added a deprecation warning for the next() callback in
 * navigation guards; vue-router 6 will remove next() entirely. These tests
 * ensure that:
 *   1. Our wrapper itself does not invoke any deprecated guard pattern.
 *   2. Consumer code using the modern (return-value) guard pattern works
 *      end-to-end through our outlet.
 *
 * If a future vue-router upgrade prints additional deprecation warnings
 * surfaced via our own code, the assertion below fails fast.
 */

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
};

const PageA = {
  components: { IonPage },
  name: 'PageA',
  template: '<ion-page data-pageid="page-a"></ion-page>',
};

const PageB = {
  components: { IonPage },
  name: 'PageB',
  template: '<ion-page data-pageid="page-b"></ion-page>',
};

describe('vue-router deprecation surface', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('does not emit next() deprecation warnings during normal navigation', async () => {
    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: PageA },
        { path: '/b', component: PageB },
      ],
    });

    router.push('/');
    await router.isReady();
    mount(App, { global: { plugins: [router, IonicVue] } });
    await waitForRouter();

    router.push('/b');
    await waitForRouter();
    router.back();
    await waitForRouter();
    router.replace('/b');
    await waitForRouter();

    const nextWarnings = warnSpy.mock.calls.filter((args) =>
      args.some((arg) => typeof arg === 'string' && /\bnext\b.*deprecat/i.test(arg))
    );
    expect(nextWarnings).toEqual([]);
  });

  it('supports the return-value guard pattern (no next callback)', async () => {
    const leaveCalls: boolean[] = [];
    let allowLeave = false;

    const Guarded = {
      ...PageA,
      name: 'Guarded',
      setup() {
        onBeforeRouteLeave(() => {
          leaveCalls.push(allowLeave);
          return allowLeave;
        });
      },
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Guarded },
        { path: '/b', component: PageB },
      ],
    });

    router.push('/');
    await router.isReady();
    mount(App, { global: { plugins: [router, IonicVue] } });
    await waitForRouter();

    router.push('/b');
    await waitForRouter();
    expect(router.currentRoute.value.path).toBe('/');
    expect(leaveCalls).toEqual([false]);

    allowLeave = true;
    router.push('/b');
    await waitForRouter();
    expect(router.currentRoute.value.path).toBe('/b');
    expect(leaveCalls).toEqual([false, true]);

    const nextWarnings = warnSpy.mock.calls.filter((args) =>
      args.some((arg) => typeof arg === 'string' && /\bnext\b.*deprecat/i.test(arg))
    );
    expect(nextWarnings).toEqual([]);
  });
});
