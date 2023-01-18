import type { Ref } from 'vue';
import { ref } from 'vue';

export interface UseKeyboardResult {
  isOpen: Ref<boolean>;
  keyboardHeight: Ref<number>;
  unregister: () => void
}

export const useKeyboard = (): UseKeyboardResult => {
  const isOpen = ref(false);
  const keyboardHeight = ref(0);

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
