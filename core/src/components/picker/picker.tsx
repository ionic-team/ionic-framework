import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop, State, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Animation, AnimationBuilder, CssClassMap, OverlayEventDetail, OverlayInterface, PickerButton, PickerColumn } from '../../interface';
import { dismiss, eventMethod, present, safeCall } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-picker',
  styleUrls: {
    ios: 'picker.ios.scss',
    md: 'picker.md.scss'
  },
  scoped: true
})
export class Picker implements ComponentInterface, OverlayInterface {
  private durationTimeout: any;

  mode = getIonMode(this);

  animation?: Animation;

  @Element() el!: HTMLElement;

  @State() presented = false;

  /** @internal */
  @Prop() overlayIndex!: number;

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

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    const cancelBtn = this.buttons.find(b => b.role === 'cancel');
    if (cancelBtn) {
      this.buttonClick(cancelBtn);
    } else {
      this.dismiss();
    }
  }

  /**
   * Present the picker overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    await present(this, 'pickerEnter', iosEnterAnimation, iosEnterAnimation, undefined);

    if (this.duration > 0) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
    }
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
  dismiss(data?: any, role?: string): Promise<boolean> {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return dismiss(this, data, role, 'pickerLeave', iosLeaveAnimation, iosLeaveAnimation);
  }

  /**
   * Returns a promise that resolves when the picker did dismiss.
   */
  @Method()
  onDidDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionPickerDidDismiss');
  }

  /**
   * Returns a promise that resolves when the picker will dismiss.
   */
  @Method()
  onWillDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionPickerWillDismiss');
  }

  /**
   * Get the column that matches the specified name.
   *
   * @param name The name of the column.
   */
  @Method()
  getColumn(name: string): Promise<PickerColumn | undefined> {
    return Promise.resolve(this.columns.find(column => column.name === name));
  }

  private buttonClick(button: PickerButton) {
    // if (this.disabled) {
    //   return;
    // }

    // keep the time of the most recent button click
    // a handler has been provided, execute it
    // pass the handler the values from the inputs
    const shouldDismiss = safeCall(button.handler, this.getSelected()) !== false;
    if (shouldDismiss) {
      return this.dismiss();
    }
    return Promise.resolve(false);
  }

  private getSelected() {
    const selected: { [k: string]: any } = {};
    this.columns.forEach((col, index) => {
      const selectedColumn = col.selectedIndex !== undefined
        ? col.options[col.selectedIndex]
        : undefined;
      selected[col.name] = {
        text: selectedColumn ? selectedColumn.text : undefined,
        value: selectedColumn ? selectedColumn.value : undefined,
        columnIndex: index
      };
    });
    return selected;
  }

  hostData() {
    const mode = getIonMode(this);
    return {
      'aria-modal': 'true',
      class: {
        [mode]: true,

        // Used internally for styling
        [`picker-${mode}`]: true,

        ...getClassMap(this.cssClass)
      },
      style: {
        zIndex: 20000 + this.overlayIndex
      }
    };
  }

  render() {
    return [
      <ion-backdrop
        visible={this.showBackdrop}
        tappable={this.backdropDismiss}
      >
      </ion-backdrop>,
      <div class="picker-wrapper" role="dialog">
        <div class="picker-toolbar">
          {this.buttons.map(b => (
            <div class={buttonWrapperClass(b)}>
              <button
                type="button"
                onClick={() => this.buttonClick(b)}
                class={buttonClass(b)}
              >
                {b.text}
              </button>
            </div>
          ))}
        </div>

        <div class="picker-columns">
          <div class="picker-above-highlight"></div>
            {this.presented && this.columns.map(c =>
              <ion-picker-column col={c}></ion-picker-column>
            )}
          <div class="picker-below-highlight"></div>
        </div>
      </div>
    ];
  }
}

const buttonWrapperClass = (button: PickerButton): CssClassMap => {
  return {
    [`picker-toolbar-${button.role}`]: button.role !== undefined,
    'picker-toolbar-button': true
  };
};

const buttonClass = (button: PickerButton): CssClassMap => {
  return {
    'picker-button': true,
    'ion-activatable': true,
    ...getClassMap(button.cssClass)
  };
};
