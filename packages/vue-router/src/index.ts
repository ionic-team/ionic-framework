import { App } from 'vue';
import {
  createRouter as createVueRouter,
  createWebHistory as createVueWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouterOptions,
} from 'vue-router';
import { createIonRouter } from './router';
import { createViewStacks } from './viewStacks';

export const createRouter = (opts: RouterOptions) => {
  const router = createVueRouter(opts);
  const ionRouter = createIonRouter(opts, router);
  const viewStacks = createViewStacks();

  const oldInstall = router.install.bind(router);
  router.install = (app: App) => {
    app.provide('navManager', ionRouter);
    app.provide('viewStacks', viewStacks);

    oldInstall(app);
  };

  router.beforeEach((to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    ionRouter.handleHistoryChange(to);
    next();
  });

  return router;
}

export const createWebHistory = (base?: string) => createVueWebHistory(base)
