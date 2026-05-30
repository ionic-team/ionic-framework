import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createRouter, createMemoryHistory } from '@ionic/vue-router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonicVue,
  IonApp,
  IonRouterOutlet,
  IonPage,
} from '@ionic/vue';
import { waitForRouter } from './utils';

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
}

describe('createMemoryHistory', () => {
  it('should not error when going back with memory router', async () => {
    const PageTemplate = {
      template: `
        <ion-page>
          <ion-header>
            <ion-toolbar>
              <ion-back-button></ion-back-button>
            </ion-toolbar>
          </ion-header>
          <ion-content></ion-content>
        </ion-page>
      `,
      components: { IonPage, IonContent, IonHeader, IonToolbar, IonBackButton }
    }

    const router = createRouter({
      history: createMemoryHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: PageTemplate },
        { path: '/page2', component: PageTemplate },
        { path: '/page3', component: PageTemplate }
      ]
    });
    const push = vi.spyOn(router, 'back');

    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    router.push('/page2');
    await waitForRouter();

    router.push('/page3');
    await waitForRouter();


    const backButtons = wrapper.findAllComponents(IonBackButton);
    const pageTwoButton = backButtons[1];
    const pageThreeButton = backButtons[2];

    await pageThreeButton.trigger('click');
    await waitForRouter();

    await pageTwoButton.trigger('click');
    await waitForRouter();

    expect(push).toHaveBeenCalledTimes(2);
  });
})
