import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonRouterOutlet, IonPage } from '@ionic/vue';

describe('IonPage', () => {
  it('should add ion-page class', async () => {
    const Page1 = {
      template: '<ion-page></ion-page>',
      name: 'Page1',
      components: { IonPage }
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
    expect(cmp.classes('ion-page')).toBe(true);
  });
  it('should preserve custom classes', async () => {
    const Page1 = {
      template: '<ion-page class="custom-class"></ion-page>',
      name: 'Page1',
      components: { IonPage }
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
    expect(cmp.classes('ion-page')).toBe(true);
    expect(cmp.classes('custom-class')).toBe(true);
  });
  it('should not re-add ion-page-invisible when setting the class', async () => {
    const Page1 = {
      template: `<ion-page :class="{ 'custom-class': addClass }"></ion-page>`,
      name: 'Page1',
      components: { IonPage },
      data() {
        return {
          addClass: false
        }
      }
    };

    const wrapper = mount(Page1);

    expect(wrapper.classes('custom-class')).toBe(false);

    await wrapper.setData({ addClass: true });

    expect(wrapper.classes('custom-class')).toBe(true);
    expect(wrapper.classes('ion-page-invisible')).toBe(false);
  });
})
