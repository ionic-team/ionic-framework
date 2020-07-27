import { createRouter, RouterOptions } from 'vue-router';

export const createIonRouter = (opts: RouterOptions) => {
  console.log(`[ion-vue-router] Received options`, opts);
  const router = createRouter(opts);
  console.log(`[ion-vue-router] created vue router`, router);
  return router;
}
