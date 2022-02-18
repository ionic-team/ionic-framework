import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage } from '@ionic/vue';

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
}

describe('IonPage', () => {
  beforeAll(() => {
    (HTMLElement.prototype as HTMLIonRouterOutletElement).commit = jest.fn();
  });
  it('should add ion-page class', async () => {
    const Page1 = {
      template: '<ion-page></ion-page>',
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
    const wrapper = mount(App, {
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
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const cmp = wrapper.findComponent(Page1);
    expect(cmp.classes('ion-page')).toBe(true);
    expect(cmp.classes('custom-class')).toBe(true);
  });
})
