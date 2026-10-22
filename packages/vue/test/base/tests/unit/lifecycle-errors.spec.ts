import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import {
  IonicVue,
  IonPage,
  IonRouterOutlet,
  onIonViewDidEnter,
  onIonViewDidLeave,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue';
import { defineComponent, h, onErrorCaptured, ref } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { waitForRouter } from './utils';
import LifecycleErrorBoundary from '@/views/LifecycleErrorBoundary.vue';
import LifecycleErrorPage from '@/views/LifecycleErrorPage.vue';

const lifecycles = [
  ['ionViewWillEnter', onIonViewWillEnter],
  ['ionViewDidEnter', onIonViewDidEnter],
  ['ionViewWillLeave', onIonViewWillLeave],
  ['ionViewDidLeave', onIonViewDidLeave],
] as const;

describe.each(['composition', 'options', 'methods'] as const)('%s lifecycle errors', (api) => {
  describe.each(lifecycles)('%s', (lifecycle, registerHook) => {
    it.each([
      ['synchronous', 'capture'],
      ['asynchronous', 'capture'],
      ['synchronous', 'app'],
      ['asynchronous', 'app'],
    ])('handles %s errors with the %s handler and completes navigation', async (timing, handler) => {
      const error = new Error(`${api} ${lifecycle} ${timing}`);
      const captured: unknown[] = [];
      const reported: unknown[] = [];
      const sources: (ComponentPublicInstance | null)[] = [];
      const messages = ref<string[]>([]);
      let receiver: ComponentPublicInstance | undefined;
      const fail = () => { throw error; };
      const hook = timing === 'asynchronous' ? async () => fail() : fail;
      const optionHook = function (this: ComponentPublicInstance) {
        receiver = this;
        return hook();
      };
      const Page = defineComponent({
        name: 'LifecycleErrorPage',
        ...(api === 'options' ? { [lifecycle]: optionHook } : {}),
        ...(api === 'methods' ? { methods: { [lifecycle]: optionHook } } : {}),
        setup() {
          if (api === 'composition') {
            registerHook(hook);
          }
          return { marker: 'error-page' };
        },
        render: () => h(IonPage, { 'data-pageid': 'error' }, () => 'Error page'),
      });
      const OtherPage = defineComponent({
        render: () => h(IonPage, { 'data-pageid': 'other' }, () => 'Other page'),
      });
      const Boundary = defineComponent({
        setup() {
          onErrorCaptured((err, instance) => {
            captured.push(err);
            sources.push(instance);
            if (handler === 'capture') {
              messages.value.push((err as Error).message);
              return false;
            }
          });
          return () => [h('p', { id: 'errors' }, messages.value.join(', ')), h(IonRouterOutlet)];
        },
      });
      const router = createRouter({
        history: createWebHistory(),
        routes: [
          { path: '/', component: OtherPage },
          { path: '/error', component: Page },
          { path: '/other', component: OtherPage },
        ],
      });
      await router.push('/');
      await router.isReady();
      const wrapper = mount(Boundary, {
        global: {
          plugins: [router, [IonicVue, { animated: false }]],
          config: {
            errorHandler(err) {
              reported.push(err);
              messages.value.push((err as Error).message);
            },
          },
        },
      });
      try {
        await router.push('/error');
        await waitForRouter();
        const page = wrapper.findComponent(Page);
        expect(page.classes()).not.toContain('ion-page-invisible');
        await router.push('/other');
        await waitForRouter();
        expect(wrapper.find('[data-pageid="other"]').classes()).not.toContain('ion-page-invisible');
        expect(captured).toEqual([error]);
        expect(reported).toEqual(handler === 'app' ? [error] : []);
        expect(sources).toEqual([page.vm.$.proxy]);
        expect(wrapper.find('#errors').text()).toBe(error.message);
        if (api !== 'composition') {
          expect(receiver).toBe(page.vm.$.proxy);
        }
      } finally {
        wrapper.unmount();
      }
    });
  });
});

describe('Lifecycle error reproduction', () => {
  it.each([
    ['composition', 'false'],
    ['composition', 'true'],
    ['options', 'false'],
    ['options', 'true'],
  ])('captures %s errors with async=%s', async (api, asynchronous) => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{
        path: '/lifecycle-errors',
        component: LifecycleErrorBoundary,
        children: [{ path: '', component: LifecycleErrorPage }],
      }],
    });
    await router.push(`/lifecycle-errors?api=${api}&async=${asynchronous}`);
    await router.isReady();
    const wrapper = mount(IonRouterOutlet, {
      global: { plugins: [router, [IonicVue, { animated: false }]] },
    });
    try {
      await waitForRouter();
      expect(wrapper.find('#lifecycle-error').text()).toBe('Ionic lifecycle error');
      expect(wrapper.find('[data-pageid="lifecycle-error"]').classes()).not.toContain('ion-page-invisible');
    } finally {
      wrapper.unmount();
    }
  });
});
