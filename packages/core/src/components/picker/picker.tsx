import { Component, CssClassMap, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';
import { Animation, AnimationBuilder, AnimationController, Config, DomController, OverlayDismissEvent, OverlayDismissEventDetail } from '../../index';

import { domControllerAsync, playAnimationAsync } from '../../utils/helpers';
import { getClassMap } from '../../utils/theme';
import { OverlayInterface } from '../../utils/overlays';

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

  private presented = false;
  private animation: Animation;
  private durationTimeout: any;
  private mode: string;

  @Element() private el: HTMLElement;

  @State() private showSpinner: boolean = null;
  @State() private spinner: string;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;
  @Prop() overlayId: number;

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
  @Event() ionPickerDidLoad: EventEmitter<PickerEventDetail>;

  /**
   * Emitted after the picker has presented.
   */
  @Event() ionPickerDidPresent: EventEmitter<PickerEventDetail>;

  /**
   * Emitted before the picker has presented.
   */
  @Event() ionPickerWillPresent: EventEmitter<PickerEventDetail>;

  /**
   * Emitted before the picker has dismissed.
   */
  @Event() ionPickerWillDismiss: EventEmitter<PickerDismissEventDetail>;

  /**
   * Emitted after the picker has dismissed.
   */
  @Event() ionPickerDidDismiss: EventEmitter<PickerDismissEventDetail>;

  /**
   * Emitted after the picker has unloaded.
   */
  @Event() ionPickerDidUnload: EventEmitter<PickerEventDetail>;


  componentDidLoad() {
    if (!this.spinner) {
      let defaultSpinner = 'lines';

      if (this.mode === 'md') {
        defaultSpinner = 'crescent';
      }

      this.spinner = this.config.get('pickerSpinner') || defaultSpinner;
    }

    if (this.showSpinner === null || this.showSpinner === undefined) {
      this.showSpinner = !!(this.spinner && this.spinner !== 'hide');
    }
    this.ionPickerDidLoad.emit();
  }

  componentDidUnload() {
    this.ionPickerDidUnload.emit();
  }


  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    const cancelBtn = this.buttons.find(b => b.role === 'cancel');
    if (cancelBtn) {
      this.buttonClick(cancelBtn);
    } else {
      this.dismiss().catch();
    }
  }

  /**
   * Present the picker overlay after it has been created.
   */
  @Method()
  present(): Promise<void> {
    if(this.presented) {
      return Promise.reject('overlay already presented');
    }
    this.presented = true;

    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionPickerWillPresent.emit();

    this.el.style.zIndex = `${20000 + this.overlayId}`;

    // get the user's animation fn if one was provided
    const animationBuilder = this.enterAnimation || this.config.get('pickerEnter', iosEnterAnimation);

    // build the animation and kick it off
    return this.playAnimation(animationBuilder).then(() => {
      // blur the currently active element
      const activeElement: any = document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();

      // If there is a duration, dismiss after that amount of time
      if (typeof this.duration === 'number' && this.duration > 10) {
        this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
      }
      this.ionPickerDidPresent.emit();
    });
  }

  /**
   * Dismiss the picker overlay after it has been presented.
   */
  @Method()
  dismiss(data?: any, role?: string) {
    if(!this.presented) {
      return Promise.reject('overlay is not presented');
    }
    this.presented = false;
    clearTimeout(this.durationTimeout);

    this.ionPickerWillDismiss.emit({data, role});

    const animationBuilder = this.leaveAnimation || this.config.get('pickerLeave', iosLeaveAnimation);

    return this.playAnimation(animationBuilder).then(() => {
      this.ionPickerDidDismiss.emit({data, role});
      return domControllerAsync(this.dom.write, () => {
        this.el.parentNode.removeChild(this.el);
      });
    });
  }

  @Method()
  addButton(button: any) {
    this.buttons.push(button);
  }

  @Method()
  addColumn(column: PickerColumn) {
    this.columns.push(column);
  }

  @Method()
  getColumn(name: string): PickerColumn {
    return this.getColumns().find(column => column.name === name);
  }

  @Method()
  getColumns(): PickerColumn[] {
    return this.columns;
  }

  private playAnimation(animationBuilder: AnimationBuilder) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;
      if (!this.willAnimate) {
        animation.duration(0);
      }
      return playAnimationAsync(animation);
    }).then(animation => {
      animation.destroy();
      this.animation = null;
    })
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

  private getSelected(): any {
    const selected: {[k: string]: any} = {};
    this.columns.forEach((col, index) => {
      const selectedColumn = col.options[col.selectedIndex];
      selected[col.name] = {
        text: selectedColumn ? selectedColumn.text : null,
        value: selectedColumn ? selectedColumn.value : null,
        columnIndex: index,
      };
    });
    return selected;
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
  name?: string;
  align?: string;
  selectedIndex?: number;
  prevSelected?: number;
  prefix?: string;
  suffix?: string;
  options?: PickerColumnOption[];
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

export interface PickerEvent extends CustomEvent {
  target: HTMLIonPickerElement;
  detail: PickerEventDetail;
}

export interface PickerEventDetail {

}

export interface PickerDismissEventDetail extends OverlayDismissEventDetail {
  // keep this just for the sake of static types and potential future extensions
}

export interface PickerDismissEvent extends OverlayDismissEvent {
  // keep this just for the sake of static types and potential future extensions
}

export {
  iosEnterAnimation as iosPickerEnterAnimation,
  iosLeaveAnimation as iosPickerLeaveAnimation
};
