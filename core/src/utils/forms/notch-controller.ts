import { win } from '@utils/window';

type NotchElement = HTMLIonInputElement | HTMLIonSelectElement;

export const createNotchController = (
  el: NotchElement,
  getNotchSpacerEl: () => HTMLElement | undefined,
  getLabelSlot: () => HTMLElement | undefined
) => {
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
       * that can be null if ion-select has
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
         * Set the root to be the select
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
     * the same amount the label element is scaled by in the
     * select CSS (See $select-floating-label-scale in select.vars.scss).
     */
    notchSpacerEl.style.setProperty('width', `${width * 0.75}px`);
  };

  return {
    setNotchWidth,
  };
};
