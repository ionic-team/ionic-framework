import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';
import { waitForRouter } from './utils';

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
}

const BasePage = {
  template: '<ion-page :data-pageid="name"></ion-page>',
  components: { IonPage },
}

const Page1 = {
  ...BasePage,
  data() {
    return {
      name: 'page1'
    }
  },
  ionViewWillEnter: jest.fn(),
  ionViewDidEnter: jest.fn(),
  ionViewWillLeave: jest.fn(),
  ionViewDidLeave: jest.fn(),
}

const Page2 = defineComponent({
  ...BasePage,
  setup() {
    return {
      name: 'page2'
    }
  },
  ionViewWillEnter: jest.fn(),
  ionViewDidEnter: jest.fn(),
  ionViewWillLeave: jest.fn(),
  ionViewDidLeave: jest.fn(),
});

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    { path: '/', component: Page1 },
    { path: '/2', component: Page2 }
  ]
});

describe('Lifecycle Events', () => {
  beforeAll(() => {
    (HTMLElement.prototype as HTMLIonRouterOutletElement).commit = jest.fn();
  });
  it('Triggers lifecycle events', async () => {
    // Initial render
    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    // Page 1 lifecycle hooks
    expect(Page1.ionViewWillEnter).toHaveBeenCalledWith();
    expect(Page1.ionViewWillEnter.mock.instances[0]).toEqual(expect.objectContaining({ name: 'page1' }))

    expect(Page1.ionViewDidEnter).toHaveBeenCalled();
    expect(Page1.ionViewDidEnter.mock.instances[0]).toEqual(expect.objectContaining({ name: 'page1' }))

    expect(Page1.ionViewWillLeave).not.toHaveBeenCalled();
    expect(Page1.ionViewDidLeave).not.toHaveBeenCalled();
    expect(wrapper.html()).toContain('page1');

    // Page 2 lifecycle hooks
    expect(Page2.ionViewWillEnter).not.toHaveBeenCalled();
    expect(Page2.ionViewDidEnter).not.toHaveBeenCalled();
    expect(Page2.ionViewWillLeave).not.toHaveBeenCalled();
    expect(Page2.ionViewDidLeave).not.toHaveBeenCalled();

    // Navigate to 2nd page
    router.push('/2');
    jest.resetAllMocks();
    await waitForRouter();

    // Page 1 lifecycle hooks
    expect(Page1.ionViewDidEnter).not.toHaveBeenCalled();
    expect(Page1.ionViewWillEnter).not.toHaveBeenCalled();

    expect(Page1.ionViewWillLeave).toHaveBeenCalled();
    expect(Page1.ionViewWillLeave.mock.instances[0]).toEqual(expect.objectContaining({ name: 'page1' }))

    expect(Page1.ionViewDidLeave).toHaveBeenCalled();
    expect(Page1.ionViewDidLeave.mock.instances[0]).toEqual(expect.objectContaining({ name: 'page1' }))

    // Page 2 lifecycle hooks
    expect(Page2.ionViewWillEnter).toHaveBeenCalled();
    expect((Page2.ionViewWillEnter as jest.Mock).mock.instances[0]).toEqual(expect.objectContaining({ name: 'page2' }))

    expect(Page2.ionViewDidEnter).toHaveBeenCalled();
    expect((Page2.ionViewDidEnter as jest.Mock).mock.instances[0]).toEqual(expect.objectContaining({ name: 'page2' }))

    expect(Page2.ionViewWillLeave).not.toHaveBeenCalled();
    expect(Page2.ionViewDidLeave).not.toHaveBeenCalled();
    expect(wrapper.html()).toContain('page2');
  });
});
