import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController, Config } from '../../index';

import { createThemedClasses } from '../../utils/theme';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';

@Component({
  tag: 'ion-popover',
  styleUrls: {
    ios: 'popover.ios.scss',
    md: 'popover.md.scss'
  },
  host: {
    theme: 'popover'
  }
})
export class Popover {
  private animation: Animation;

  @State() positioned: boolean = false;

  @Element() private el: HTMLElement;

  /**
   * @output {PopoverEvent} Emitted after the popover has loaded.
   */
  @Event() ionPopoverDidLoad: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted after the popover has presented.
   */
  @Event() ionPopoverDidPresent: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted before the popover has presented.
   */
  @Event() ionPopoverWillPresent: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted before the popover has dismissed.
   */
  @Event() ionPopoverWillDismiss: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted after the popover has dismissed.
   */
  @Event() ionPopoverDidDismiss: EventEmitter;

  /**
   * @output {PopoverEvent} Emitted after the popover has unloaded.
   */
  @Event() ionPopoverDidUnload: EventEmitter;

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
  @Prop() popoverId: string;
  @Prop() showBackdrop: boolean = true;


  present() {
    return new Promise<void>(resolve => {
      this._present(resolve);
    });
  }


  private positionPopover() {
    const props = POPOVER_POSITION_PROPERTIES[this.mode];
    console.debug('Position popover', this.el, this.ev, props);

    // Declare the popover elements
    let contentEl = this.el.querySelector('.popover-content') as HTMLElement;
    let arrowEl = this.el.querySelector('.popover-arrow') as HTMLElement;

    // If no event was passed, hide the arrow
    if (!this.ev) {
      arrowEl.style.display = 'none';
    }

    // Set the default transform origin direction
    let origin = {
      y: 'top',
      x: 'left'
    };

    // Popover content width and height
    const popover = {
      width: contentEl.getBoundingClientRect().width,
      height: contentEl.getBoundingClientRect().height
    };

    // Window body width and height
    // TODO need to check if portrait/landscape?
    const body = {
      width: window.screen.width,
      height: window.screen.height
    };

    // If ev was passed, use that for target element
    let targetDim = this.ev && this.ev.target && (this.ev.target as HTMLElement).getBoundingClientRect();

    // The target is the object that dispatched the event that was passed
    let target = {
      top: (targetDim && 'top' in targetDim) ? targetDim.top : (body.height / 2) - (popover.height / 2),
      left: (targetDim && 'left' in targetDim) ? targetDim.left : (body.width / 2) - (popover.width / 2),
      width: targetDim && targetDim.width || 0,
      height: targetDim && targetDim.height || 0
    };

    // If the popover should be centered to the target
    if (props.centerTarget) {
      target.left = (targetDim && 'left' in targetDim) ? targetDim.left : (body.width / 2);
    }

    // The arrow that shows above the popover on iOS
    let arrowDim = arrowEl.getBoundingClientRect();

    const arrow = {
      width: arrowDim.width,
      height: arrowDim.height
    };

    let arrowCSS = {
      top: target.top + target.height,
      left: target.left + (target.width / 2) - (arrow.width / 2)
    };

    let popoverCSS = {
      top: target.top + target.height + (arrow.height - 1),
      left: target.left
    };

    // If the popover should be centered to the target
    if (props.centerTarget) {
      popoverCSS.left = target.left + (target.width / 2) - (popover.width / 2);
    }

    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    if (popoverCSS.left < props.padding) {
      popoverCSS.left = props.padding;
    } else if (popover.width + props.padding + popoverCSS.left > body.width) {
      popoverCSS.left = body.width - popover.width - props.padding;
      origin.x = 'right';
    }

    // If the popover when popped down stretches past bottom of screen,
    // make it pop up if there's room above
    if (this.showFromBottom(target, popover, body)) {
      this.el.className = this.el.className + ' popover-bottom';
      origin.y = 'bottom';

      popoverCSS.top = target.top - popover.height;

      if (props.showArrow) {
        arrowCSS.top = target.top - (arrow.height + 1);
        popoverCSS.top = target.top - popover.height - (arrow.height - 1);
      }

    // If the popover exceeds the viewport then cut the bottom off
    } else if (this.exceedsViewport(target, popover, body)) {
      contentEl.style.bottom = props.padding + props.unit;
    }

    arrowEl.style.top = arrowCSS.top + 'px';
    arrowEl.style.left = arrowCSS.left + 'px';

    contentEl.style.top = popoverCSS.top + 'px';
    contentEl.style.left = popoverCSS.left + 'px';

    contentEl.style.transformOrigin = origin.y + ' ' + origin.x;

    // Since the transition starts before styling is done we
    // want to wait for the styles to apply before showing the wrapper
    this.positioned = true;
  }

  private showFromBottom(target: any, popover: any, body: any): boolean {
    return target.top + target.height + popover.height > body.height && target.top - popover.height > 0;
  }

  private exceedsViewport(target: any, popover: any, body: any): boolean {
    return target.top + target.height + popover.height > body.height;
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
        this.positionPopover();
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

  protected render() {
    const ThisComponent = this.component;

    const wrapperClasses = createThemedClasses(this.mode, this.color, 'popover-wrapper');

    const wrapperStyle = this.positioned ? { 'opacity' : '1' } : {};

    return [
      <ion-backdrop
        onClick={this.backdropClick.bind(this)}
        class='popover-backdrop'
      />,
      <div class={wrapperClasses} style={wrapperStyle}>
        <div class='popover-arrow'/>
        <div class='popover-content'>
          <div class='popover-viewport'>
            <ThisComponent
              {...this.componentProps}
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

export const POPOVER_POSITION_PROPERTIES: any = {
  ios: {
    padding: 2,
    unit: '%',
    showArrow: true,
    centerTarget: true
  },
  md: {
    padding: 12,
    unit: 'px',
    showArrow: false,
    centerTarget: false
  }
};
