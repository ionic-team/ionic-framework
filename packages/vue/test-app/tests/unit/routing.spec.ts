import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage, IonTabs, IonTabBar } from '@ionic/vue';

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
}

const BasePage = {
  template: '<ion-page :data-pageid="name"></ion-page>',
  components: { IonPage },
}

describe('Routing', () => {
  it('should pass no props', async () => {
    const Page1 = {
      ...BasePage,
      props: {
        title: { type: String, default: 'Default Title' }
      }
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
    expect(cmp.props()).toEqual({ title: 'Default Title' });
  });

  it('should pass route props as an object', async () => {
    const Page1 = {
      ...BasePage,
      props: {
        title: { type: String, default: 'Default Title' }
      }
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Page1, props: { title: 'Page 1 Title' } }
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
    expect(cmp.props()).toEqual({ title: 'Page 1 Title' });
  });

  it('should pass route props as a function', async () => {
    const Page1 = {
      ...BasePage,
      props: {
        title: { type: String, default: 'Default Title' }
      }
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/myPath', component: Page1, props: function(route) { return { title: `${route.path} Title` } } }
      ]
    });

    router.push('/myPath');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const cmp = wrapper.findComponent(Page1);
    expect(cmp.props()).toEqual({ title: '/myPath Title' });
  });

  it('should pass route params as props', async () => {
    const Page1 = {
      ...BasePage,
      props: {
        title: { type: String, default: 'Default Title' }
      }
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/:title', component: Page1, props: true }
      ]
    });

    router.push('/myPath');
    await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [router, IonicVue]
      }
    });

    const cmp = wrapper.findComponent(Page1);
    expect(cmp.props()).toEqual({ title: 'myPath' });
  });
});
