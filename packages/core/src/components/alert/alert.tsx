
import { Component, CssClassMap, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { AnimationBuilder, Animation, AnimationController, Config } from '../../index';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';

@Component({
  tag: 'ion-alert',
  styleUrls: {
    ios: 'alert.ios.scss',
    md: 'alert.md.scss',
    wp: 'alert.wp.scss'
  },
  host: {
    theme: 'alert'
  }
})
export class Alert {
  private animation: Animation;

  @Element() private el: HTMLElement;

  @Event() private ionAlertDidLoad: EventEmitter;
  @Event() private ionAlertDidPresent: EventEmitter;
  @Event() private ionAlertWillPresent: EventEmitter;
  @Event() private ionAlertWillDismiss: EventEmitter;
  @Event() private ionAlertDidDismiss: EventEmitter;
  @Event() private ionAlertDidUnload: EventEmitter;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;

  @Prop() cssClass: string;
  @Prop() title: string;
  @Prop() subTitle: string;
  @Prop() message: string;
  @Prop() buttons: AlertButton[] = [];
  @Prop() inputs: AlertInput[] = [];
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
    this.ionAlertWillPresent.emit({ alert: this });

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
      this.ionAlertWillDismiss.emit({ alert: this });

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
          this.ionAlertDidDismiss.emit({ alert: this });

          Context.dom.write(() => {
            this.el.parentNode.removeChild(this.el);
          });

          resolve();
        }).play();
      });
    });
  }


  protected ionViewDidUnload() {
    this.ionAlertDidUnload.emit({ alert: this });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  protected ionViewDidLoad() {
    this.ionAlertDidLoad.emit({ alert: this });
  }

  protected ionViewDidEnter() {
    this.ionAlertDidPresent.emit({ loading: this });
  }

  protected backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  rbClick(button: any) {
    console.log('rbClick', button);
    // if (this.enabled) {
    //   this.d.inputs.forEach(input => {
    //     input.checked = (button === input);
    //   });
    //   this.activeId = button.id;

    //   if (button.handler) {
    //     button.handler(button);
    //   }
    // }
  }

  cbClick(button: any) {
    console.log('cbClick', button);
    // if (this.enabled) {
    //   button.checked = !button.checked;

    //   if (button.handler) {
    //     button.handler(button);
    //   }
    // }
  }

  btnClick(button: any) {
    console.log('btnClick', button);

    // if (!this.enabled) {
    //   return;
    // }

    // keep the time of the most recent button click
    // this.lastClick = Date.now();

    let shouldDismiss = true;

    if (button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      // if (button.handler(this.getValues()) === false) {
      //   // if the return value of the handler is false then do not dismiss
      //   shouldDismiss = false;
      // }
    }

    if (shouldDismiss) {
      this.dismiss();
    }
  }

  buttonClass(button: AlertButton): CssClassMap {
    let buttonClass: string[] = !button.cssClass
      ? ['alert-button']
      : [`alert-button`, `${button.cssClass}`];

    return buttonClass.reduce((prevValue: any, cssClass: any) => {
      prevValue[cssClass] = true;
      return prevValue;
    }, {});
  }

  renderCheckbox(inputs: AlertInput[]) {
    if (inputs.length === 0) return null;

    return (
      <div class="alert-checkbox-group">
        { inputs.map(i => (
          <button onClick={() => this.cbClick(i)} aria-checked={i.checked} id={i.id} disabled={i.disabled} role="checkbox" class="alert-tappable alert-checkbox alert-checkbox-button">
            <div class="button-inner">
              <div class="alert-checkbox-icon"><div class="alert-checkbox-inner"></div></div>
              <div class="alert-checkbox-label">
                {i.label}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  renderRadio(inputs: AlertInput[]) {
    const hdrId = 'TODO';
    const activeId = 'TODO';

    if (inputs.length === 0) return null;

    return (
      <div class="alert-radio-group" role="radiogroup" aria-labelledby={hdrId} aria-activedescendant={activeId}>
        { inputs.map(i => (
          <button onClick={() => this.rbClick(i)} aria-checked={i.checked} disabled={i.disabled} id={i.id} class="alert-radio-button alert-tappable alert-radio" role="radio">
            <div class="button-inner">
              <div class="alert-radio-icon"><div class="alert-radio-inner"></div></div>
              <div class="alert-radio-label">
                {i.label}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  renderInput(inputs: AlertInput[]) {
    if (inputs.length === 0) return null;

    return (
      <div class="alert-input-group">
        { inputs.map(i => (
          <div class="alert-input-wrapper">
            <input
              placeholder={i.placeholder}
              value={i.value}
              type={i.type}
              min={i.min}
              max={i.max}
              id={i.id}
              class="alert-input"/>
          </div>
        ))}
      </div>
    );
  }

  protected render() {
    const hdrId = 'TODO';
    const subHdrId = 'TODO';
    const msgId = 'TODO';

    const alertButtonGroupClass = {
      'alert-button-group': true,
      'alert-button-group-vertical': this.buttons.length > 2
    };

    let buttons = this.buttons
      .map(b => {
        if (typeof b === 'string') {
          b = { text: b };
        }
        return b;
      })
      .filter(b => b !== null);

    // An alert can be created with several different inputs. Radios,
    // checkboxes and inputs are all accepted, but they cannot be mixed.
    const inputTypes: string[] = [];

    let inputs = this.inputs
      .map(i => {
        return i;
      })
      .filter(i => i !== null);

    inputs.forEach(i => {
      if (inputTypes.indexOf(i.type) < 0) {
        inputTypes.push(i.type);
      }
    })

    if (inputTypes.length > 1 && (inputTypes.indexOf('checkbox') > -1 || inputTypes.indexOf('radio') > -1)) {
      console.warn(`Alert cannot mix input types: ${(inputTypes.join('/'))}. Please see alert docs for more info.`);
    }

    let inputType = inputTypes.length ? inputTypes[0] : null;

    return [
      <ion-backdrop
        onClick={this.backdropClick.bind(this)}
        class="alert-backdrop"
      />,
      <div class="alert-wrapper">
        <div class="alert-head">
          {this.title
              ? <h2 id={hdrId} class="alert-title">{this.title}</h2>
              : null}
          {this.subTitle
              ? <h2 id={subHdrId} class="alert-sub-title">{this.subTitle}</h2>
              : null}
        </div>
        <div id={msgId} class="alert-message" innerHTML={this.message}></div>

        {(() => {
          switch(inputType) {
            case 'checkbox':
              return this.renderCheckbox(inputs);

            case 'radio':
              return this.renderRadio(inputs);

            default:
              return this.renderInput(inputs);
          };
        })()}

        <div class={alertButtonGroupClass}>
          {buttons.map(b =>
            <button class={this.buttonClass(b)} onClick={() => this.btnClick(b)}>
              <span class="button-inner">
                {b.text}
              </span>
            </button>
          )}
       </div>
      </div>
    ];
  }

}

export interface AlertOptions {
  title?: string;
  subTitle?: string;
  message?: string;
  cssClass?: string;
  mode?: string;
  inputs?: AlertInput[];
  buttons?: (AlertButton|string)[];
  enableBackdropDismiss?: boolean;
}

export interface AlertInput {
  type?: string;
  name?: string | number;
  placeholder?: string;
  value?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  handler?: Function;
  min?: string | number;
  max?: string | number;
}

export interface AlertButton {
  text?: string;
  role?: string;
  cssClass?: string;
  handler?: (value: any) => boolean|void;
};

export interface AlertEvent {
  detail: {
    alert: Alert;
  };
}
