import { win } from '@utils/browser';

export const createSlotMutationController = (el: HTMLElement, mutationCallback: () => void): SlotMutationController => {
  let mutationObserver: MutationObserver | undefined;
  if (win !== undefined && 'IntersectionObserver' in win) {
    mutationObserver = new MutationObserver((entries) => {
      for (const entry of entries) {
        if (entry.addedNodes.length > 0) {
          for (const node of entry.addedNodes) {
            if ((node as HTMLElement).slot === 'label') {
              mutationCallback();
              return;
            }
          }
        }

        if (entry.removedNodes.length > 0) {
          for (const node of entry.addedNodes) {
            if ((node as HTMLElement).slot === 'label') {
              mutationCallback();
              return;
            }
          }
        }
      }
    });

    mutationObserver.observe(el, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  const destroy = () => {
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = undefined;
    }
  };

  return {
    destroy,
  };
};

export type SlotMutationController = {
  destroy: () => void;
};
