import { writeTask } from '@stencil/core';

import { GestureDetail } from '../../../utils/gesture';

import { ModalGesture } from './index';

export class SwipeToCloseGesture implements ModalGesture {
  // The current opacity of the backdrop element
  private minBackdropOpacity = 0.4;
  private backdropOpacity = 0;
  // The current scale of the presenting element
  private minPresentingScale = 0.92;
  private presentingScale = 0;
  // The minimum y position for the open card style modal
  private minY = 44;
  // Current Y position of the dragging modal
  private y = 0;

  constructor(
    private el: HTMLIonModalElement,
    private backdropEl: HTMLElement | undefined,
    private wrapperEl: HTMLElement | undefined,
    private presentingEl: HTMLElement | undefined,
    private onDismiss: (velocityY: number) => void) {
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
      canStart: detail => this.swipeToCloseCanStart(detail),
      onStart: detail => this.swipeToCloseOnStart(detail),
      onMove: detail => this.swipeToCloseOnMove(detail),
      onEnd: detail => this.swipeToCloseOnEnd(detail)
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

  private swipeToCloseCanStart(_detail: GestureDetail) {
    return true;
  }

  private swipeToCloseOnStart(_detail: GestureDetail) {
    this.swipeDisableTransition();
    this.backdropOpacity = parseFloat(this.backdropEl!.style.opacity!);
  }

  private swipeToCloseOnMove(detail: GestureDetail) {
    const y = this.minY + detail.deltaY;

    this.swipeSlideTo(y);
  }

  private swipeToCloseOnEnd(detail: GestureDetail) {
    console.log('On end', detail);

    const viewportHeight = window.innerHeight;

    this.swipeEnableTransition();

    if (detail.velocityY < -0.6) {
      this.swipeOpen();
    } else if (detail.velocityY > 0.6) {
      this.onDismiss(detail.velocityY);
    } else if (detail.currentY <= viewportHeight / 2) {
      this.swipeOpen();
    } else {
      this.onDismiss(detail.velocityY);
    }
  }

  private swipeDisableTransition() {
    this.wrapperEl!.style.transition = '';
  }

  private swipeEnableTransition() {
    this.wrapperEl!.style.transition = `400ms transform cubic-bezier(0.23, 1, 0.32, 1)`;
  }

  private swipeSlideTo(y: number) {
    const viewportHeight = (this.el.ownerDocument as any).defaultView.innerHeight;

    const dy = y - this.minY;

    const yRatio = dy / viewportHeight;

    console.log(y, yRatio);

    const backdropOpacity = this.minBackdropOpacity - this.minBackdropOpacity * yRatio;
    // const presentingScale = this.presentingScale - this.presentingScale * yRatio;
    const presentingScale = this.minPresentingScale - (this.minPresentingScale * -yRatio) * 0.1;

    // Store current state of values for animation effects
    this.presentingScale = presentingScale;
    this.backdropOpacity = backdropOpacity;
    this.y = y;

    this.swipeSetPresentingScale(presentingScale);
    this.swipeSetBackdropOpacity(backdropOpacity);
    // this.y = y;
    writeTask(() => {
      this.wrapperEl!.style.transform = `translateY(${y}px)`;
    });
  }

  private swipeSetBackdropOpacity(opacity: number) {
    writeTask(() => {
      this.backdropEl!.style.opacity = `${opacity}`;
    });
  }

  private swipeSetPresentingScale(scale: number) {
    console.log('Presenting scale', scale);
    if (!this.presentingEl) {
      return;
    }

    writeTask(() => {
      this.presentingEl!.style.transform = `translateY(-5px) scale(${scale})`;
    });
  }

  private async swipeOpen() {
    requestAnimationFrame(() => {
      this.swipeSlideTo(this.minY);
    });
  }
}