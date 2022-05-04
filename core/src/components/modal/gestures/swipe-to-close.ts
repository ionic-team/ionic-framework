import type { Animation } from '../../../interface';
import { getTimeGivenProgression } from '../../../utils/animation/cubic-bezier';
import { isIonContent } from '../../../utils/content';
import type { GestureDetail } from '../../../utils/gesture';
import { createGesture } from '../../../utils/gesture';
import { clamp } from '../../../utils/helpers';

import { calculateSpringStep, handleCanDismiss } from './utils';

// Defaults for the card swipe animation
export const SwipeToCloseDefaults = {
  MIN_PRESENTING_SCALE: 0.93,
};

export const createSwipeToCloseGesture = (
  el: HTMLIonModalElement,
  contentEl: HTMLElement,
  scrollEl: HTMLElement,
  animation: Animation,
  onDismiss: () => void
) => {
  const height = el.offsetHeight;
  let isOpen = false;
  let canDismissBlocksGesture = false;
  const canDismissMaxStep = 0.2;
  const hasRefresherInContent = !!contentEl.querySelector('ion-refresher');
  const getScrollY = () => {
    if (isIonContent(contentEl)) {
      return (contentEl as HTMLIonContentElement).scrollY;
      /**
       * Custom scroll containers are intended to be
       * used with virtual scrolling, so we assume
       * there is scrolling in this case.
       */
    } else {
      return true;
    }
  };
  const initialScrollY = getScrollY();

  const disableContentScroll = () => {
    if (isIonContent(contentEl)) {
      (contentEl as HTMLIonContentElement).scrollY = false;
    } else {
      contentEl.style.setProperty('overflow', 'hidden');
    }
  };

  const resetContentScroll = () => {
    if (isIonContent(contentEl)) {
      (contentEl as HTMLIonContentElement).scrollY = initialScrollY;
    } else {
      contentEl.style.removeProperty('overflow');
    }
  };

  const canStart = (detail: GestureDetail) => {
    const target = detail.event.target as HTMLElement | null;

    if (target === null || !(target as any).closest) {
      return true;
    }

    /**
     * If we are swiping on the content,
     * swiping should only be possible if
     * the content is scrolled all the way
     * to the top so that we do not interfere
     * with scrolling.
     */
    const content = target.closest('ion-content');
    if (content) {
      /**
       * The card should never swipe to close
       * on the content with a refresher.
       * Note: We cannot solve this by making the
       * swipeToClose gesture have a higher priority
       * than the refresher gesture as the iOS native
       * refresh gesture uses a scroll listener in
       * addition to a gesture.
       */
      return !hasRefresherInContent && scrollEl.scrollTop === 0;
    }

    /**
     * Card should be swipeable on all
     * parts of the modal except for the footer.
     */
    const footer = target.closest('ion-footer');
    if (footer === null) {
      return true;
    }

    return false;
  };

  const onStart = (detail: GestureDetail) => {
    const { deltaY } = detail;
    /**
     * If canDismiss is anything other than `true`
     * then users should be able to swipe down
     * until a threshold is hit. At that point,
     * the card modal should not proceed any further.
     * TODO (FW-937)
     * Remove undefined check
     */

    canDismissBlocksGesture = el.canDismiss !== undefined && el.canDismiss !== true;

    /**
     * If we are pulling down, then
     * it is possible we are pulling on the
     * content. We do not want scrolling to
     * happen at the same time as the gesture.
     */
    if (deltaY > 0) {
      disableContentScroll();
    }

    animation.progressStart(true, isOpen ? 1 : 0);
  };

  const onMove = (detail: GestureDetail) => {
    const { deltaY } = detail;

    /**
     * If we are pulling down, then
     * it is possible we are pulling on the
     * content. We do not want scrolling to
     * happen at the same time as the gesture.
     */
    if (deltaY > 0) {
      disableContentScroll();
    }

    /**
     * If we are swiping on the content
     * then the swipe gesture should only
     * happen if we are pulling down.
     *
     * However, if we pull up and
     * then down such that the scroll position
     * returns to 0, we should be able to swipe
     * the card.
     */

    const step = detail.deltaY / height;

    /**
     * Check if user is swiping down and
     * if we have a canDismiss value that
     * should block the gesture from
     * proceeding,
     */
    const isAttempingDismissWithCanDismiss = step >= 0 && canDismissBlocksGesture;

    /**
     * If we are blocking the gesture from dismissing,
     * set the max step value so that the sheet cannot be
     * completely hidden.
     */
    const maxStep = isAttempingDismissWithCanDismiss ? canDismissMaxStep : 0.9999;

    /**
     * If we are blocking the gesture from
     * dismissing, calculate the spring modifier value
     * this will be added to the starting breakpoint
     * value to give the gesture a spring-like feeling.
     * Note that the starting breakpoint is always 0,
     * so we omit adding 0 to the result.
     */
    const processedStep = isAttempingDismissWithCanDismiss ? calculateSpringStep(step / maxStep) : step;

    const clampedStep = clamp(0.0001, processedStep, maxStep);

    animation.progressStep(clampedStep);
  };

  const onEnd = (detail: GestureDetail) => {
    const velocity = detail.velocityY;
    const step = detail.deltaY / height;

    const isAttempingDismissWithCanDismiss = step >= 0 && canDismissBlocksGesture;
    const maxStep = isAttempingDismissWithCanDismiss ? canDismissMaxStep : 0.9999;

    const processedStep = isAttempingDismissWithCanDismiss ? calculateSpringStep(step / maxStep) : step;

    const clampedStep = clamp(0.0001, processedStep, maxStep);

    const threshold = (detail.deltaY + velocity * 1000) / height;

    /**
     * If canDismiss blocks
     * the swipe gesture, then the
     * animation can never complete until
     * canDismiss is checked.
     */
    const shouldComplete = !isAttempingDismissWithCanDismiss && threshold >= 0.5;
    let newStepValue = shouldComplete ? -0.001 : 0.001;

    if (!shouldComplete) {
      animation.easing('cubic-bezier(1, 0, 0.68, 0.28)');
      newStepValue += getTimeGivenProgression([0, 0], [1, 0], [0.68, 0.28], [1, 1], clampedStep)[0];
    } else {
      animation.easing('cubic-bezier(0.32, 0.72, 0, 1)');
      newStepValue += getTimeGivenProgression([0, 0], [0.32, 0.72], [0, 1], [1, 1], clampedStep)[0];
    }

    const duration = shouldComplete
      ? computeDuration(step * height, velocity)
      : computeDuration((1 - clampedStep) * height, velocity);
    isOpen = shouldComplete;

    gesture.enable(false);

    resetContentScroll();

    animation
      .onFinish(() => {
        if (!shouldComplete) {
          gesture.enable(true);
        }
      })
      .progressEnd(shouldComplete ? 1 : 0, newStepValue, duration);

    /**
     * If the canDismiss value blocked the gesture
     * from proceeding, then we should ignore whatever
     * shouldComplete is. Whether or not the modal
     * animation should complete is now determined by
     * canDismiss.
     *
     * If the user swiped >25% of the way
     * to the max step, then we should
     * check canDismiss. 25% was chosen
     * to avoid accidental swipes.
     */
    if (isAttempingDismissWithCanDismiss && clampedStep > maxStep / 4) {
      handleCanDismiss(el, animation);
    } else if (shouldComplete) {
      onDismiss();
    }
  };

  const gesture = createGesture({
    el,
    gestureName: 'modalSwipeToClose',
    gesturePriority: 40,
    direction: 'y',
    threshold: 10,
    canStart,
    onStart,
    onMove,
    onEnd,
  });
  return gesture;
};

const computeDuration = (remaining: number, velocity: number) => {
  return clamp(400, remaining / Math.abs(velocity * 1.1), 500);
};
