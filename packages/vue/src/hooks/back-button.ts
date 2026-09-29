import type { BackButtonEvent } from "@ionic/core/components";

type Handler = (processNextHandler: () => void) => Promise<any> | void | null;
export interface UseBackButtonResult {
  unregister: () => void;
}

export const useBackButton = (
  priority: number,
  handler: Handler
): UseBackButtonResult => {
  /**
   * `Handler` permits returning null, which core's public `register` type
   * does not accept, so normalize it rather than narrowing the public
   * `useBackButton` contract.
   */
  const callback = (ev: Event) =>
    (ev as BackButtonEvent).detail.register(
      priority,
      (processNextHandler: () => void) => {
        const result = handler(processNextHandler);
        return result === null ? undefined : result;
      }
    );
  const unregister = () =>
    document.removeEventListener("ionBackButton", callback);

  document.addEventListener("ionBackButton", callback);

  return { unregister };
};
