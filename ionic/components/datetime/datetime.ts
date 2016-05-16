import {Component, Optional, ElementRef, Renderer, Input, Output, Provider, forwardRef, EventEmitter, HostListener, ViewEncapsulation} from 'angular2/core';
import {NG_VALUE_ACCESSOR} from 'angular2/common';

import {Config} from '../../config/config';
import {Picker, PickerColumn, PickerColumnOption} from '../picker/picker';
import {Form} from '../../util/form';
import {Item} from '../item/item';
import {merge, isBlank, isPresent, isTrueProperty, isArray, isString} from '../../util/util';
import {dateValueRange, renderDateTime, renderTextFormat, convertFormatToKey, getValueFromFormat, parseTemplate, parseDate, updateDate, DateTimeData, convertDataToISO, daysInMonth, dateSortValue, dateDataSortValue, LocaleData} from '../../util/datetime-util';
import {NavController} from '../nav/nav-controller';

const DATETIME_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => DateTime), multi: true});


/**
 * @name DateTime
 * @description
 * The Date/Time Picker displays a dialog from the bottom of a page.
 *
 *
 * It is similar to the native `<input type="datetime-local">` element.
 * However, Ionic's Date/Time component makes it easy for developers to display
 * the date in their preferred format and manage the date from their JavaScript.
 * Additionally, the Date/Time component makes it easier for users to scroll through
 * and individually select parts of date and time values from an easy to user interface.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Date</ion-label>
 *   <ion-datetime displayFormat="MM/DD/YYYY" [(ngModel)]="myDate">
 *   </ion-datetime>
 * </ion-item>
 * ```
 *
 *
 * ### Display and Picker Formats
 *
 * Datetime values can be displayed in many different formats, so it is best to
 * let the app decide exactly how to display it. To do so, `ion-datetime` uses
 * a common format seen in many other libraries and programming languages:
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
 * The `displayFormat` input allows developers to specify how a date's value
 * should be displayed within the `ion-datetime`. The `pickerFormat` decides
 * which datetime picker columns should be shown, the order of the columns, and
 * which format to display the value in. If a `pickerFormat` is not provided
 * then it'll use the `displayFormat` instead. In most cases only providing the
 * `displayFormat` is needed.
 *
 * In the example below, the datetime's display would use the month's short
 * name, the 1 digit day in the month, and a 4 digit year.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Date</ion-label>
 *   <ion-datetime displayFormat="MMM DD, YYYY" [(ngModel)]="myDate">
 *   </ion-datetime>
 * </ion-item>
 * ```
 *
 * In this example, the datetime's display would only show hours and minutes,
 * and the hours would be in the 24-hour format. Note that the divider between
 * the hours and minutes, in this case the `:` character, can be have any
 * character which the app chooses to use as the divider.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Date</ion-label>
 *   <ion-datetime displayFormat="HH:mm" [(ngModel)]="myDate">
 *   </ion-datetime>
 * </ion-item>
 * ```
 *
 *
 * ### Datetime Data
 *
 * Historically, handling datetime data within JavaScript, or even within HTML
 * inputs, has always been a challenge. Specifically, JavaScript's `Date` object is
 * notoriously difficult to correctly parse apart datetime strings or to format
 * datetime values. Even worse is how different browsers and JavaScript versions
 * parse various datetime strings differently, especially per locale. Additional,
 * developers face even more challenges when dealing with timezones using
 * JavaScript's core `Date` object.
 *
 * But no worries, all is not lost! Ionic's datetime input has been designed so
 * developers can avoid the common pitfalls, allowing developers to easily format
 * datetime data within the input, and give the user a simple datetime picker for a
 * great user experience. Oddly enough, one of the best ways to work with datetime
 * values in JavaScript is to not use the `Date` object at all.
 *
 * ##### ISO 8601 Datetime Format: YYYY-MM-DDTHH:mmZ
 *
 * For all the reasons above, and how datetime data is commonly saved within databases,
 * Ionic uses the [ISO 8601 datetime format](https://www.w3.org/TR/NOTE-datetime)
 * for both its input value, and output value. The value is simply a string, rather
 * than using JavaScript's `Date` object, and it strictly follows the standardized
 * ISO 8601 format. Additionally, when using the ISO datetime string format, it makes
 * it easier on developers when passing data within JSON objects, and sending databases
 * a standardized datetime format which it can be easily parse apart and formatted.
 * Because of the strict adherence to the ISO 8601 format, and not involving the hundreds
 * of other format possibilities and locales, this approach actually makes it easier
 * for Ionic apps and backend-services to manage datetime data.
 *
 * An ISO format can be used as a simple year, or just the hour and minute, or get more
 * detailed down to the millisecond and timezone. Any of the ISO formats below can be used,
 * and after a user selects a new date, Ionic will continue to use the same ISO format
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
 * set the datetime value's output, which is the value that sent the the component's
 * `ngModel`. The format's are merely for displaying the value as text and the picker's
 * interface, but the datetime's value is always persisted as a valid ISO 8601 datetime
 * string.
 *
 *
 * ### Min and Max Datetimes
 *
 * Dates are infinite in either direction, so for a user selection there should be at
 * least some form of restricting the dates can be selected. Be default, the maximum
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
 * ### Month Names and Day of the Week Names
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
 * names. The month names and day names can be either configurated at the app level, or
 * individual `ion-datetime` level.
 *
 * ##### App Config Level
 *
 * ```ts
 * @App({
 *   config: {
 *     monthNames: ['janeiro, 'fevereiro', 'mar\u00e7o', ... ],
 *     monthShortNames: ['jan', 'fev', 'mar', ... ],
 *     dayNames: ['domingo', 'segunda-feira', 'ter\u00e7a-feira', ... ],
 *     dayShortNames: ['dom', 'seg', 'ter', ... ],
 *   }
 * })
 * ```
 *
 * ##### Component Input Level
 *
 * ```html
 * <ion-item>
 *   <ion-label>Período</ion-label>
 *   <ion-datetime displayFormat="DDDD MMM D, YYYY" [(ngModel)]="myDate"
 *     [monthNames]="['janeiro, 'fevereiro', 'mar\u00e7o', ... ]"
 *     [monthShortNames]="['jan', 'fev', 'mar', ... ]"
 *     [dayNames]="['domingo', 'segunda-feira', 'ter\u00e7a-feira', ... ]"
 *     [dayShortNames]="['dom', 'seg', 'ter', ... ]"
 *     ></ion-datetime>
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
 * subtracting 30 minutes), or even formatting data to a specific locale, then we highly
 * recommend using [moment.js](http://momentjs.com/) to "Parse, validate, manipulate, and
 * display dates in JavaScript". [Moment.js](http://momentjs.com/) has quickly become
 * our goto standard when dealing with datetimes within JavaScript, but Ionic does not
 * prepackage this dependency since most apps will not require it, and its locale
 * configuration should be decided by the end-developer.
 *
 * @demo /docs/v2/demos/datetime/
 */
@Component({
  selector: 'ion-datetime',
  template:
    '<div class="datetime-text">{{_text}}</div>' +
    '<button aria-haspopup="true" ' +
            'type="button" ' +
            '[id]="id" ' +
            'category="item-cover" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
    '</button>',
  host: {
    '[class.datetime-disabled]': '_disabled'
  },
  providers: [DATETIME_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
})
export class DateTime {
  private _disabled: any = false;
  private _labelId: string;
  private _text: string = '';
  private _fn: Function;
  private _isOpen: boolean = false;
  private _min: DateTimeData;
  private _max: DateTimeData;
  private _value: DateTimeData = {};
  private _locale: LocaleData = {};

  /**
   * @private
   */
  id: string;

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
  @Input() displayFormat: string = 'MMM D, YYYY';

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
   * the hour values range from `1` to `23` for 24-hour, or `1` to `12` for 12-hour. However,
   * to control exactly which hours to display, the `hourValues` input can take either an
   * array of numbers, or string of comma separated numbers.
   */
  @Input() hourValues: any;

  /**
   * @input {array | string} Values used to create the list of selectable minutes. By default
   * the mintues range from `1` to `59`. However, to control exactly which minutes to display,
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
   * @input {any} Any addition options that the picker interface can accept.
   * See the [Picker API docs](../../picker/Picker) for the picker options.
   */
  @Input() pickerOptions: any = {};

  /**
   * @output {any} Any expression to evaluate when the datetime selection has changed.
   */
  @Output() change: EventEmitter<any> = new EventEmitter();

  /**
   * @output {any} Any expression to evaluate when the datetime selection was cancelled.
   */
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private _form: Form,
    private _config: Config,
    @Optional() private _item: Item,
    @Optional() private _nav: NavController
  ) {
    this._form.register(this);
    if (_item) {
      this.id = 'dt-' + _item.registerInput('datetime');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-datetime', true);
    }

    if (!_nav) {
      console.error('parent <ion-nav> required for <ion-datetime>');
    }
  }

  @HostListener('click', ['$event'])
  private _click(ev) {
    if (ev.detail === 0) {
      // do not continue if the click event came from a form submit
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    this.open();
  }

  @HostListener('keyup.space', ['$event'])
  private _keyup(ev) {
    if (!this._isOpen) {
      this.open();
    }
  }

  /**
   * @private
   */
  open() {
    if (this._disabled) {
      return;
    }

    console.debug('datetime, open picker');

    // the user may have assigned some options specifically for the alert
    let pickerOptions = merge({}, this.pickerOptions);

    let picker = Picker.create(pickerOptions);
    pickerOptions.buttons = [
      {
        text: this.cancelText,
        role: 'cancel',
        handler: () => {
          this.cancel.emit(null);
        }
      },
      {
        text: this.doneText,
        handler: (data) => {
          console.log('datetime, done', data);
          this.onChange(data);
          this.change.emit(data);
        }
      }
    ];

    this.generate(picker);
    this.validate(picker);

    picker.change.subscribe(() => {
      this.validate(picker);
    });

    this._nav.present(picker, pickerOptions);

    this._isOpen = true;
    picker.onDismiss(() => {
      this._isOpen = false;
    });
  }

  /**
   * @private
   */
  generate(picker: Picker) {
    // if a picker format wasn't provided, then fallback
    // to use the display format
    let template = this.pickerFormat || this.displayFormat;

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
        if (isPresent(this[key + 'Values'])) {
          // user provide exact values for this date part
          values = convertToArrayOfNumbers(this[key + 'Values'], key);

        } else {
          // use the default date part values
          values = dateValueRange(format, this._min, this._max);
        }

        let column: PickerColumn = {
          name: key,
          options: values.map(val => {
            return {
              value: val,
              text: renderTextFormat(format, val, null, this._locale),
            };
          })
        };

        if (column.options.length) {
          // cool, we've loaded up the columns with options
          // preselect the option for this column
          var selected = column.options.find(opt => opt.value === getValueFromFormat(this._value, format));
          if (selected) {
            // set the select index for this column's options
            column.selectedIndex = column.options.indexOf(selected);
          }

          // add our newly created column to the picker
          picker.addColumn(column);
        }
      });

      this.divyColumns(picker);
    }
  }

  /**
   * @private
   */
  validate(picker: Picker) {
    let i: number;
    let today = new Date();
    let columns = picker.getColumns();

    // find the columns used
    let yearCol = columns.find(col => col.name === 'year');
    let monthCol = columns.find(col => col.name === 'month');
    let dayCol = columns.find(col => col.name === 'day');

    let yearOpt: PickerColumnOption;
    let monthOpt: PickerColumnOption;
    let dayOpt: PickerColumnOption;

    // default to assuming today's year
    let selectedYear = today.getFullYear();
    if (yearCol) {
      yearOpt = yearCol.options[yearCol.selectedIndex];
      if (yearOpt) {
        // they have a selected year value
        selectedYear = yearOpt.value;
      }
    }

    // default to assuming this month has 31 days
    let numDaysInMonth = 31;
    let selectedMonth;
    if (monthCol) {
      monthOpt = monthCol.options[monthCol.selectedIndex];
      if (monthOpt) {
        // they have a selected month value
        selectedMonth = monthOpt.value;

        // calculate how many days are in this month
        numDaysInMonth = daysInMonth(selectedMonth, selectedYear);
      }
    }

    // create sort values for the min/max datetimes
    let minCompareVal = dateDataSortValue(this._min);
    let maxCompareVal = dateDataSortValue(this._max);

    if (monthCol) {
      // enable/disable which months are valid
      // to show within the min/max date range
      for (i = 0; i < monthCol.options.length; i++) {
        monthOpt = monthCol.options[i];

        // loop through each month and see if it
        // is within the min/max date range
        monthOpt.disabled = (dateSortValue(selectedYear, monthOpt.value, 31) < minCompareVal ||
                             dateSortValue(selectedYear, monthOpt.value, 1) > maxCompareVal);
      }
    }

    if (dayCol) {
      if (isPresent(selectedMonth)) {
        // enable/disable which days are valid
        // to show within the min/max date range
        for (i = 0; i < 31; i++) {
          dayOpt = dayCol.options[i];

          // loop through each day and see if it
          // is within the min/max date range
          var compareVal = dateSortValue(selectedYear, selectedMonth, dayOpt.value);

          dayOpt.disabled = (compareVal < minCompareVal ||
                             compareVal > maxCompareVal ||
                             numDaysInMonth <= i);
        }

      } else {
        // enable/disable which numbers of days to show in this month
        for (i = 0; i < 31; i++) {
          dayCol.options[i].disabled = (numDaysInMonth <= i);
        }
      }
    }

    picker.refresh();
  }

  /**
   * @private
   */
  divyColumns(picker: Picker) {
    let pickerColumns = picker.getColumns();
    let columns = [];

    pickerColumns.forEach((col, i) => {
      columns.push(0);

      col.options.forEach(opt => {
        if (opt.text.length > columns[i]) {
          columns[i] = opt.text.length;
        }
      });

    });

    if (columns.length === 2) {
      var width = Math.max(columns[0], columns[1]);
      pickerColumns[0].columnWidth = pickerColumns[1].columnWidth = `${width * 16}px`;

    } else if (columns.length === 3) {
      var width = Math.max(columns[0], columns[2]);
      pickerColumns[1].columnWidth = `${columns[1] * 16}px`;
      pickerColumns[0].columnWidth = pickerColumns[2].columnWidth = `${width * 16}px`;

    } else if (columns.length > 3) {
      columns.forEach((col, i) => {
        pickerColumns[i].columnWidth = `${col * 12}px`;
      });
    }
  }

  /**
   * @private
   */
  setValue(newData: any) {
    updateDate(this._value, newData);
  }

  /**
   * @private
   */
  getValue(): DateTimeData {
    return this._value;
  }

  /**
   * @private
   */
  updateText() {
    // create the text of the formatted data
    this._text = renderDateTime(this.displayFormat, this._value, this._locale);
  }

  /**
   * @private
   */
  calcMinMax() {
    let todaysYear = new Date().getFullYear();

    if (isBlank(this.min)) {
      if (isPresent(this.yearValues)) {
        this.min = Math.min.apply(Math, convertToArrayOfNumbers(this.yearValues, 'year'));

      } else {
        this.min = (todaysYear - 100).toString();
      }
    }

    if (isBlank(this.max)) {
      if (isPresent(this.yearValues)) {
        this.max = Math.max.apply(Math, convertToArrayOfNumbers(this.yearValues, 'year'));

      } else {
        this.max = todaysYear.toString();
      }
    }

    let min = this._min = parseDate(this.min);
    let max = this._max = parseDate(this.max);

    min.month = min.month || 1;
    min.day = min.day || 1;
    min.hour = min.hour || 0;
    min.minute = min.minute || 0;
    min.second = min.second || 0;

    max.month = max.month || 12;
    max.day = max.day || 31;
    max.hour = max.hour || 23;
    max.minute = max.minute || 59;
    max.second = max.second || 59;
  }

  /**
   * @input {boolean} Whether or not the datetime component is disabled. Default `false`.
   */
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-datetime-disabled', this._disabled);
  }

  /**
   * @private
   */
  writeValue(val: any) {
    console.debug('datetime, writeValue', val);
    this.setValue(val);
    this.updateText();
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    // first see if locale names were provided in the inputs
    // then check to see if they're in the config
    // if neither were provided then it will use default English names
    ['monthNames', 'monthShortNames', 'dayNames', 'dayShortNames'].forEach(type => {
      this._locale[type] = convertToArrayOfStrings(isPresent(this[type]) ? this[type] : this._config.get(type), type);
    });

    // update how the datetime value is displayed as formatted text
    this.updateText();
  }

  /**
   * @private
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (val: any) => {
      console.debug('datetime, onChange', val);
      this.setValue(val);
      this.updateText();

      // convert DateTimeData value to iso datetime format
      fn(convertDataToISO(this._value));

      this.onTouched();
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  onChange(val: any) {
    // onChange used when there is not an ngControl
    console.debug('datetime, onChange w/out ngControl', val);
    this.setValue(val);
    this.updateText();
    this.onTouched();
  }

  /**
   * @private
   */
  onTouched() { }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}

/**
 * @private
 * Use to convert a string of comma separated numbers or
 * an array of numbers, and clean up any user input
 */
function convertToArrayOfNumbers(input: any, type: string): number[] {
  var values: number[] = [];

  if (isString(input)) {
    // convert the string to an array of strings
    // auto remove any whitespace and [] characters
    input = input.replace(/\[|\]|\s/g, '').split(',');
  }

  if (isArray(input)) {
    // ensure each value is an actual number in the returned array
    input.forEach(num => {
      num = parseInt(num, 10);
      if (!isNaN(num)) {
        values.push(num);
      }
    });
  }

  if (!values.length) {
    console.warn(`Invalid "${type}Values". Must be an array of numbers, or a comma separated string of numbers.`);
  }

  return values;
}

/**
 * @private
 * Use to convert a string of comma separated strings or
 * an array of strings, and clean up any user input
 */
function convertToArrayOfStrings(input: any, type: string): string[] {
  if (isPresent(input)) {
    var values: string[] = [];

    if (isString(input)) {
      // convert the string to an array of strings
      // auto remove any [] characters
      input = input.replace(/\[|\]/g, '').split(',');
    }

    if (isArray(input)) {
      // trim up each string value
      input.forEach(val => {
        val = val.trim();
        if (val) {
          values.push(val);
        }
      });
    }

    if (!values.length) {
      console.warn(`Invalid "${type}Names". Must be an array of strings, or a comma separated string.`);
    }

    return values;
  }
}
