import { Component, CssClassMap, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, Config, DomController, OverlayDismissEvent, OverlayDismissEventDetail } from '../../index';
import { domControllerAsync, autoFocus } from '../../utils/helpers';
import { createThemedClasses, getClassMap } from '../../utils/theme';
import { OverlayInterface, BACKDROP, overlayAnimation } from '../../utils/overlays';

import iosEnterAnimation from './animations/ios.enter';
import iosLeaveAnimation from './animations/ios.leave';

import mdEnterAnimation from './animations/md.enter';
import mdLeaveAnimation from './animations/md.leave';

@Component({
  tag: 'ion-alert',
  styleUrls: {
    ios: 'alert.ios.scss',
    md: 'alert.md.scss'
  },
  host: {
    theme: 'alert'
  }
})
export class Alert implements OverlayInterface {

  private presented = false;
  private activeId: string;
  private inputType: string | null = null;
  private hdrId: string;

  animation: Animation;
  mode: string;
  color: string;

  @Element() private el: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;
  @Prop() overlayId: number;

  /**
   * Animation to use when the alert is presented.
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when the alert is dismissed.
   */
  @Prop() leaveAnimation: AnimationBuilder;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass: string;

  /**
   * The main title in the heading of the alert.
   */
  @Prop() title: string;

  /**
   * The subtitle in the heading of the alert. Displayed under the title.
   */
  @Prop() subTitle: string;

  /**
   * The main message to be displayed in the alert.
   */
  @Prop() message: string;

  /**
   * Array of buttons to be added to the alert.
   */
  @Prop() buttons: AlertButton[] = [];

  /**
   * Array of input to show in the alert.
   */
  @Prop({ mutable: true }) inputs: AlertInput[] = [];

  /**
   * If true, the alert will be dismissed when the backdrop is clicked. Defaults to `true`.
   */
  @Prop() enableBackdropDismiss = true;

  /**
   * If true, the alert will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the alert will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the alert has loaded.
   */
  @Event() ionAlertDidLoad: EventEmitter<AlertEventDetail>;

  /**
   * Emitted after the alert has presented.
   */
  @Event() ionAlertDidPresent: EventEmitter<AlertEventDetail>;

  /**
   * Emitted before the alert has presented.
   */
  @Event() ionAlertWillPresent: EventEmitter<AlertEventDetail>;

  /**
   * Emitted before the alert has dismissed.
   */
  @Event() ionAlertWillDismiss: EventEmitter<AlertDismissEventDetail>;

  /**
   * Emitted after the alert has dismissed.
   */
  @Event() ionAlertDidDismiss: EventEmitter<AlertDismissEventDetail>;

  /**
   * Emitted after the alert has unloaded.
   */
  @Event() ionAlertDidUnload: EventEmitter<AlertEventDetail>;

  componentDidLoad() {
    this.ionAlertDidLoad.emit();
  }

  componentDidEnter() {
    this.ionAlertDidPresent.emit();
  }

  componentDidUnload() {
    this.ionAlertDidUnload.emit();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(null, BACKDROP).catch();
  }

  /**
   * Present the alert overlay after it has been created.
   */
  @Method()
  present(): Promise<void> {
    if(this.presented) {
      return Promise.reject('overlay already presented');
    }
    this.presented = true;
    this.ionAlertWillPresent.emit();

    this.el.style.zIndex = `${20000 + this.overlayId}`;

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('alertEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

    // build the animation and kick it off
    return this.playAnimation(animationBuilder).then(() => {
      autoFocus(this.el);
      this.ionAlertDidPresent.emit();
    });
  }

  /**
   * Dismiss the alert overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string) {
    if(!this.presented) {
      return Promise.reject('overlay is not presented');
    }
    this.presented = false;
    this.ionAlertWillDismiss.emit({data, role});

    // get the user's animation fn if one was provided
    const animationBuilder = this.leaveAnimation || this.config.get('alertLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    return this.playAnimation(animationBuilder).then(() => {
      this.ionAlertDidDismiss.emit({data, role});

      return domControllerAsync(this.dom.write, () => {
        this.el.parentNode.removeChild(this.el);
      });
    });
  }

  private rbClick(inputIndex: number) {
    this.inputs = this.inputs.map((input, index) => {
      input.checked = (inputIndex === index);
      return input;
    });

    const rbButton = this.inputs[inputIndex];
    this.activeId = rbButton.id;

    if (rbButton.handler) {
      rbButton.handler(rbButton);
    }
  }

  private cbClick(inputIndex: number) {
    this.inputs = this.inputs.map((input, index) => {
      if (inputIndex === index) {
        input.checked = !input.checked;
      }
      return input;
    });

    const cbButton = this.inputs[inputIndex];
    if (cbButton.handler) {
      cbButton.handler(cbButton);
    }
  }

  private buttonClick(button: any) {
    let shouldDismiss = true;

    if (button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      if (button.handler(this.getValues()) === false) {
        // if the return value of the handler is false then do not dismiss
        shouldDismiss = false;
      }
    }

    if (shouldDismiss) {
      this.dismiss(this.getValues(), button.role);
    }
  }

  private getValues(): any {
    if (this.inputType === 'radio') {
      // this is an alert with radio buttons (single value select)
      // return the one value which is checked, otherwise undefined
      const checkedInput = this.inputs.find(i => i.checked);
      console.debug('returning', checkedInput ? checkedInput.value : undefined);
      return checkedInput ? checkedInput.value : undefined;
    }

    if (this.inputType === 'checkbox') {
      // this is an alert with checkboxes (multiple value select)
      // return an array of all the checked values
      console.debug('returning', this.inputs.filter(i => i.checked).map(i => i.value));
      return this.inputs.filter(i => i.checked).map(i => i.value);
    }

    if (this.inputs.length === 0) {
      // this is an alert without any options/inputs at all
      console.debug('returning', 'undefined');
      return undefined;
    }

    // this is an alert with text inputs
    // return an object of all the values with the input name as the key
    const values: {[k: string]: string} = {};
    this.inputs.forEach(i => {
      values[i.name] = i.value;
    });

    console.debug('returning', values);
    return values;
  }

  private playAnimation(animationBuilder: AnimationBuilder): Promise<void> {
    return overlayAnimation(this, animationBuilder, this.willAnimate, this.el, undefined);
  }

  private renderCheckbox(inputs: AlertInput[]) {
    if (inputs.length === 0) return null;

    return (
      <div class='alert-checkbox-group'>
        { inputs.map((i, index) => (
          <button onClick={() => this.cbClick(index)} aria-checked={i.checked} id={i.id} disabled={i.disabled} tabIndex={0} role='checkbox' class='alert-tappable alert-checkbox alert-checkbox-button'>
            <div class='alert-button-inner'>
              <div class='alert-checkbox-icon'><div class='alert-checkbox-inner'></div></div>
              <div class='alert-checkbox-label'>
                {i.label}
              </div>
            </div>
            {this.mode==="md" ? <ion-ripple-effect /> : null}
          </button>
        ))}
      </div>
    );
  }

  private renderRadio(inputs: AlertInput[]) {
    if (inputs.length === 0) return null;

    return (
      <div class='alert-radio-group' role='radiogroup' aria-labelledby={this.hdrId} aria-activedescendant={this.activeId}>
        { inputs.map((i, index) => (
          <button onClick={() => this.rbClick(index)} aria-checked={i.checked} disabled={i.disabled} id={i.id} tabIndex={0} class='alert-radio-button alert-tappable alert-radio' role='radio'>
            <div class='alert-button-inner'>
              <div class='alert-radio-icon'><div class='alert-radio-inner'></div></div>
              <div class='alert-radio-label'>
                {i.label}
              </div>
            </div>
            {this.mode==="md" ? <ion-ripple-effect /> : null}
          </button>
        ))}
      </div>
    );
  }

  private renderInput(inputs: AlertInput[]) {
    if (inputs.length === 0) return null;

    return (
      <div class='alert-input-group'>
        { inputs.map(i => (
          <div class='alert-input-wrapper'>
            <input
              placeholder={i.placeholder}
              value={i.value}
              type={i.type}
              min={i.min}
              max={i.max}
              id={i.id}
              disabled={i.disabled}
              tabIndex={0}
              class='alert-input'/>
          </div>
        ))}
      </div>
    );
  }

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'alert-translucent') : {};

    return {
      role: 'alertdialog',
      class: {
        ...themedClasses,
        ...getClassMap(this.cssClass)
      },
      id: this.overlayId
    };
  }

  render() {
    const hdrId = `alert-${this.overlayId}-hdr`;
    const subHdrId = `alert-${this.overlayId}-sub-hdr`;
    const msgId = `alert-${this.overlayId}-msg`;

    if (this.title || !this.subTitle) {
      this.hdrId = hdrId;

    } else if (this.subTitle) {
      this.hdrId = subHdrId;
    }

    const alertButtonGroupClass = {
      'alert-button-group': true,
      'alert-button-group-vertical': this.buttons.length > 2
    };

    const buttons = this.buttons.map(b => {
      if (typeof b === 'string') {
        return { text: b } as AlertButton;
      }
      return b;
    })
    .filter(b => b !== null);

    this.inputs = this.inputs.map((i, index) => {
      return {
        type: i.type || 'text',
        name: i.name ? i.name : index + '',
        placeholder: i.placeholder ? i.placeholder : '',
        value: i.value ? i.value : '',
        label: i.label,
        checked: !!i.checked,
        disabled: !!i.disabled,
        id: i.id ? i.id : `alert-input-${this.overlayId}-${index}`,
        handler: i.handler ? i.handler : null,
        min: i.min ? i.min : null,
        max: i.max ? i.max : null
      } as AlertInput;
    }).filter(i => i !== null);

    // An alert can be created with several different inputs. Radios,
    // checkboxes and inputs are all accepted, but they cannot be mixed.
    const inputTypes: string[] = [];
    this.inputs.forEach(i => {
      if (inputTypes.indexOf(i.type) < 0) {
        inputTypes.push(i.type);
      }
    });

    if (inputTypes.length > 1 && (inputTypes.indexOf('checkbox') > -1 || inputTypes.indexOf('radio') > -1)) {
      console.warn(`Alert cannot mix input types: ${(inputTypes.join('/'))}. Please see alert docs for more info.`);
    }

    this.inputType = inputTypes.length > 0 ? inputTypes[0] : null;

    return [
      <ion-backdrop tappable={this.enableBackdropDismiss}/>,
      <div class='alert-wrapper'>
        <div class='alert-head'>
          {this.title
            ? <h2 id={hdrId} class='alert-title'>{this.title}</h2>
            : null}
          {this.subTitle
            ? <h2 id={subHdrId} class='alert-sub-title'>{this.subTitle}</h2>
            : null}
        </div>

        <div id={msgId} class='alert-message' innerHTML={this.message}></div>
        {(() => {
          switch (this.inputType) {
            case 'checkbox': return this.renderCheckbox(this.inputs);
            case 'radio': return this.renderRadio(this.inputs);
            default: return this.renderInput(this.inputs);
          }
        })()}

        <div class={alertButtonGroupClass}>
          {buttons.map(b =>
            <button class={buttonClass(b)} tabIndex={0} onClick={() => this.buttonClick(b)}>
              <span class='alert-button-inner'>
                {b.text}
              </span>
            </button>
          )}
        </div>
      </div>
    ];
  }
}

function buttonClass(button: AlertButton): CssClassMap {
  return {
    'alert-button': true,
    ...getClassMap(button.cssClass)
  };
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
  translucent?: boolean;
}

export interface AlertInput {
  type: string;
  name: string | number;
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
  text: string;
  role?: string;
  cssClass?: string;
  handler?: (value: any) => boolean|void;
}

export interface AlertEvent extends CustomEvent {
  target: HTMLIonAlertElement;
  detail: AlertEventDetail;
}

export interface AlertEventDetail {
}

export interface AlertDismissEventDetail extends OverlayDismissEventDetail {
  // keep this just for the sake of static types and potential future extensions
}

export interface AlertDismissEvent extends OverlayDismissEvent {
  // keep this just for the sake of static types and potential future extensions
}

export {
  iosEnterAnimation as iosAlertEnterAnimation,
  iosLeaveAnimation as iosAlertLeaveAnimation,
  mdEnterAnimation as mdAlertEnterAnimation,
  mdLeaveAnimation as mdAlertLeaveAnimation,
};
