import { win } from '@utils/browser';
import { raf } from '@utils/helpers';
/**
 * Used to update a scoped component that uses emulated slots. This fires when
 * content is passed into the slot or when the content inside of a slot changes.
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
  let hostMutationObserver: MutationObserver | undefined;
  let slottedContentMutationObserver: MutationObserver | undefined;

  if (win !== undefined && 'MutationObserver' in win) {
    hostMutationObserver = new MutationObserver((entries) => {
      for (const entry of entries) {
        for (const node of entry.addedNodes) {
          /**
           * Check to see if the added node
           *  is our slotted content.
           */
          if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).slot === slotName) {
            /**
             * If so, we want to watch the slotted
             * content itself for changes. This lets us
             * detect when content inside of the slot changes.
             */
            mutationCallback();

            /**
             * Adding the listener in an raf
             * waits until Stencil moves the slotted element
             * into the correct place in the event that
             * slotted content is being added.
             */
            raf(() => watchForSlotChange(node as HTMLElement));
            return;
          }
        }
      }
    });

    hostMutationObserver.observe(el, {
      childList: true,
    });
  }

  /**
   * Listen for changes inside of the slotted content.
   * We can listen for subtree changes here to be
   * informed of text within the slotted content
   * changing. Doing this on the host is possible
   * but it is much more expensive to do because
   * it also listens for changes to the internals
   * of the component.
   */
  const watchForSlotChange = (slottedEl: HTMLElement) => {
    if (slottedContentMutationObserver) {
      slottedContentMutationObserver.disconnect();
      slottedContentMutationObserver = undefined;
    }

    slottedContentMutationObserver = new MutationObserver((entries) => {
      mutationCallback();

      for (const entry of entries) {
        for (const node of entry.removedNodes) {
          /**
           * If the element was removed then we
           * need to destroy the MutationObserver
           * so the element can be garbage collected.
           */
          if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).slot === slotName) {
            destroySlottedContentObserver();
          }
        }
      }
    });

    /**
     * Listen for changes inside of the element
     * as well as anything deep in the tree.
     * We listen on the parentElement so that we can
     * detect when slotted element itself is removed.
     */
    slottedContentMutationObserver.observe(slottedEl.parentElement ?? slottedEl, { subtree: true, childList: true });
  };

  const destroy = () => {
    if (hostMutationObserver) {
      hostMutationObserver.disconnect();
      hostMutationObserver = undefined;
    }

    destroySlottedContentObserver();
  };

  const destroySlottedContentObserver = () => {
    if (slottedContentMutationObserver) {
      slottedContentMutationObserver.disconnect();
      slottedContentMutationObserver = undefined;
    }
  };

  return {
    destroy,
  };
};

export type SlotMutationController = {
  destroy: () => void;
};
