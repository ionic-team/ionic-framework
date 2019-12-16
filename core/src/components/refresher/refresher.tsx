import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h, readTask, writeTask } from '@stencil/core';

import { getTimeGivenProgression } from '../../';
import { getIonMode } from '../../global/ionic-global';
import { Animation, Gesture, GestureDetail, RefresherEventDetail } from '../../interface';
import { clamp } from '../../utils/helpers';
import { hapticImpact } from '../../utils/native/haptic';

import { createPullingAnimation, createSnapBackAnimation, getRefresherAnimationType, handleScrollWhilePulling, handleScrollWhileRefreshing, setSpinnerOpacity, shouldUseNativeRefresher, translateElement } from './refresher.utils';

@Component({
  tag: 'ion-refresher',
  styleUrls: {
    ios: 'refresher.ios.scss',
    md: 'refresher.md.scss'
  }
})
export class Refresher implements ComponentInterface {

  private appliedStyles = false;
  private didStart = false;
  private progress = 0;
  private scrollEl?: HTMLElement;
  private scrollListenerCallback?: any;
  private gesture?: Gesture;

  private pointerDown = false;
  private needsCompletion = false;
  private didRefresh = false;
  private lastVelocityY = 0;
  private elementToTransform?: HTMLElement;
  private animations: Animation[] = [];

  @State() private nativeRefresher = false;

  @Element() el!: HTMLIonRefresherElement;

  /**
   * The current state which the refresher is in. The refresher's states include:
   *
   * - `inactive` - The refresher is not being pulled down or refreshing and is currently hidden.
   * - `pulling` - The user is actively pulling down the refresher, but has not reached the point yet that if the user lets go, it'll refresh.
   * - `cancelling` - The user pulled down the refresher and let go, but did not pull down far enough to kick off the `refreshing` state. After letting go, the refresher is in the `cancelling` state while it is closing, and will go back to the `inactive` state once closed.
   * - `ready` - The user has pulled down the refresher far enough that if they let go, it'll begin the `refreshing` state.
   * - `refreshing` - The refresher is actively waiting on the async operation to end. Once the refresh handler calls `complete()` it will begin the `completing` state.
   * - `completing` - The `refreshing` state has finished and the refresher is in the way of closing itself. Once closed, the refresher will go back to the `inactive` state.
   */
  @State() private state: RefresherState = RefresherState.Inactive;

  /**
   * The minimum distance the user must pull down until the
   * refresher will go into the `refreshing` state.
   * Does not apply when the refresher has a `contentId` and the refresher
   * content uses a spinner, enabling the native refresher.
   */
  @Prop() pullMin = 60;

  /**
   * The maximum distance of the pull until the refresher
   * will automatically go into the `refreshing` state.
   * Defaults to the result of `pullMin + 60`.
   * Does not apply when the refresher has a `contentId` and the refresher
   * content uses a spinner, enabling the native refresher.
   */
  @Prop() pullMax: number = this.pullMin + 60;

  /**
   * Time it takes to close the refresher.
   * Does not apply when the refresher has a `contentId` and the refresher
   * content uses a spinner, enabling the native refresher.
   */
  @Prop() closeDuration = '280ms';

  /**
   * Time it takes the refresher to to snap back to the `refreshing` state.
   * Does not apply when the refresher has a `contentId` and the refresher
   * content uses a spinner, enabling the native refresher.
   */
  @Prop() snapbackDuration = '280ms';

  /**
   * How much to multiply the pull speed by. To slow the pull animation down,
   * pass a number less than `1`. To speed up the pull, pass a number greater
   * than `1`. The default value is `1` which is equal to the speed of the cursor.
   * If a negative value is passed in, the factor will be `1` instead.
   *
   * For example: If the value passed is `1.2` and the content is dragged by
   * `10` pixels, instead of `10` pixels the content will be pulled by `12` pixels
   * (an increase of 20 percent). If the value passed is `0.8`, the dragged amount
   * will be `8` pixels, less than the amount the cursor has moved.
   *
   * Does not apply when the refresher has a `contentId` and the refresher
   * content uses a spinner, enabling the native refresher.
   */
  @Prop() pullFactor = 1;

  /**
   * The ID of the content to be refreshed. Only used with native refreshers
   * where a spinner is passed to the content.
   */
  @Prop() contentId?: string;

  /**
   * If `true`, the refresher will be hidden.
   */
  @Prop() disabled = false;
  @Watch('disabled')
  disabledChanged() {
    if (this.gesture) {
      this.gesture.enable(!this.disabled);
    }
  }

  /**
   * Emitted when the user lets go of the content and has pulled down
   * further than the `pullMin` or pulls the content down and exceeds the pullMax.
   * Updates the refresher state to `refreshing`. The `complete()` method should be
   * called when the async operation has completed.
   */
  @Event() ionRefresh!: EventEmitter<RefresherEventDetail>;

  /**
   * Emitted while the user is pulling down the content and exposing the refresher.
   */
  @Event() ionPull!: EventEmitter<void>;

  /**
   * Emitted when the user begins to start pulling down.
   */
  @Event() ionStart!: EventEmitter<void>;

  private checkNativeRefresher() {
    if (shouldUseNativeRefresher(this.el, getIonMode(this))) {
      const contentEl = this.el.closest('ion-content');
      this.setupNativeRefresher(contentEl);
    } else {
      this.destroyNativeRefresher();
    }
  }

  private destroyNativeRefresher() {
    if (this.scrollEl && this.scrollListenerCallback) {
      this.scrollEl.removeEventListener('scroll', this.scrollListenerCallback);
      this.scrollListenerCallback = undefined;
    }

    this.nativeRefresher = false;
  }

  private async resetNativeRefresher(el: HTMLElement | undefined, state: RefresherState) {
    this.state = state;

    if (el !== undefined) {
      await translateElement(el, undefined);
    }

    this.didRefresh = false;
    this.needsCompletion = false;
    this.pointerDown = false;
    this.state = RefresherState.Inactive;
  }

  private async setupNativeRefresher(contentEl: HTMLIonContentElement | null) {
    if (this.scrollListenerCallback || !contentEl || this.nativeRefresher) {
      return;
    }

    this.nativeRefresher = true;

    const pullingSpinner = this.el.querySelector('ion-refresher-content .refresher-pulling ion-spinner') as HTMLElement;
    const refreshingSpinner = this.el.querySelector('ion-refresher-content .refresher-refreshing ion-spinner') as HTMLElement;

    if (getIonMode(this) === 'ios') {
      this.elementToTransform = contentEl.querySelector(`#${this.contentId}`) as HTMLElement | undefined;
      if (this.elementToTransform === undefined) {
        console.error('The native style refresher must have a contentId.');
        return;
      }

      const ticks = pullingSpinner.shadowRoot!.querySelectorAll('svg');
      const MAX_PULL = this.scrollEl!.clientHeight * 0.16;
      const NUM_TICKS = ticks.length;

      writeTask(() => ticks.forEach(el => el.style.setProperty('animation', 'none')));

      this.scrollListenerCallback = () => {
        // If pointer is not on screen or refresher is not active, ignore scroll
        if (!this.pointerDown && this.state === RefresherState.Inactive) { return; }

        readTask(() => {
          // PTR should only be active when overflow scrolling at the top
          const scrollTop = this.scrollEl!.scrollTop;
          const refresherHeight = this.el.clientHeight;

          if (scrollTop > 0) {
            /**
             * If refresher is refreshing and user tries to scroll
             * progressively fade refresher out/in
             */
            if (this.state === RefresherState.Refreshing) {
              const ratio = clamp(0, scrollTop / (refresherHeight * 0.5), 1);
              writeTask(() => setSpinnerOpacity(refreshingSpinner, 1 - ratio));
              return;
            }

            writeTask(() => setSpinnerOpacity(pullingSpinner, 0));
            return;
          }

          if (this.pointerDown) {
            if (!this.didStart) {
              this.didStart = true;
              this.ionStart.emit();
            }

            // emit "pulling" on every move
            if (this.pointerDown) {
              this.ionPull.emit();
            }
          }

          // delay showing the next tick marks until user has pulled 30px
          const opacity = clamp(0, Math.abs(scrollTop) / refresherHeight, 0.99);
          const pullAmount = this.progress = clamp(0, (Math.abs(scrollTop) - 30) / MAX_PULL, 1);
          const currentTickToShow = clamp(0, Math.floor(pullAmount * NUM_TICKS), NUM_TICKS - 1);
          const shouldShowRefreshingSpinner = this.state === RefresherState.Refreshing || currentTickToShow === NUM_TICKS - 1;

          if (shouldShowRefreshingSpinner) {
            if (this.pointerDown) {
              handleScrollWhileRefreshing(refreshingSpinner, this.lastVelocityY);
            }

            if (!this.didRefresh) {
              this.beginRefresh();
              this.didRefresh = true;
              hapticImpact({ style: 'light' });

              /**
               * Translate the content element otherwise when pointer is removed
               * from screen the scroll content will bounce back over the refresher
               */
              if (!this.pointerDown) {
                translateElement(this.elementToTransform, `${refresherHeight}px`);
              }
            } else {
              this.state = RefresherState.Pulling;
              handleScrollWhilePulling(pullingSpinner, ticks, opacity, currentTickToShow);
            }
          }
        });
      };

      this.scrollEl!.addEventListener('scroll', this.scrollListenerCallback);

      this.gesture = (await import('../../utils/gesture')).createGesture({
            el: this.scrollEl!,
            gestureName: 'refresher',
            gesturePriority: 10,
            direction: 'y',
            threshold: 0,
            onStart: () => {
              this.pointerDown = true;

              if (!this.didRefresh) {
                translateElement(this.elementToTransform, '0px');
              }
            },
            onMove: ev => {
              this.lastVelocityY = ev.velocityY;
            },
            onEnd: () => {
              this.pointerDown = false;
              this.didStart = false;

              if (this.needsCompletion) {
                this.resetNativeRefresher(this.elementToTransform, RefresherState.Completing);
                this.needsCompletion = false;
              } else if (this.didRefresh) {
                readTask(() => translateElement(this.elementToTransform, `${this.el.clientHeight}px`));
              }
            },
          });

      this.disabledChanged();
    } else {
      const circle = pullingSpinner.shadowRoot!.querySelector('circle')!;
      const pullingRefresherIcon = this.el.querySelector('ion-refresher-content .refresher-pulling-icon') as HTMLElement;

      // TODO clean up this awful awful code
      writeTask(() => {
        circle.style.setProperty('animation', 'none');

        const refreshingCircle = refreshingSpinner.shadowRoot!.querySelector('circle')!;
        refreshingSpinner.style.setProperty('animation-delay', '-655ms');
        refreshingCircle.style.setProperty('animation-delay', '-655ms');

        // really what I need here is the caret-back-sharp ionicon
        // inside of a div container that has been appended
        // inside of the pulling spinner so that the arrow
        // can fade in. It also might be possible to just have it sit inside
        // of ion-refresher-content, but I haven't tried that yet
        const container = document.createElement('div');
        container.style.setProperty('width', '100%');
        container.style.setProperty('height', '100%');
        container.classList.add('arrow-container');

        const icon = document.createElement('ion-icon');
        icon.style.setProperty('font-size', '12px');
        icon.name = 'caret-back-sharp';
        container.appendChild(icon);
        pullingSpinner.shadowRoot!.appendChild(container);
      });

      this.gesture = (await import('../../utils/gesture')).createGesture({
        el: this.scrollEl!,
        gestureName: 'refresher',
        gesturePriority: 10,
        direction: 'y',
        threshold: 0,
        canStart: () => this.state !== RefresherState.Refreshing && this.state !== RefresherState.Completing && this.scrollEl!.scrollTop === 0,
        onStart: (ev: GestureDetail) => {
          ev.data = { animation: undefined, didStart: false };
        },
        onMove: (ev: GestureDetail) => {
          if (ev.velocityY <= 0 && this.progress === 0) {
            return;
          }

          if (!ev.data.didStart) {
            ev.data.didStart = true;

            this.state = RefresherState.Pulling;
            const animationType = getRefresherAnimationType(contentEl);
            const animation = createPullingAnimation(animationType, pullingRefresherIcon);
            ev.data.animation = animation;

            writeTask(() => {
              this.scrollEl!.style.setProperty('--overflow', 'hidden');

              animation.progressStart(false, 0);
              this.ionStart.emit();
              this.animations.push(animation);
            });

            return;
          }

          // Since we are using an easing curve, slow the gesture tracking down a bit
          this.progress = clamp(0, (ev.deltaY / 180) * 0.5, 1);
          ev.data.animation.progressStep(this.progress);
          this.ionPull.emit();
        },
        onEnd: (ev: GestureDetail) => {
          if (!ev.data.didStart) { return; }

          writeTask(() => this.scrollEl!.style.removeProperty('--overflow'));
          if (this.progress <= 0.4) {
            ev.data.animation
              .progressEnd(0, this.progress, 500)
              .onFinish(() => {
                this.animations.forEach(ani => ani.destroy());
                this.animations = [];
              });
            return;
          }

          const progress = getTimeGivenProgression([0, 0], [0, 0], [1, 1], [1, 1], this.progress)[0];
          const snapBackAnimation = createSnapBackAnimation(pullingRefresherIcon);
          this.animations.push(snapBackAnimation);
          writeTask(async () => {
            pullingRefresherIcon.style.setProperty('--ion-pulling-refresher-translate', `${(progress * 100)}px`);
            ev.data.animation.progressEnd();
            await snapBackAnimation.play();

            this.state = RefresherState.Refreshing;

            ev.data.animation.destroy();
            this.ionRefresh.emit({
              complete: this.complete.bind(this)
            });
          });
        }
      });

      this.disabledChanged();
    }
  }

  componentDidUpdate() {
    this.checkNativeRefresher();
  }

  async connectedCallback() {
    if (this.el.getAttribute('slot') !== 'fixed') {
      console.error('Make sure you use: <ion-refresher slot="fixed">');
      return;
    }

    const contentEl = this.el.closest('ion-content');
    if (!contentEl) {
      console.error('<ion-refresher> must be used inside an <ion-content>');
      return;
    }

    this.scrollEl = await contentEl.getScrollElement();
    if (shouldUseNativeRefresher(this.el, getIonMode(this))) {
      this.setupNativeRefresher(contentEl);
    } else {
      this.gesture = (await import('../../utils/gesture')).createGesture({
        el: contentEl,
        gestureName: 'refresher',
        gesturePriority: 10,
        direction: 'y',
        threshold: 20,
        passive: false,
        canStart: () => this.canStart(),
        onStart: () => this.onStart(),
        onMove: ev => this.onMove(ev),
        onEnd: () => this.onEnd(),
      });

      this.disabledChanged();
    }
  }

  disconnectedCallback() {
    this.destroyNativeRefresher();
    this.scrollEl = undefined;
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  private completeNativeRefresher() {
    this.needsCompletion = true;

    // Do not reset scroll el until user removes pointer from screen
    if (this.pointerDown) { return; }

    if (getIonMode(this) === 'ios') {
      this.resetNativeRefresher(this.elementToTransform, RefresherState.Completing);
    } else {
      // TODO
      this.state = RefresherState.Completing;
      this.animations.forEach(ani => ani.destroy());
      this.animations = [];

      setTimeout(() => {
        this.state = RefresherState.Inactive;
      }, 250);
    }
  }

  /**
   * Call `complete()` when your async operation has completed.
   * For example, the `refreshing` state is while the app is performing
   * an asynchronous operation, such as receiving more data from an
   * AJAX request. Once the data has been received, you then call this
   * method to signify that the refreshing has completed and to close
   * the refresher. This method also changes the refresher's state from
   * `refreshing` to `completing`.
   */
  @Method()
  async complete() {
    if (this.nativeRefresher) {
      this.completeNativeRefresher();
    } else {
      this.close(RefresherState.Completing, '120ms');
    }
  }

  /**
   * Changes the refresher's state from `refreshing` to `cancelling`.
   */
  @Method()
  async cancel() {
    if (this.nativeRefresher) {
      // Do not reset scroll el until user removes pointer from screen
      if (!this.pointerDown) {
        this.resetNativeRefresher(this.elementToTransform, RefresherState.Cancelling);
      }
    } else {
      this.close(RefresherState.Cancelling, '');
    }
  }

  /**
   * A number representing how far down the user has pulled.
   * The number `0` represents the user hasn't pulled down at all. The
   * number `1`, and anything greater than `1`, represents that the user
   * has pulled far enough down that when they let go then the refresh will
   * happen. If they let go and the number is less than `1`, then the
   * refresh will not happen, and the content will return to it's original
   * position.
   */
  @Method()
  getProgress() {
    return Promise.resolve(this.progress);
  }

  private canStart(): boolean {
    if (!this.scrollEl) {
      return false;
    }
    if (this.state !== RefresherState.Inactive) {
      return false;
    }
    // if the scrollTop is greater than zero then it's
    // not possible to pull the content down yet
    if (this.scrollEl.scrollTop > 0) {
      return false;
    }
    return true;
  }

  private onStart() {
    this.progress = 0;
    this.state = RefresherState.Inactive;
  }

  private onMove(detail: GestureDetail) {
    if (!this.scrollEl) {
      return;
    }
    // this method can get called like a bazillion times per second,
    // so it's built to be as efficient as possible, and does its
    // best to do any DOM read/writes only when absolutely necessary
    // if multi-touch then get out immediately
    const ev = detail.event as TouchEvent;
    if (ev.touches && ev.touches.length > 1) {
      return;
    }

    // do nothing if it's actively refreshing
    // or it's in the way of closing
    // or this was never a startY
    if ((this.state & RefresherState._BUSY_) !== 0) {
      return;
    }

    const pullFactor = (Number.isNaN(this.pullFactor) || this.pullFactor < 0) ? 1 : this.pullFactor;
    const deltaY = detail.deltaY * pullFactor;
    // don't bother if they're scrolling up
    // and have not already started dragging
    if (deltaY <= 0) {
      // the current Y is higher than the starting Y
      // so they scrolled up enough to be ignored
      this.progress = 0;
      this.state = RefresherState.Inactive;

      if (this.appliedStyles) {
        // reset the styles only if they were applied
        this.setCss(0, '', false, '');
        return;
      }

      return;
    }

    if (this.state === RefresherState.Inactive) {
      // this refresh is not already actively pulling down
      // get the content's scrollTop
      const scrollHostScrollTop = this.scrollEl.scrollTop;

      // if the scrollTop is greater than zero then it's
      // not possible to pull the content down yet
      if (scrollHostScrollTop > 0) {
        this.progress = 0;
        return;
      }

      // content scrolled all the way to the top, and dragging down
      this.state = RefresherState.Pulling;
    }

    // prevent native scroll events
    if (ev.cancelable) {
      ev.preventDefault();
    }

    // the refresher is actively pulling at this point
    // move the scroll element within the content element
    this.setCss(deltaY, '0ms', true, '');

    if (deltaY === 0) {
      // don't continue if there's no delta yet
      this.progress = 0;
      return;
    }

    const pullMin = this.pullMin;
    // set pull progress
    this.progress = deltaY / pullMin;

    // emit "start" if it hasn't started yet
    if (!this.didStart) {
      this.didStart = true;
      this.ionStart.emit();
    }

    // emit "pulling" on every move
    this.ionPull.emit();

    // do nothing if the delta is less than the pull threshold
    if (deltaY < pullMin) {
      // ensure it stays in the pulling state, cuz its not ready yet
      this.state = RefresherState.Pulling;
      return;
    }

    if (deltaY > this.pullMax) {
      // they pulled farther than the max, so kick off the refresh
      this.beginRefresh();
      return;
    }

    // pulled farther than the pull min!!
    // it is now in the `ready` state!!
    // if they let go then it'll refresh, kerpow!!
    this.state = RefresherState.Ready;

    return;
  }

  private onEnd() {
    // only run in a zone when absolutely necessary
    if (this.state === RefresherState.Ready) {
      // they pulled down far enough, so it's ready to refresh
      this.beginRefresh();

    } else if (this.state === RefresherState.Pulling) {
      // they were pulling down, but didn't pull down far enough
      // set the content back to it's original location
      // and close the refresher
      // set that the refresh is actively cancelling
      this.cancel();
    }
  }

  private beginRefresh() {
    // assumes we're already back in a zone
    // they pulled down far enough, so it's ready to refresh
    this.state = RefresherState.Refreshing;

    // place the content in a hangout position while it thinks
    this.setCss(this.pullMin, this.snapbackDuration, true, '');

    // emit "refresh" because it was pulled down far enough
    // and they let go to begin refreshing
    this.ionRefresh.emit({
      complete: this.complete.bind(this)
    });
  }

  private close(state: RefresherState, delay: string) {

    // create fallback timer incase something goes wrong with transitionEnd event
    setTimeout(() => {
      this.state = RefresherState.Inactive;
      this.progress = 0;
      this.didStart = false;
      this.setCss(0, '0ms', false, '');
    }, 600);

    // reset set the styles on the scroll element
    // set that the refresh is actively cancelling/completing
    this.state = state;
    this.setCss(0, this.closeDuration, true, delay);

    // TODO: stop gesture
  }

  private setCss(y: number, duration: string, overflowVisible: boolean, delay: string) {
    if (this.nativeRefresher) { return; }

    this.appliedStyles = (y > 0);
    writeTask(() => {
      if (this.scrollEl) {
        const style = this.scrollEl.style;
        style.transform = ((y > 0) ? `translateY(${y}px) translateZ(0px)` : 'translateZ(0px)');
        style.transitionDuration = duration;
        style.transitionDelay = delay;
        style.overflow = (overflowVisible ? 'hidden' : '');
      }
    });
  }

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        slot="fixed"
        class={{
          [mode]: true,

          // Used internally for styling
          [`refresher-${mode}`]: true,
          'refresher-native': this.nativeRefresher,
          'refresher-active': this.state !== RefresherState.Inactive,
          'refresher-pulling': this.state === RefresherState.Pulling,
          'refresher-ready': this.state === RefresherState.Ready,
          'refresher-refreshing': this.state === RefresherState.Refreshing,
          'refresher-cancelling': this.state === RefresherState.Cancelling,
          'refresher-completing': this.state === RefresherState.Completing,
        }}
      >
      </Host>
    );
  }
}

const enum RefresherState {
  Inactive = 1 << 0,
  Pulling = 1 << 1,
  Ready = 1 << 2,
  Refreshing = 1 << 3,
  Cancelling = 1 << 4,
  Completing = 1 << 5,

  _BUSY_ = Refreshing | Cancelling | Completing,
}
