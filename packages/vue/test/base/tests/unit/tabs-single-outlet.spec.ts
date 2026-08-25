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
} from '@ionic/vue';
import { waitForRouter } from './utils';

enableAutoUnmount(afterEach);

/**
 * Reproduces the apps-without-an-outer-outlet shape: <ion-tabs> mounted at
 * the root of the app, with the inner <ion-router-outlet> as the ONLY outlet
 * in the viewStacks. With this shape, `usingLinearNavigation` (size === 1) is
 * true, so unmountLeavingViews / mountIntermediaryViews are invoked when
 * router.go(-N) crosses tabs. Several visits across tabs can grow the
 * popstate delta beyond the inner outlet's stack length, exposing
 * out-of-bounds reads in those helpers.
 */

const makeTabPage = (id: string) => ({
  template: `<ion-page :data-pageid="'${id}'"></ion-page>`,
  components: { IonPage },
});

const Tab1 = makeTabPage('tab1');
const Tab1Sub = makeTabPage('tab1sub');
const Tab2 = makeTabPage('tab2');
const Tab2Sub = makeTabPage('tab2sub');
const Tab3 = makeTabPage('tab3');
const Tab3Sub = makeTabPage('tab3sub');

const TabsApp = {
  components: {
    IonApp,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonRouterOutlet,
  },
  template: `
    <ion-app>
      <ion-tabs>
        <ion-router-outlet />
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="tab1" href="/tab1"><ion-label>Tab 1</ion-label></ion-tab-button>
          <ion-tab-button tab="tab2" href="/tab2"><ion-label>Tab 2</ion-label></ion-tab-button>
          <ion-tab-button tab="tab3" href="/tab3"><ion-label>Tab 3</ion-label></ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-app>
  `,
};

const buildRouter = () =>
  createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
      { path: '/', redirect: '/tab1' },
      { path: '/tab1', component: Tab1 },
      { path: '/tab1/sub', component: Tab1Sub },
      { path: '/tab2', component: Tab2 },
      { path: '/tab2/sub', component: Tab2Sub },
      { path: '/tab3', component: Tab3 },
      { path: '/tab3/sub', component: Tab3Sub },
    ],
  });

describe('ion-tabs at root (single outlet)', () => {
  it('does not throw when navigating across tabs and sub-pages', async () => {
    const router = buildRouter();

    // Capture both Vue runtime errors and unhandled promise rejections.
    // `unmountLeavingViews` runs inside a Vue reactive effect, so a throw
    // ends up as a Promise rejection rather than a synchronous error.
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const errors: unknown[] = [];
    const onWindowUnhandled = (event: { reason?: unknown; preventDefault?: () => void }) => {
      errors.push(event.reason ?? event);
      event.preventDefault?.();
    };
    const onProcessUnhandled = (reason: unknown) => {
      errors.push(reason);
    };
    (globalThis as any).addEventListener('unhandledrejection', onWindowUnhandled);
    (process as any).on('unhandledRejection', onProcessUnhandled);

    try {
      router.push('/tab1');
      await router.isReady();

      mount(TabsApp, {
        global: {
          plugins: [router, IonicVue],
          config: {
            errorHandler: (err: unknown) => {
              errors.push(err);
            },
          },
        },
      });
      await waitForRouter();

      // Build up browser history across tabs and sub-pages, the way the
      // customer's repro does. Each push adds a history entry while reusing
      // any existing view item for the destination route.
      router.push('/tab1/sub'); await waitForRouter();
      router.push('/tab2');     await waitForRouter();
      router.push('/tab3');     await waitForRouter();
      router.push('/tab3/sub'); await waitForRouter();
      router.push('/tab2');     await waitForRouter();
      router.push('/tab1/sub'); await waitForRouter();

      // Now: history position is large (7+), but the inner outlet's view stack
      // only ever held [tab1, tab1sub, tab2, tab3, tab3sub] at most. Jump back
      // to /tab1 with a delta that exceeds the stack-above-startIndex count.
      router.go(-6);
      await waitForRouter();

      // Give any pending microtasks/promise rejections a chance to flush.
      await waitForRouter();
    } finally {
      consoleErrorSpy.mockRestore();
      (globalThis as any).removeEventListener('unhandledrejection', onWindowUnhandled);
      (process as any).off('unhandledRejection', onProcessUnhandled);
    }

    // Any error thrown during the navigation above is a regression for this
    // scenario; the original bug surfaced as a TypeError from indexing past
    // the end of the inner outlet's view stack.
    expect(
      errors,
      `errors: ${errors.map((e) => (e instanceof Error ? e.stack : String(e))).join('\n')}`,
    ).toEqual([]);
  });
});
