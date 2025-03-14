import type { BackButtonEvent } from "@ionic/core/components";
import { onBeforeUnmount, getCurrentInstance } from 'vue'

type Handler = (processNextHandler: () => void) => Promise<any> | void | null;
export interface UseBackButtonResult {
  unregister: () => void;
}

export const useBackButton = (
  priority: number,
  handler: Handler
): UseBackButtonResult => {
  const callback = (ev: BackButtonEvent) =>
    ev.detail.register(priority, handler);
  const unregister = () =>
    document.removeEventListener("ionBackButton", callback);

  document.addEventListener("ionBackButton", callback);
  
  if (getCurrentInstance()){
    onBeforeUnmount(() => {
      unregister()
    });
  }

  return { unregister };
};
