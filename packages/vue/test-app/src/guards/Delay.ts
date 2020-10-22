import { loadingController } from '@ionic/vue';
import {
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router';

export const DelayGuard = async (_: RouteLocationNormalized, _x: RouteLocationNormalized, next: NavigationGuardNext) => {
  const loading = await loadingController.create({
    message: 'Waiting 1000ms...',
    duration: 1000
  });

  await loading.present();

  await loading.onDidDismiss();

  next({ path: '/routing' });
}
