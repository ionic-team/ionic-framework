import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';
import { Animation, AnimationBuilder, Config, CssClassMap } from '../../index';

import { getClassMap } from '../../utils/theme';
import { OverlayEventDetail, OverlayInterface, dismiss, eventMethod, present } from '../../utils/overlays';

import iosEnterAnimation from './animations/ios.enter';
import iosLeaveAnimation from './animations/ios.leave';

@Component({
  tag: 'ion-picker',
  styleUrls: {
    ios: 'picker.ios.scss',
    md: 'picker.md.scss'
  },
  host: {
    theme: 'picker'
  }
})
export class Picker implements OverlayInterface {

  private durationTimeout: any;

  mode: string;
  presented = false;
  animation: Animation;

  @Element() el: HTMLElement;

  @State() private showSpinner: boolean|undefined;
  @State() private spinner: string;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop() overlayId: number;
  @Prop() keyboardClose = true;

  /**
   * Animation to use when the picker is presented.
   */
  @Prop() enterAnimation: AnimationBuilder;

  /**
   * Animation to use when the picker is dismissed.
   */
  @Prop() leaveAnimation: AnimationBuilder;

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
  @Prop() cssClass: string;

  /**
   * Number of milliseconds to wait before dismissing the picker.
   */
  @Prop() duration: number;

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
  @Event() ionPickerDidLoad: EventEmitter<void>;

  /**
   * Emitted after the picker has presented.
   */
  @Event({eventName: 'ionPickerDidPresent'}) didPresent: EventEmitter<void>;

  /**
   * Emitted before the picker has presented.
   */
  @Event({eventName: 'ionPickerWillPresent'}) willPresent: EventEmitter<void>;

  /**
   * Emitted before the picker has dismissed.
   */
  @Event({eventName: 'ionPickerWillDismiss'}) willDismiss: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the picker has dismissed.
   */
  @Event({eventName: 'ionPickerDidDismiss'}) didDismiss: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the picker has unloaded.
   */
  @Event() ionPickerDidUnload: EventEmitter<void>;


  componentWillLoad() {
    if (!this.spinner) {
      const defaultSpinner = (this.mode === 'ios') ? 'lines' : 'crescent';
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
    await present(this, 'pickerEnter', iosEnterAnimation, iosEnterAnimation, undefined);

    if (this.duration > 0) {
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
    return dismiss(this, data, role, 'pickerLeave', iosLeaveAnimation, iosLeaveAnimation);
  }

  /**
   * Returns a promise that resolves when the picker did dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await picker.onDidDismiss();
   * ```
   */
  @Method()
  onDidDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionPickerDidDismiss', callback);
  }

  /**
   * Returns a promise that resolves when the picker will dismiss. It also accepts a callback
   * that is called in the same circustances.
   *
   * ```
   * const {data, role} = await picker.onWillDismiss();
   * ```
   */
  @Method()
  onWillDismiss(callback?: (detail: OverlayEventDetail) => void): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionPickerWillDismiss', callback);
  }

  @Method()
  addButton(button: PickerButton) {
    this.buttons.push(button);
  }

  @Method()
  addColumn(column: PickerColumn) {
    this.columns.push(column);
  }

  @Method()
  getColumn(name: string): PickerColumn|undefined {
    return this.columns.find(column => column.name === name);
  }

  @Method()
  getColumns(): PickerColumn[] {
    return this.columns;
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
    const selected: {[k: string]: any} = {};
    this.columns.forEach((col, index) => {
      const selectedColumn = col.selectedIndex ? col.options[col.selectedIndex] : null;
      selected[col.name] = {
        text: selectedColumn ? selectedColumn.text : null,
        value: selectedColumn ? selectedColumn.value : null,
        columnIndex: index,
      };
    });
    return selected;
  }

  hostData() {
    return {
      style: {
        zIndex: 20000 + this.overlayId,
      }
    };
  }

  render() {
    // TODO: cssClass

    const buttons = this.buttons.map(b => {
      if (typeof b === 'string') {
        b = { text: b };
      }
      if (!b.cssClass) {
        b.cssClass = '';
      }
      return b;
    })
    .filter(b => b !== null);

    const columns = this.columns;

    // // clean up dat data
    // data.columns = data.columns.map(column => {
    //   if (!isPresent(column.options)) {
    //     column.options = [];
    //   }
    //   column.selectedIndex = column.selectedIndex || 0;
    //   column.options = column.options.map(inputOpt => {
    //     let opt: PickerColumnOption = {
    //       text: '',
    //       value: '',
    //       disabled: inputOpt.disabled,
    //     };

    //     if (isPresent(inputOpt)) {
    //       if (isString(inputOpt) || isNumber(inputOpt)) {
    //         opt.text = inputOpt.toString();
    //         opt.value = inputOpt;

    //       } else {
    //         opt.text = isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value;
    //         opt.value = isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text;
    //       }
    //     }

    //     return opt;
    //   });
    //   return column;
    // });

    return [
      <ion-backdrop visible={this.showBackdrop} tappable={this.enableBackdropDismiss}/>,
      <div class='picker-wrapper' role='dialog'>
        <div class='picker-toolbar'>
          {buttons.map(b =>
            <div class={buttonWrapperClass(b)}>
              <button onClick={() => this.buttonClick(b)} class={buttonClass(b)}>
                {b.text}
              </button>
            </div>
          )}
        </div>
        <div class='picker-columns'>
          <div class='picker-above-highlight'></div>
          {columns.map(c =>
            <ion-picker-column col={c}></ion-picker-column>
          )}
          <div class='picker-below-highlight'></div>
        </div>
      </div>
    ];
  }
}

function buttonWrapperClass(button: PickerButton): CssClassMap {
  const buttonClass: CssClassMap = {
    'picker-toolbar-button': true,
  };
  if (button.role) {
    buttonClass[`picker-toolbar-${button.role}`] = true;
  }
  return buttonClass;
}

function buttonClass(button: PickerButton): CssClassMap {
  return {
    'picker-button': true,
    ...getClassMap(button.cssClass)
  };
}

export interface PickerButton {
  text?: string;
  role?: string;
  cssClass?: string;
  handler?: (value: any) => boolean|void;
}

export interface PickerOptions {
  buttons?: PickerButton[];
  columns?: PickerColumn[];
  cssClass?: string;
  enableBackdropDismiss?: boolean;
}

export interface PickerColumn {
  name: string;
  align?: string;
  selectedIndex?: number;
  prevSelected?: number;
  prefix?: string;
  suffix?: string;
  options: PickerColumnOption[];
  cssClass?: string;
  columnWidth?: string;
  prefixWidth?: string;
  suffixWidth?: string;
  optionsWidth?: string;
  refresh?: () => void;
}

export interface PickerColumnOption {
  text?: string;
  value?: any;
  disabled?: boolean;
  duration?: number;
  transform?: string;
  selected?: boolean;
}
