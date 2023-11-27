import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { raf } from '@utils/helpers';
import { createLockController } from '@utils/lock-controller';
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
import { getClassMap } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { AnimationBuilder, CssClassMap, OverlayInterface, FrameworkDelegate } from '../../interface';
import type { OverlayEventDetail } from '../../utils/overlays-interface';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import type { PickerButton, PickerColumn } from './picker-interface';

// TODO(FW-2832): types

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-picker-legacy',
  styleUrls: {
    ios: 'picker.ios.scss',
    md: 'picker.md.scss',
  },
  scoped: true,
})
export class PickerLegacy implements ComponentInterface, OverlayInterface {
  private readonly delegateController = createDelegateController(this);
  private readonly lockController = createLockController();
  private readonly triggerController = createTriggerController();

  private durationTimeout?: ReturnType<typeof setTimeout>;
  lastFocus?: HTMLElement;

  @Element() el!: HTMLIonPickerElement;

  @State() presented = false;

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
   * Animation to use when the picker is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the picker is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * Array of buttons to be displayed at the top of the picker.
   */
  @Prop() buttons: PickerButton[] = [];

  /**
   * Array of columns to be displayed in the picker.
   */
  @Prop() columns: PickerColumn[] = [];

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * Number of milliseconds to wait before dismissing the picker.
   */
  @Prop() duration = 0;

  /**
   * If `true`, a backdrop will be displayed behind the picker.
   */
  @Prop() showBackdrop = true;

  /**
   * If `true`, the picker will be dismissed when the backdrop is clicked.
   */
  @Prop() backdropDismiss = true;

  /**
   * If `true`, the picker will animate.
   */
  @Prop() animated = true;

  /**
   * Additional attributes to pass to the picker.
   */
  @Prop() htmlAttributes?: { [key: string]: any };

  /**
   * If `true`, the picker will open. If `false`, the picker will close.
   * Use this if you need finer grained control over presentation, otherwise
   * just use the pickerController or the `trigger` property.
   * Note: `isOpen` will not automatically be set back to `false` when
   * the picker dismisses. You will need to do that in your code.
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
   * causes the picker to open when clicked.
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
   * Emitted after the picker has presented.
   */
  @Event({ eventName: 'ionPickerDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the picker has presented.
   */
  @Event({ eventName: 'ionPickerWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the picker has dismissed.
   */
  @Event({ eventName: 'ionPickerWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the picker has dismissed.
   */
  @Event({ eventName: 'ionPickerDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the picker has presented.
   * Shorthand for ionPickerWillDismiss.
   */
  @Event({ eventName: 'didPresent' }) didPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the picker has presented.
   * Shorthand for ionPickerWillPresent.
   */
  @Event({ eventName: 'willPresent' }) willPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the picker has dismissed.
   * Shorthand for ionPickerWillDismiss.
   */
  @Event({ eventName: 'willDismiss' }) willDismissShorthand!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the picker has dismissed.
   * Shorthand for ionPickerDidDismiss.
   */
  @Event({ eventName: 'didDismiss' }) didDismissShorthand!: EventEmitter<OverlayEventDetail>;

  connectedCallback() {
    prepareOverlay(this.el);
    this.triggerChanged();
  }

  disconnectedCallback() {
    this.triggerController.removeClickListener();
  }

  componentWillLoad() {
    setOverlayId(this.el);
  }

  componentDidLoad() {
    /**
     * If picker was rendered with isOpen="true"
     * then we should open picker immediately.
     */
    if (this.isOpen === true) {
      raf(() => this.present());
    }
  }

  /**
   * Present the picker overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    const unlock = await this.lockController.lock();

    await this.delegateController.attachViewToDom();

    await present(this, 'pickerEnter', iosEnterAnimation, iosEnterAnimation, undefined);

    if (this.duration > 0) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
    }

    unlock();
  }

  /**
   * Dismiss the picker overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the picker.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the picker.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {
    const unlock = await this.lockController.lock();

    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    const dismissed = await dismiss(this, data, role, 'pickerLeave', iosLeaveAnimation, iosLeaveAnimation);

    if (dismissed) {
      this.delegateController.removeViewFromDom();
    }

    unlock();

    return dismissed;
  }

  /**
   * Returns a promise that resolves when the picker did dismiss.
   */
  @Method()
  onDidDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionPickerDidDismiss');
  }

  /**
   * Returns a promise that resolves when the picker will dismiss.
   */
  @Method()
  onWillDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionPickerWillDismiss');
  }

  /**
   * Get the column that matches the specified name.
   *
   * @param name The name of the column.
   */
  @Method()
  getColumn(name: string): Promise<PickerColumn | undefined> {
    return Promise.resolve(this.columns.find((column) => column.name === name));
  }

  private async buttonClick(button: PickerButton) {
    const role = button.role;
    if (isCancel(role)) {
      return this.dismiss(undefined, role);
    }
    const shouldDismiss = await this.callButtonHandler(button);
    if (shouldDismiss) {
      return this.dismiss(this.getSelected(), button.role);
    }
    return Promise.resolve();
  }

  private async callButtonHandler(button: PickerButton | undefined) {
    if (button) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      const rtn = await safeCall(button.handler, this.getSelected());
      if (rtn === false) {
        // if the return value of the handler is false then do not dismiss
        return false;
      }
    }
    return true;
  }

  private getSelected() {
    const selected: { [k: string]: any } = {};
    this.columns.forEach((col, index) => {
      const selectedColumn = col.selectedIndex !== undefined ? col.options[col.selectedIndex] : undefined;
      selected[col.name] = {
        text: selectedColumn ? selectedColumn.text : undefined,
        value: selectedColumn ? selectedColumn.value : undefined,
        columnIndex: index,
      };
    });
    return selected;
  }

  private onBackdropTap = () => {
    this.dismiss(undefined, BACKDROP);
  };

  private dispatchCancelHandler = (ev: CustomEvent) => {
    const role = ev.detail.role;
    if (isCancel(role)) {
      const cancelButton = this.buttons.find((b) => b.role === 'cancel');
      this.callButtonHandler(cancelButton);
    }
  };

  render() {
    const { htmlAttributes } = this;
    const mode = getIonMode(this);
    return (
      <Host
        aria-modal="true"
        tabindex="-1"
        {...(htmlAttributes as any)}
        style={{
          zIndex: `${20000 + this.overlayIndex}`,
        }}
        class={{
          [mode]: true,

          // Used internally for styling
          [`picker-${mode}`]: true,
          'overlay-hidden': true,
          ...getClassMap(this.cssClass),
        }}
        onIonBackdropTap={this.onBackdropTap}
        onIonPickerWillDismiss={this.dispatchCancelHandler}
      >
        <ion-backdrop visible={this.showBackdrop} tappable={this.backdropDismiss}></ion-backdrop>

        <div tabindex="0"></div>

        <div class="picker-wrapper ion-overlay-wrapper" role="dialog">
          <div class="picker-toolbar">
            {this.buttons.map((b) => (
              <div class={buttonWrapperClass(b)}>
                <button type="button" onClick={() => this.buttonClick(b)} class={buttonClass(b)}>
                  {b.text}
                </button>
              </div>
            ))}
          </div>

          <div class="picker-columns">
            <div class="picker-above-highlight"></div>
            {this.presented && this.columns.map((c) => <ion-picker-column col={c}></ion-picker-column>)}
            <div class="picker-below-highlight"></div>
          </div>
        </div>

        <div tabindex="0"></div>
      </Host>
    );
  }
}

const buttonWrapperClass = (button: PickerButton): CssClassMap => {
  return {
    [`picker-toolbar-${button.role}`]: button.role !== undefined,
    'picker-toolbar-button': true,
  };
};

const buttonClass = (button: PickerButton): CssClassMap => {
  return {
    'picker-button': true,
    'ion-activatable': true,
    ...getClassMap(button.cssClass),
  };
};
