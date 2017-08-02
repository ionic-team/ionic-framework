import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State
} from '@stencil/core';
import { AnimationBuilder, Animation } from '../../index';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';

@Component({
  tag: 'ion-action-sheet',
  // styleUrls: {
  //   ios: 'action-sheet.ios.scss',
  //   md: 'action-sheet.md.scss',
  //   wp: 'action-sheet.wp.scss'
  // },
  host: {
    theme: 'action-sheet'
  }
})
export class ActionSheet {
  private animation: Animation;
  private durationTimeout: any;

  @Element() private el: HTMLElement;

  @Event() ionActionSheetDidLoad: EventEmitter;
  @Event() ionActionSheetWillPresent: EventEmitter;
  @Event() ionActionSheetDidPresent: EventEmitter;
  @Event() ionActionSheetWillDismiss: EventEmitter;
  @Event() ionActionSheetDidDismiss: EventEmitter;
  @Event() ionActionSheetDidUnload: EventEmitter;

  @Prop() cssClass: string;
  @Prop() title: string;
  @Prop() subTitle: string;
  @Prop() buttons: ActionSheetButtons[];
  @Prop() enableBackdropDismiss: boolean = true;
  @Prop() showBackdrop: boolean = true;

  @Prop() enterAnimation: AnimationBuilder;
  @Prop() exitAnimation: AnimationBuilder;
  @Prop() id: string;

  @Listen('ionDismiss')
  onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  ionViewDidLoad() {
    this.ionActionSheetDidLoad.emit({ actionsheet: this });
  }

  present() {
    return new Promise<void>(resolve => {
      this._present(resolve);
    });
  }

  private _present(resolve: Function) {
    // if (this.animation) {
    //   this.animation.destroy();
    //   this.animation = null;
    // }
    this.ionActionSheetWillPresent.emit(
      { actionsheet: this } as ActionSheetEvent
    );

    // let animationBuilder = this.enterAnimation
    // ? this.enterAnimation
    // : iOSEnterAnimation;

    // build the animation and kick it off
    // this.animation = animationBuilder(this.el);

    // this.animation.onFinish((a: any) => {
    // a.destroy();
    // this.ionViewDidLoad();
    resolve();
    // }).play();
  }

  dismiss() {
    //
    // if (this.animation) {
    //   this.animation.destroy();
    //   this.animation = null;
    // }

    return new Promise<void>(resolve => {
      this.ionActionSheetWillDismiss.emit(
        { actionsheet: this } as ActionSheetEvent
      );

      // get the user's animation fn if one was provided
      let animationBuilder = this.exitAnimation;

      // let animationBuilder = this.exitAnimation
      // ? this.exitAnimation
      // : iOSLeaveAnimation;

      // build the animation and kick it off
      // this.animation = animationBuilder(this.el);
      // this.animation.onFinish((a: any) => {
      //   a.destroy();
      this.ionActionSheetDidDismiss.emit(
        { actionsheet: this } as ActionSheetEvent
      );

      Core.dom.write(() => {
        this.el.parentNode.removeChild(this.el);
      });

      resolve();
      // }).play();
    });
  }

  ionViewDidUnload() {
    this.ionActionSheetDidUnload.emit(
      { actionsheet: this } as ActionSheetEvent
    );
  }

  backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  render() {
    let userCssClass = 'action-sheet-content';
    if (this.cssClass) {
      userCssClass += ' ' + this.cssClass;
    }
    return [
      <div
        onClick={this.backdropClick.bind(this)}
        class={{
          'action-sheet-backdrop': true,
          'hide-backdrop': !this.showBackdrop
        }}
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
            {this.buttons.map(b =>
              <ion-button onClick={() => b.handler()}>{b.text}</ion-button>
            )}
          </div>
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
}

export interface ActionSheetButtons {
  text?: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean | void;
}

export interface ActionSheetEvent {
  actionsheet: ActionSheet;
}
