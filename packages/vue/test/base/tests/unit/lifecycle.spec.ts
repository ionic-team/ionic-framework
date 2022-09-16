import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonTabs, IonPage } from '@ionic/vue';
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

describe('Lifecycle Events', () => {
  beforeAll(() => {
    (HTMLElement.prototype as HTMLIonRouterOutletElement).commit = jest.fn();
  });
  it('Triggers lifecycle events', async () => {
    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Page1 },
        { path: '/2', component: Page2 }
      ]
    });

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
  it('should fire lifecycle events on inner tab page', async () => {
    const TabsPage = {
      template: `
        <ion-page>
          <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
          </ion-tabs>
        </ion-page>
      `,
      components: { IonPage, IonTabs, IonRouterOutlet },
      ionViewWillEnter: jest.fn(),
      ionViewDidEnter: jest.fn(),
      ionViewWillLeave: jest.fn(),
      ionViewDidLeave: jest.fn(),
    }
    const Tab1Page = {
      ...BasePage,
      ionViewWillEnter: jest.fn(),
      ionViewDidEnter: jest.fn(),
      ionViewWillLeave: jest.fn(),
      ionViewDidLeave: jest.fn(),
    }

    const NonTabPage = {
      ...BasePage,
      ionViewWillEnter: jest.fn(),
      ionViewDidEnter: jest.fn(),
      ionViewWillLeave: jest.fn(),
      ionViewDidLeave: jest.fn(),
    }


    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: TabsPage, children: [
          { path: 'tab1', component: Tab1Page }
        ]},
        { path: '/non-tab', component: NonTabPage }
      ]
    });

    // Initial render
    router.push('/tab1');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    // Initial load
    expect(TabsPage.ionViewWillEnter).toHaveBeenCalled();
    expect(TabsPage.ionViewDidEnter).toHaveBeenCalled();

    expect(Tab1Page.ionViewWillEnter).toHaveBeenCalled();
    expect(Tab1Page.ionViewDidEnter).toHaveBeenCalled();

    expect(NonTabPage.ionViewWillEnter).not.toHaveBeenCalled();
    expect(NonTabPage.ionViewDidEnter).not.toHaveBeenCalled();

    // Navigate out of tabs
    router.push('/non-tab');
    jest.resetAllMocks();
    await waitForRouter();

    expect(TabsPage.ionViewWillLeave).toHaveBeenCalled();
    expect(TabsPage.ionViewDidLeave).toHaveBeenCalled();

    // Tab1Page currently does not call leaving hooks
    // when navigating out of tabs
    //expect(Tab1Page.ionViewWillLeave).toHaveBeenCalled();
    //expect(Tab1Page.ionViewDidLeave).toHaveBeenCalled();

    expect(NonTabPage.ionViewWillEnter).toHaveBeenCalled();
    expect(NonTabPage.ionViewDidEnter).toHaveBeenCalled();

    // Go back
    router.back();
    jest.resetAllMocks();
    await waitForRouter();

    expect(TabsPage.ionViewWillEnter).toHaveBeenCalled();
    expect(TabsPage.ionViewDidEnter).toHaveBeenCalled();

    expect(Tab1Page.ionViewWillEnter).toHaveBeenCalled();
    expect(Tab1Page.ionViewDidEnter).toHaveBeenCalled();

    expect(NonTabPage.ionViewWillLeave).toHaveBeenCalled();
    expect(NonTabPage.ionViewDidLeave).toHaveBeenCalled();

    // Navigate out of tabs again
    router.push('/non-tab');
    jest.resetAllMocks();
    await waitForRouter();

    expect(TabsPage.ionViewWillLeave).toHaveBeenCalled();
    expect(TabsPage.ionViewDidLeave).toHaveBeenCalled();

    expect(NonTabPage.ionViewWillEnter).toHaveBeenCalled();
    expect(NonTabPage.ionViewDidEnter).toHaveBeenCalled();

    // Go back again
    router.back();
    jest.resetAllMocks();
    await waitForRouter();

    expect(TabsPage.ionViewWillEnter).toHaveBeenCalled();
    expect(TabsPage.ionViewDidEnter).toHaveBeenCalled();

    expect(NonTabPage.ionViewWillLeave).toHaveBeenCalled();
    expect(NonTabPage.ionViewDidLeave).toHaveBeenCalled();
  })
});
