import { writeTask } from '@stencil/core';

import { GestureDetail } from '../../../utils/gesture';

import { ModalGesture } from './index';

// Defaults for the card swipe animation
export const SwipeToCloseDefaults = {
  MIN_BACKDROP_OPACITY: 0.4,
  MIN_PRESENTING_SCALE: 0.92,
  MIN_Y_CARD: 44,
  MIN_Y_FULLSCREEN: 0,
  MIN_PRESENTING_Y: 1
};

export class SwipeToCloseGesture implements ModalGesture {
  // The current opacity of the backdrop element
  private minBackdropOpacity = SwipeToCloseDefaults.MIN_BACKDROP_OPACITY;
  private backdropOpacity = 0;
  // The current scale of the presenting element
  private minPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
  private presentingScale = 0;
  // The minimum y position of the presenting element
  private minPresentingY = SwipeToCloseDefaults.MIN_PRESENTING_Y;
  // The minimum y position for the swipe-to-close animations
  private minY = SwipeToCloseDefaults.MIN_Y_FULLSCREEN;
  // The lowest y to allow when dragging, will slow down considerably after this
  private boundsY = 0;
  // Current Y position of the dragging modal
  private y = 0;

  constructor(
    private el: HTMLIonModalElement,
    private backdropEl: HTMLElement | undefined,
    private wrapperEl: HTMLElement | undefined,
    private presentingEl: HTMLElement | undefined,
    private onDismiss: (velocityY: number) => void) {

    this.minY = el.presentationStyle === 'card' ? SwipeToCloseDefaults.MIN_Y_CARD : SwipeToCloseDefaults .MIN_Y_FULLSCREEN;
    this.boundsY = el.presentationStyle === 'card' ? 20 : 0;

    this.init();
  }

  async init() {
    const gesture = (await import('../../../utils/gesture')).createGesture({
      el: this.el,
      gestureName: 'modalSwipeToClose',
      gesturePriority: 110,
      threshold: 0,
      direction: 'y',
      passive: true,
      mouseEvents: false,
      disableScroll: false,
      canStart: detail => this.canStart(detail),
      onStart: detail => this.onStart(detail),
      onMove: detail => this.onMove(detail),
      onEnd: detail => this.onEnd(detail)
    });

    gesture.setDisabled(false);
  }

  getY() {
    return this.y;
  }

  getBackdropOpacity() {
    return this.backdropOpacity;
  }

  getPresentingScale() {
    return this.presentingScale;
  }

  setPresentingEl(presentingEl: HTMLElement) {
    this.presentingEl = presentingEl;
  }

  private canStart(detail: GestureDetail) {
    const target = detail.event.target;

    if (!target || !(target as HTMLElement).closest) {
      return true;
    }

    const content = (target as HTMLElement).closest('ion-content') as HTMLIonContentElement;

    if (!content) {
      return true;
    }

    // Target is in the content so we don't start the gesture.
    // We could be more nuanced here and allow it for content that
    // does not need to scroll.

    return false;
  }

  private onStart(_detail: GestureDetail) {
    this.disableTransition();
    this.backdropOpacity = parseFloat(this.backdropEl!.style.opacity!);
  }

  private onMove(detail: GestureDetail) {
    const y = this.minY + detail.deltaY;

    // A scaled down value for overdragging
    const overY = this.boundsY + detail.deltaY * 0.07;

    // If we're above the max limit, then greatly reduce the drag amount
    const actualY = y > this.boundsY ? y : overY;

    this.slideTo(actualY);
  }

  private onEnd(detail: GestureDetail) {
    const viewportHeight = window.innerHeight;

    this.enableTransition();

    requestAnimationFrame(() => {
      if (detail.velocityY < -0.6) {
        this.swipeOpen();
      } else if (detail.velocityY > 0.6) {
        this.onDismiss(detail.velocityY);
      } else if (detail.currentY <= viewportHeight / 2) {
        this.swipeOpen();
      } else {
        this.onDismiss(detail.velocityY);
      }
    });
  }

  private disableTransition() {
    this.el.classList.remove('modal-animation-reset');
    if (this.presentingEl) {
      this.presentingEl.classList.remove('ion-page-card-reset');
    }
  }

  private enableTransition() {
    this.el.classList.add('modal-animation-reset');
    if (this.presentingEl) {
      this.presentingEl.classList.add('ion-page-card-reset');
    }
  }

  private slideTo(y: number) {
    const viewportHeight = (this.el.ownerDocument as any).defaultView.innerHeight;

    const dy = y - this.minY;

    const yRatio = dy / viewportHeight;

    const backdropOpacity = this.minBackdropOpacity - this.minBackdropOpacity * yRatio;
    const presentingScale = this.minPresentingScale - (this.minPresentingScale * -yRatio) * 0.085;

    // Store current state of values for animation effects
    this.presentingScale = presentingScale;
    this.backdropOpacity = backdropOpacity;
    this.y = y;

    writeTask(() => {
      this.setPresentingScale(presentingScale);
      this.setBackdropOpacity(backdropOpacity);
      this.setY(y);
    });
  }

  private setBackdropOpacity(opacity: number) {
    this.backdropEl!.style.opacity = `${opacity}`;
  }

  private setPresentingScale(scale: number) {
    // Only adjust the scale of the presenting element if it exists and the
    // presentation style is 'card'
    if (!this.presentingEl || !(this.el.presentationStyle === 'card')) {
      return;
    }

    this.presentingEl!.style.transform = `translateY(${this.minPresentingY}px) scale(${scale})`;
  }

  private setY(y: number) {
    this.wrapperEl!.style.transform = `translateY(${y}px)`;
  }

  private async swipeOpen() {
    requestAnimationFrame(() => {
      this.slideTo(this.minY);
    });
  }
}
