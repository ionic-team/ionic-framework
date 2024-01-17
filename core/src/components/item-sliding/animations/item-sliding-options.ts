import { createAnimation } from '@utils/animation/animation';

/**
 * Animates the opening and closing of a sliding item option.
 * @param el The element to animate.
 * @param viewportOffset The offset of the element on the x-axis to locate it off-screen.
 * @param progress The progress of the animation (0 - 1).
 * @param isFinal Whether the animation is in its final state (collapsed or expanded).
 * @param zIndex _Optional_ The z-index to apply to the element.
 */
export const slidingItemAnimation = (
  el: HTMLIonItemOptionElement,
  viewportOffset: number,
  progress: number,
  isFinal: boolean,
  zIndex: number | undefined
) => {
  const styles = zIndex !== undefined ? { zIndex: `${zIndex}` } : {};

  const animation = createAnimation()
    .addElement(el)
    /**
     * The specific value here does not actually
     * matter. We just need this to be a positive
     * value so the animation does not jump
     * to the end when the user begins to drag.
     */
    .duration(1)
    .commitStyles()
    .keyframes([
      { offset: 0, transform: `translate3d(${viewportOffset}px,0,0)`, ...styles },
      { offset: 1, transform: `translate3d(0,0,0)`, ...styles },
    ]);

  if (!isFinal) {
    animation.progressStart(true, progress);
  } else {
    animation.destroy();

    const toggleAnimation = createAnimation()
      .addElement(el)
      .duration(300)
      .easing('ease-out')
      .commitStyles()
      .beforeStyles({
        zIndex: zIndex,
      })
      .fromTo('transform', el.style.transform, `translate3d(0,0,0)`)
      .afterClearStyles(['z-index']);

    toggleAnimation.play();
  }
};
