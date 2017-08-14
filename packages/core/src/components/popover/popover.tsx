import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { AnimationBuilder, Animation, AnimationController, Config } from '../../index';

import { createThemedClasses } from '../../utils/theme';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';

@Component({
  tag: 'ion-popover',
  styleUrls: {
    ios: 'popover.ios.scss',
    md: 'popover.md.scss',
    wp: 'popover.wp.scss'
  },
  host: {
    theme: 'popover'
  }
})
export class Popover {
  private animation: Animation;

  @Element() private el: HTMLElement;

  @Event() private ionPopoverDidLoad: EventEmitter;
  @Event() private ionPopoverDidPresent: EventEmitter;
  @Event() private ionPopoverWillPresent: EventEmitter;
  @Event() private ionPopoverWillDismiss: EventEmitter;
  @Event() private ionPopoverDidDismiss: EventEmitter;
  @Event() private ionPopoverDidUnload: EventEmitter;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;

  @Prop() mode: string;
  @Prop() color: string;
  @Prop() component: string;
  @Prop() componentProps: any = {};
  @Prop() cssClass: string;
  @Prop() enableBackdropDismiss: boolean = true;
  @Prop() enterAnimation: AnimationBuilder;
  @Prop() exitAnimation: AnimationBuilder;
  @Prop() ev: Event;
  @Prop() id: string;
  @Prop() showBackdrop: boolean = true;


  present() {
    return new Promise<void>(resolve => {
      this._present(resolve);
    });
  }


  // TODO currently only positions iOS
  private positionView(nativeEle: HTMLElement, ev: any, mode: string) {
    // Default to material design mode unless mode is ios
    const popoverMode = (mode === 'ios') ? mode : 'md';
    const popoverProps = popoverViewProps[popoverMode];
    const popoverPadding = popoverProps.bodyPadding;

    // Declare the popover elements
    let popoverWrapperEle = nativeEle.querySelector('.popover-wrapper') as HTMLElement;
    let popoverContentEle = nativeEle.querySelector('.popover-content') as HTMLElement;
    let popoverArrowEle = nativeEle.querySelector('.popover-arrow') as HTMLElement;

    // Grab the default origin from the properties
    let originY = 'top';
    let originX = 'left';

    // Popover content width and height
    let popoverDim = popoverContentEle.getBoundingClientRect();
    let popoverWidth = popoverDim.width;
    let popoverHeight = popoverDim.height;

    // Window body width and height
    // TODO need to check if portrait/landscape?
    let bodyWidth = window.screen.width;
    let bodyHeight = window.screen.height;

    // If ev was passed, use that for target element
    let targetDim = ev && ev.target && ev.target.getBoundingClientRect();

    let targetTop = (targetDim && 'top' in targetDim) ? targetDim.top : (bodyHeight / 2) - (popoverHeight / 2);
    let targetLeft = (targetDim && 'left' in targetDim) ? targetDim.left : (bodyWidth / 2);
    let targetWidth = targetDim && targetDim.width || 0;
    let targetHeight = targetDim && targetDim.height || 0;

    // The arrow that shows above the popover on iOS
    let arrowDim = popoverArrowEle.getBoundingClientRect();
    var arrowWidth = arrowDim.width;
    var arrowHeight = arrowDim.height;

    // If no ev was passed, hide the arrow
    if (!targetDim) {
      popoverArrowEle.style.display = 'none';
    }

    let arrowCSS = {
      top: targetTop + targetHeight,
      left: targetLeft + (targetWidth / 2) - (arrowWidth / 2)
    };

    let popoverCSS = {
      top: targetTop + targetHeight + (arrowHeight - 1),
      left: targetLeft + (targetWidth / 2) - (popoverWidth / 2)
    };

    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    if (popoverCSS.left < popoverPadding) {
      popoverCSS.left = popoverPadding;
    } else if (popoverWidth + popoverPadding + popoverCSS.left > bodyWidth) {
      popoverCSS.left = bodyWidth - popoverWidth - popoverPadding;
      originX = 'right';
    }

    // If the popover when popped down stretches past bottom of screen,
    // make it pop up if there's room above
    if (targetTop + targetHeight + popoverHeight > bodyHeight && targetTop - popoverHeight > 0) {
      arrowCSS.top = targetTop - (arrowHeight + 1);
      popoverCSS.top = targetTop - popoverHeight - (arrowHeight - 1);
      nativeEle.className = nativeEle.className + ' popover-bottom';
      originY = 'bottom';
      // If there isn't room for it to pop up above the target cut it off
    } else if (targetTop + targetHeight + popoverHeight > bodyHeight) {
      popoverContentEle.style.bottom = popoverPadding + '%';
    }

    popoverArrowEle.style.top = arrowCSS.top + 'px';
    popoverArrowEle.style.left = arrowCSS.left + 'px';

    popoverContentEle.style.top = popoverCSS.top + 'px';
    popoverContentEle.style.left = popoverCSS.left + 'px';

    popoverContentEle.style.transformOrigin = originY + ' ' + originX;

    // Since the transition starts before styling is done we
    // want to wait for the styles to apply before showing the wrapper
    popoverWrapperEle.style.opacity = '1';
  }

  private _present(resolve: Function) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
    this.ionPopoverWillPresent.emit({ popover: this });

    // get the user's animation fn if one was provided
    let animationBuilder = this.enterAnimation;

    if (!animationBuilder) {
      // user did not provide a custom animation fn
      // decide from the config which animation to use
      animationBuilder = iOSEnterAnimation;
    }

    // build the animation and kick it off
    this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;

      animation.onFinish((a: any) => {
        a.destroy();
        this.ionViewDidEnter();
        this.positionView(this.el, this.ev, this.mode);
        resolve();
      }).play();
    });
  }

  dismiss() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }
    return new Promise(resolve => {
      this.ionPopoverWillDismiss.emit({ popover: this });

      // get the user's animation fn if one was provided
      let animationBuilder = this.exitAnimation;
      if (!animationBuilder) {
        // user did not provide a custom animation fn
        // decide from the config which animation to use
        animationBuilder = iOSLeaveAnimation;
      }

      // build the animation and kick it off
      this.animationCtrl.create(animationBuilder, this.el).then(animation => {
        this.animation = animation;

        animation.onFinish((a: any) => {
          a.destroy();
          this.ionPopoverDidDismiss.emit({ popover: this });

          Context.dom.write(() => {
            this.el.parentNode.removeChild(this.el);
          });

          resolve();
        }).play();
      });
    });
  }

  protected ionViewDidUnload() {
    this.ionPopoverDidUnload.emit({ popover: this });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  protected ionViewDidLoad() {
    this.ionPopoverDidLoad.emit({ popover: this });
  }

  protected ionViewDidEnter() {
    this.ionPopoverDidPresent.emit({ popover: this });
  }

  protected backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  render() {
    const ThisComponent = this.component;

    const dialogClasses = createThemedClasses(
      this.mode,
      this.color,
      'popover-wrapper'
    );

    return [
      <ion-backdrop
        onClick={this.backdropClick.bind(this)}
        class="popover-backdrop"
      />,
      <div class={dialogClasses}>
        <div class="popover-arrow" />
        <div class="popover-content">
          <div class="popover-viewport">
            <ThisComponent
              props={this.componentProps}
              class={this.cssClass}
            />
          </div>
        </div>
      </div>
    ];
  }
}

export interface PopoverOptions {
  component: string;
  componentProps?: any;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  exitAnimation?: AnimationBuilder;
  cssClass?: string;
  ev: Event;
}

export interface PopoverEvent {
  detail: {
    popover: Popover;
  };
}

export const popoverViewProps: any = {
  ios: {
    bodyPadding: 2,
    showArrow: true
  },
  md: {
    bodyPadding: 12,
    showArrow: false
  }
}

// TODO FIX
const POPOVER_MD_BODY_PADDING = 12;
