import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue'
import { DelayGuard } from '@/guards/Delay';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    name: 'Overlays',
    component: () => import('@/views/Overlays.vue')
  },
  {
    path: '/inputs',
    name: 'Inputs',
    component: () => import('@/views/Inputs.vue')
  },
  {
    path: '/slides',
    name: 'Slides',
    component: () => import('@/views/Slides.vue')
  },
  {
    path: '/default-href',
    component: () => import('@/views/DefaultHref.vue')
  },
  {
    path: '/routing',
    component: () => import('@/views/routing/Routing.vue')
  },
  {
    path: '/routing/child',
    component: () => import('@/views/routing/RoutingChild.vue')
  },
  {
    path: '/routing/:id',
    component: () => import('@/views/routing/RoutingParameter.vue'),
    props: true
  },
  {
    path: '/routing/:id/view',
    component: () => import('@/views/routing/RoutingParameterView.vue')
  },
  {
    path: '/navigation',
    component: () => import('@/views/Navigation.vue')
  },
  {
    path: '/nested',
    name: 'RouterOutlet',
    component: () => import('@/views/RouterOutlet.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/NestedChild.vue')
      },
      {
        path: 'two',
        component: () => import('@/views/NestedChildTwo.vue')
      },
      {
        path: ':id',
        component: () => import('@/views/Folder.vue'),
        props: true
      }
    ]
  },
  {
    path: '/tabs/',
    component: () => import('@/views/tabs/primary/Tabs.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/tabs/primary/children/Tab1.vue'),
        children: [
          {
            path: 'child-one',
            component: () => import('@/views/tabs/primary/children/Tab1ChildOne.vue')
          },
          {
            path: 'child-two',
            component: () => import('@/views/tabs/primary/children/Tab1ChildTwo.vue')
          }
        ]
      },
      {
        path: 'tab2',
        component: () => import('@/views/tabs/primary/children/Tab2.vue')
      },
      {
        path: 'tab3',
        beforeEnter: (to, from, next) => {
          /**
           * Redirect back to tab1
           */
          next({ path: '/tabs/tab1' });
        },
        component: () => import('@/views/tabs/primary/children/Tab3.vue')
      },
      {
        path: 'tab4',
        component: () => import('@/views/tabs/primary/children/Tab4.vue')
      }
    ]
  },
  {
    path: '/tabs-new/',
    component: () => import('@/views/tabs/primary/TabsNew.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs-new/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/tabs/primary/children/Tab1.vue'),
      },
      {
        path: 'tab1/child-one',
        component: () => import('@/views/tabs/primary/children/Tab1ChildOne.vue')
      },
      {
        path: 'tab1/child-two',
        component: () => import('@/views/tabs/primary/children/Tab1ChildTwo.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/tabs/primary/children/Tab2.vue')
      },
      {
        path: 'tab3',
        beforeEnter: (to, from, next) => {
          next({ path: '/tabs/tab1' });
        },
        component: () => import('@/views/tabs/primary/children/Tab3.vue')
      }
    ]
  },
  {
    path: '/tabs-secondary/',
    component: () => import('@/views/tabs/secondary/TabsSecondary.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs-secondary/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/tabs/secondary/children/Tab1Secondary.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/tabs/secondary/children/Tab2Secondary.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/tabs/secondary/children/Tab3Secondary.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

(window as any).debugRouter = router;

export default router
