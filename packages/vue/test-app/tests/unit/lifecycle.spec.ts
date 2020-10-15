import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage } from '@ionic/vue';

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
}

const Page1 = {
  name: 'Page1',
  template: '<ion-page data-pageid="page1"></ion-page>',
  components: {
    IonPage,
  },
  ionViewDidEnter() {},
  ionViewDidLeave() { console.log('asd') },
  ionViewWillEnter() {},
  ionViewWillLeave() { console.log('qwe') },
}

const Page2 = {
  ...Page1,
  name: 'Page2',
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
    const page1DidEnterSpy = jest.spyOn(Page1, 'ionViewDidEnter');
    const page1WillEnterSpy = jest.spyOn(Page1, 'ionViewWillEnter');
    const page1DidLeaveSpy = jest.spyOn(Page1, 'ionViewDidLeave');
    const page1WillLeaveSpy = jest.spyOn(Page1, 'ionViewWillLeave');
    const page2DidEnterSpy = jest.spyOn(Page2, 'ionViewDidEnter');
    const page2WillEnterSpy = jest.spyOn(Page2, 'ionViewWillEnter');
    const page2DidLeaveSpy = jest.spyOn(Page2, 'ionViewDidLeave');
    const page2WillLeaveSpy = jest.spyOn(Page2, 'ionViewWillLeave');

    // Initial render
    router.push('/');
    await router.isReady();
    mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    // Page 1 lifecycle hooks
    expect(page1DidEnterSpy).toHaveBeenCalled();
    expect(page1WillEnterSpy).toHaveBeenCalled();
    expect(page1DidLeaveSpy).not.toHaveBeenCalled();
    expect(page1WillLeaveSpy).not.toHaveBeenCalled();

    // Page 2 lifecycle hooks
    expect(page2DidEnterSpy).not.toHaveBeenCalled();
    expect(page2WillEnterSpy).not.toHaveBeenCalled();
    expect(page2DidLeaveSpy).not.toHaveBeenCalled();
    expect(page2WillLeaveSpy).not.toHaveBeenCalled();

    // Navigate to 2nd page
    router.push('/2');
    jest.resetAllMocks();
    await flushPromises();

    (HTMLElement.prototype as HTMLIonRouterOutletElement).commit = jest.fn();
    await new Promise((r) => setTimeout(r, 100));

    // Page 1 lifecycle hooks
    expect(page1DidEnterSpy).not.toHaveBeenCalled();
    expect(page1WillEnterSpy).not.toHaveBeenCalled();
    expect(page1DidLeaveSpy).toHaveBeenCalled();
    expect(page1WillLeaveSpy).toHaveBeenCalled();

    // Page 2 lifecycle hooks
    expect(page2DidEnterSpy).toHaveBeenCalled();
    expect(page2WillEnterSpy).toHaveBeenCalled();
    expect(page2DidLeaveSpy).not.toHaveBeenCalled();
    expect(page2WillLeaveSpy).not.toHaveBeenCalled();
  });
});
