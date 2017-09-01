import { Component, CssClassMap, Element, Event, EventEmitter, HostElement, Prop, PropDidChange, State } from '@stencil/core';

import { deepCopy, isCheckedProperty } from '../../utils/helpers';

import { ActionSheet } from '../action-sheet/action-sheet';
import { Alert } from '../alert/alert';
import { Popover } from '../popover/popover';

import { SelectOption } from '../select-option/select-option';

import { ActionSheetController } from '../action-sheet-controller/action-sheet-controller';
import { AlertController } from '../alert-controller/alert-controller';
import { PopoverController } from '../popover-controller/popover-controller';


@Component({
  tag: 'ion-select',
  styleUrls: {
    ios: 'select.ios.scss',
    md: 'select.md.scss',
    wp: 'select.wp.scss'
  },
  host: {
    theme: 'select'
  }
})
export class Select {
  texts: any = [];
  id: string;
  labelId: string;
  item: any;
  options: SelectOption[] = [];
  overlay: ActionSheet | Alert | Popover;

  @Prop({ connect: 'ion-action-sheet-controller' }) actionSheetCtrl: ActionSheetController;
  @Prop({ connect: 'ion-alert-controller' }) alertCtrl: AlertController;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: PopoverController;

  @Element() el: HTMLElement;

  @State() text: string;

  /**
   * @input {boolean} If true, the user cannot interact with this element. Defaults to `false`.
   */
  @Prop() disabled: boolean = false;

  /**
   * @input {string} The text to display on the cancel button. Default: `Cancel`.
   */
  @Prop() cancelText: string = 'Cancel';

  /**
   * @input {string} The text to display on the ok button. Default: `OK`.
   */
  @Prop() okText: string = 'OK';

  /**
   * @input {string} The text to display when the select is empty.
   */
  @Prop() placeholder: string;

  /**
   * @input {any} Any additional options that the `alert` or `action-sheet` interface can take.
   * See the [AlertController API docs](../../alert/AlertController/#create) and the
   * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) for the
   * create options for each interface.
   */
  @Prop() selectOptions: any = {};

  /**
   * @input {string} The interface the select should use: `action-sheet`, `popover` or `alert`. Default: `alert`.
   */
  @Prop() interface: string = 'alert';

  /**
   * @input {string} The text to display instead of the selected option's value.
   */
  @Prop() selectedText: string;

  /**
   * @input {boolean} If true, the element can accept multiple values.
   */
  @Prop() multiple: boolean;

  /**
   * @input {string} the value of the select.
   */
  @Prop({ mutable: true }) value: string | string[];

  @PropDidChange('value')
  valueChanged() {
    this.optionUpdated();
  }

  /**
   * @output {EventEmitter} Emitted when the selection is cancelled.
   */
  @Event() ionCancel: EventEmitter;


  ionViewDidLoad() {
    // Get the parent item
    this.item = this.el.closest('ion-item') as HostElement;

    this.setOptions();
  }


  setOptions() {
    // Get the options
    const options = this.el.querySelectorAll('ion-select-option') as NodeListOf<any>;

    Array.from(options).forEach(option => {
      if (!option.value) {
        option.value = option.getText();
      }
      this.options.push(option.$instance);
    })

    const values = this.getValues();

    if (values.length === 0) {
      // there are no values set at this point
      // so check to see who should be selected
      let filtered = this.options.filter(o => o.selected).map(o => o.value);
      this.value = filtered;
    } else {
      this.optionUpdated();
    }
  }


  /**
   * @hidden
   * Update the select options when the value changes
   */
  optionUpdated() {
    this.texts = [];

    if (this.options) {
      this.options.forEach(option => {
        // check this option if the option's value is in the values array
        option.selected = this.getValues().some(selectValue => {
          return isCheckedProperty(selectValue, option.value);
        });

        if (option.selected) {
          this.texts.push(option.getText());
        }
      });
    }

    this.text = this.texts.join(', ');
  }


  /**
   * @hidden
   */
  getValues(): any[] {
    if (!this.value) {
      return [];
    }
    const values = Array.isArray(this.value) ? this.value : [this.value];
    return values;
  }


  /**
   * Close the select interface.
   */
  close(): Promise<any> | void {
    // TODO check !this.overlay || !this.isFocus()
    if (!this.overlay) {
      return;
    }

    return this.overlay.dismiss();
  }


  /**
   * @hidden
   */
  getText() {
    return (this.multiple ? this.texts : this.texts.join());
  }

  /**
   * @hidden
   */
  resetInterface(ev: Event): string {
    let selectInterface = this.interface;

    if (selectInterface === 'action-sheet' && this.options.length > 6) {
      console.warn('Interface cannot be "' + selectInterface + '" with more than 6 options. Using the "alert" interface instead.');
      selectInterface = 'alert';
    }

    if ((selectInterface === 'action-sheet' || selectInterface === 'popover') && this.multiple) {
      console.warn('Interface cannot be "' + selectInterface + '" with a multi-value select. Using the "alert" interface instead.');
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover' && !ev) {
      console.warn('Interface cannot be "' + selectInterface + '" without passing an event. Using the "alert" interface instead.');
      selectInterface = 'alert';
    }

    return selectInterface;
  }

  buildAlert(selectOptions: any) {
    console.debug('Build Select: Alert with', selectOptions, this.options);

    // user cannot provide inputs from selectOptions
    // alert inputs must be created by ionic from ion-select-options
    selectOptions.inputs = this.options.map((option: any) => {
      return {
        type: (this.multiple ? 'checkbox' : 'radio'),
        label: option.getText(),
        value: option.value,
        checked: option.selected,
        disabled: option.disabled,
        handler: (selectedOption: any) => {
          // Only emit the select event if it is being checked
          // For multi selects this won't emit when unchecking
          if (selectedOption.checked) {
            option.ionSelect.emit(option.value);
          }
        }
      };
    });

    // If multiple is true use checkboxes, else use radio buttons
    var selectCssClass = 'select-alert ' + this.multiple ? 'multiple-select-alert' : 'single-select-alert';

    // If the user passed a cssClass for the select, add it
    selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';

    // Add an ok button to the alert
    selectOptions.buttons = selectOptions.buttons.concat({
      text: this.okText,
      handler: (selectedValues: any) => this.value = selectedValues
    })

    // create the alert instance from our built up selectOptions
    const alertOptions = {
      cssClass: selectCssClass,
      ...selectOptions
    }

    console.debug('Built Select: Alert with', alertOptions);
    return this.alertCtrl.create(alertOptions);
  }

  buildActionSheet(selectOptions: any) {
    console.debug('Building Select: Action Sheet with', selectOptions, this.options);

    selectOptions.buttons = selectOptions.buttons.concat(this.options.map((option: any) => {
      return {
        role: (option.selected ? 'selected' : ''),
        text: option.getText(),
        handler: () => {
          this.value = option.value;
          option.ionSelect.emit(option.value);
        }
      };
    }));

    var selectCssClass = 'select-action-sheet';

    // If the user passed a cssClass for the select, add it
    selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';

    const actionSheetOptions = {
      cssClass: selectCssClass,
      ...selectOptions
    }

    console.debug('Built Select: Action Sheet with', actionSheetOptions);
    return this.actionSheetCtrl.create(actionSheetOptions);
  }

  buildPopover(selectOptions: any) {
    console.debug('Building Select: Popover with', selectOptions, this.options);

    selectOptions = this.options.map((option: any) => {
      return {
        text: option.getText(),
        checked: option.selected,
        disabled: option.disabled,
        value: option.value,
        handler: () => {
          this.value = option.value;
          option.ionSelect.emit(option.value);
        }
      };
    });

    var selectCssClass = 'select-popover';

    // If the user passed a cssClass for the select, add it
    selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';

    const popoverOptions = {
      component: 'ion-select-popover',
      componentProps: {
        options: selectOptions
      },
      cssClass: selectCssClass,
      ev: event
    }

    console.debug('Built Select: Popover with', popoverOptions);
    return this.popoverCtrl.create(popoverOptions);
  }

  open(ev: UIEvent) {
    // the user may have assigned some options specifically for the alert
    const selectOptions = deepCopy(this.selectOptions);

    // make sure their buttons array is removed from the options
    // and we create a new array for the alert's two buttons
    selectOptions.buttons = [{
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit(this);
      }
    }];

    // if the selectOptions didn't provide a title then use the label's text
    if (!selectOptions.title && this.item) {
      selectOptions.title = this.item.getLabelText();
    }

    // If the user passed in an invalid interface we need to reset it to alert
    let selectInterface = this.resetInterface(ev);

    let controller: Promise<any>;

    if (selectInterface === 'action-sheet') {
      controller = this.buildActionSheet(selectOptions);
    } else if (selectInterface === 'popover') {
      controller = this.buildPopover(selectOptions);
    } else {
      controller = this.buildAlert(selectOptions);
    }

    controller.then((component: any) => {
      component.present();

      // component.onDidDismiss(() => {
      //   this.overlay = undefined;
      // })

      // this.overlay = component;
    });
  }

  hostData() {
    return {
      class: {
        'select-disabled': this.disabled
      }
    };
  }

  render() {
    let addPlaceholderClass = false;

    // If selected text has been passed in, use that first
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
      <div class={ selectTextClasses }>{ selectText }</div>,
      <div class="select-icon">
        <div class="select-icon-inner"></div>
      </div>,
      <button
        aria-haspopup="true"
        id={this.id}
        aria-labelledby={this.labelId}
        aria-disabled={this.disabled ? "true" : false}
        onClick={this.open.bind(this)}
        class="item-cover">
      </button>
    ];
  }
}