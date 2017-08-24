import { Component, CssClassMap, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { AnimationBuilder, Animation, AnimationController, Config } from '../../index';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';

@Component({
  tag: 'ion-action-sheet',
  styleUrls: {
    ios: 'action-sheet.ios.scss',
    md: 'action-sheet.md.scss',
    wp: 'action-sheet.wp.scss'
  },
  host: {
    theme: 'action-sheet'
  }
})
export class ActionSheet {
  private animation: Animation;

  @Element() private el: HTMLElement;

  @Event() private ionActionSheetDidLoad: EventEmitter;
  @Event() private ionActionSheetDidPresent: EventEmitter;
  @Event() private ionActionSheetWillPresent: EventEmitter;
  @Event() private ionActionSheetWillDismiss: EventEmitter;
  @Event() private ionActionSheetDidDismiss: EventEmitter;
  @Event() private ionActionSheetDidUnload: EventEmitter;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;

  @Prop() cssClass: string;
  @Prop() title: string;
  @Prop() subTitle: string;
  @Prop() buttons: ActionSheetButton[];
  @Prop() enableBackdropDismiss: boolean = true;

  @Prop() enterAnimation: AnimationBuilder;
  @Prop() exitAnimation: AnimationBuilder;
  @Prop() id: string;


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
          this.ionActionSheetDidDismiss.emit({ actionSheet: this });

          Context.dom.write(() => {
            this.el.parentNode.removeChild(this.el);
          });

          resolve();
        }).play();
      });
    });
  }

  protected ionViewDidUnload() {
    this.ionActionSheetDidUnload.emit({ actionSheet: this });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  protected ionViewDidLoad() {
    this.ionActionSheetDidLoad.emit({ actionSheet: this });
  }

  protected ionViewDidEnter() {
    this.ionActionSheetDidPresent.emit({ loading: this });
  }

  protected backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  protected click(button: ActionSheetButton) {
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

  protected render() {
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
        class="action-sheet-backdrop"
      />,
      <div class="action-sheet-wrapper" role="dialog">
        <div class="action-sheet-container">
          <div class="action-sheet-group">
            {this.title
              ? <div class="action-sheet-title">{this.title}</div>
              : null}
            {this.subTitle
              ? <div class="action-sheet-sub-title">{this.subTitle}</div>
              : null}
            {buttons.map(b =>
              <button class={this.buttonClass(b)} onClick={() => this.click(b)}>
                <span class="button-inner">
                  {b.icon
                    ? <ion-icon name={b.icon} class="action-sheet-icon" />
                    : null}
                  {b.text}
                </span>
              </button>
            )}
          </div>
          {cancelButton
            ? <div class="action-sheet-group">
                <button
                  class={this.buttonClass(cancelButton)}
                  onClick={() => this.click(cancelButton)}
                >
                  {cancelButton.icon
                    ? <ion-icon
                        name={cancelButton.icon}
                        class="action-sheet-icon"
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

  buttonClass(button: ActionSheetButton): CssClassMap {
    let buttonClass: string[] = !button.role
      ? ['action-sheet-button']
      : [`action-sheet-button`, `action-sheet-${button.role}`];
    return buttonClass.reduce((prevValue: any, cssClass: any) => {
      prevValue[cssClass] = true;
      return prevValue;
    }, {});
  }
}

export interface ActionSheetOptions {
  title?: string;
  subTitle?: string;
  cssClass?: string;
  buttons?: (ActionSheetButton | string)[];
  enableBackdropDismiss?: boolean;
}

export interface ActionSheetButton {
  text?: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean | void;
}

export interface ActionSheetEvent {
  detail: {
    actionSheet: ActionSheet;
  };
}
