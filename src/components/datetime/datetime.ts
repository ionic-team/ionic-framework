import { AfterContentInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Config } from '../../config/config';
import { Picker } from '../picker/picker';
import { PickerController } from '../picker/picker-controller';
import { PickerColumn } from '../picker/picker-options';
import { Form } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { assert, clamp, isArray, isBlank, isObject, isPresent, isString } from '../../util/util';
import {
  DateTimeData,
  LocaleData,
  compareDates,
  convertDataToISO,
  convertFormatToKey,
  dateDataSortValue,
  dateSortValue,
  dateValueRange,
  daysInMonth,
  getValueFromFormat,
  parseDate,
  parseTemplate,
  renderDateTime,
  renderTextFormat,
  updateDate,
} from '../../util/datetime-util';

/**
 * @name DateTime
 * @description
 * The DateTime component is used to present an interface which makes it easy for
 * users to select dates and times. Tapping on `<ion-datetime>` will display a picker
 * interface that slides up from the bottom of the page. The picker then displays
 * scrollable columns that can be used to individually select years, months, days,
 * hours and minute values. The DateTime component is similar to the native
 * `<input type="datetime-local">` element, however, Ionic's DateTime component makes
 * it easy to display the date and time in a preferred format, and manage the datetime
 * values.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Date</ion-label>
 *   <ion-datetime displayFormat="MM/DD/YYYY" [(ngModel)]="myDate"></ion-datetime>
 * </ion-item>
 * ```
 *
 *
 * ## Display and Picker Formats
 *
 * The DateTime component displays the values in two places: in the `<ion-datetime>`
 * component, and in the interface that is presented from the bottom of the screen.
 * The following chart lists all of the formats that can be used.
 *
 * | Format  | Description                    | Example                 |
 * |---------|--------------------------------|-------------------------|
 * | `YYYY`  | Year, 4 digits                 | `2018`                  |
 * | `YY`    | Year, 2 digits                 | `18`                    |
 * | `M`     | Month                          | `1` ... `12`            |
 * | `MM`    | Month, leading zero            | `01` ... `12`           |
 * | `MMM`   | Month, short name              | `Jan`                   |
 * | `MMMM`  | Month, full name               | `January`               |
 * | `D`     | Day                            | `1` ... `31`            |
 * | `DD`    | Day, leading zero              | `01` ... `31`           |
 * | `DDD`   | Day, short name                | `Fri`                   |
 * | `DDDD`  | Day, full name                 | `Friday`                |
 * | `H`     | Hour, 24-hour                  | `0` ... `23`            |
 * | `HH`    | Hour, 24-hour, leading zero    | `00` ... `23`           |
 * | `h`     | Hour, 12-hour                  | `1` ... `12`            |
 * | `hh`    | Hour, 12-hour, leading zero    | `01` ... `12`           |
 * | `a`     | 12-hour time period, lowercase | `am` `pm`               |
 * | `A`     | 12-hour time period, uppercase | `AM` `PM`               |
 * | `m`     | Minute                         | `1` ... `59`            |
 * | `mm`    | Minute, leading zero           | `01` ... `59`           |
 * | `s`     | Second                         | `1` ... `59`            |
 * | `ss`    | Second, leading zero           | `01` ... `59`           |
 * | `Z`     | UTC Timezone Offset            | `Z or +HH:mm or -HH:mm` |
 *
 * **Important**: See the [Month Names and Day of the Week Names](#month-names-and-day-of-the-week-names)
 * section below on how to use different names for the month and day.
 *
 * ### Display Format
 *
 * The `displayFormat` input property specifies how a datetime's value should be
 * printed, as formatted text, within the `ion-datetime` component.
 *
 * In the following example, the display in the `<ion-datetime>` will use the
 * month's short name, the numerical day with a leading zero, a comma and the
 * four-digit year. In addition to the date, it will display the time with the hours
 * in the 24-hour format and the minutes. Any character can be used as a separator.
 * An example display using this format is: `Jun 17, 2005 11:06`.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Date</ion-label>
 *   <ion-datetime displayFormat="MMM DD, YYYY HH:mm" [(ngModel)]="myDate"></ion-datetime>
 * </ion-item>
 * ```
 *
 * ### Picker Format
 *
 * The `pickerFormat` input property determines which columns should be shown in the
 * interface, the order of the columns, and which format to use within each column.
 * If the `pickerFormat` input is not provided then it will default to the `displayFormat`.
 *
 * In the following example, the display in the `<ion-datetime>` will use the
 * `MM/YYYY` format, such as `06/2020`. However, the picker interface
 * will display two columns with the month's long name, and the four-digit year.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Date</ion-label>
 *   <ion-datetime displayFormat="MM/YYYY" pickerFormat="MMMM YYYY" [(ngModel)]="myDate"></ion-datetime>
 * </ion-item>
 * ```
 *
 * ### Datetime Data
 *
 * Historically, handling datetime values within JavaScript, or even within HTML
 * inputs, has always been a challenge. Specifically, JavaScript's `Date` object is
 * notoriously difficult to correctly parse apart datetime strings or to format
 * datetime values. Even worse is how different browsers and JavaScript versions
 * parse various datetime strings differently, especially per locale.
 *
 * But no worries, all is not lost! Ionic's datetime input has been designed so
 * developers can avoid the common pitfalls, allowing developers to easily format
 * datetime values within the input, and give the user a simple datetime picker for a
 * great user experience.
 *
 * ##### ISO 8601 Datetime Format: YYYY-MM-DDTHH:mmZ
 *
 * Ionic uses the [ISO 8601 datetime format](https://www.w3.org/TR/NOTE-datetime)
 * for its value. The value is simply a string, rather than using JavaScript's `Date`
 * object. Additionally, when using the ISO datetime format, it makes it easier
 * to serialize and pass within JSON objects, and sending databases a standardized
 * format which it can be easily parsed if need be.
 *
 * To create an ISO datetime string for the current date and time, e.g. use `const currentDate = (new Date()).toISOString();`.
 *
 * An ISO format can be used as a simple year, or just the hour and minute, or get more
 * detailed down to the millisecond and timezone. Any of the ISO formats below can be used,
 * and after a user selects a new value, Ionic will continue to use the same ISO format
 * which datetime value was originally given as.
 *
 * | Description          | Format                 | Datetime Value Example       |
 * |----------------------|------------------------|------------------------------|
 * | Year                 | YYYY                   | 1994                         |
 * | Year and Month       | YYYY-MM                | 1994-12                      |
 * | Complete Date        | YYYY-MM-DD             | 1994-12-15                   |
 * | Date and Time        | YYYY-MM-DDTHH:mm       | 1994-12-15T13:47             |
 * | UTC Timezone         | YYYY-MM-DDTHH:mm:ssTZD | 1994-12-15T13:47:20.789Z     |
 * | Timezone Offset      | YYYY-MM-DDTHH:mm:ssTZD | 1994-12-15T13:47:20.789+5:00 |
 * | Hour and Minute      | HH:mm                  | 13:47                        |
 * | Hour, Minute, Second | HH:mm:ss               | 13:47:20                     |
 *
 * Note that the year is always four-digits, milliseconds (if it's added) is always
 * three-digits, and all others are always two-digits. So the number representing
 * January always has a leading zero, such as `01`. Additionally, the hour is always
 * in the 24-hour format, so `00` is `12am` on a 12-hour clock, `13` means `1pm`,
 * and `23` means `11pm`.
 *
 * It's also important to note that neither the `displayFormat` or `pickerFormat` can
 * set the datetime value's output, which is the value that is set by the component's
 * `ngModel`. The format's are merely for displaying the value as text and the picker's
 * interface, but the datetime's value is always persisted as a valid ISO 8601 datetime
 * string.
 *
 *
 * ## Min and Max Datetimes
 *
 * Dates are infinite in either direction, so for a user's selection there should be at
 * least some form of restricting the dates that can be selected. By default, the maximum
 * date is to the end of the current year, and the minimum date is from the beginning
 * of the year that was 100 years ago.
 *
 * To customize the minimum and maximum datetime values, the `min` and `max` component
 * inputs can be provided which may make more sense for the app's use-case, rather
 * than the default of the last 100 years. Following the same IS0 8601 format listed
 * in the table above, each component can restrict which dates can be selected by the
 * user. Below is an example of restricting the date selection between the beginning
 * of 2016, and October 31st of 2020:
 *
 * ```html
 * <ion-item>
 *   <ion-label>Date</ion-label>
 *   <ion-datetime displayFormat="MMMM YYYY" min="2016" max="2020-10-31" [(ngModel)]="myDate">
 *   </ion-datetime>
 * </ion-item>
 * ```
 *
 *
 * ## Month Names and Day of the Week Names
 *
 * At this time, there is no one-size-fits-all standard to automatically choose the correct
 * language/spelling for a month name, or day of the week name, depending on the language
 * or locale. Good news is that there is an
 * [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)
 * standard which *most* browsers have adopted. However, at this time the standard has not
 * been fully implemented by all popular browsers so Ionic is unavailable to take advantage
 * of it *yet*. Additionally, Angular also provides an internationalization service, but it
 * is still under heavy development so Ionic does not depend on it at this time.
 *
 * All things considered, the by far easiest solution is to just provide an array of names
 * if the app needs to use names other than the default English version of month and day
 * names. The month names and day names can be either configured at the app level, or
 * individual `ion-datetime` level.
 *
 * ### App Config Level
 *
 * ```ts
 * //app.module.ts
 * @NgModule({
 * ...,
 * imports: [
 *   IonicModule.forRoot(MyApp, {
 *   monthNames: ['janeiro', 'fevereiro', 'mar\u00e7o', ... ],
 *   monthShortNames: ['jan', 'fev', 'mar', ... ],
 *   dayNames: ['domingo', 'segunda-feira', 'ter\u00e7a-feira', ... ],
 *   dayShortNames: ['dom', 'seg', 'ter', ... ],
 * })
 * ],
 * ...
 * })
 * ```
 *
 * ### Component Input Level
 *
 * ```html
 * <ion-item>
 *   <ion-label>Período</ion-label>
 *   <ion-datetime displayFormat="DDDD MMM D, YYYY" [(ngModel)]="myDate"
 *     monthNames="janeiro, fevereiro, mar\u00e7o, ..."
 *     monthShortNames="jan, fev, mar, ..."
 *     dayNames="domingo, segunda-feira, ter\u00e7a-feira, ..."
 *     dayShortNames="dom, seg, ter, ..."></ion-datetime>
 * </ion-item>
 * ```
 *
 *
 * ### Advanced Datetime Validation and Manipulation
 *
 * The datetime picker provides the simplicity of selecting an exact format, and persists
 * the datetime values as a string using the standardized
 * [ISO 8601 datetime format](https://www.w3.org/TR/NOTE-datetime).
 * However, it's important to note that `ion-datetime` does not attempt to solve all
 * situtations when validating and manipulating datetime values. If datetime values need
 * to be parsed from a certain format, or manipulated (such as adding 5 days to a date,
 * subtracting 30 minutes, etc.), or even formatting data to a specific locale, then we highly
 * recommend using [moment.js](http://momentjs.com/) to "Parse, validate, manipulate, and
 * display dates in JavaScript". [Moment.js](http://momentjs.com/) has quickly become
 * our goto standard when dealing with datetimes within JavaScript, but Ionic does not
 * prepackage this dependency since most apps will not require it, and its locale
 * configuration should be decided by the end-developer.
 *
 *
 * @usage
 * ```html
 * <ion-item>
 *   <ion-label>Date</ion-label>
 *   <ion-datetime displayFormat="MM/DD/YYYY" [(ngModel)]="myDate">
 *   </ion-datetime>
 * </ion-item>
 * ```
 *
 *
 * @demo /docs/demos/src/datetime/
 */
@Component({
  selector: 'ion-datetime',
  template:
    '<div *ngIf="!_text" class="datetime-text datetime-placeholder">{{placeholder}}</div>' +
    '<div *ngIf="_text" class="datetime-text">{{_text}}</div>' +
    '<button aria-haspopup="true" ' +
            'type="button" ' +
            '[id]="id" ' +
            'ion-button="item-cover" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
    '</button>',
  host: {
    '[class.datetime-disabled]': '_disabled'
  },
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: DateTime, multi: true } ],
  encapsulation: ViewEncapsulation.None,
})
export class DateTime extends BaseInput<DateTimeData> implements AfterContentInit, ControlValueAccessor, OnDestroy {

  _text: string = '';
  _min: DateTimeData;
  _max: DateTimeData;
  _locale: LocaleData = {};
  _picker: Picker;

  /**
   * @input {string} The minimum datetime allowed. Value must be a date string
   * following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * such as `1996-12-19`. The format does not have to be specific to an exact
   * datetime. For example, the minimum could just be the year, such as `1994`.
   * Defaults to the beginning of the year, 100 years ago from today.
   */
  @Input() min: string;

  /**
   * @input {string} The maximum datetime allowed. Value must be a date string
   * following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * `1996-12-19`. The format does not have to be specific to an exact
   * datetime. For example, the maximum could just be the year, such as `1994`.
   * Defaults to the end of this year.
   */
  @Input() max: string;

  /**
   * @input {string} The display format of the date and time as text that shows
   * within the item. When the `pickerFormat` input is not used, then the
   * `displayFormat` is used for both display the formatted text, and determining
   * the datetime picker's columns. See the `pickerFormat` input description for
   * more info. Defaults to `MMM D, YYYY`.
   */
  @Input() displayFormat: string;

  /**
   * @input {string} The default datetime selected in picker modal if field value is empty.
   * Value must be a date string following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * `1996-12-19`.
   */
  @Input() initialValue: string;

  /**
   * @input {string} The format of the date and time picker columns the user selects.
   * A datetime input can have one or many datetime parts, each getting their
   * own column which allow individual selection of that particular datetime part. For
   * example, year and month columns are two individually selectable columns which help
   * choose an exact date from the datetime picker. Each column follows the string
   * parse format. Defaults to use `displayFormat`.
   */
  @Input() pickerFormat: string;

  /**
   * @input {string} The text to display on the picker's cancel button. Default: `Cancel`.
   */
  @Input() cancelText: string = 'Cancel';

  /**
   * @input {string} The text to display on the picker's "Done" button. Default: `Done`.
   */
  @Input() doneText: string = 'Done';

  /**
   * @input {array | string} Values used to create the list of selectable years. By default
   * the year values range between the `min` and `max` datetime inputs. However, to
   * control exactly which years to display, the `yearValues` input can take either an array
   * of numbers, or string of comma separated numbers. For example, to show upcoming and
   * recent leap years, then this input's value would be `yearValues="2024,2020,2016,2012,2008"`.
   */
  @Input() yearValues: any;

  /**
   * @input {array | string} Values used to create the list of selectable months. By default
   * the month values range from `1` to `12`. However, to control exactly which months to
   * display, the `monthValues` input can take either an array of numbers, or string of
   * comma separated numbers. For example, if only summer months should be shown, then this
   * input value would be `monthValues="6,7,8"`. Note that month numbers do *not* have a
   * zero-based index, meaning January's value is `1`, and December's is `12`.
   */
  @Input() monthValues: any;

  /**
   * @input {array | string} Values used to create the list of selectable days. By default
   * every day is shown for the given month. However, to control exactly which days of
   * the month to display, the `dayValues` input can take either an array of numbers, or
   * string of comma separated numbers. Note that even if the array days have an invalid
   * number for the selected month, like `31` in February, it will correctly not show
   * days which are not valid for the selected month.
   */
  @Input() dayValues: any;

  /**
   * @input {array | string} Values used to create the list of selectable hours. By default
   * the hour values range from `0` to `23` for 24-hour, or `1` to `12` for 12-hour. However,
   * to control exactly which hours to display, the `hourValues` input can take either an
   * array of numbers, or string of comma separated numbers.
   */
  @Input() hourValues: any;

  /**
   * @input {array | string} Values used to create the list of selectable minutes. By default
   * the mintues range from `0` to `59`. However, to control exactly which minutes to display,
   * the `minuteValues` input can take either an array of numbers, or string of comma separated
   * numbers. For example, if the minute selections should only be every 15 minutes, then
   * this input value would be `minuteValues="0,15,30,45"`.
   */
  @Input() minuteValues: any;

  /**
   * @input {array} Full names for each month name. This can be used to provide
   * locale month names. Defaults to English.
   */
  @Input() monthNames: any;

  /**
   * @input {array} Short abbreviated names for each month name. This can be used to provide
   * locale month names. Defaults to English.
   */
  @Input() monthShortNames: any;

  /**
   * @input {array} Full day of the week names. This can be used to provide
   * locale names for each day in the week. Defaults to English.
   */
  @Input() dayNames: any;

  /**
   * @input {array} Short abbreviated day of the week names. This can be used to provide
   * locale names for each day in the week. Defaults to English.
   */
  @Input() dayShortNames: any;

  /**
   * @input {any} Any additional options that the picker interface can accept.
   * See the [Picker API docs](../../picker/Picker) for the picker options.
   */
  @Input() pickerOptions: any = {};

  /**
   * @input {string} The text to display when there's no date selected yet.
   * Using lowercase to match the input attribute
   */
  @Input() placeholder: string = '';

  /**
   * @output {any} Emitted when the datetime selection was cancelled.
   */
  @Output() ionCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    form: Form,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() item: Item,
    @Optional() private _pickerCtrl: PickerController
  ) {
    super(config, elementRef, renderer, 'datetime', {}, form, item, null);
  }

  /**
   * @hidden
   */
  ngAfterContentInit() {
    // first see if locale names were provided in the inputs
    // then check to see if they're in the config
    // if neither were provided then it will use default English names
    ['monthNames', 'monthShortNames', 'dayNames', 'dayShortNames'].forEach(type => {
      (<any>this)._locale[type] = convertToArrayOfStrings(isPresent((<any>this)[type]) ? (<any>this)[type] : this._config.get(type), type);
    });

    this._initialize();
  }

  /**
   * @hidden
   */
  _inputNormalize(val: any): DateTimeData {
    updateDate(this._value, val);
    return this._value;
  }

  /**
   * @hidden
   */
  _inputUpdated() {
    super._inputUpdated();
    this.updateText();
  }

  /**
   * @hidden
   */
  _inputShouldChange(): boolean {
    return true;
  }

  /**
   * TODO: REMOVE THIS
   * @hidden
   */
  _inputChangeEvent(): any {
    return this.value;
  }

  /**
   * @hidden
   */
  _inputNgModelEvent(): any {
    return convertDataToISO(this.value);
  }

  @HostListener('click', ['$event'])
  _click(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.open();
  }

  @HostListener('keyup.space')
  _keyup() {
    this.open();
  }

  /**
   * @hidden
   */
  open() {
    if (this.isFocus() || this._disabled) {
      return;
    }

    console.debug('datetime, open picker');

    // the user may have assigned some options specifically for the picker
    const pickerOptions = {...this.pickerOptions};

    // Add a cancel and done button by default to the picker
    const defaultButtons = [{
      text: this.cancelText,
      role: 'cancel',
      handler: () => this.ionCancel.emit(this)
    }, {
      text: this.doneText,
      handler: (data: any) => this.value = data,
    }];

    pickerOptions.buttons = (pickerOptions.buttons || []).concat(defaultButtons);

    // Configure picker under the hood
    const picker = this._picker = this._pickerCtrl.create(pickerOptions);

    picker.ionChange.subscribe(() => {
      this.validate();
      picker.refresh();
    });

    // Update picker status before presenting
    this.generate();
    this.validate();

    // Present picker
    this._fireFocus();
    picker.present(pickerOptions);
    picker.onDidDismiss(() => {
      this._fireBlur();
    });
  }

  /**
   * @hidden
   */
  generate() {
    const picker = this._picker;
    // if a picker format wasn't provided, then fallback
    // to use the display format
    let template = this.pickerFormat || this.displayFormat || DEFAULT_FORMAT;

    if (isPresent(template)) {
      // make sure we've got up to date sizing information
      this.calcMinMax();

      // does not support selecting by day name
      // automaticallly remove any day name formats
      template = template.replace('DDDD', '{~}').replace('DDD', '{~}');
      if (template.indexOf('D') === -1) {
        // there is not a day in the template
        // replace the day name with a numeric one if it exists
        template = template.replace('{~}', 'D');
      }
      // make sure no day name replacer is left in the string
      template = template.replace(/{~}/g, '');

      // parse apart the given template into an array of "formats"
      parseTemplate(template).forEach(format => {
        // loop through each format in the template
        // create a new picker column to build up with data
        let key = convertFormatToKey(format);
        let values: any[];

        // first see if they have exact values to use for this input
        if (isPresent((<any>this)[key + 'Values'])) {
          // user provide exact values for this date part
          values = convertToArrayOfNumbers((<any>this)[key + 'Values'], key);

        } else {
          // use the default date part values
          values = dateValueRange(format, this._min, this._max);
        }

        const column: PickerColumn = {
          name: key,
          selectedIndex: 0,
          options: values.map(val => {
            return {
              value: val,
              text: renderTextFormat(format, val, null, this._locale),
            };
          })
        };

        // cool, we've loaded up the columns with options
        // preselect the option for this column
        const optValue = getValueFromFormat(this.getValueOrDefault(), format);
        const selectedIndex = column.options.findIndex(opt => opt.value === optValue);
        if (selectedIndex >= 0) {
          // set the select index for this column's options
          column.selectedIndex = selectedIndex;
        }

        // add our newly created column to the picker
        picker.addColumn(column);
      });


      // Normalize min/max
      const min = <any>this._min;
      const max = <any>this._max;
      const columns = this._picker.getColumns();
      ['month', 'day', 'hour', 'minute']
        .filter(name => !columns.find(column => column.name === name))
        .forEach(name => {
          min[name] = 0;
          max[name] = 0;
        });

      this.divyColumns();
    }
  }

  /**
   * @hidden
   */
  validateColumn(name: string, index: number, min: number, max: number, lowerBounds: number[], upperBounds: number[]): number {
    assert(lowerBounds.length === 5, 'lowerBounds length must be 5');
    assert(upperBounds.length === 5, 'upperBounds length must be 5');

    const column = this._picker.getColumn(name);
    if (!column) {
      return 0;
    }

    const lb = lowerBounds.slice();
    const ub = upperBounds.slice();
    const options = column.options;
    let indexMin = options.length - 1;
    let indexMax = 0;

    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var value = opt.value;
      lb[index] = opt.value;
      ub[index] = opt.value;

      var disabled = opt.disabled = (
        value < lowerBounds[index] ||
        value > upperBounds[index] ||
        dateSortValue(ub[0], ub[1], ub[2], ub[3], ub[4]) < min ||
        dateSortValue(lb[0], lb[1], lb[2], lb[3], lb[4]) > max
      );
      if (!disabled) {
        indexMin = Math.min(indexMin, i);
        indexMax = Math.max(indexMax, i);
      }
    }
    let selectedIndex = column.selectedIndex = clamp(indexMin, column.selectedIndex, indexMax);
    opt = column.options[selectedIndex];
    if (opt) {
      return opt.value;
    }
    return 0;
  }

  /**
   * @private
   */
  validate() {
    const today = new Date();
    const minCompareVal = dateDataSortValue(this._min);
    const maxCompareVal = dateDataSortValue(this._max);
    const yearCol = this._picker.getColumn('year');

    assert(minCompareVal <= maxCompareVal, 'invalid min/max value');

    let selectedYear: number = today.getFullYear();
    if (yearCol) {
      // default to the first value if the current year doesn't exist in the options
      if (!yearCol.options.find(col => col.value === today.getFullYear())) {
        selectedYear = yearCol.options[0].value;
      }

      var yearOpt = yearCol.options[yearCol.selectedIndex];
      if (yearOpt) {
        // they have a selected year value
        selectedYear = yearOpt.value;
      }
    }

    const selectedMonth = this.validateColumn(
      'month', 1,
      minCompareVal, maxCompareVal,
      [selectedYear, 0, 0, 0, 0],
      [selectedYear, 12, 31, 23, 59]
    );

    const numDaysInMonth = daysInMonth(selectedMonth, selectedYear);
    const selectedDay = this.validateColumn(
      'day', 2,
      minCompareVal, maxCompareVal,
      [selectedYear, selectedMonth, 0, 0, 0],
      [selectedYear, selectedMonth, numDaysInMonth, 23, 59]
    );

    const selectedHour = this.validateColumn(
      'hour', 3,
      minCompareVal, maxCompareVal,
      [selectedYear, selectedMonth, selectedDay, 0, 0],
      [selectedYear, selectedMonth, selectedDay, 23, 59]
    );

    this.validateColumn(
      'minute', 4,
      minCompareVal, maxCompareVal,
      [selectedYear, selectedMonth, selectedDay, selectedHour, 0],
      [selectedYear, selectedMonth, selectedDay, selectedHour, 59]
    );
  }

  /**
   * @hidden
   */
  divyColumns() {
    const pickerColumns = this._picker.getColumns();
    let columnsWidth: number[] = [];
    let col: PickerColumn;
    let width: number;
    for (var i = 0; i < pickerColumns.length; i++) {
      col = pickerColumns[i];
      columnsWidth.push(0);

      for (var j = 0; j < col.options.length; j++) {
        width = col.options[j].text.length;
        if (width > columnsWidth[i]) {
          columnsWidth[i] = width;
        }
      }
    }

    if (columnsWidth.length === 2) {
      width = Math.max(columnsWidth[0], columnsWidth[1]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].align = 'left';
      pickerColumns[0].optionsWidth = pickerColumns[1].optionsWidth = `${width * 17}px`;

    } else if (columnsWidth.length === 3) {
      width = Math.max(columnsWidth[0], columnsWidth[2]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].columnWidth = `${columnsWidth[1] * 17}px`;
      pickerColumns[0].optionsWidth = pickerColumns[2].optionsWidth = `${width * 17}px`;
      pickerColumns[2].align = 'left';
    }
  }

  /**
   * @hidden
   */
  updateText() {
    // create the text of the formatted data
    const template = this.displayFormat || this.pickerFormat || DEFAULT_FORMAT;
    this._text = renderDateTime(template, this.getValue(), this._locale);
  }

  /**
   * @hidden
   */
  getValue(): DateTimeData {
    return this._value;
  }

  /**
   * @hidden
   */
  getValueOrDefault(): DateTimeData {
    if (this.hasValue()) {
      return this._value;
    }

    const initialDateString = this.getDefaultValueDateString();
    const _default = {};
    updateDate(_default, initialDateString);
    return _default;
  }

  /**
   * Get the default value as a date string
   * @hidden
   */
  getDefaultValueDateString() {
    if (this.initialValue) {
      return this.initialValue;
    }

    const nowString = (new Date).toISOString();
    if (this.max) {
      const now = parseDate(nowString);
      const max = parseDate(this.max);

      let v;
      for (let i in max) {
        v = (<any>max)[i];
        if (v === null) {
          (<any>max)[i] = (<any>now)[i];
        }
      }

      const diff = compareDates(now, max);
      // If max is before current time, return max
      if (diff > 0) {
        return this.max;
      }
    }
    return nowString;
  }

  /**
   * @hidden
   */
  hasValue(): boolean {
    const val = this._value;
    return isPresent(val)
      && isObject(val)
      && Object.keys(val).length > 0;
  }

  /**
   * @hidden
   */
  calcMinMax(now?: Date) {
    const todaysYear = (now || new Date()).getFullYear();
    if (isPresent(this.yearValues)) {
      var years = convertToArrayOfNumbers(this.yearValues, 'year');
      if (isBlank(this.min)) {
        this.min = Math.min.apply(Math, years);
      }
      if (isBlank(this.max)) {
        this.max = Math.max.apply(Math, years);
      }
    } else {
      if (isBlank(this.min)) {
        this.min = (todaysYear - 100).toString();
      }
      if (isBlank(this.max)) {
        this.max = todaysYear.toString();
      }
    }
    const min = this._min = parseDate(this.min);
    const max = this._max = parseDate(this.max);

    min.year = min.year || todaysYear;
    max.year = max.year || todaysYear;

    min.month = min.month || 1;
    max.month = max.month || 12;
    min.day = min.day || 1;
    max.day = max.day || 31;
    min.hour = min.hour || 0;
    max.hour = max.hour || 23;
    min.minute = min.minute || 0;
    max.minute = max.minute || 59;
    min.second = min.second || 0;
    max.second = max.second || 59;

    // Ensure min/max constraits
    if (min.year > max.year) {
      console.error('min.year > max.year');
      min.year = max.year - 100;
    }
    if (min.year === max.year) {
      if (min.month > max.month) {
        console.error('min.month > max.month');
        min.month = 1;
      } else if (min.month === max.month && min.day > max.day) {
        console.error('min.day > max.day');
        min.day = 1;
      }
    }
  }
}

/**
 * @hidden
 * Use to convert a string of comma separated numbers or
 * an array of numbers, and clean up any user input
 */
function convertToArrayOfNumbers(input: any, type: string): number[] {
  if (isString(input)) {
    // convert the string to an array of strings
    // auto remove any whitespace and [] characters
    input = input.replace(/\[|\]|\s/g, '').split(',');
  }

  let values: number[];
  if (isArray(input)) {
    // ensure each value is an actual number in the returned array
    values = input
      .map((num: any) => parseInt(num, 10))
      .filter(isFinite);
  }

  if (!values || !values.length) {
    console.warn(`Invalid "${type}Values". Must be an array of numbers, or a comma separated string of numbers.`);
  }

  return values;
}

/**
 * @hidden
 * Use to convert a string of comma separated strings or
 * an array of strings, and clean up any user input
 */
function convertToArrayOfStrings(input: any, type: string): string[] {
  if (isPresent(input)) {
    if (isString(input)) {
      // convert the string to an array of strings
      // auto remove any [] characters
      input = input.replace(/\[|\]/g, '').split(',');
    }

    var values: string[];
    if (isArray(input)) {
      // trim up each string value
      values = input.map((val: string) => val.trim());
    }

    if (!values || !values.length) {
      console.warn(`Invalid "${type}Names". Must be an array of strings, or a comma separated string.`);
    }

    return values;
  }
}


const DEFAULT_FORMAT = 'MMM D, YYYY';
