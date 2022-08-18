import { loadingController } from '@ionic/vue';
import {
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router';

export const DelayGuard = async (_: RouteLocationNormalized, _x: RouteLocationNormalized, next: NavigationGuardNext) => {
  const loading = await loadingController.create({
    message: 'Waiting 500ms...',
    duration: 500
  });

  await loading.present();

  await loading.onDidDismiss();

  next({ path: '/routing' });
}
