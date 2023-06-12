import { win } from '@utils/browser';

/**
 * Used to update a scoped component that uses emulated slots. This fires when
 * content is passed into the slot. It does not fire when existing
 * slotted content changes.
 * This is not needed for components using native slots in the Shadow DOM.
 * @internal
 * @param el The host element to observe
 * @param slotName mutationCallback will fire when nodes on this slot change
 * @param mutationCallback The callback to fire whenever the slotted content changes
 */
export const createSlotMutationController = (
  el: HTMLElement,
  slotName: string,
  mutationCallback: () => void
): SlotMutationController => {
  let mutationObserver: MutationObserver | undefined;
  if (win !== undefined && 'IntersectionObserver' in win) {
    mutationObserver = new MutationObserver((entries) => {
      for (const entry of entries) {
        for (const node of entry.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && (node as Element).slot === slotName) {
            mutationCallback();
            return;
          }
        }
      }
    });

    mutationObserver.observe(el, {
      childList: true,
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
