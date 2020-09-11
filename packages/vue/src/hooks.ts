import { BackButtonEvent } from '@ionic/core';
import { inject } from 'vue';

type Handler = (processNextHandler: () => void) => Promise<any> | void | null;

export interface IonRouter {
  canGoBack: (deep?: number) => boolean;
}

export const useHardwareBackButton = (priority: number, handler: Handler) => {
  const callback = (ev: BackButtonEvent) => ev.detail.register(priority, handler);
  const unregister = () => document.removeEventListener('ionBackButton', callback);

  document.addEventListener('ionBackButton', callback);

  return { unregister };
}

export const useIonRouter = (): IonRouter => {
  const { canGoBack } = inject('navManager') as any;

  return {
    canGoBack
  } as IonRouter
}
