import { App } from 'vue';
import {
  createRouter as createVueRouter,
  createWebHistory as createVueWebHistory,
  createWebHashHistory as createVueWebHashHistory,
  createMemoryHistory as createVueMemoryHistory
} from 'vue-router';
import { createIonRouter } from './router';
import { createViewStacks } from './viewStacks';
import { IonicVueRouterOptions } from './types';

export const createRouter = (opts: IonicVueRouterOptions) => {
  const routerOptions = { ...opts };
  delete routerOptions.tabsPrefix;

  const router = createVueRouter(routerOptions);
  const ionRouter = createIonRouter(opts, router);
  const viewStacks = createViewStacks(router);

  const oldInstall = router.install.bind(router);
  router.install = (app: App) => {
    app.provide('navManager', ionRouter);
    app.provide('viewStacks', viewStacks);

    oldInstall(app);
  };

  const oldIsReady = router.isReady.bind(router);
  router.isReady = () => oldIsReady();

  return router;
}

export const createWebHistory = (base?: string) => createVueWebHistory(base);
export const createWebHashHistory = (base?: string) => createVueWebHashHistory(base);
export const createMemoryHistory = (base?: string) => createVueMemoryHistory(base);
