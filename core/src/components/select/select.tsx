import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Listen, Method, Prop, State, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { ActionSheetButton, ActionSheetOptions, AlertInput, AlertOptions, CssClassMap, OverlaySelect, PopoverOptions, SelectChangeEventDetail, SelectInterface, SelectPopoverOption, StyleEventDetail } from '../../interface';
import { findItemLabel, renderHiddenInput } from '../../utils/helpers';
import { actionSheetController, alertController, popoverController } from '../../utils/overlays';
import { hostContext } from '../../utils/theme';

import { SelectCompareFn } from './select-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-select',
  styleUrls: {
    ios: 'select.ios.scss',
    md: 'select.md.scss'
  },
  shadow: true
})
export class Select implements ComponentInterface {

  private childOpts: HTMLIonSelectOptionElement[] = [];
  private inputId = `ion-sel-${selectIds++}`;
  private overlay?: OverlaySelect;
  private didInit = false;
  private buttonEl?: HTMLButtonElement;

  @Element() el!: HTMLIonSelectElement;

  @State() isExpanded = false;

  /**
   * If `true`, the user cannot interact with the select.
   */
  @Prop() disabled = false;

  /**
   * The text to display on the cancel button.
   */
  @Prop() cancelText = 'Cancel';

  /**
   * The text to display on the ok button.
   */
  @Prop() okText = 'OK';

  /**
   * The text to display when the select is empty.
   */
  @Prop() placeholder?: string | null;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * The text to display instead of the selected option's value.
   */
  @Prop() selectedText?: string | null;

  /**
   * If `true`, the select can accept multiple values.
   */
  @Prop() multiple = false;

  /**
   * The interface the select should use: `action-sheet`, `popover` or `alert`.
   */
  @Prop() interface: SelectInterface = 'alert';

  /**
   * Any additional options that the `alert`, `action-sheet` or `popover` interface
   * can take. See the [AlertController API docs](../../alert/AlertController/#create), the
   * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the
   * [PopoverController API docs](../../popover/PopoverController/#create) for the
   * create options for each interface.
   */
  @Prop() interfaceOptions: any = {};

  /**
   * A property name or function used to compare object values
   */
  @Prop() compareWith?: string | SelectCompareFn | null;

  /**
   * the value of the select.
   */
  @Prop({ mutable: true }) value?: any | null;

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<SelectChangeEventDetail>;

  /**
   * Emitted when the selection is cancelled.
   */
  @Event() ionCancel!: EventEmitter<void>;

  /**
   * Emitted when the select has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the select loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('disabled')
  disabledChanged() {
    this.emitStyle();
  }

  @Watch('value')
  valueChanged() {
    if (this.didInit) {
      this.updateOptions();
      this.ionChange.emit({
        value: this.value,
      });
      this.emitStyle();
    }
  }

  @Listen('ionSelectOptionDidLoad')
  @Listen('ionSelectOptionDidUnload')
  async selectOptionChanged() {
    await this.loadOptions();

    if (this.didInit) {
      this.updateOptions();
      this.updateOverlayOptions();
      this.emitStyle();

      /**
       * In the event that options
       * are not loaded at component load
       * this ensures that any value that is
       * set is properly rendered once
       * options have been loaded
       */
      if (this.value !== undefined) {
        this.el.forceUpdate();
      }

    }
  }

  async componentDidLoad() {
    await this.loadOptions();

    if (this.value === undefined) {
      if (this.multiple) {
        // there are no values set at this point
        // so check to see who should be selected
        const checked = this.childOpts.filter(o => o.selected);
        this.value = checked.map(o => o.value);
      } else {
        const checked = this.childOpts.find(o => o.selected);
        if (checked) {
          this.value = checked.value;
        }
      }
    }
    this.updateOptions();
    this.emitStyle();
    this.el.forceUpdate();
    this.didInit = true;
  }

  /**
   * Open the select overlay. The overlay is either an alert, action sheet, or popover,
   * depending on the `interface` property on the `ion-select`.
   *
   * @param event The user interface event that called the open.
   */
  @Method()
  async open(event?: UIEvent): Promise<any> {
    if (this.disabled || this.isExpanded) {
      return undefined;
    }
    const overlay = this.overlay = await this.createOverlay(event);
    this.isExpanded = true;
    overlay.onDidDismiss().then(() => {
      this.overlay = undefined;
      this.isExpanded = false;
      this.setFocus();
    });
    await overlay.present();
    return overlay;
  }

  private createOverlay(ev?: UIEvent): Promise<OverlaySelect> {
    let selectInterface = this.interface;
    if ((selectInterface === 'action-sheet' || selectInterface === 'popover') && this.multiple) {
      console.warn(`Select interface cannot be "${selectInterface}" with a multi-value select. Using the "alert" interface instead.`);
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover' && !ev) {
      console.warn('Select interface cannot be a "popover" without passing an event. Using the "alert" interface instead.');
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover') {
      return this.openPopover(ev!);
    }
    if (selectInterface === 'action-sheet') {
      return this.openActionSheet();
    }
    return this.openAlert();
  }

  private updateOverlayOptions(): void {
    if (!this.overlay) { return; }
    const overlay = (this.overlay as any);

    switch (this.interface) {
      case 'action-sheet':
        overlay.buttons = this.createActionSheetButtons(this.childOpts);
        break;
      case 'popover':
        const popover = overlay.querySelector('ion-select-popover');
        if (popover) {
          popover.options = this.createPopoverOptions(this.childOpts);
        }
        break;
      default:
        const inputType = (this.multiple ? 'checkbox' : 'radio');
        overlay.inputs = this.createAlertInputs(this.childOpts, inputType);
        break;
    }
  }

  private createActionSheetButtons(data: any[]): ActionSheetButton[] {
    const actionSheetButtons = data.map(option => {
      return {
        role: (option.selected ? 'selected' : ''),
        text: option.textContent,
        handler: () => {
          this.value = option.value;
        }
      } as ActionSheetButton;
    });

    // Add "cancel" button
    actionSheetButtons.push({
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit();
      }
    });

    return actionSheetButtons;
  }

  private createAlertInputs(data: any[], inputType: string): AlertInput[] {
    return data.map(o => {
      return {
        type: inputType,
        label: o.textContent,
        value: o.value,
        checked: o.selected,
        disabled: o.disabled
      } as AlertInput;
    });
  }

  private createPopoverOptions(data: any[]): SelectPopoverOption[] {
    return data.map(o => {
      return {
        text: o.textContent,
        value: o.value,
        checked: o.selected,
        disabled: o.disabled,
        handler: () => {
          this.value = o.value;
          this.close();
        }
      } as SelectPopoverOption;
    });
  }

  private async openPopover(ev: UIEvent) {
    const interfaceOptions = this.interfaceOptions;
    const mode = getIonMode(this);

    const popoverOpts: PopoverOptions = {
      mode,
      ...interfaceOptions,

      component: 'ion-select-popover',
      cssClass: ['select-popover', interfaceOptions.cssClass],
      event: ev,
      componentProps: {
        header: interfaceOptions.header,
        subHeader: interfaceOptions.subHeader,
        message: interfaceOptions.message,
        value: this.value,
        options: this.createPopoverOptions(this.childOpts)
      }
    };
    return popoverController.create(popoverOpts);
  }

  private async openActionSheet() {

    const mode = getIonMode(this);
    const interfaceOptions = this.interfaceOptions;
    const actionSheetOpts: ActionSheetOptions = {
      mode,
      ...interfaceOptions,

      buttons: this.createActionSheetButtons(this.childOpts),
      cssClass: ['select-action-sheet', interfaceOptions.cssClass]
    };
    return actionSheetController.create(actionSheetOpts);
  }

  private async openAlert() {
    const label = this.getLabel();
    const labelText = (label) ? label.textContent : null;

    const interfaceOptions = this.interfaceOptions;
    const inputType = (this.multiple ? 'checkbox' : 'radio');
    const mode = getIonMode(this);

    const alertOpts: AlertOptions = {
      mode,
      ...interfaceOptions,

      header: interfaceOptions.header ? interfaceOptions.header : labelText,
      inputs: this.createAlertInputs(this.childOpts, inputType),
      buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
          handler: () => {
            this.ionCancel.emit();
          }
        },
        {
          text: this.okText,
          handler: (selectedValues: any) => {
            this.value = selectedValues;
          }
        }
      ],
      cssClass: ['select-alert', interfaceOptions.cssClass,
                 (this.multiple ? 'multiple-select-alert' : 'single-select-alert')]
    };
    return alertController.create(alertOpts);
  }

  /**
   * Close the select interface.
   */
  private close(): Promise<boolean> {
    // TODO check !this.overlay || !this.isFocus()
    if (!this.overlay) {
      return Promise.resolve(false);
    }
    return this.overlay.dismiss();
  }

  private async loadOptions() {
    this.childOpts = await Promise.all(
      Array.from(this.el.querySelectorAll('ion-select-option')).map(o => o.componentOnReady())
    );
  }

  private updateOptions() {
    // iterate all options, updating the selected prop
    let canSelect = true;
    for (const selectOption of this.childOpts) {
      const selected = canSelect && isOptionSelected(this.value, selectOption.value, this.compareWith);
      selectOption.selected = selected;

      // if current option is selected and select is single-option, we can't select
      // any option more
      if (selected && !this.multiple) {
        canSelect = false;
      }
    }
  }

  private getLabel() {
    return findItemLabel(this.el);
  }

  private hasValue(): boolean {
    return this.getText() !== '';
  }

  private getText(): string {
    const selectedText = this.selectedText;
    if (selectedText != null && selectedText !== '') {
      return selectedText;
    }
    return generateText(this.childOpts, this.value, this.compareWith);
  }

  private setFocus() {
    if (this.buttonEl) {
      this.buttonEl.focus();
    }
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'select': true,
      'has-placeholder': this.placeholder != null,
      'has-value': this.hasValue(),
      'interactive-disabled': this.disabled,
      'select-disabled': this.disabled
    });
  }

  private onClick = (ev: UIEvent) => {
    this.setFocus();
    this.open(ev);
  }
  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.ionBlur.emit();
  }

  render() {
    const { placeholder, name, disabled, isExpanded, value, el } = this;
    const mode = getIonMode(this);
    const labelId = this.inputId + '-lbl';
    const label = findItemLabel(el);
    if (label) {
      label.id = labelId;
    }

    let addPlaceholderClass = false;
    let selectText = this.getText();
    if (selectText === '' && placeholder != null) {
      selectText = placeholder;
      addPlaceholderClass = true;
    }

    renderHiddenInput(true, el, name, parseValue(value), disabled);

    const selectTextClasses: CssClassMap = {
      'select-text': true,
      'select-placeholder': addPlaceholderClass
    };

    return (
      <Host
        onClick={this.onClick}
        role="combobox"
        aria-haspopup="dialog"
        aria-disabled={disabled ? 'true' : null}
        aria-expanded={`${isExpanded}`}
        aria-labelledby={labelId}
        class={{
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          'select-disabled': disabled,
        }}
      >
        <div class={selectTextClasses}>
          {selectText}
        </div>
        <div class="select-icon" role="presentation">
          <div class="select-icon-inner"></div>
        </div>
        <button
          type="button"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          disabled={disabled}
          ref={(btnEl => this.buttonEl = btnEl)}
        >
        </button>
      </Host>
    );
  }
}

const parseValue = (value: any) => {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return value.toString();
};

const isOptionSelected = (currentValue: any[] | any, compareValue: any, compareWith?: string | SelectCompareFn | null) => {
  if (currentValue === undefined) {
    return false;
  }
  if (Array.isArray(currentValue)) {
    return currentValue.some(val => compareOptions(val, compareValue, compareWith));
  } else {
    return compareOptions(currentValue, compareValue, compareWith);
  }
};

const compareOptions = (currentValue: any, compareValue: any, compareWith?: string | SelectCompareFn | null): boolean => {
  if (typeof compareWith === 'function') {
    return compareWith(currentValue, compareValue);
  } else if (typeof compareWith === 'string') {
    return currentValue[compareWith] === compareValue[compareWith];
  } else {
    return currentValue === compareValue;
  }
};

const generateText = (opts: HTMLIonSelectOptionElement[], value: any | any[], compareWith?: string | SelectCompareFn | null) => {
  if (value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value
      .map(v => textForValue(opts, v, compareWith))
      .filter(opt => opt !== null)
      .join(', ');
  } else {
    return textForValue(opts, value, compareWith) || '';
  }
};

const textForValue = (opts: HTMLIonSelectOptionElement[], value: any, compareWith?: string | SelectCompareFn | null): string | null => {
  const selectOpt = opts.find(opt => {
    return compareOptions(opt.value, value, compareWith);
  });
  return selectOpt
    ? selectOpt.textContent
    : null;
};

let selectIds = 0;
