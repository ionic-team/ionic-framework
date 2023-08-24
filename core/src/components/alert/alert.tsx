import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Listen, Method, Prop, Watch, forceUpdate, h } from '@stencil/core';
import { ENABLE_HTML_CONTENT_DEFAULT } from '@utils/config';
import type { Gesture } from '@utils/gesture';
import { createButtonActiveGesture } from '@utils/gesture/button-active';
import { raf } from '@utils/helpers';
import {
  createDelegateController,
  createTriggerController,
  BACKDROP,
  dismiss,
  eventMethod,
  isCancel,
  prepareOverlay,
  present,
  safeCall,
  setOverlayId,
} from '@utils/overlays';
import { sanitizeDOMString } from '@utils/sanitization';
import { getClassMap } from '@utils/theme';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type { AnimationBuilder, CssClassMap, OverlayInterface, FrameworkDelegate } from '../../interface';
import type { OverlayEventDetail } from '../../utils/overlays-interface';
import type { IonicSafeString } from '../../utils/sanitization';

import type { AlertButton, AlertInput } from './alert-interface';
import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

// TODO(FW-2832): types

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-alert',
  styleUrls: {
    ios: 'alert.ios.scss',
    md: 'alert.md.scss',
  },
  scoped: true,
})
export class Alert implements ComponentInterface, OverlayInterface {
  private readonly delegateController = createDelegateController(this);
  private readonly triggerController = createTriggerController();
  private customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);
  private activeId?: string;
  private inputType?: string;
  private processedInputs: AlertInput[] = [];
  private processedButtons: AlertButton[] = [];
  private wrapperEl?: HTMLElement;
  private gesture?: Gesture;
  private currentTransition?: Promise<any>;

  presented = false;
  lastFocus?: HTMLElement;

  @Element() el!: HTMLIonAlertElement;

  /** @internal */
  @Prop() overlayIndex!: number;

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /** @internal */
  @Prop() hasController = false;

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
   *
   * This property accepts custom HTML as a string.
   * Content is parsed as plaintext by default.
   * `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config
   * before custom HTML can be used.
   */
  @Prop() message?: string | IonicSafeString;

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
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /**
   * If `true`, the alert will animate.
   */
  @Prop() animated = true;

  /**
   * Additional attributes to pass to the alert.
   */
  @Prop() htmlAttributes?: { [key: string]: any };

  /**
   * If `true`, the alert will open. If `false`, the alert will close.
   * Use this if you need finer grained control over presentation, otherwise
   * just use the alertController or the `trigger` property.
   * Note: `isOpen` will not automatically be set back to `false` when
   * the alert dismisses. You will need to do that in your code.
   */
  @Prop() isOpen = false;
  @Watch('isOpen')
  onIsOpenChange(newValue: boolean, oldValue: boolean) {
    if (newValue === true && oldValue === false) {
      this.present();
    } else if (newValue === false && oldValue === true) {
      this.dismiss();
    }
  }

  /**
   * An ID corresponding to the trigger element that
   * causes the alert to open when clicked.
   */
  @Prop() trigger: string | undefined;
  @Watch('trigger')
  triggerChanged() {
    const { trigger, el, triggerController } = this;
    if (trigger) {
      triggerController.addClickListener(el, trigger);
    }
  }

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

  /**
   * Emitted after the alert has presented.
   * Shorthand for ionAlertWillDismiss.
   */
  @Event({ eventName: 'didPresent' }) didPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the alert has presented.
   * Shorthand for ionAlertWillPresent.
   */
  @Event({ eventName: 'willPresent' }) willPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the alert has dismissed.
   * Shorthand for ionAlertWillDismiss.
   */
  @Event({ eventName: 'willDismiss' }) willDismissShorthand!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the alert has dismissed.
   * Shorthand for ionAlertDidDismiss.
   */
  @Event({ eventName: 'didDismiss' }) didDismissShorthand!: EventEmitter<OverlayEventDetail>;

  @Listen('keydown', { target: 'document' })
  onKeydown(ev: any) {
    const inputTypes = new Set(this.processedInputs.map((i) => i.type));

    // The only inputs we want to navigate between using arrow keys are the radios
    // ignore the keydown event if it is not on a radio button
    if (
      !inputTypes.has('radio') ||
      (ev.target && !this.el.contains(ev.target)) ||
      ev.target.classList.contains('alert-button')
    ) {
      return;
    }

    // Get all radios inside of the radio group and then
    // filter out disabled radios since we need to skip those
    const query = this.el.querySelectorAll('.alert-radio') as NodeListOf<HTMLButtonElement>;
    const radios = Array.from(query).filter((radio) => !radio.disabled);

    // The focused radio is the one that shares the same id as
    // the event target
    const index = radios.findIndex((radio) => radio.id === ev.target.id);

    // We need to know what the next radio element should
    // be in order to change the focus
    let nextEl: HTMLButtonElement | undefined;

    // If hitting arrow down or arrow right, move to the next radio
    // If we're on the last radio, move to the first radio
    if (['ArrowDown', 'ArrowRight'].includes(ev.key)) {
      nextEl = index === radios.length - 1 ? radios[0] : radios[index + 1];
    }

    // If hitting arrow up or arrow left, move to the previous radio
    // If we're on the first radio, move to the last radio
    if (['ArrowUp', 'ArrowLeft'].includes(ev.key)) {
      nextEl = index === 0 ? radios[radios.length - 1] : radios[index - 1];
    }

    if (nextEl && radios.includes(nextEl)) {
      const nextProcessed = this.processedInputs.find((input) => input.id === nextEl?.id);

      if (nextProcessed) {
        this.rbClick(nextProcessed);
        nextEl.focus();
      }
    }
  }

  @Watch('buttons')
  buttonsChanged() {
    const buttons = this.buttons;
    this.processedButtons = buttons.map((btn) => {
      return typeof btn === 'string' ? { text: btn, role: btn.toLowerCase() === 'cancel' ? 'cancel' : undefined } : btn;
    });
  }

  @Watch('inputs')
  inputsChanged() {
    const inputs = this.inputs;

    // Get the first input that is not disabled and the checked one
    // If an enabled checked input exists, set it to be the focusable input
    // otherwise we default to focus the first input
    // This will only be used when the input is type radio
    const first = inputs.find((input) => !input.disabled);
    const checked = inputs.find((input) => input.checked && !input.disabled);
    const focusable = checked || first;

    // An alert can be created with several different inputs. Radios,
    // checkboxes and inputs are all accepted, but they cannot be mixed.
    const inputTypes = new Set(inputs.map((i) => i.type));
    if (inputTypes.has('checkbox') && inputTypes.has('radio')) {
      console.warn(
        `Alert cannot mix input types: ${Array.from(inputTypes.values()).join(
          '/'
        )}. Please see alert docs for more info.`
      );
    }

    this.inputType = inputTypes.values().next().value;
    this.processedInputs = inputs.map(
      (i, index) =>
        ({
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
          max: i.max,
          cssClass: i.cssClass ?? '',
          attributes: i.attributes || {},
          tabindex: i.type === 'radio' && i !== focusable ? -1 : 0,
        } as AlertInput)
    );
  }

  connectedCallback() {
    prepareOverlay(this.el);
    this.triggerChanged();
  }

  componentWillLoad() {
    setOverlayId(this.el);
    this.inputsChanged();
    this.buttonsChanged();
  }

  disconnectedCallback() {
    this.triggerController.removeClickListener();

    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  componentDidLoad() {
    /**
     * Only create gesture if:
     * 1. A gesture does not already exist
     * 2. App is running in iOS mode
     * 3. A wrapper ref exists
     */
    if (!this.gesture && getIonMode(this) === 'ios' && this.wrapperEl) {
      this.gesture = createButtonActiveGesture(this.wrapperEl, (refEl: HTMLElement) =>
        refEl.classList.contains('alert-button')
      );
      this.gesture.enable(true);
    }

    /**
     * If alert was rendered with isOpen="true"
     * then we should open alert immediately.
     */
    if (this.isOpen === true) {
      raf(() => this.present());
    }
  }

  /**
   * Present the alert overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    /**
     * When using an inline alert
     * and dismissing an alert it is possible to
     * quickly present the alert while it is
     * dismissing. We need to await any current
     * transition to allow the dismiss to finish
     * before presenting again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }

    await this.delegateController.attachViewToDom();

    this.currentTransition = present(this, 'alertEnter', iosEnterAnimation, mdEnterAnimation);
    await this.currentTransition;
    this.currentTransition = undefined;
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
  async dismiss(data?: any, role?: string): Promise<boolean> {
    /**
     * When using an inline alert
     * and presenting an alert it is possible to
     * quickly dismiss the alert while it is
     * presenting. We need to await any current
     * transition to allow the present to finish
     * before dismissing again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }

    this.currentTransition = dismiss(this, data, role, 'alertLeave', iosLeaveAnimation, mdLeaveAnimation);
    const dismissed = await this.currentTransition;

    if (dismissed) {
      this.delegateController.removeViewFromDom();
    }

    return dismissed;
  }

  /**
   * Returns a promise that resolves when the alert did dismiss.
   */
  @Method()
  onDidDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionAlertDidDismiss');
  }

  /**
   * Returns a promise that resolves when the alert will dismiss.
   */
  @Method()
  onWillDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionAlertWillDismiss');
  }

  private rbClick(selectedInput: AlertInput) {
    for (const input of this.processedInputs) {
      input.checked = input === selectedInput;
      input.tabindex = input === selectedInput ? 0 : -1;
    }
    this.activeId = selectedInput.id;
    safeCall(selectedInput.handler, selectedInput);
    forceUpdate(this);
  }

  private cbClick(selectedInput: AlertInput) {
    selectedInput.checked = !selectedInput.checked;
    safeCall(selectedInput.handler, selectedInput);
    forceUpdate(this);
  }

  private async buttonClick(button: AlertButton) {
    const role = button.role;
    const values = this.getValues();
    if (isCancel(role)) {
      return this.dismiss({ values }, role);
    }
    const returnData = await this.callButtonHandler(button, values);
    if (returnData !== false) {
      return this.dismiss({ values, ...returnData }, button.role);
    }
    return false;
  }

  private async callButtonHandler(button: AlertButton | undefined, data?: any) {
    if (button?.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      const returnData = await safeCall(button.handler, data);
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
      const checkedInput = this.processedInputs.find((i) => !!i.checked);
      return checkedInput ? checkedInput.value : undefined;
    }

    if (this.inputType === 'checkbox') {
      // this is an alert with checkboxes (multiple value select)
      // return an array of all the checked values
      return this.processedInputs.filter((i) => i.checked).map((i) => i.value);
    }

    // this is an alert with text inputs
    // return an object of all the values with the input name as the key
    const values: { [k: string]: string } = {};
    this.processedInputs.forEach((i) => {
      values[i.name!] = i.value || '';
    });
    return values;
  }

  private renderAlertInputs() {
    switch (this.inputType) {
      case 'checkbox':
        return this.renderCheckbox();
      case 'radio':
        return this.renderRadio();
      default:
        return this.renderInput();
    }
  }

  private renderCheckbox() {
    const inputs = this.processedInputs;
    const mode = getIonMode(this);

    if (inputs.length === 0) {
      return null;
    }

    return (
      <div class="alert-checkbox-group">
        {inputs.map((i) => (
          <button
            type="button"
            onClick={() => this.cbClick(i)}
            aria-checked={`${i.checked}`}
            id={i.id}
            disabled={i.disabled}
            tabIndex={i.tabindex}
            role="checkbox"
            class={{
              ...getClassMap(i.cssClass),
              'alert-tappable': true,
              'alert-checkbox': true,
              'alert-checkbox-button': true,
              'ion-focusable': true,
              'alert-checkbox-button-disabled': i.disabled || false,
            }}
          >
            <div class="alert-button-inner">
              <div class="alert-checkbox-icon">
                <div class="alert-checkbox-inner"></div>
              </div>
              <div class="alert-checkbox-label">{i.label}</div>
            </div>
            {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
          </button>
        ))}
      </div>
    );
  }

  private renderRadio() {
    const inputs = this.processedInputs;

    if (inputs.length === 0) {
      return null;
    }

    return (
      <div class="alert-radio-group" role="radiogroup" aria-activedescendant={this.activeId}>
        {inputs.map((i) => (
          <button
            type="button"
            onClick={() => this.rbClick(i)}
            aria-checked={`${i.checked}`}
            disabled={i.disabled}
            id={i.id}
            tabIndex={i.tabindex}
            class={{
              ...getClassMap(i.cssClass),
              'alert-radio-button': true,
              'alert-tappable': true,
              'alert-radio': true,
              'ion-focusable': true,
              'alert-radio-button-disabled': i.disabled || false,
            }}
            role="radio"
          >
            <div class="alert-button-inner">
              <div class="alert-radio-icon">
                <div class="alert-radio-inner"></div>
              </div>
              <div class="alert-radio-label">{i.label}</div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  private renderInput() {
    const inputs = this.processedInputs;
    if (inputs.length === 0) {
      return null;
    }
    return (
      <div class="alert-input-group">
        {inputs.map((i) => {
          if (i.type === 'textarea') {
            return (
              <div class="alert-input-wrapper">
                <textarea
                  placeholder={i.placeholder}
                  value={i.value}
                  id={i.id}
                  tabIndex={i.tabindex}
                  {...(i.attributes as { [key: string]: any })}
                  disabled={i.attributes?.disabled ?? i.disabled}
                  class={inputClass(i)}
                  onInput={(e) => {
                    i.value = (e.target as any).value;
                    if (i.attributes?.onInput) {
                      i.attributes.onInput(e);
                    }
                  }}
                />
              </div>
            );
          } else {
            return (
              <div class="alert-input-wrapper">
                <input
                  placeholder={i.placeholder}
                  type={i.type}
                  min={i.min}
                  max={i.max}
                  value={i.value}
                  id={i.id}
                  tabIndex={i.tabindex}
                  {...(i.attributes as { [key: string]: any })}
                  disabled={i.attributes?.disabled ?? i.disabled}
                  class={inputClass(i)}
                  onInput={(e) => {
                    i.value = (e.target as any).value;
                    if (i.attributes?.onInput) {
                      i.attributes.onInput(e);
                    }
                  }}
                />
              </div>
            );
          }
        })}
      </div>
    );
  }

  private onBackdropTap = () => {
    this.dismiss(undefined, BACKDROP);
  };

  private dispatchCancelHandler = (ev: CustomEvent) => {
    const role = ev.detail.role;
    if (isCancel(role)) {
      const cancelButton = this.processedButtons.find((b) => b.role === 'cancel');
      this.callButtonHandler(cancelButton);
    }
  };

  private renderAlertButtons() {
    const buttons = this.processedButtons;
    const mode = getIonMode(this);
    const alertButtonGroupClass = {
      'alert-button-group': true,
      'alert-button-group-vertical': buttons.length > 2,
    };
    return (
      <div class={alertButtonGroupClass}>
        {buttons.map((button) => (
          <button
            {...button.htmlAttributes}
            type="button"
            id={button.id}
            class={buttonClass(button)}
            tabIndex={0}
            onClick={() => this.buttonClick(button)}
          >
            <span class="alert-button-inner">{button.text}</span>
            {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
          </button>
        ))}
      </div>
    );
  }

  private renderAlertMessage(msgId: string) {
    const { customHTMLEnabled, message } = this;
    if (customHTMLEnabled) {
      return <div id={msgId} class="alert-message" innerHTML={sanitizeDOMString(message)}></div>;
    }

    return (
      <div id={msgId} class="alert-message">
        {message}
      </div>
    );
  }

  render() {
    const { overlayIndex, header, subHeader, message, htmlAttributes } = this;
    const mode = getIonMode(this);
    const hdrId = `alert-${overlayIndex}-hdr`;
    const subHdrId = `alert-${overlayIndex}-sub-hdr`;
    const msgId = `alert-${overlayIndex}-msg`;
    const role = this.inputs.length > 0 || this.buttons.length > 0 ? 'alertdialog' : 'alert';

    /**
     * If the header is defined, use that. Otherwise, fall back to the subHeader.
     * If neither is defined, don't set aria-labelledby.
     */
    const ariaLabelledBy = header ? hdrId : subHeader ? subHdrId : null;

    return (
      <Host
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={message !== undefined ? msgId : null}
        tabindex="-1"
        {...(htmlAttributes as any)}
        style={{
          zIndex: `${20000 + overlayIndex}`,
        }}
        class={{
          ...getClassMap(this.cssClass),
          [mode]: true,
          'overlay-hidden': true,
          'alert-translucent': this.translucent,
        }}
        onIonAlertWillDismiss={this.dispatchCancelHandler}
        onIonBackdropTap={this.onBackdropTap}
      >
        <ion-backdrop tappable={this.backdropDismiss} />

        <div tabindex="0"></div>

        <div class="alert-wrapper ion-overlay-wrapper" ref={(el) => (this.wrapperEl = el)}>
          <div class="alert-head">
            {header && (
              <h2 id={hdrId} class="alert-title">
                {header}
              </h2>
            )}
            {subHeader && (
              <h2 id={subHdrId} class="alert-sub-title">
                {subHeader}
              </h2>
            )}
          </div>

          {this.renderAlertMessage(msgId)}

          {this.renderAlertInputs()}
          {this.renderAlertButtons()}
        </div>

        <div tabindex="0"></div>
      </Host>
    );
  }
}

const inputClass = (input: AlertInput): CssClassMap => {
  return {
    'alert-input': true,
    'alert-input-disabled': (input.attributes?.disabled ?? input.disabled) || false,
    ...getClassMap(input.cssClass),
    ...getClassMap(input.attributes ? input.attributes.class?.toString() : ''),
  };
};

const buttonClass = (button: AlertButton): CssClassMap => {
  return {
    'alert-button': true,
    'ion-focusable': true,
    'ion-activatable': true,
    [`alert-button-role-${button.role}`]: button.role !== undefined,
    ...getClassMap(button.cssClass),
  };
};
