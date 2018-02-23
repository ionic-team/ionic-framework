import { Component, CssClassMap, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController, Config, DomController, OverlayDismissEvent, OverlayDismissEventDetail } from '../../index';

import { domControllerAsync, isDef, playAnimationAsync } from '../../utils/helpers';
import { createThemedClasses, getClassMap } from '../../utils/theme';
import { OverlayInterface, BACKDROP } from '../../utils/overlays';

import iosEnterAnimation from './animations/ios.enter';
import iosLeaveAnimation from './animations/ios.leave';

import mdEnterAnimation from './animations/md.enter';
import mdLeaveAnimation from './animations/md.leave';

@Component({
  tag: 'ion-action-sheet',
  styleUrls: {
    ios: 'action-sheet.ios.scss',
    md: 'action-sheet.md.scss'
  },
  host: {
    theme: 'action-sheet'
  }
})
export class ActionSheet implements OverlayInterface {

  mode: string;
  color: string;

  private presented = false;
  private animation: Animation | null = null;

  @Element() private el: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;
  @Prop() overlayId: number;

  /**
   * Animation to use when the action sheet is presented.
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when the action sheet is dismissed.
   */
  @Prop() leaveAnimation: AnimationBuilder;

  /**
   * An array of buttons for the action sheet.
   */
  @Prop() buttons: ActionSheetButton[];

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass: string;

  /**
   * If true, the action sheet will be dismissed when the backdrop is clicked. Defaults to `true`.
   */
  @Prop() enableBackdropDismiss = true;

  /**
   * Subtitle for the action sheet.
   */
  @Prop() subTitle: string;

  /**
   * Title for the action sheet.
   */
  @Prop() title: string;

  /**
   * If true, the action sheet will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the action sheet will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the alert has loaded.
   */
  @Event() ionActionSheetDidLoad: EventEmitter<ActionSheetEventDetail>;

  /**
   * Emitted after the alert has presented.
   */
  @Event() ionActionSheetDidPresent: EventEmitter<ActionSheetEventDetail>;

  /**
   * Emitted before the alert has presented.
   */
  @Event() ionActionSheetWillPresent: EventEmitter<ActionSheetEventDetail>;

  /**
   * Emitted before the alert has dismissed.
   */
  @Event() ionActionSheetWillDismiss: EventEmitter<ActionSheetDismissEventDetail>;

  /**
   * Emitted after the alert has dismissed.
   */
  @Event() ionActionSheetDidDismiss: EventEmitter<ActionSheetDismissEventDetail>;

  /**
   * Emitted after the alert has unloaded.
   */
  @Event() ionActionSheetDidUnload: EventEmitter<ActionSheetEventDetail>;


  componentDidLoad() {
    this.ionActionSheetDidLoad.emit();
  }

  componentDidUnload() {
    this.ionActionSheetDidUnload.emit();
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(null, BACKDROP);
  }

  /**
   * Present the action sheet overlay after it has been created.
   */
  @Method()
  present(): Promise<void> {
    if(this.presented) {
      return Promise.reject('overlay already presented');
    }
    this.presented = true;

    this.ionActionSheetWillPresent.emit();

    this.el.style.zIndex = `${20000 + this.overlayId}`;

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('actionSheetEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    // build the animation and kick it off
    return this.playAnimation(animationBuilder).then(() => {
      this.ionActionSheetDidPresent.emit();
    });
  }

  /**
   * Dismiss the action sheet overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string) {
    if(!this.presented) {
      return Promise.reject('overlay is not presented');
    }
    this.presented = false;

    this.ionActionSheetWillDismiss.emit({data, role});

    const animationBuilder = this.leaveAnimation || this.config.get('actionSheetLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
    return this.playAnimation(animationBuilder).then(() => {
      this.ionActionSheetDidDismiss.emit({data, role});
      return domControllerAsync(this.dom.write, () => {
        this.el.parentNode.removeChild(this.el);
      });
    });
  }

  private playAnimation(animationBuilder: AnimationBuilder) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;
      // Check if prop animate is false or if the config for animate is defined/false
      if (!this.willAnimate || (isDef(this.config.get('willAnimate')) && this.config.get('willAnimate') === false)) {
        // if the duration is 0, it won't actually animate I don't think
        // TODO - validate this
        this.animation = animation.duration(0);
      }
      return playAnimationAsync(animation);
    }).then((animation) => {
      animation.destroy();
      this.animation = null;
    });
  }

  protected buttonClick(button: ActionSheetButton) {
    let shouldDismiss = true;
    if (button.handler) {
      if (button.handler() === false) {
        shouldDismiss = false;
      }
    }
    if (shouldDismiss) {
      this.dismiss();
    }
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'action-sheet-translucent') : {};

    return {
      class: {
        ...themedClasses,
        ...getClassMap(this.cssClass)
      }
    };
  }

  render() {
    const allButtons = this.buttons.map(b => {
      if (typeof b === 'string') {
        b = { text: b };
      }
      if (!b.cssClass) {
        b.cssClass = '';
      }
      return b;
    });
    const cancelButton = allButtons.find(b => b.role === 'cancel');
    const buttons = allButtons.filter(b => b.role !== 'cancel');

    return [
      <ion-backdrop tappable={this.enableBackdropDismiss}/>,
      <div class='action-sheet-wrapper' role='dialog'>
        <div class='action-sheet-container'>
          <div class='action-sheet-group'>
            {this.title
              ? <div class='action-sheet-title'>
                {this.title}
                {this.subTitle
                ? <div class='action-sheet-sub-title'>{this.subTitle}</div>
                : null}
              </div>
              : null}
            {buttons.map(b =>
              <button class={buttonClass(b)} onClick={() => this.buttonClick(b)}>
                <span class='action-sheet-button-inner'>
                  {b.icon
                    ? <ion-icon name={b.icon} class='action-sheet-icon' />
                    : null}
                  {b.text}
                </span>
              </button>
            )}
          </div>
          {cancelButton
            ? <div class='action-sheet-group action-sheet-group-cancel'>
                <button
                  class={buttonClass(cancelButton)}
                  onClick={() => this.buttonClick(cancelButton)}
                >
                  <span class='action-sheet-button-inner'>
                    {cancelButton.icon
                      ? <ion-icon
                          name={cancelButton.icon}
                          class='action-sheet-icon'
                        />
                      : null}
                    {cancelButton.text}
                  </span>
                </button>

              </div>
            : null}
        </div>
      </div>
    ];
  }
}

function buttonClass(button: ActionSheetButton): CssClassMap {
  const buttonClasses: any = {
    'action-sheet-button': true,
    ...getClassMap(button.cssClass),
  };
  if (button.role) {
    buttonClasses[`action-sheet-${button.role}`] = true;
  }
  return buttonClasses;
}

export interface ActionSheetOptions {
  title?: string;
  subTitle?: string;
  cssClass?: string;
  buttons?: (ActionSheetButton | string)[];
  enableBackdropDismiss?: boolean;
  translucent?: boolean;
}

export interface ActionSheetButton {
  text?: string;
  role?: 'cancel' | 'destructive' | 'selected' | string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean | void;
}

export interface ActionSheetEvent extends CustomEvent {
  target: HTMLIonActionSheetElement;
  detail: ActionSheetEventDetail;
}

export interface ActionSheetEventDetail {

}

export interface ActionSheetDismissEventDetail extends OverlayDismissEventDetail {
  // keep this just for the sake of static types and potential future extensions
}

export interface ActionSheetDismissEvent extends OverlayDismissEvent {
  // keep this just for the sake of static types and potential future extensions
}

export {
  iosEnterAnimation as iosActionSheetEnterAnimation,
  iosLeaveAnimation as iosActionSheetLeaveAnimation,
  mdEnterAnimation as mdActionSheetEnterAnimation,
  mdLeaveAnimation as mdActionSheetetLeaveAnimation,
};
