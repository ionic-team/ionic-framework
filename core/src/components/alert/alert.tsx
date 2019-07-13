import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { AlertButton, AlertInput, Animation, AnimationBuilder, CssClassMap, OverlayEventDetail, OverlayInterface } from '../../interface';
import { BACKDROP, dismiss, eventMethod, isCancel, present, safeCall } from '../../utils/overlays';
import { sanitizeDOMString } from '../../utils/sanitization';
import { getClassMap } from '../../utils/theme';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-alert',
  styleUrls: {
    ios: 'alert.ios.scss',
    md: 'alert.md.scss'
  },
  scoped: true
})
export class Alert implements ComponentInterface, OverlayInterface {

  private activeId?: string;
  private inputType?: string;
  private processedInputs: AlertInput[] = [];
  private processedButtons: AlertButton[] = [];

  presented = false;
  animation?: Animation;
  mode = getIonMode(this);

  @Element() el!: HTMLIonAlertElement;

  /** @internal */
  @Prop() overlayIndex!: number;

  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
   */
  @Prop() keyboardClose = true;

  /**
   * Animation to use when the alert is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the alert is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * The main title in the heading of the alert.
   */
  @Prop() header?: string;

  /**
   * The subtitle in the heading of the alert. Displayed under the title.
   */
  @Prop() subHeader?: string;

  /**
   * The main message to be displayed in the alert.
   * `message` can accept either plaintext or HTML as a string.
   * To display characters normally reserved for HTML, they
   * must be escaped. For example `<Ionic>` would become
   * `&lt;Ionic&gt;`
   *
   * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
   */
  @Prop() message?: string;

  /**
   * Array of buttons to be added to the alert.
   */
  @Prop() buttons: (AlertButton | string)[] = [];

  /**
   * Array of input to show in the alert.
   */
  @Prop({ mutable: true }) inputs: AlertInput[] = [];

  /**
   * If `true`, the alert will be dismissed when the backdrop is clicked.
   */
  @Prop() backdropDismiss = true;

  /**
   * If `true`, the alert will be translucent.
   */
  @Prop() translucent = false;

  /**
   * If `true`, the alert will animate.
   */
  @Prop() animated = true;

  /**
   * Emitted after the alert has presented.
   */
  @Event({ eventName: 'ionAlertDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the alert has presented.
   */
  @Event({ eventName: 'ionAlertWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the alert has dismissed.
   */
  @Event({ eventName: 'ionAlertWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the alert has dismissed.
   */
  @Event({ eventName: 'ionAlertDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  @Watch('buttons')
  buttonsChanged() {
    const buttons = this.buttons;
    this.processedButtons = buttons.map(btn => {
      return (typeof btn === 'string')
        ? { text: btn, role: btn.toLowerCase() === 'cancel' ? 'cancel' : undefined }
        : btn;
    });
  }

  @Watch('inputs')
  inputsChanged() {
    const inputs = this.inputs;

    // An alert can be created with several different inputs. Radios,
    // checkboxes and inputs are all accepted, but they cannot be mixed.
    const inputTypes = new Set(inputs.map(i => i.type));
    if (inputTypes.has('checkbox') && inputTypes.has('radio')) {
      console.warn(`Alert cannot mix input types: ${(Array.from(inputTypes.values()).join('/'))}. Please see alert docs for more info.`);
    }
    this.inputType = inputTypes.values().next().value;
    this.processedInputs = inputs.map((i, index) => ({
      type: i.type || 'text',
      name: i.name || `${index}`,
      placeholder: i.placeholder || '',
      value: i.value,
      label: i.label,
      checked: !!i.checked,
      disabled: !!i.disabled,
      id: i.id || `alert-input-${this.overlayIndex}-${index}`,
      handler: i.handler,
      min: i.min,
      max: i.max
    }) as AlertInput);
  }

  componentWillLoad() {
    this.inputsChanged();
    this.buttonsChanged();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(undefined, BACKDROP);
  }

  @Listen('ionAlertWillDismiss')
  protected dispatchCancelHandler(ev: CustomEvent) {
    const role = ev.detail.role;
    if (isCancel(role)) {
      const cancelButton = this.processedButtons.find(b => b.role === 'cancel');
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
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the alert.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the alert.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<boolean> {
    return dismiss(this, data, role, 'alertLeave', iosLeaveAnimation, mdLeaveAnimation);
  }

  /**
   * Returns a promise that resolves when the alert did dismiss.
   */
  @Method()
  onDidDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionAlertDidDismiss');
  }

  /**
   * Returns a promise that resolves when the alert will dismiss.
   */
  @Method()
  onWillDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionAlertWillDismiss');
  }

  private rbClick(selectedInput: AlertInput) {
    for (const input of this.processedInputs) {
      input.checked = input === selectedInput;
    }
    this.activeId = selectedInput.id;
    safeCall(selectedInput.handler, selectedInput);
    this.el.forceUpdate();
  }

  private cbClick(selectedInput: AlertInput) {
    selectedInput.checked = !selectedInput.checked;
    safeCall(selectedInput.handler, selectedInput);
    this.el.forceUpdate();
  }

  private buttonClick(button: AlertButton) {
    const role = button.role;
    const values = this.getValues();
    if (isCancel(role)) {
      return this.dismiss({ values }, role);
    }
    const returnData = this.callButtonHandler(button, values);
    if (returnData !== false) {
      return this.dismiss({ values, ...returnData }, button.role);
    }
    return Promise.resolve(false);
  }

  private callButtonHandler(button: AlertButton | undefined, data?: any) {
    if (button && button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      const returnData = safeCall(button.handler, data);
      if (returnData === false) {
        // if the return value of the handler is false then do not dismiss
        return false;
      }
      if (typeof returnData === 'object') {
        return returnData;
      }
    }
    return {};
  }

  private getValues(): any {
    if (this.processedInputs.length === 0) {
      // this is an alert without any options/inputs at all
      return undefined;
    }

    if (this.inputType === 'radio') {
      // this is an alert with radio buttons (single value select)
      // return the one value which is checked, otherwise undefined
      const checkedInput = this.processedInputs.find(i => !!i.checked);
      return checkedInput ? checkedInput.value : undefined;
    }

    if (this.inputType === 'checkbox') {
      // this is an alert with checkboxes (multiple value select)
      // return an array of all the checked values
      return this.processedInputs.filter(i => i.checked).map(i => i.value);
    }

    // this is an alert with text inputs
    // return an object of all the values with the input name as the key
    const values: {[k: string]: string} = {};
    this.processedInputs.forEach(i => {
      values[i.name!] = i.value || '';
    });
    return values;
  }

  private renderAlertInputs(labelledBy: string | undefined) {
    switch (this.inputType) {
      case 'checkbox': return this.renderCheckbox(labelledBy);
      case 'radio': return this.renderRadio(labelledBy);
      default: return this.renderInput(labelledBy);
    }
  }

  private renderCheckbox(labelledby: string | undefined) {
    const inputs = this.processedInputs;
    const mode = getIonMode(this);
    if (inputs.length === 0) {
      return null;
    }
    return (
      <div class="alert-checkbox-group" aria-labelledby={labelledby}>
        { inputs.map(i => (
          <button
            type="button"
            onClick={() => this.cbClick(i)}
            aria-checked={`${i.checked}`}
            id={i.id}
            disabled={i.disabled}
            tabIndex={0}
            role="checkbox"
            class="alert-tappable alert-checkbox alert-checkbox-button ion-focusable"
          >
            <div class="alert-button-inner">
              <div class="alert-checkbox-icon">
                <div class="alert-checkbox-inner"></div>
              </div>
              <div class="alert-checkbox-label">
                {i.label}
              </div>
            </div>
            {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
          </button>
        ))}
      </div>
    );
  }

  private renderRadio(labelledby: string | undefined) {
    const inputs = this.processedInputs;
    if (inputs.length === 0) {
      return null;
    }
    return (
      <div class="alert-radio-group" role="radiogroup" aria-labelledby={labelledby} aria-activedescendant={this.activeId}>
        { inputs.map(i => (
          <button
            type="button"
            onClick={() => this.rbClick(i)}
            aria-checked={`${i.checked}`}
            disabled={i.disabled}
            id={i.id}
            tabIndex={0}
            class="alert-radio-button alert-tappable alert-radio ion-focusable"
            role="radio"
          >
            <div class="alert-button-inner">
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

  private renderInput(labelledby: string | undefined) {
    const inputs = this.processedInputs;
    if (inputs.length === 0) {
      return null;
    }
    return (
      <div class="alert-input-group" aria-labelledby={labelledby}>
        { inputs.map(i => (
          <div class="alert-input-wrapper">
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
              class="alert-input"
            />
          </div>
        ))}
      </div>
    );
  }

  hostData() {
    const mode = getIonMode(this);

    return {
      'role': 'dialog',
      'aria-modal': 'true',
      style: {
        zIndex: 20000 + this.overlayIndex,
      },
      class: {
        ...getClassMap(this.cssClass),
        [mode]: true,
        'alert-translucent': this.translucent
      }
    };
  }

  private renderAlertButtons() {
    const buttons = this.processedButtons;
    const mode = getIonMode(this);
    const alertButtonGroupClass = {
      'alert-button-group': true,
      'alert-button-group-vertical': buttons.length > 2
    };
    return (
      <div class={alertButtonGroupClass}>
        {buttons.map(button =>
          <button type="button" class={buttonClass(button)} tabIndex={0} onClick={() => this.buttonClick(button)}>
            <span class="alert-button-inner">
              {button.text}
            </span>
            {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
          </button>
        )}
      </div>
    );
  }

  render() {
    const hdrId = `alert-${this.overlayIndex}-hdr`;
    const subHdrId = `alert-${this.overlayIndex}-sub-hdr`;
    const msgId = `alert-${this.overlayIndex}-msg`;

    let labelledById: string | undefined;
    if (this.header !== undefined) {
      labelledById = hdrId;
    } else if (this.subHeader !== undefined) {
      labelledById = subHdrId;
    }

    return [
      <ion-backdrop tappable={this.backdropDismiss}/>,

      <div class="alert-wrapper">

        <div class="alert-head">
          {this.header && <h2 id={hdrId} class="alert-title">{this.header}</h2>}
          {this.subHeader && <h2 id={subHdrId} class="alert-sub-title">{this.subHeader}</h2>}
        </div>

        <div id={msgId} class="alert-message" innerHTML={sanitizeDOMString(this.message)}></div>

        {this.renderAlertInputs(labelledById)}
        {this.renderAlertButtons()}

      </div>
    ];
  }
}

const buttonClass = (button: AlertButton): CssClassMap => {
  return {
    'alert-button': true,
    'ion-focusable': true,
    'ion-activatable': true,
    ...getClassMap(button.cssClass)
  };
};
