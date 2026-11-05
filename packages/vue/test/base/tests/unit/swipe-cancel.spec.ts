import { flushPromises, mount } from '@vue/test-utils';
import { IonicVue, IonPage, IonRouterOutlet } from '@ionic/vue';
import { createRouter, createMemoryHistory } from '@ionic/vue-router';
import { h, nextTick, reactive } from 'vue';
import { routeLocationKey } from 'vue-router';
import { expect, it, vi } from 'vitest';

async function mountOutlet(
  enteringView: { ionPageElement?: HTMLElement } | undefined
) {
  const routeInfo = { pathname: '/page2', pushedByRoute: '/page1' };
  const handleNavigateBack = vi.fn();
  const findViewItemByRouteInfo = vi.fn(() => enteringView);
  const wrapper = mount(IonRouterOutlet, {
    global: {
      provide: {
        [routeLocationKey as symbol]: reactive({ matched: [], path: '/page2' }),
        navManager: {
          getCurrentRouteInfo: () => routeInfo,
          handleNavigateBack,
        },
        viewStacks: { findViewItemByRouteInfo, clear: vi.fn() },
      },
    },
  });
  await nextTick();
  const outlet = wrapper.element as HTMLIonRouterOutletElement;
  return { wrapper, outlet, handleNavigateBack, findViewItemByRouteInfo };
}

it.each([
  ['a missing view', undefined],
  ['an unmounted page', {}],
] as const)(
  'cancelled swipe tolerates %s after navigation changes',
  async (_, view) => {
    const { wrapper, outlet, handleNavigateBack } = await mountOutlet(view);
    try {
      expect(() => outlet.swipeHandler!.onEnd(false)).not.toThrow();
      expect(handleNavigateBack).not.toHaveBeenCalled();
    } finally {
      wrapper.unmount();
    }
  }
);

it('cancelled swipe hides the previous page when it is still mounted', async () => {
  const page = document.createElement('div');
  const { wrapper, outlet, handleNavigateBack } = await mountOutlet({
    ionPageElement: page,
  });
  try {
    outlet.swipeHandler!.onEnd(false);

    expect(page.getAttribute('aria-hidden')).toBe('true');
    expect(page.classList.contains('ion-page-hidden')).toBe(true);
    expect(handleNavigateBack).not.toHaveBeenCalled();
  } finally {
    wrapper.unmount();
  }
});

it('completed swipe still navigates back', async () => {
  const { wrapper, outlet, handleNavigateBack, findViewItemByRouteInfo } =
    await mountOutlet(undefined);
  try {
    outlet.swipeHandler!.onEnd(true);

    expect(handleNavigateBack).toHaveBeenCalledOnce();
    expect(findViewItemByRouteInfo).not.toHaveBeenCalled();
  } finally {
    wrapper.unmount();
  }
});

it('ignores a late cancellation after returning to the root page', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/page1', component: { render: () => h(IonPage) } },
      { path: '/page2', component: { render: () => h(IonPage) } },
    ],
  });
  await router.push('/page1');
  const wrapper = mount(IonRouterOutlet, {
    global: { plugins: [router, [IonicVue, { animated: false }]] },
  });
  try {
    const outlet = wrapper.element as HTMLIonRouterOutletElement;
    outlet.commit = vi.fn().mockResolvedValue(true);
    await router.push('/page2');
    await flushPromises();
    const swipeHandler = outlet.swipeHandler!;
    expect(swipeHandler.canStart()).toBe(true);

    await new Promise<void>((resolve) => {
      const removeHook = router.afterEach(() => {
        removeHook();
        resolve();
      });
      router.back();
    });
    await flushPromises();

    expect(router.currentRoute.value.path).toBe('/page1');
    expect(() => swipeHandler.onEnd(false)).not.toThrow();
  } finally {
    wrapper.unmount();
  }
});
