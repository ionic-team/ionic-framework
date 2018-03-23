import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, Config, CssClassMap } from '../../index';
import { createThemedClasses, getClassMap } from '../../utils/theme';
import { BACKDROP, OverlayEventDetail, OverlayInterface, dismiss, eventMethod, isCancel, present } from '../../utils/overlays';

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

  private activeId: string | undefined;
  private inputType: string | undefined;
  private hdrId: string;

  presented = false;
  animation: Animation|undefined;
  color: string;

  @Element() el: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop() overlayId: number;
  @Prop() mode: string;
  @Prop() keyboardClose = true;

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
   * Emitted after the alert has presented.
   */
  @Event() ionAlertDidLoad: EventEmitter<void>;

  /**
   * Emitted before the alert has presented.
   */
  @Event() ionAlertDidUnload: EventEmitter<void>;

  /**
   * Emitted after the alert has presented.
   */
  @Event({eventName: 'ionAlertDidPresent'}) didPresent: EventEmitter<void>;

  /**
   * Emitted before the alert has presented.
   */
  @Event({eventName: 'ionAlertWillPresent'}) willPresent: EventEmitter<void>;

  /**
   * Emitted before the alert has dismissed.
   */
  @Event({eventName: 'ionAlertWillDismiss'}) willDismiss: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the alert has dismissed.
   */
  @Event({eventName: 'ionAlertDidDismiss'}) didDismiss: EventEmitter<OverlayEventDetail>;


  componentDidLoad() {
    this.ionAlertDidLoad.emit();
  }

  componentDidUnload() {
    this.ionAlertDidUnload.emit();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(null, BACKDROP);
  }

  @Listen('ionAlertWillDismiss')
  protected dispatchCancelHandler(ev: CustomEvent) {
    const role = ev.detail.role;
    if (isCancel(role)) {
      const cancelButton = this.buttons.find(b => b.role === 'cancel');
      this.callButtonHandler(cancelButton);
    }
  }

  /**
   * Present the alert overlay after it has been created.
   */
  @Method()
  present(): Promise<void> {
    return present(this, 'alertEnter', iosEnterAnimation, mdEnterAnimation);
  }

  /**
   * Dismiss the alert overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<void> {
    return dismiss(this, data, role, 'alertLeave', iosLeaveAnimation, mdLeaveAnimation);
  }

  /**
   * Returns a promise that resolves when the alert did dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await alert.onDidDismiss();
   * ```
   */
  @Method()
  onDidDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionAlerDidDismiss', callback);
  }

  /**
   * Returns a promise that resolves when the alert will dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await alert.onWillDismiss();
   * ```
   */
  @Method()
  onWillDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionAlertWillDismiss', callback);
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

  private buttonClick(button: AlertButton) {
    const role = button.role;
    if (isCancel(role)) {
      this.dismiss(this.getValues(), role);
      return;
    }
    const shouldDismiss = this.callButtonHandler(button);
    if (shouldDismiss) {
      this.dismiss(this.getValues(), button.role);
    }
  }

  private callButtonHandler(button: AlertButton|undefined): boolean {
    if (button && button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      if (button.handler(this.getValues()) === false) {
        // if the return value of the handler is false then do not dismiss
        return false;
      }
    }
    return true;
  }

  private getValues(): any {
    if (this.inputType === 'radio') {
      // this is an alert with radio buttons (single value select)
      // return the one value which is checked, otherwise undefined
      const checkedInput = this.inputs.find(i => i.checked === true);
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
      values[i.name] = i.value || '';
    });

    console.debug('returning', values);
    return values;
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
            {this.mode === 'md' ? <ion-ripple-effect /> : null}
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
            {this.mode === 'md' ? <ion-ripple-effect /> : null}
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
              onInput={e => i.value = (e.target as any).value}
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
      style: {
        zIndex: 20000 + this.overlayId,
      },
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

    this.inputType = inputTypes.length > 0 ? inputTypes[0] : undefined;

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
