import { BackButtonEvent } from '@ionic/core';
import { inject, ref, Ref } from 'vue';

type Handler = (processNextHandler: () => void) => Promise<any> | void | null;

export interface IonRouter {
  canGoBack: (deep?: number) => boolean;
}

export interface IonKeyboardRef {
  isOpen: Ref<boolean>;
  keyboardHeight: Ref<number>;
  unregister: () => void
}

export const useBackButton = (priority: number, handler: Handler) => {
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

export const useKeyboard = (): IonKeyboardRef => {
  let isOpen = ref(false);
  let keyboardHeight = ref(0);

  const showCallback = (ev: CustomEvent) => {
    isOpen.value = true;
    keyboardHeight.value = ev.detail.keyboardHeight;
  }

  const hideCallback = () => {
    isOpen.value = false;
    keyboardHeight.value = 0;
  }

  const unregister = () => {
    if (typeof (window as any) !== 'undefined') {
      window.removeEventListener('ionKeyboardDidShow', showCallback);
      window.removeEventListener('ionKeyboardDidHide', hideCallback);
    }
  }

  if (typeof (window as any) !== 'undefined') {
    window.addEventListener('ionKeyboardDidShow', showCallback);
    window.addEventListener('ionKeyboardDidHide', hideCallback);
  }

  return {
    isOpen,
    keyboardHeight,
    unregister
  }
}
