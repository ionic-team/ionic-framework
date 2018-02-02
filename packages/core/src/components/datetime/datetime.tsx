import { Component, CssClassMap, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';

import {
  DatetimeData,
  LocaleData,
  convertFormatToKey,
  convertToArrayOfNumbers,
  convertToArrayOfStrings,
  dateDataSortValue,
  dateSortValue,
  dateValueRange,
  daysInMonth,
  getValueFromFormat,
  parseDate,
  parseTemplate,
  renderDatetime,
  renderTextFormat,
  updateDate
} from './datetime-util';
import { clamp, isBlank, isObject } from '../../utils/helpers';
import { Picker, PickerColumn, PickerController, PickerOptions } from '../../index';


@Component({
  tag: 'ion-datetime',
  styleUrls: {
    ios: 'datetime.ios.scss',
    md: 'datetime.md.scss'
  },
  host: {
    theme: 'datetime'
  }
})
export class Datetime {
  [key: string]: any;

  private datetimeId: string;
  private labelId: string;
  private picker: Picker;

  locale: LocaleData = {};
  datetimeMin: DatetimeData = {};
  datetimeMax: DatetimeData = {};
  datetimeValue: DatetimeData = {};

  @State() text: any;

  @Prop({ connect: 'ion-picker-controller' }) pickerCtrl: PickerController;

  /**
   * If true, the user cannot interact with the datetime. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * The minimum datetime allowed. Value must be a date string
   * following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * such as `1996-12-19`. The format does not have to be specific to an exact
   * datetime. For example, the minimum could just be the year, such as `1994`.
   * Defaults to the beginning of the year, 100 years ago from today.
   */
  @Prop({ mutable: true }) min: string;

  /**
   * The maximum datetime allowed. Value must be a date string
   * following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * `1996-12-19`. The format does not have to be specific to an exact
   * datetime. For example, the maximum could just be the year, such as `1994`.
   * Defaults to the end of this year.
   */
  @Prop({ mutable: true }) max: string;

  /**
   * The display format of the date and time as text that shows
   * within the item. When the `pickerFormat` input is not used, then the
   * `displayFormat` is used for both display the formatted text, and determining
   * the datetime picker's columns. See the `pickerFormat` input description for
   * more info. Defaults to `MMM D, YYYY`.
   */
  @Prop() displayFormat = 'MMM D, YYYY';

  /**
   * The format of the date and time picker columns the user selects.
   * A datetime input can have one or many datetime parts, each getting their
   * own column which allow individual selection of that particular datetime part. For
   * example, year and month columns are two individually selectable columns which help
   * choose an exact date from the datetime picker. Each column follows the string
   * parse format. Defaults to use `displayFormat`.
   */
  @Prop() pickerFormat: string;

  /**
   * The text to display on the picker's cancel button. Default: `Cancel`.
   */
  @Prop() cancelText = 'Cancel';

  /**
   * The text to display on the picker's "Done" button. Default: `Done`.
   */
  @Prop() doneText = 'Done';

  /**
   * Values used to create the list of selectable years. By default
   * the year values range between the `min` and `max` datetime inputs. However, to
   * control exactly which years to display, the `yearValues` input can take either an array
   * of numbers, or string of comma separated numbers. For example, to show upcoming and
   * recent leap years, then this input's value would be `yearValues="2024,2020,2016,2012,2008"`.
   */
  @Prop() yearValues: any;

  /**
   * Values used to create the list of selectable months. By default
   * the month values range from `1` to `12`. However, to control exactly which months to
   * display, the `monthValues` input can take either an array of numbers, or string of
   * comma separated numbers. For example, if only summer months should be shown, then this
   * input value would be `monthValues="6,7,8"`. Note that month numbers do *not* have a
   * zero-based index, meaning January's value is `1`, and December's is `12`.
   */
  @Prop() monthValues: any;

  /**
   * Values used to create the list of selectable days. By default
   * every day is shown for the given month. However, to control exactly which days of
   * the month to display, the `dayValues` input can take either an array of numbers, or
   * string of comma separated numbers. Note that even if the array days have an invalid
   * number for the selected month, like `31` in February, it will correctly not show
   * days which are not valid for the selected month.
   */
  @Prop() dayValues: any;

  /**
   * Values used to create the list of selectable hours. By default
   * the hour values range from `0` to `23` for 24-hour, or `1` to `12` for 12-hour. However,
   * to control exactly which hours to display, the `hourValues` input can take either an
   * array of numbers, or string of comma separated numbers.
   */
  @Prop() hourValues: any;

  /**
   * Values used to create the list of selectable minutes. By default
   * the mintues range from `0` to `59`. However, to control exactly which minutes to display,
   * the `minuteValues` input can take either an array of numbers, or string of comma separated
   * numbers. For example, if the minute selections should only be every 15 minutes, then
   * this input value would be `minuteValues="0,15,30,45"`.
   */
  @Prop() minuteValues: any;

  /**
   * Full names for each month name. This can be used to provide
   * locale month names. Defaults to English.
   */
  @Prop() monthNames: any;

  /**
   * Short abbreviated names for each month name. This can be used to provide
   * locale month names. Defaults to English.
   */
  @Prop() monthShortNames: any;

  /**
   * Full day of the week names. This can be used to provide
   * locale names for each day in the week. Defaults to English.
   */
  @Prop() dayNames: any;

  /**
   * Short abbreviated day of the week names. This can be used to provide
   * locale names for each day in the week. Defaults to English.
   */
  @Prop() dayShortNames: any;

  /**
   * Any additional options that the picker interface can accept.
   * See the [Picker API docs](../../picker/Picker) for the picker options.
   */
  @Prop() pickerOptions: PickerOptions = {
    buttons: [],
    columns: []
  };

  /**
   * The text to display when there's no date selected yet.
   * Using lowercase to match the input attribute
   */
  @Prop() placeholder: string;

  /**
   * the value of the datetime.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * Update the datetime value when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    this.updateValue();
  }

  /**
   * Emitted when the datetime selection was cancelled.
   */
  @Event() ionCancel: EventEmitter;

  componentWillLoad() {
    // first see if locale names were provided in the inputs
    // then check to see if they're in the config
    // if neither were provided then it will use default English names
    this.locale = {
      // this.locale[type] = convertToArrayOfStrings((this[type] ? this[type] : this.config.get(type), type);
      monthNames: convertToArrayOfStrings(this.monthNames, 'monthNames'),
      monthShortNames: convertToArrayOfStrings(this.monthShortNames, 'monthShortNames'),
      dayNames: convertToArrayOfStrings(this.dayNames, 'dayNames'),
      dayShortNames: convertToArrayOfStrings(this.dayShortNames, 'dayShortNames')
    };

    this.updateValue();
  }

  /**
   * Update the datetime text and datetime value
   */
  updateValue() {
    updateDate(this.datetimeValue, this.value);
    this.updateText();
  }

  buildPicker(pickerOptions: PickerOptions) {
    console.debug('Build Datetime: Picker with', pickerOptions);

    // If the user has not passed in picker buttons,
    // add a cancel and ok button to the picker
    if (pickerOptions.buttons.length === 0) {
      pickerOptions.buttons = [{
        text: this.cancelText,
        role: 'cancel',
        handler: () => this.ionCancel.emit(this)
      }, {
        text: this.doneText,
        handler: (data: any) => this.value = data,
      }];
    }

    pickerOptions.columns = this.generateColumns();

    const picker = this.pickerCtrl.create(pickerOptions);

    // picker.ionChange.subscribe(() => {
    //   this.validate();
    //   picker.refresh();
    // });

    // picker.onDidDismiss(() => {
    //   this._fireBlur();
    // });

    console.debug('Built Datetime: Picker with', pickerOptions);
    return picker;
  }

  open() {
    const pickerOptions = {...this.pickerOptions};

    // TODO check this.isFocus() || this.disabled
    if (this.disabled) {
      return;
    }

    let controller: Promise<any>;

    controller = this.buildPicker(pickerOptions);

    controller.then((component: any) => {
      // Update picker status before presenting
      this.picker = component;

      this.validate();

      component.present();
    });
  }


  /**
   */
  generateColumns(): PickerColumn[] {
    let columns: PickerColumn[] = [];

    // if a picker format wasn't provided, then fallback
    // to use the display format
    let template = this.pickerFormat || this.displayFormat || DEFAULT_FORMAT;

    if (template) {
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
      parseTemplate(template).forEach((format: any) => {
        // loop through each format in the template
        // create a new picker column to build up with data
        const key = convertFormatToKey(format);
        let values: any[];

        // check if they have exact values to use for this date part
        // otherwise use the default date part values
        values = this[key + 'Values']
          ? convertToArrayOfNumbers(this[key + 'Values'], key)
          : dateValueRange(format, this.datetimeMin, this.datetimeMax);

        const column: PickerColumn = {
          name: key,
          selectedIndex: 0,
          options: values.map(val => {
            return {
              value: val,
              text: renderTextFormat(format, val, null, this.locale),
            };
          })
        };

        // cool, we've loaded up the columns with options
        // preselect the option for this column
        const optValue = getValueFromFormat(this.datetimeValue, format);
        const selectedIndex = column.options.findIndex(opt => opt.value === optValue);
        if (selectedIndex >= 0) {
          // set the select index for this column's options
          column.selectedIndex = selectedIndex;
        }

        // add our newly created column to the picker
        columns.push(column);
      });

      // Normalize min/max
      const min = this.datetimeMin;
      const max = this.datetimeMax;
      ['month', 'day', 'hour', 'minute']
        .filter(name => !columns.find(column => column.name === name))
        .forEach(name => {
          min[name] = 0;
          max[name] = 0;
        });

      columns = this.divyColumns(columns);
    }

    return columns;
  }

  /**
   * @private
   */
  validate() {
    const today = new Date();
    const minCompareVal = dateDataSortValue(this.datetimeMin);
    const maxCompareVal = dateDataSortValue(this.datetimeMax);
    const yearCol = this.picker.getColumn('year');

    let selectedYear: number = today.getFullYear();
    if (yearCol) {
      // default to the first value if the current year doesn't exist in the options
      if (!yearCol.options.find(col => col.value === today.getFullYear())) {
        selectedYear = yearCol.options[0].value;
      }

      const yearOpt = yearCol.options[yearCol.selectedIndex];
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
   */
  calcMinMax(now?: Date) {
    const todaysYear = (now || new Date()).getFullYear();

    if (this.yearValues) {
      const years = convertToArrayOfNumbers(this.yearValues, 'year');
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
    const min = this.datetimeMin = parseDate(this.min);
    const max = this.datetimeMax = parseDate(this.max);

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


  /**
   */
  validateColumn(name: string, index: number, min: number, max: number, lowerBounds: number[], upperBounds: number[]): number {
    const column = this.picker.getColumn(name);
    if (!column) {
      return 0;
    }

    const lb = lowerBounds.slice();
    const ub = upperBounds.slice();
    const options = column.options;
    let indexMin = options.length - 1;
    let indexMax = 0;

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const value = opt.value;
      lb[index] = opt.value;
      ub[index] = opt.value;

      const disabled = opt.disabled = (
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
    const selectedIndex = column.selectedIndex = clamp(indexMin, column.selectedIndex, indexMax);
    const opt = column.options[selectedIndex];
    if (opt) {
      return opt.value;
    }
    return 0;
  }


  /**
   */
  divyColumns(columns: PickerColumn[]): PickerColumn[] {
    const pickerColumns = columns;
    const columnsWidth: number[] = [];
    let col: PickerColumn;
    let width: number;
    for (let i = 0; i < pickerColumns.length; i++) {
      col = pickerColumns[i];
      columnsWidth.push(0);

      for (let j = 0; j < col.options.length; j++) {
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

    return columns;
  }

  /**
   */
  updateText() {
    // create the text of the formatted data
    const template = this.displayFormat || this.pickerFormat || DEFAULT_FORMAT;
    this.text = renderDatetime(template, this.datetimeValue, this.locale);
  }

  /**
   */
  hasValue(): boolean {
    const val = this.datetimeValue;
    return val
      && isObject(val)
      && Object.keys(val).length > 0;
  }

  hostData() {
    return {
      class: {
        'datetime-disabled': this.disabled
      }
    };
  }

  render() {
    let addPlaceholderClass = false;

    // If selected text has been passed in, use that first
    let datetimeText = this.text;
    if (!datetimeText && this.placeholder) {
      datetimeText = this.placeholder;
      addPlaceholderClass = true;
    }

    const datetimeTextClasses: CssClassMap = {
      'datetime-text': true,
      'datetime-placeholder': addPlaceholderClass
    };

    return [
      <div class={ datetimeTextClasses }>{ datetimeText }</div>,
      <button
        aria-haspopup='true'
        id={this.datetimeId}
        aria-labelledby={this.labelId}
        aria-disabled={this.disabled ? 'true' : false}
        onClick={this.open.bind(this)}
        class='datetime-cover'>
      </button>
    ];
  }
}

const DEFAULT_FORMAT = 'MMM D, YYYY';
