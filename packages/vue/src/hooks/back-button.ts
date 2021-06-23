import { BackButtonEvent } from '@ionic/core/components';

type Handler = (processNextHandler: () => void) => Promise<any> | void | null;

export const useBackButton = (priority: number, handler: Handler) => {
  const callback = (ev: BackButtonEvent) => ev.detail.register(priority, handler);
  const unregister = () => document.removeEventListener('ionBackButton', callback);

  document.addEventListener('ionBackButton', callback);

  return { unregister };
}
