import { win } from '@utils/browser';
import { raf } from '@utils/helpers';

type NotchElement = HTMLIonInputElement | HTMLIonSelectElement | HTMLIonTextareaElement;

/**
 * A utility to calculate the size of an outline notch
 * width relative to the content passed. This is used in
 * components such as `ion-select` with `fill="outline"`
 * where we need to pass slotted HTML content. This is not
 * needed when rendering plaintext content because we can
 * render the plaintext again hidden with `opacity: 0` inside
 * of the notch. As a result we can rely on the intrinsic size
 * of the element to correctly compute the notch width. We
 * cannot do this with slotted content because we cannot project
 * it into 2 places at once.
 *
 * @internal
 * @param el: The host element
 * @param getNotchSpacerEl: A function that returns a reference to the notch spacer element inside of the component template.
 * @param getLabelSlot: A function that returns a reference to the slotted content.
 */
export const createNotchController = (
  el: NotchElement,
  getNotchSpacerEl: () => HTMLElement | undefined,
  getLabelSlot: () => Element | null
): NotchController => {
  let notchVisibilityIO: IntersectionObserver | undefined;

  const needsExplicitNotchWidth = () => {
    const notchSpacerEl = getNotchSpacerEl();

    if (
      /**
       * If the notch is not being used
       * then we do not need to set the notch width.
       */
      notchSpacerEl === undefined ||
      /**
       * If either the label property is being
       * used or the label slot is not defined,
       * then we do not need to estimate the notch width.
       */
      el.label !== undefined ||
      getLabelSlot() === null
    ) {
      return false;
    }

    return true;
  };

  const calculateNotchWidth = () => {
    if (needsExplicitNotchWidth()) {
      /**
       * Run this the frame after
       * the browser has re-painted the host element.
       * Otherwise, the label element may have a width
       * of 0 and the IntersectionObserver will be used.
       */
      raf(() => {
        setNotchWidth();
      });
    }
  };

  /**
   * When using a label prop we can render
   * the label value inside of the notch and
   * let the browser calculate the size of the notch.
   * However, we cannot render the label slot in multiple
   * places so we need to manually calculate the notch dimension
   * based on the size of the slotted content.
   *
   * This function should only be used to set the notch width
   * on slotted label content. The notch width for label prop
   * content is automatically calculated based on the
   * intrinsic size of the label text.
   */
  const setNotchWidth = () => {
    const notchSpacerEl = getNotchSpacerEl();

    if (notchSpacerEl === undefined) {
      return;
    }

    if (!needsExplicitNotchWidth()) {
      notchSpacerEl.style.removeProperty('width');
      return;
    }

    const width = getLabelSlot()!.scrollWidth;

    if (
      /**
       * If the computed width of the label is 0
       * and notchSpacerEl's offsetParent is null
       * then that means the element is hidden.
       * As a result, we need to wait for the element
       * to become visible before setting the notch width.
       *
       * We do not check el.offsetParent because
       * that can be null if the host element has
       * position: fixed applied to it.
       * notchSpacerEl does not have position: fixed.
       */
      width === 0 &&
      notchSpacerEl.offsetParent === null &&
      win !== undefined &&
      'IntersectionObserver' in win
    ) {
      /**
       * If there is an IO already attached
       * then that will update the notch
       * once the element becomes visible.
       * As a result, there is no need to create
       * another one.
       */
      if (notchVisibilityIO !== undefined) {
        return;
      }

      const io = (notchVisibilityIO = new IntersectionObserver(
        (ev) => {
          /**
           * If the element is visible then we
           * can try setting the notch width again.
           */
          if (ev[0].intersectionRatio === 1) {
            setNotchWidth();
            io.disconnect();
            notchVisibilityIO = undefined;
          }
        },
        /**
         * Set the root to be the host element
         * This causes the IO callback
         * to be fired in WebKit as soon as the element
         * is visible. If we used the default root value
         * then WebKit would only fire the IO callback
         * after any animations (such as a modal transition)
         * finished, and there would potentially be a flicker.
         */
        { threshold: 0.01, root: el }
      ));

      io.observe(notchSpacerEl);
      return;
    }

    /**
     * If the element is visible then we can set the notch width.
     * The notch is only visible when the label is scaled,
     * which is why we multiply the width by 0.75 as this is
     * the same amount the label element is scaled by in the host CSS.
     * (See $form-control-label-stacked-scale in globals.scss).
     */
    notchSpacerEl.style.setProperty('width', `${width * 0.75}px`);
  };

  const destroy = () => {
    if (notchVisibilityIO) {
      notchVisibilityIO.disconnect();
      notchVisibilityIO = undefined;
    }
  };

  return {
    calculateNotchWidth,
    destroy,
  };
};

export type NotchController = {
  calculateNotchWidth: () => void;
  destroy: () => void;
};
