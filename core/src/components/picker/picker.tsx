import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';

import { Animation, AnimationBuilder, Config, CssClassMap, Mode, OverlayEventDetail, OverlayInterface, PickerButton, PickerColumn } from '../../interface';
import { dismiss, eventMethod, present } from '../../utils/overlays';
import { createThemedClasses, getClassMap } from '../../utils/theme';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';

@Component({
  tag: 'ion-picker',
  styleUrls: {
    ios: 'picker.ios.scss',
    md: 'picker.md.scss'
  }
})
export class Picker implements OverlayInterface {
  private durationTimeout: any;

  mode!: Mode;
  presented = false;
  animation?: Animation;

  @Element() el!: HTMLElement;

  @State() private showSpinner!: boolean;
  @State() private spinner!: string;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config!: Config;

  /** @hidden */
  @Prop() overlayId!: number;

  /**
   * If the keyboard should be able to close the picker. Defaults to true.
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
  @Prop() duration?: number;

  /**
   * If true, a backdrop will be displayed behind the picker. Defaults to `true`.
   */
  @Prop() showBackdrop = true;

  /**
   * If true, the picker will be dismissed when the backdrop is clicked. Defaults to `true`.
   */
  @Prop() enableBackdropDismiss = true;

  /**
   * If true, the picker will animate. Defaults to `true`.
   */
  @Prop() willAnimate = true;

  /**
   * Emitted after the picker has loaded.
   */
  @Event() ionPickerDidLoad!: EventEmitter<void>;

  /**
   * Emitted after the picker has presented.
   */
  @Event({ eventName: 'ionPickerDidPresent' })
  didPresent!: EventEmitter<void>;

  /**
   * Emitted before the picker has presented.
   */
  @Event({ eventName: 'ionPickerWillPresent' })
  willPresent!: EventEmitter<void>;

  /**
   * Emitted before the picker has dismissed.
   */
  @Event({ eventName: 'ionPickerWillDismiss' })
  willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the picker has dismissed.
   */
  @Event({ eventName: 'ionPickerDidDismiss' })
  didDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the picker has unloaded.
   */
  @Event() ionPickerDidUnload!: EventEmitter<void>;

  componentWillLoad() {
    if (!this.spinner) {
      const defaultSpinner = this.mode === 'ios' ? 'lines' : 'crescent';
      this.spinner = this.config.get('pickerSpinner', defaultSpinner);
    }
    if (this.showSpinner === undefined) {
      this.showSpinner = !!(this.spinner && this.spinner !== 'hide');
    }
  }

  componentDidLoad() {
    this.ionPickerDidLoad.emit();
  }

  componentDidUnload() {
    this.ionPickerDidUnload.emit();
  }

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
    await present(
      this,
      'pickerEnter',
      iosEnterAnimation,
      iosEnterAnimation,
      undefined
    );

    if (this.duration) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
    }
  }

  /**
   * Dismiss the picker overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string): Promise<void> {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return dismiss(
      this,
      data,
      role,
      'pickerLeave',
      iosLeaveAnimation,
      iosLeaveAnimation
    );
  }

  /**
   * Returns a promise that resolves when the picker did dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   */
  @Method()
  onDidDismiss(
    callback?: (detail: OverlayEventDetail) => void
  ): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionPickerDidDismiss', callback);
  }

  /**
   * Returns a promise that resolves when the picker will dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   */
  @Method()
  onWillDismiss(
    callback?: (detail: OverlayEventDetail) => void
  ): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionPickerWillDismiss', callback);
  }

  /**
   * Returns the column the matches the specified name
   */
  @Method()
  getColumn(name: string): PickerColumn | undefined {
    return this.columns.find(column => column.name === name);
  }

  private buttonClick(button: PickerButton) {
    // if (this.disabled) {
    //   return;
    // }

    // keep the time of the most recent button click
    let shouldDismiss = true;

    if (button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      if (button.handler(this.getSelected()) === false) {
        // if the return value of the handler is false then do not dismiss
        shouldDismiss = false;
      }
    }

    if (shouldDismiss) {
      this.dismiss();
    }
  }

  private getSelected() {
    const selected: { [k: string]: any } = {};
    this.columns.forEach((col, index) => {
      const selectedColumn = col.selectedIndex
        ? col.options[col.selectedIndex]
        : null;
      selected[col.name] = {
        text: selectedColumn ? selectedColumn.text : null,
        value: selectedColumn ? selectedColumn.value : null,
        columnIndex: index
      };
    });
    return selected;
  }

  hostData() {
    return {
      class: {
        ...createThemedClasses(this.mode, 'picker'),
        ...getClassMap(this.cssClass)
      },
      style: {
        zIndex: 20000 + this.overlayId
      }
    };
  }

  render() {
    const buttons = this.buttons.map(b => {
      return (typeof b === 'string')
        ? { text: b }
        : b;
    });

    const columns = this.columns;

    return [
      <ion-backdrop
        visible={this.showBackdrop}
        tappable={this.enableBackdropDismiss}
      />,

      <div class="picker-wrapper" role="dialog">

        <div class="picker-toolbar">
          {buttons.map(b => (
            <div class={buttonWrapperClass(b)}>
              <button
                onClick={() => this.buttonClick(b)}
                class={buttonClass(b)}
              >
                {b.text}
              </button>
            </div>
          ))}
        </div>

        <div class="picker-columns">
          <div class="picker-above-highlight" />
          {columns.map(c => <ion-picker-column col={c} />)}
          <div class="picker-below-highlight" />
        </div>

      </div>
    ];
  }
}

function buttonWrapperClass(button: PickerButton): CssClassMap {
  return {
    [`picker-toolbar-${button.role}`]: !!button.role,
    'picker-toolbar-button': true
  };
}

function buttonClass(button: PickerButton): CssClassMap {
  return {
    'picker-button': true,
    ...getClassMap(button.cssClass)
  };
}
