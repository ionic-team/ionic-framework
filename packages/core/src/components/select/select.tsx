import { Component, CssClassMap, Event, EventEmitter, Prop } from '@stencil/core';


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
  text: any;
  id: any;
  labelId: any;

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
  @Prop() interface: string = '';

  /**
   * @input {string} The text to display instead of the selected option's value.
   */
  @Prop() selectedText: string;

  /**
   * @input {boolean} If true, the element can accept multiple values.
   */
  @Prop() multiple: boolean;

  /**
   * @output {EventEmitter} Emitted when the selection is cancelled.
   */
  @Event() ionCancel: EventEmitter;


  hostData() {
    return {
      class: {
        'select-disabled': this.disabled
      }
    };
  }

  render() {
    let addPlaceholderClass = false

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
      // add placeholder class
      <div class={selectTextClasses}>{ selectText }</div>,
      <div class="select-icon">
        <div class="select-icon-inner"></div>
      </div>,
      <button
        aria-haspopup="true"
        id={this.id}
        aria-labelledby={this.labelId}
        aria-disabled={this.disabled ? "true" : false}
        class="item-cover">
      </button>
    ];
  }

}

// export class Select extends BaseInput<any> implements OnDestroy {

//   _options: QueryList<Option>;
//   _overlay: ActionSheet | Alert | Popover;
//   _texts: string[] = [];
//   _text: string = '';


//   @HostListener('click', ['$event'])
//   _click(ev: UIEvent) {
//     if (ev.detail === 0) {
//       // do not continue if the click event came from a form submit
//       return;
//     }
//     ev.preventDefault();
//     ev.stopPropagation();
//     this.open(ev);
//   }

//   @HostListener('keyup.space')
//   _keyup() {
//     this.open();
//   }

//   /**
//    * @hidden
//    */
//   getValues(): any[] {
//     const values = Array.isArray(this._value) ? this._value : [this._value];
//     assert(this._multi || values.length <= 1, 'single only can have one value');
//     return values;
//   }

//   /**
//    * Open the select interface.
//    */
//   open(ev?: UIEvent) {
//     if (this.isFocus() || this._disabled) {
//       return;
//     }

//     console.debug('select, open alert');

//     // the user may have assigned some options specifically for the alert
//     const selectOptions = deepCopy(this.selectOptions);

//     // make sure their buttons array is removed from the options
//     // and we create a new array for the alert's two buttons
//     selectOptions.buttons = [{
//       text: this.cancelText,
//       role: 'cancel',
//       handler: () => {
//         this.ionCancel.emit(this);
//       }
//     }];

//     // if the selectOptions didn't provide a title then use the label's text
//     if (!selectOptions.title && this._item) {
//       selectOptions.title = this._item.getLabelText();
//     }

//     let options = this._options.toArray();
//     if (this.interface === 'action-sheet' && options.length > 6) {
//       console.warn('Interface cannot be "action-sheet" with more than 6 options. Using the "alert" interface.');
//       this.interface = 'alert';
//     }

//     if ((this.interface === 'action-sheet' || this.interface === 'popover') && this._multi) {
//       console.warn('Interface cannot be "' + this.interface + '" with a multi-value select. Using the "alert" interface.');
//       this.interface = 'alert';
//     }

//     if (this.interface === 'popover' && !ev) {
//       console.warn('Interface cannot be "popover" without UIEvent.');
//       this.interface = 'alert';
//     }

//     let overlay: ActionSheet | Alert | Popover;

//     if (this.interface === 'action-sheet') {
//       selectOptions.buttons = selectOptions.buttons.concat(options.map(input => {
//         return {
//           role: (input.selected ? 'selected' : ''),
//           text: input.text,
//           handler: () => {
//             this.value = input.value;
//             input.ionSelect.emit(input.value);
//           }
//         };
//       }));
//       var selectCssClass = 'select-action-sheet';

//       // If the user passed a cssClass for the select, add it
//       selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';

//       selectOptions.cssClass = selectCssClass;
//       overlay = new ActionSheet(this._app, selectOptions, this.config);

//     } else if (this.interface === 'popover') {
//       let popoverOptions: SelectPopoverOption[] = options.map(input => ({
//         text: input.text,
//         checked: input.selected,
//         disabled: input.disabled,
//         value: input.value,
//         handler: () => {
//           this.value = input.value;
//           input.ionSelect.emit(input.value);
//         }
//       }));

//       var popoverCssClass = 'select-popover';

//       // If the user passed a cssClass for the select, add it
//       popoverCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';

//       overlay = new Popover(this._app, SelectPopover, {
//         options: popoverOptions
//       }, {
//         cssClass: popoverCssClass
//       }, this.config, this.deepLinker);

//       // ev.target is readonly.
//       // place popover regarding to ion-select instead of .button-inner
//       Object.defineProperty(ev, 'target', { value: ev.currentTarget });
//       selectOptions.ev = ev;

//     } else {
//       // default to use the alert interface
//       this.interface = 'alert';

//       // user cannot provide inputs from selectOptions
//       // alert inputs must be created by ionic from ion-options
//       selectOptions.inputs = this._options.map(input => {
//         return {
//           type: (this._multi ? 'checkbox' : 'radio'),
//           label: input.text,
//           value: input.value,
//           checked: input.selected,
//           disabled: input.disabled,
//           handler: (selectedOption: any) => {
//             // Only emit the select event if it is being checked
//             // For multi selects this won't emit when unchecking
//             if (selectedOption.checked) {
//               input.ionSelect.emit(input.value);
//             }
//           }
//         };
//       });

//       var selectCssClass = 'select-alert';

//       // create the alert instance from our built up selectOptions
//       overlay = new Alert(this._app, selectOptions, this.config);

//       if (this._multi) {
//         // use checkboxes
//         selectCssClass += ' multiple-select-alert';
//       } else {
//         // use radio buttons
//         selectCssClass += ' single-select-alert';
//       }

//       // If the user passed a cssClass for the select, add it
//       selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';
//       overlay.setCssClass(selectCssClass);

//       overlay.addButton({
//         text: this.okText,
//         handler: (selectedValues) => this.value = selectedValues
//       });

//     }

//     overlay.present(selectOptions);

//     this._fireFocus();

//     overlay.onDidDismiss(() => {
//       this._fireBlur();
//       this._overlay = undefined;
//     });

//     this._overlay = overlay;
//   }

//   /**
//    * Close the select interface.
//    */
//   close(): Promise<any> {
//     if (!this._overlay || !this.isFocus()) {
//       return;
//     }

//     return this._overlay.dismiss();
//   }


//   /**
//    * @hidden
//    */
//   get text() {
//     return (this._multi ? this._texts : this._texts.join());
//   }


//   /**
//    * @private
//    */
//   @ContentChildren(Option)
//   set options(val: QueryList<Option>) {
//     this._options = val;
//     const values = this.getValues();
//     if (values.length === 0) {
//       // there are no values set at this point
//       // so check to see who should be selected
//       // we use writeValue() because we don't want to update ngModel
//       this.writeValue(val.filter(o => o.selected).map(o => o.value));
//     } else {
//       this._inputUpdated();
//     }
//   }

//   _inputShouldChange(val: string[]|string): boolean {
//     return !deepEqual(this._value, val);
//   }

//   /**
//    * TODO: REMOVE THIS
//    * @hidden
//    */
//   _inputChangeEvent(): any {
//     return this.value;
//   }

//   /**
//    * @hidden
//    */
//   _inputUpdated() {
//     this._texts.length = 0;

//     if (this._options) {
//       this._options.forEach(option => {
//         // check this option if the option's value is in the values array
//         option.selected = this.getValues().some(selectValue => {
//           return isCheckedProperty(selectValue, option.value);
//         });

//         if (option.selected) {
//           this._texts.push(option.text);
//         }
//       });
//     }

//     this._text = this._texts.join(', ');
//   }

// }
