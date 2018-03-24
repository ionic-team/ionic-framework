import { Component, Element, Event, EventEmitter, Listen, Prop, State, Watch } from '@stencil/core';
import { CssClassMap } from '../../index';
import { HTMLIonSelectOptionElementEvent } from '../select-option/select-option';
import { BlurEvent, FocusEvent, SelectInputChangeEvent, StyleEvent } from '../../utils/input-interfaces';

import { ActionSheetButton, ActionSheetOptions  } from '../action-sheet/action-sheet';
import { AlertOptions } from '../alert/alert';
import { PopoverOptions } from '../popover/popover';

import { ActionSheetController } from '../action-sheet-controller/action-sheet-controller';
import { AlertController } from '../alert-controller/alert-controller';
import { PopoverController } from '../popover-controller/popover-controller';
import { SelectPopoverOption } from '../select-popover/select-popover';


@Component({
  tag: 'ion-select',
  styleUrls: {
    ios: 'select.ios.scss',
    md: 'select.md.scss'
  },
  host: {
    theme: 'select'
  }
})
export class Select {

  private childOpts: HTMLIonSelectOptionElement[] = [];
  private selectId: string;
  private labelId: string;
  private overlay: HTMLIonActionSheetElement | HTMLIonAlertElement | HTMLIonPopoverElement | undefined;
  private styleTmr: any;
  private mode: string;

  @Element() private el: HTMLIonSelectElement;

  @State() isExpanded = false;

  @State() keyFocus: boolean;

  @State() text: string;

  @Prop({ connect: 'ion-action-sheet-controller' }) actionSheetCtrl: ActionSheetController;
  @Prop({ connect: 'ion-alert-controller' }) alertCtrl: AlertController;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: PopoverController;

  /**
   * If true, the user cannot interact with the select. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * The text to display on the cancel button. Default: `Cancel`.
   */
  @Prop() cancelText = 'Cancel';

  /**
   * The text to display on the ok button. Default: `OK`.
   */
  @Prop() okText = 'OK';

  /**
   * The text to display when the select is empty.
   */
  @Prop() placeholder: string;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop({ mutable: true }) name: string;

  /**
   * The text to display instead of the selected option's value.
   */
  @Prop() selectedText: string;

  /**
   * If true, the select can accept multiple values.
   */
  @Prop() multiple: boolean;

  /**
   * The interface the select should use: `action-sheet`, `popover` or `alert`. Default: `alert`.
   */
  @Prop() interface = 'alert';

  /**
   * Any additional options that the `alert`, `action-sheet` or `popover` interface
   * can take. See the [AlertController API docs](../../alert/AlertController/#create), the
   * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the
   * [PopoverController API docs](../../popover/PopoverController/#create) for the
   * create options for each interface.
   */
  @Prop() interfaceOptions: any = {};

  /**
   * the value of the select.
   */
  @Prop({ mutable: true }) value: string | string[] | null = null;

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange: EventEmitter<SelectInputChangeEvent>;

  /**
   * Emitted when the selection is cancelled.
   */
  @Event() ionCancel: EventEmitter;

  /**
   * Emitted when the select has focus.
   */
  @Event() ionFocus: EventEmitter<FocusEvent>;

  /**
   * Emitted when the select loses focus.
   */
  @Event() ionBlur: EventEmitter<BlurEvent>;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter<StyleEvent>;


  @Watch('disabled')
  disabledChanged() {
    this.emitStyle();
  }

  @Watch('value')
  valueChanged() {
    // this select value just changed
    // double check the select option with this value is checked
    if (this.value === undefined) {
      // set to undefined
      // ensure all that are checked become unchecked
      this.childOpts.filter(o => o.selected).forEach(selectOption => {
        selectOption.selected = false;
      });
      this.text = '';

    } else {
      let hasChecked = false;
      const texts: string[] = [];

      this.childOpts.forEach(selectOption => {
        if ((Array.isArray(this.value) && this.value.indexOf(selectOption.value) > -1) || (selectOption.value === this.value)) {
          if (!selectOption.selected && (this.multiple || !hasChecked)) {
            // correct value for this select option
            // but this select option isn't checked yet
            // and we haven't found a checked yet
            // so CHECK IT!
            selectOption.selected = true;

          } else if (!this.multiple && hasChecked && selectOption.selected) {
            // somehow we've got multiple select options
            // with the same value, but only one can be checked
            selectOption.selected = false;
          }

          // remember we've got a checked select option button now
          hasChecked = true;

        } else if (selectOption.selected) {
          // this select option doesn't have the correct value
          // and it's also checked, so let's uncheck it
          selectOption.selected = false;
        }

        if (selectOption.selected) {
          texts.push(selectOption.textContent);
        }
      });

      this.text = texts.join(', ');
    }

    // emit the new value
    this.ionChange.emit({
      value: this.value,
      text: this.text
    });
    this.emitStyle();
  }

  @Listen('ionSelectOptionDidLoad')
  optLoad(ev: HTMLIonSelectOptionElementEvent) {
    const selectOption = ev.target;
    this.childOpts = Array.from(this.el.querySelectorAll('ion-select-option'));

    if (this.value !== undefined && (Array.isArray(this.value) && this.value.indexOf(selectOption.value) > -1) || (selectOption.value === this.value)) {
      // this select has a value and this
      // option equals the correct select value
      // so let's check this select option
      selectOption.selected = true;

    } else if (Array.isArray(this.value) && this.multiple && selectOption.selected) {
      // if the value is an array we need to push the option on
      this.value.push(selectOption.value);

    } else if (this.value === undefined && selectOption.selected) {
      // this select does not have a value
      // but this select option is checked, so let's set the
      // select's value from the checked select option
      this.value = selectOption.value;

    } else if (selectOption.selected) {
      // if it doesn't match one of the above cases, but the
      // select option is still checked, then we need to uncheck it
      selectOption.selected = false;
    }
  }

  @Listen('ionSelectOptionDidUnload')
  optUnload(ev: HTMLIonSelectOptionElementEvent) {
    const index = this.childOpts.indexOf(ev.target);
    if (index > -1) {
      this.childOpts.splice(index, 1);
    }
  }

  @Listen('ionSelect')
  onSelect(ev: HTMLIonSelectOptionElementEvent) {
    // ionSelect only come from the checked select option
    this.childOpts.forEach(selectOption => {
      if (selectOption === ev.target) {
        this.value = selectOption.value;
      } else {
        selectOption.selected = false;
      }
    });
  }

  constructor() {
    this.selectId = 'ion-sel-' + (selectIds++);
  }

  componentWillLoad() {
    if (!this.value) {
      this.value = this.multiple ? [] : undefined;
    }
    this.name = this.name || this.selectId;
  }

  componentDidLoad() {
    const label = this.getLabel();
    if (label) {
      this.labelId = label.id = this.name + '-lbl';
    }

    if (this.multiple) {
      // there are no values set at this point
      // so check to see who should be selected
      const checked = this.childOpts.filter(o => o.selected);

      (this.value as string[]).length = 0;
      checked.forEach(o => {
        // doing this instead of map() so we don't
        // fire off an unecessary change event
        (this.value as string[]).push(o.value);
      });
      this.text = checked.map(o => o.textContent).join(', ');

    } else {
      const checked = this.childOpts.find(o => o.selected);
      if (checked) {
        this.value = checked.value;
        this.text = checked.textContent;
      }
    }
    this.emitStyle();
  }

  private getLabel() {
    const item = this.el.closest('ion-item');
    if (item) {
      return item.querySelector('ion-label');
    }
    return null;
  }

  private open(ev: UIEvent) {
    let selectInterface = this.interface;

    if ((selectInterface === 'action-sheet' || selectInterface === 'popover') && this.multiple) {
      console.warn('Select interface cannot be "' + selectInterface + '" with a multi-value select. Using the "alert" interface instead.');
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover' && !ev) {
      console.warn('Select interface cannot be a "popover" without passing an event. Using the "alert" interface instead.');
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover') {
      return this.openPopover(ev);
    }

    if (selectInterface === 'action-sheet') {
      return this.openActionSheet();
    }

    return this.openAlert();
  }

  private async openPopover(ev: UIEvent) {
    const interfaceOptions = {...this.interfaceOptions};

    const popoverOpts: PopoverOptions = Object.assign(interfaceOptions, {
      component: 'ion-select-popover',
      data: {
        title: interfaceOptions.title,
        subTitle: interfaceOptions.subTitle,
        message: interfaceOptions.message,
        value: this.value,
        options: this.childOpts.map(o => {
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
        })
      },
      cssClass: 'select-popover' + (interfaceOptions.cssClass ? ' ' + interfaceOptions.cssClass : ''),
      ev: ev
    });

    const popover = this.overlay = await this.popoverCtrl.create(popoverOpts);
    await popover.present();
    this.isExpanded = true;
    return popover;
  }

  private async openActionSheet() {
    const interfaceOptions = {...this.interfaceOptions};

    const actionSheetButtons = this.childOpts.map(option => {
      return {
        role: (option.selected ? 'selected' : ''),
        text: option.textContent,
        handler: () => {
          this.value = option.value;
        }
      } as ActionSheetButton;
    });

    actionSheetButtons.push({
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit(this);
      }
    });

    const actionSheetOpts: ActionSheetOptions = Object.assign(interfaceOptions, {
      buttons: actionSheetButtons,
      cssClass: 'select-action-sheet' + (interfaceOptions.cssClass ? ' ' + interfaceOptions.cssClass : '')
    });

    const actionSheet = this.overlay = await this.actionSheetCtrl.create(actionSheetOpts);
    await actionSheet.present();

    this.isExpanded = true;
    return actionSheet;
  }

  private async openAlert() {
    const interfaceOptions = {...this.interfaceOptions};

    const label = this.getLabel();
    const labelText = (label) ? label.textContent : null;

    const alertOpts: AlertOptions = Object.assign(interfaceOptions, {
      title: interfaceOptions.title ? interfaceOptions.title : labelText,
      inputs: this.childOpts.map(o => {
        return {
          type: (this.multiple ? 'checkbox' : 'radio'),
          label: o.textContent,
          value: o.value,
          checked: o.selected,
          disabled: o.disabled
        };
      }),
      buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
          handler: () => {
            this.ionCancel.emit(this);
          }
        },
        {
          text: this.okText,
          handler: (selectedValues: any) => {
            this.value = selectedValues;
          }
        }
      ],
      cssClass: 'select-alert ' +
                (this.multiple ? 'multiple-select-alert' : 'single-select-alert') +
                (interfaceOptions.cssClass ? ' ' + interfaceOptions.cssClass : '')
    });

    const alert = this.overlay = await this.alertCtrl.create(alertOpts);
    await alert.present();

    this.isExpanded = true;
    return alert;
  }

  /**
   * Close the select interface.
   */
  private close(): Promise<void> {
    // TODO check !this.overlay || !this.isFocus()
    if (!this.overlay) {
      return Promise.resolve();
    }

    const overlay = this.overlay;
    this.overlay = undefined;

    this.isExpanded = false;

    return overlay.dismiss();
  }

  onKeyUp() {
    this.keyFocus = true;
  }

  onFocus() {
    this.ionFocus.emit();
  }

  onBlur() {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  hasValue(): boolean {
    if (Array.isArray(this.value)) {
      return this.value.length > 0;
    }
    return (this.value !== null && this.value !== undefined && this.value !== '');
  }

  private emitStyle() {
    clearTimeout(this.styleTmr);

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit({
        'select': true,
        'select-disabled': this.disabled,
        'input-has-value': this.hasValue()
      });
    });
  }

  hostData() {
    return {
      class: {
        'select-disabled': this.disabled,
        'select-key': this.keyFocus
      }
    };
  }

  render() {
    let addPlaceholderClass = false;

    let selectText = this.selectedText || this.text;
    if (!selectText && this.placeholder) {
      selectText = this.placeholder;
      addPlaceholderClass = true;
    }

    const selectTextClasses: CssClassMap = {
      'select-text': true,
      'select-placeholder': addPlaceholderClass
    };

    return [
      <div
        role='textbox'
        aria-multiline='false'
        class={ selectTextClasses }>{ selectText }
      </div>,
      <div class='select-icon' role='presentation'>
        <div class='select-icon-inner'></div>
      </div>,
      <button
        type='button'
        role='combobox'
        aria-haspopup='dialog'
        aria-expanded={this.isExpanded}
        aria-labelledby={this.labelId}
        aria-disabled={this.disabled ? 'true' : false}
        onClick={this.open.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        class='select-cover'>
        <slot></slot>
        {this.mode === 'md' ? <ion-ripple-effect /> : null}
      </button>,
      <input type='hidden' name={this.name} value={this.value}/>
    ];
  }
}

let selectIds = 0;
