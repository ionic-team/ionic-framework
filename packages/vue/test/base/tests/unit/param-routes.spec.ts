import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { IonicVue, IonApp, IonRouterOutlet, IonPage } from '@ionic/vue';
import { waitForRouter } from './utils';

/**
 * Pins matched-route reference equality for parameterized routes.
 * viewStacks.findViewItemByPath relies on
 *
 *   resolvedPath.matched.find(m => m === viewItem.matchedRoute)
 *
 * being stable across navigations. Vue Router 5 changed how param parsers
 * are normalized; if that shifts matched-route identity for catch-all or
 * optional params, the outlet would mis-reuse a stale view or fail to
 * reuse a still-valid one.
 */

const App = {
  components: { IonApp, IonRouterOutlet },
  template: '<ion-app><ion-router-outlet /></ion-app>',
};

describe('parameterized routes', () => {
  it('catch-all routes mount distinct view items per path', async () => {
    const FilePage = {
      components: { IonPage },
      name: 'FilePage',
      props: { pathMatch: { type: [String, Array], default: '' } },
      template: '<ion-page :data-pageid="`file-${Array.isArray(pathMatch) ? pathMatch.join(\'-\') : pathMatch}`"></ion-page>',
    };
    const Home = {
      components: { IonPage },
      name: 'Home',
      template: '<ion-page data-pageid="home"></ion-page>',
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Home },
        { path: '/files/:pathMatch(.*)*', component: FilePage, props: true },
      ],
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: { plugins: [router, IonicVue] },
    });
    await waitForRouter();

    router.push('/files/a/b/c');
    await waitForRouter();
    let pages = wrapper.findAllComponents(FilePage);
    expect(pages.length).toBe(1);

    router.push('/files/a/b/d');
    await waitForRouter();
    pages = wrapper.findAllComponents(FilePage);
    // Two distinct view items must exist - the first must not be reused
    // for the second path. If matched-route equality drifted, we would
    // see length === 1 with stale props.
    expect(pages.length).toBe(2);
  });

  it('parameterized routes do not reuse view items across params', async () => {
    const UserPage = {
      components: { IonPage },
      name: 'UserPage',
      props: { id: { type: String, default: '' } },
      template: '<ion-page :data-pageid="`user-${id}`"></ion-page>',
    };
    const Home = {
      components: { IonPage },
      name: 'Home',
      template: '<ion-page data-pageid="home"></ion-page>',
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Home },
        { path: '/users/:id', component: UserPage, props: true },
      ],
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: { plugins: [router, IonicVue] },
    });
    await waitForRouter();

    router.push('/users/1');
    await waitForRouter();
    expect(wrapper.findAllComponents(UserPage).length).toBe(1);

    router.push('/users/2');
    await waitForRouter();
    const pages = wrapper.findAllComponents(UserPage);
    expect(pages.length).toBe(2);
    expect(pages[0].props().id).toBe('1');
    expect(pages[1].props().id).toBe('2');
  });

  it('optional parameter routes resolve both with and without the param', async () => {
    const PostPage = {
      components: { IonPage },
      name: 'PostPage',
      props: {
        id: { type: String, default: '' },
        postId: { type: String, default: '' },
      },
      template: '<ion-page :data-pageid="`user-${id}-post-${postId || \'none\'}`"></ion-page>',
    };
    const Home = {
      components: { IonPage },
      name: 'Home',
      template: '<ion-page data-pageid="home"></ion-page>',
    };

    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [
        { path: '/', component: Home },
        { path: '/users/:id/posts/:postId?', component: PostPage, props: true },
      ],
    });

    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: { plugins: [router, IonicVue] },
    });
    await waitForRouter();

    router.push('/users/1/posts');
    await waitForRouter();
    let pages = wrapper.findAllComponents(PostPage);
    expect(pages.length).toBe(1);
    expect(pages[0].props().id).toBe('1');
    // postId is optional - undefined / empty string are both acceptable
    expect(pages[0].props().postId || '').toBe('');

    router.push('/users/1/posts/42');
    await waitForRouter();
    pages = wrapper.findAllComponents(PostPage);
    expect(pages.length).toBe(2);
    expect(pages[1].props().postId).toBe('42');
  });
});
