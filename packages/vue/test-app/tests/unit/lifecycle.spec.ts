import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage } from '../../../src';

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
}

const Page1 = {
  template: '<ion-page data-pageid="page1"></ion-page>',
  components: {
    IonPage,
  },
  mounted() {},
  ionViewDidEnter() {},
  ionViewDidLeave() {},
  ionViewWillEnter() {},
  ionViewWillLeave() {},
}

const Page2 = {
  ...Page1,
  template: '<ion-page data-pageid="page2"></ion-page>',
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    { path: '/', component: Page1 },
    { path: '/2', component: Page2 }
  ]
});

describe('Lifecycle Events', () => {
  it('Triggers lifecycle events', async () => {
    const mountedSpy = jest.spyOn(Page1, 'mounted');

    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    await flushPromises();
    console.log(wrapper.html());

    expect(mountedSpy).toHaveBeenCalled();
  });
});
