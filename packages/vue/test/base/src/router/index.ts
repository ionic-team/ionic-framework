import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue'
import { DelayGuard } from '@/guards/Delay';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/version-test',
    component: () => import('@/views/VersionTest.vue')
  },
  {
    path: '/delayed-redirect',
    beforeEnter: DelayGuard,
    component: Home
  },
  {
    path: '/lifecycle',
    component: () => import('@/views/Lifecycle.vue')
  },
  {
    path: '/lifecycle-setup',
    component: () => import('@/views/LifecycleSetup.vue')
  },
  {
    path: '/overlays',
    component: () => import('@/views/Overlays.vue')
  },
  {
    path: '/modal-multiple-children',
    component: () => import('@/views/ModalMultipleChildren.vue')
  },
  {
    path: '/keep-contents-mounted',
    component: () => import('@/views/OverlaysKeepContentsMounted.vue')
  },
  {
    path: '/icons',
    component: () => import('@/views/Icons.vue')
  },
  {
    path: '/inputs',
    component: () => import('@/views/Inputs.vue')
  },
  {
    path: '/default-href',
    component: () => import('@/views/DefaultHref.vue')
  },
  {
    path: '/routing',
    component: () => import('@/views/Routing.vue')
  },
  {
    path: '/routing/child',
    component: () => import('@/views/RoutingChild.vue')
  },
  {
    path: '/routing/:id',
    component: () => import('@/views/RoutingParameter.vue'),
    props: true
  },
  {
    path: '/routing/:id/view',
    component: () => import('@/views/RoutingParameterView.vue')
  },
  {
    path: '/navigation',
    component: () => import('@/views/Navigation.vue')
  },
  {
    path: '/components/breadcrumbs',
    component: () => import('@/views/Breadcrumbs.vue')
  },
  {
    path: '/components/select',
    component: () => import('@/views/Select.vue')
  },
  {
    path: '/components/range',
    component: () => import('@/views/Range.vue')
  },
  {
    path: '/reorder-group',
    component: () => import('@/views/ReorderGroup.vue')
  },
  {
    path: '/nested',
    component: () => import('@/views/nested/RouterOutlet.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/nested/NestedChild.vue')
      },
      {
        path: 'two',
        component: () => import('@/views/nested/NestedChildTwo.vue')
      },
      {
        path: ':id',
        component: () => import('@/views/nested/Folder.vue'),
        props: true
      }
    ]
  },
  {
    path: '/tabs/',
    component: () => import('@/views/tabs/Tabs.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/tabs/Tab1.vue'),
      },
      {
        path: 'tab1/:id',
        component: () => import('@/views/tabs/Tab1Parameter.vue'),
        props: true
      },
      {
        path: 'tab2',
        component: () => import('@/views/tabs/Tab2.vue')
      },
      {
        path: 'tab3',
        beforeEnter: (to, from, next) => {
          next({ path: '/tabs/tab1' });
        },
        component: () => import('@/views/tabs/Tab3.vue')
      },
      {
        path: 'tab4',
        component: () => import('@/views/tabs/Tab4.vue')
      }
    ]
  },
  {
    path: '/tabs-secondary/',
    component: () => import('@/views/tabs-secondary/TabsSecondary.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs-secondary/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/tabs-secondary/Tab1Secondary.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/tabs-secondary/Tab2Secondary.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/tabs-secondary/Tab3Secondary.vue')
      }
    ]
  },
  {
    path: '/tabs-basic',
    component: () => import('@/views/TabsBasic.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

(window as any).debugRouter = router;

export default router
