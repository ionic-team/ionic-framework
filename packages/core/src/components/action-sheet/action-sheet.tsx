import { Component, CssClassMap, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController, Config } from '../../index';

import { createThemedClasses } from '../../utils/theme';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';

import MdEnterAnimation from './animations/md.enter';
import MdLeaveAnimation from './animations/md.leave';

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
export class ActionSheet {
  mode: string;
  color: string;

  private animation: Animation;

  @Element() private el: HTMLElement;

  /**
   * @output {ActionSheetEvent} Emitted after the alert has loaded.
   */
  @Event() ionActionSheetDidLoad: EventEmitter;

  /**
   * @output {ActionSheetEvent} Emitted after the alert has presented.
   */
  @Event() ionActionSheetDidPresent: EventEmitter;

  /**
   * @output {ActionSheetEvent} Emitted before the alert has presented.
   */
  @Event() ionActionSheetWillPresent: EventEmitter;

  /**
   * @output {ActionSheetEvent} Emitted before the alert has dismissed.
   */
  @Event() ionActionSheetWillDismiss: EventEmitter;

  /**
   * @output {ActionSheetEvent} Emitted after the alert has dismissed.
   */
  @Event() ionActionSheetDidDismiss: EventEmitter;

  /**
   * @output {ActionSheetEvent} Emitted after the alert has unloaded.
   */
  @Event() ionActionSheetDidUnload: EventEmitter;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;

  @Prop() cssClass: string;
  @Prop() title: string;
  @Prop() subTitle: string;
  @Prop() buttons: ActionSheetButton[];
  @Prop() enableBackdropDismiss: boolean = true;
  @Prop() translucent: boolean = false;

  @Prop() enterAnimation: AnimationBuilder;
  @Prop() leaveAnimation: AnimationBuilder;

  @Prop() actionSheetId: string;

  present() {
    return new Promise<void>(resolve => {
      this._present(resolve);
    });
  }

  private _present(resolve: Function) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionActionSheetWillPresent.emit({ actionSheet: this });

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('actionSheetEnter', this.mode === 'ios' ? iOSEnterAnimation : MdEnterAnimation);

    // build the animation and kick it off
    this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;

      animation.onFinish((a: any) => {
        a.destroy();
        this.componentDidEnter();
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
      this.ionActionSheetWillDismiss.emit({ actionSheet: this });

      // get the user's animation fn if one was provided
      const animationBuilder = this.leaveAnimation || this.config.get('actionSheetLeave', this.mode === 'ios' ? iOSEnterAnimation : MdEnterAnimation);

      // build the animation and kick it off
      this.animationCtrl.create(animationBuilder, this.el).then(animation => {
        this.animation = animation;

        animation.onFinish((a: any) => {
          a.destroy();
          this.ionActionSheetDidDismiss.emit({ actionSheet: this });

          Context.dom.write(() => {
            this.el.parentNode.removeChild(this.el);
          });

          resolve();
        }).play();
      });
    });
  }

  componentDidLoad() {
    this.ionActionSheetDidLoad.emit({ actionSheet: this });
  }

  componentDidEnter() {
    this.ionActionSheetDidPresent.emit({ actionSheet: this });
  }

  componentDidUnload() {
    this.ionActionSheetDidUnload.emit({ actionSheet: this });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  protected backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  buttonClass(button: ActionSheetButton): CssClassMap {
    let buttonClass: string[] = !button.role
      ? ['action-sheet-button']
      : [`action-sheet-button`, `action-sheet-${button.role}`];
    return buttonClass.reduce((prevValue: any, cssClass: any) => {
      prevValue[cssClass] = true;
      return prevValue;
    }, {});
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

    const hostClasses = {
      ...themedClasses
    };

    return {
      class: hostClasses
    };
  }

  render() {
    let userCssClass = 'action-sheet-content';
    if (this.cssClass) {
      userCssClass += ' ' + this.cssClass;
    }

    let cancelButton: ActionSheetButton;
    let buttons = this.buttons
      .map(b => {
        if (typeof b === 'string') {
          b = { text: b };
        }
        if (!b.cssClass) {
          b.cssClass = '';
        }
        if (b.role === 'cancel') {
          cancelButton = b;
          return null;
        }
        return b;
      })
      .filter(b => b !== null);

    return [
      <ion-backdrop
        onClick={this.backdropClick.bind(this)}
        class='action-sheet-backdrop'
      />,
      <div class='action-sheet-wrapper' role='dialog'>
        <div class='action-sheet-container'>
          <div class='action-sheet-group'>
            {this.title
              ? <div class='action-sheet-title'>{this.title}</div>
              : null}
            {this.subTitle
              ? <div class='action-sheet-sub-title'>{this.subTitle}</div>
              : null}
            {buttons.map(b =>
              <button class={this.buttonClass(b)} onClick={() => this.buttonClick(b)}>
                <span class='button-inner'>
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
                  class={this.buttonClass(cancelButton)}
                  onClick={() => this.buttonClick(cancelButton)}
                >
                  {cancelButton.icon
                    ? <ion-icon
                        name={cancelButton.icon}
                        class='action-sheet-icon'
                      />
                    : null}
                  {cancelButton.text}
                </button>

              </div>
            : null}
        </div>
      </div>
    ];
  }
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
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean | void;
}

export interface ActionSheetEvent extends Event {
  detail: {
    actionSheet: ActionSheet;
  };
}

export { iOSEnterAnimation, iOSLeaveAnimation, MdEnterAnimation, MdLeaveAnimation };
