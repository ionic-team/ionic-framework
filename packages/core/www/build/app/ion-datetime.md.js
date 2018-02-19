/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { isArray, isBlank, isString, clamp, isObject, domControllerAsync, playAnimationAsync } from './chunk1.js';
import { getClassMap } from './chunk2.js';

function renderDatetime(template, value, locale) {
    if (isBlank(value)) {
        return '';
    }
    const tokens = [];
    let hasText = false;
    FORMAT_KEYS.forEach((format, index) => {
        if (template.indexOf(format.f) > -1) {
            const token = '{' + index + '}';
            const text = renderTextFormat(format.f, value[format.k], value, locale);
            if (!hasText && text && value[format.k]) {
                hasText = true;
            }
            tokens.push(token, text);
            template = template.replace(format.f, token);
        }
    });
    if (!hasText) {
        return '';
    }
    for (let i = 0; i < tokens.length; i += 2) {
        template = template.replace(tokens[i], tokens[i + 1]);
    }
    return template;
}
function renderTextFormat(format, value, date, locale) {
    if (format === FORMAT_DDDD || format === FORMAT_DDD) {
        try {
            value = (new Date(date.year, date.month - 1, date.day)).getDay();
            if (format === FORMAT_DDDD) {
                return (locale.dayNames ? locale.dayNames : DAY_NAMES)[value];
            }
            return (locale.dayShortNames ? locale.dayShortNames : DAY_SHORT_NAMES)[value];
        }
        catch (e) {
            // ignore
        }
        return '';
    }
    if (format === FORMAT_A) {
        return date ? date.hour < 12 ? 'AM' : 'PM' : value ? value.toUpperCase() : '';
    }
    if (format === FORMAT_a) {
        return date ? date.hour < 12 ? 'am' : 'pm' : value ? value : '';
    }
    if (isBlank(value)) {
        return '';
    }
    if (format === FORMAT_YY || format === FORMAT_MM ||
        format === FORMAT_DD || format === FORMAT_HH ||
        format === FORMAT_mm || format === FORMAT_ss) {
        return twoDigit(value);
    }
    if (format === FORMAT_YYYY) {
        return fourDigit(value);
    }
    if (format === FORMAT_MMMM) {
        return (locale.monthNames ? locale.monthNames : MONTH_NAMES)[value - 1];
    }
    if (format === FORMAT_MMM) {
        return (locale.monthShortNames ? locale.monthShortNames : MONTH_SHORT_NAMES)[value - 1];
    }
    if (format === FORMAT_hh || format === FORMAT_h) {
        if (value === 0) {
            return '12';
        }
        if (value > 12) {
            value -= 12;
        }
        if (format === FORMAT_hh && value < 10) {
            return ('0' + value);
        }
    }
    return value.toString();
}
function dateValueRange(format, min, max) {
    const opts = [];
    let i;
    if (format === FORMAT_YYYY || format === FORMAT_YY) {
        // year
        i = max.year;
        while (i >= min.year) {
            opts.push(i--);
        }
    }
    else if (format === FORMAT_MMMM || format === FORMAT_MMM ||
        format === FORMAT_MM || format === FORMAT_M ||
        format === FORMAT_hh || format === FORMAT_h) {
        // month or 12-hour
        for (i = 1; i < 13; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_DDDD || format === FORMAT_DDD ||
        format === FORMAT_DD || format === FORMAT_D) {
        // day
        for (i = 1; i < 32; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_HH || format === FORMAT_H) {
        // 24-hour
        for (i = 0; i < 24; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_mm || format === FORMAT_m) {
        // minutes
        for (i = 0; i < 60; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_ss || format === FORMAT_s) {
        // seconds
        for (i = 0; i < 60; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_A || format === FORMAT_a) {
        // AM/PM
        opts.push('am', 'pm');
    }
    return opts;
}
function dateSortValue(year, month, day, hour = 0, minute = 0) {
    return parseInt(`1${fourDigit(year)}${twoDigit(month)}${twoDigit(day)}${twoDigit(hour)}${twoDigit(minute)}`, 10);
}
function dateDataSortValue(data) {
    if (data) {
        return dateSortValue(data.year, data.month, data.day, data.hour, data.minute);
    }
    return -1;
}
function daysInMonth(month, year) {
    return (month === 4 || month === 6 || month === 9 || month === 11) ? 30 : (month === 2) ? isLeapYear(year) ? 29 : 28 : 31;
}
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
const ISO_8601_REGEXP = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
const TIME_REGEXP = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
function parseDate(val) {
    // manually parse IS0 cuz Date.parse cannot be trusted
    // ISO 8601 format: 1994-12-15T13:47:20Z
    let parse;
    if (val && val !== '') {
        // try parsing for just time first, HH:MM
        parse = TIME_REGEXP.exec(val);
        if (parse) {
            // adjust the array so it fits nicely with the datetime parse
            parse.unshift(undefined, undefined);
            parse[2] = parse[3] = undefined;
        }
        else {
            // try parsing for full ISO datetime
            parse = ISO_8601_REGEXP.exec(val);
        }
    }
    if (isBlank(parse)) {
        // wasn't able to parse the ISO datetime
        return null;
    }
    // ensure all the parse values exist with at least 0
    for (let i = 1; i < 8; i++) {
        parse[i] = (parse[i] !== undefined ? parseInt(parse[i], 10) : null);
    }
    let tzOffset = 0;
    if (parse[9] && parse[10]) {
        // hours
        tzOffset = parseInt(parse[10], 10) * 60;
        if (parse[11]) {
            // minutes
            tzOffset += parseInt(parse[11], 10);
        }
        if (parse[9] === '-') {
            // + or -
            tzOffset *= -1;
        }
    }
    return {
        year: parse[1],
        month: parse[2],
        day: parse[3],
        hour: parse[4],
        minute: parse[5],
        second: parse[6],
        millisecond: parse[7],
        tzOffset: tzOffset,
    };
}
function updateDate(existingData, newData) {
    if (newData && newData !== '') {
        if (isString(newData)) {
            // new date is a string, and hopefully in the ISO format
            // convert it to our DatetimeData if a valid ISO
            newData = parseDate(newData);
            if (newData) {
                // successfully parsed the ISO string to our DatetimeData
                Object.assign(existingData, newData);
                return true;
            }
        }
        else if ((newData.year || newData.hour || newData.month || newData.day || newData.minute || newData.second)) {
            // newData is from of a datetime picker's selected values
            // update the existing DatetimeData data with the new values
            // do some magic for 12-hour values
            if (newData.ampm && newData.hour) {
                newData.hour.value = (newData.ampm.value === 'pm')
                    ? (newData.hour.value === 12 ? 12 : newData.hour.value + 12)
                    : (newData.hour.value === 12 ? 0 : newData.hour.value);
            }
            // merge new values from the picker's selection
            // to the existing DatetimeData values
            for (const k in newData) {
                existingData[k] = newData[k].value;
            }
            return true;
        }
        // eww, invalid data
        console.warn(`Error parsing date: "${newData}". Please provide a valid ISO 8601 datetime format: https://www.w3.org/TR/NOTE-datetime`);
    }
    else {
        // blank data, clear everything out
        for (const k in existingData) {
            delete existingData[k];
        }
    }
    return false;
}
function parseTemplate(template) {
    const formats = [];
    template = template.replace(/[^\w\s]/gi, ' ');
    FORMAT_KEYS.forEach(format => {
        if (format.f.length > 1 && template.indexOf(format.f) > -1 && template.indexOf(format.f + format.f.charAt(0)) < 0) {
            template = template.replace(format.f, ' ' + format.f + ' ');
        }
    });
    const words = template.split(' ').filter(w => w.length > 0);
    words.forEach((word, i) => {
        FORMAT_KEYS.forEach(format => {
            if (word === format.f) {
                if (word === FORMAT_A || word === FORMAT_a) {
                    // this format is an am/pm format, so it's an "a" or "A"
                    if ((formats.indexOf(FORMAT_h) < 0 && formats.indexOf(FORMAT_hh) < 0) ||
                        VALID_AMPM_PREFIX.indexOf(words[i - 1]) === -1) {
                        // template does not already have a 12-hour format
                        // or this am/pm format doesn't have a hour, minute, or second format immediately before it
                        // so do not treat this word "a" or "A" as the am/pm format
                        return;
                    }
                }
                formats.push(word);
            }
        });
    });
    return formats;
}
function getValueFromFormat(date, format) {
    if (format === FORMAT_A || format === FORMAT_a) {
        return (date.hour < 12 ? 'am' : 'pm');
    }
    if (format === FORMAT_hh || format === FORMAT_h) {
        return (date.hour > 12 ? date.hour - 12 : date.hour);
    }
    return date[convertFormatToKey(format)];
}
function convertFormatToKey(format) {
    for (const k in FORMAT_KEYS) {
        if (FORMAT_KEYS[k].f === format) {
            return FORMAT_KEYS[k].k;
        }
    }
    return null;
}

/**
 * Use to convert a string of comma separated strings or
 * an array of strings, and clean up any user input
 */
function convertToArrayOfStrings(input, type) {
    if (!input) {
        return null;
    }
    if (isString(input)) {
        // convert the string to an array of strings
        // auto remove any [] characters
        input = input.replace(/\[|\]/g, '').split(',');
    }
    let values;
    if (isArray(input)) {
        // trim up each string value
        values = input.map(val => val.toString().trim());
    }
    if (!values || !values.length) {
        console.warn(`Invalid "${type}Names". Must be an array of strings, or a comma separated string.`);
    }
    return values;
}
/**
 * Use to convert a string of comma separated numbers or
 * an array of numbers, and clean up any user input
 */
function convertToArrayOfNumbers(input, type) {
    if (isString(input)) {
        // convert the string to an array of strings
        // auto remove any whitespace and [] characters
        input = input.replace(/\[|\]|\s/g, '').split(',');
    }
    let values;
    if (isArray(input)) {
        // ensure each value is an actual number in the returned array
        values = input
            .map((num) => parseInt(num, 10))
            .filter(isFinite);
    }
    else {
        values = [input];
    }
    if (!values || !values.length) {
        console.warn(`Invalid "${type}Values". Must be an array of numbers, or a comma separated string of numbers.`);
    }
    return values;
}
function twoDigit(val) {
    return ('0' + (val ? Math.abs(val) : '0')).slice(-2);
}
function fourDigit(val) {
    return ('000' + (val ? Math.abs(val) : '0')).slice(-4);
}
const FORMAT_YYYY = 'YYYY';
const FORMAT_YY = 'YY';
const FORMAT_MMMM = 'MMMM';
const FORMAT_MMM = 'MMM';
const FORMAT_MM = 'MM';
const FORMAT_M = 'M';
const FORMAT_DDDD = 'DDDD';
const FORMAT_DDD = 'DDD';
const FORMAT_DD = 'DD';
const FORMAT_D = 'D';
const FORMAT_HH = 'HH';
const FORMAT_H = 'H';
const FORMAT_hh = 'hh';
const FORMAT_h = 'h';
const FORMAT_mm = 'mm';
const FORMAT_m = 'm';
const FORMAT_ss = 'ss';
const FORMAT_s = 's';
const FORMAT_A = 'A';
const FORMAT_a = 'a';
const FORMAT_KEYS = [
    { f: FORMAT_YYYY, k: 'year' },
    { f: FORMAT_MMMM, k: 'month' },
    { f: FORMAT_DDDD, k: 'day' },
    { f: FORMAT_MMM, k: 'month' },
    { f: FORMAT_DDD, k: 'day' },
    { f: FORMAT_YY, k: 'year' },
    { f: FORMAT_MM, k: 'month' },
    { f: FORMAT_DD, k: 'day' },
    { f: FORMAT_HH, k: 'hour' },
    { f: FORMAT_hh, k: 'hour' },
    { f: FORMAT_mm, k: 'minute' },
    { f: FORMAT_ss, k: 'second' },
    { f: FORMAT_M, k: 'month' },
    { f: FORMAT_D, k: 'day' },
    { f: FORMAT_H, k: 'hour' },
    { f: FORMAT_h, k: 'hour' },
    { f: FORMAT_m, k: 'minute' },
    { f: FORMAT_s, k: 'second' },
    { f: FORMAT_A, k: 'ampm' },
    { f: FORMAT_a, k: 'ampm' },
];
const DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
const DAY_SHORT_NAMES = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
];
const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const MONTH_SHORT_NAMES = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
const VALID_AMPM_PREFIX = [
    FORMAT_hh, FORMAT_h, FORMAT_mm, FORMAT_m, FORMAT_ss, FORMAT_s
];

class Datetime {
    constructor() {
        this.locale = {};
        this.datetimeMin = {};
        this.datetimeMax = {};
        this.datetimeValue = {};
        /**
         * If true, the user cannot interact with the datetime. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * The display format of the date and time as text that shows
         * within the item. When the `pickerFormat` input is not used, then the
         * `displayFormat` is used for both display the formatted text, and determining
         * the datetime picker's columns. See the `pickerFormat` input description for
         * more info. Defaults to `MMM D, YYYY`.
         */
        this.displayFormat = 'MMM D, YYYY';
        /**
         * The text to display on the picker's cancel button. Default: `Cancel`.
         */
        this.cancelText = 'Cancel';
        /**
         * The text to display on the picker's "Done" button. Default: `Done`.
         */
        this.doneText = 'Done';
        /**
         * Any additional options that the picker interface can accept.
         * See the [Picker API docs](../../picker/Picker) for the picker options.
         */
        this.pickerOptions = {
            buttons: [],
            columns: []
        };
    }
    disabledChanged() {
        this.emitStyle();
    }
    /**
     * Update the datetime value when the value changes
     */
    valueChanged() {
        this.updateValue();
        this.emitStyle();
    }
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
    componentDidLoad() {
        this.emitStyle();
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit({
                'datetime': true,
                'datetime-disabled': this.disabled,
                'input-has-value': this.hasValue()
            });
        });
    }
    /**
     * Update the datetime text and datetime value
     */
    updateValue() {
        updateDate(this.datetimeValue, this.value);
        this.updateText();
    }
    buildPicker(pickerOptions) {
        console.debug('Build Datetime: Picker with', pickerOptions);
        // If the user has not passed in picker buttons,
        // add a cancel and ok button to the picker
        const buttons = pickerOptions.buttons;
        if (!buttons || buttons.length === 0) {
            pickerOptions.buttons = [
                {
                    text: this.cancelText,
                    role: 'cancel',
                    handler: () => this.ionCancel.emit(this)
                },
                {
                    text: this.doneText,
                    handler: (data) => this.value = data,
                }
            ];
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
        const pickerOptions = Object.assign({}, this.pickerOptions);
        // TODO check this.isFocus() || this.disabled
        if (this.disabled) {
            return;
        }
        let controller;
        controller = this.buildPicker(pickerOptions);
        controller.then((component) => {
            // Update picker status before presenting
            this.picker = component;
            this.validate();
            component.present();
        });
    }
    /**
     */
    generateColumns() {
        let columns = [];
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
            parseTemplate(template).forEach((format) => {
                // loop through each format in the template
                // create a new picker column to build up with data
                const key = convertFormatToKey(format);
                let values;
                // check if they have exact values to use for this date part
                // otherwise use the default date part values
                values = this[key + 'Values']
                    ? convertToArrayOfNumbers(this[key + 'Values'], key)
                    : dateValueRange(format, this.datetimeMin, this.datetimeMax);
                const column = {
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
        let selectedYear = today.getFullYear();
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
        const selectedMonth = this.validateColumn('month', 1, minCompareVal, maxCompareVal, [selectedYear, 0, 0, 0, 0], [selectedYear, 12, 31, 23, 59]);
        const numDaysInMonth = daysInMonth(selectedMonth, selectedYear);
        const selectedDay = this.validateColumn('day', 2, minCompareVal, maxCompareVal, [selectedYear, selectedMonth, 0, 0, 0], [selectedYear, selectedMonth, numDaysInMonth, 23, 59]);
        const selectedHour = this.validateColumn('hour', 3, minCompareVal, maxCompareVal, [selectedYear, selectedMonth, selectedDay, 0, 0], [selectedYear, selectedMonth, selectedDay, 23, 59]);
        this.validateColumn('minute', 4, minCompareVal, maxCompareVal, [selectedYear, selectedMonth, selectedDay, selectedHour, 0], [selectedYear, selectedMonth, selectedDay, selectedHour, 59]);
    }
    /**
     */
    calcMinMax(now) {
        const todaysYear = (now || new Date()).getFullYear();
        if (this.yearValues) {
            const years = convertToArrayOfNumbers(this.yearValues, 'year');
            if (isBlank(this.min)) {
                this.min = Math.min.apply(Math, years);
            }
            if (isBlank(this.max)) {
                this.max = Math.max.apply(Math, years);
            }
        }
        else {
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
            }
            else if (min.month === max.month && min.day > max.day) {
                console.error('min.day > max.day');
                min.day = 1;
            }
        }
    }
    /**
     */
    validateColumn(name, index, min, max, lowerBounds, upperBounds) {
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
            const disabled = opt.disabled = (value < lowerBounds[index] ||
                value > upperBounds[index] ||
                dateSortValue(ub[0], ub[1], ub[2], ub[3], ub[4]) < min ||
                dateSortValue(lb[0], lb[1], lb[2], lb[3], lb[4]) > max);
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
    divyColumns(columns) {
        const pickerColumns = columns;
        const columnsWidth = [];
        let col;
        let width;
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
        }
        else if (columnsWidth.length === 3) {
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
    hasValue() {
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
        const datetimeTextClasses = {
            'datetime-text': true,
            'datetime-placeholder': addPlaceholderClass
        };
        return [
            h("div", { class: datetimeTextClasses }, datetimeText),
            h("button", { type: 'button', "aria-haspopup": 'true', id: this.datetimeId, "aria-labelledby": this.labelId, "aria-disabled": this.disabled ? 'true' : false, onClick: this.open.bind(this), class: 'datetime-cover' })
        ];
    }
    static get is() { return "ion-datetime"; }
    static get host() { return { "theme": "datetime" }; }
    static get properties() { return { "cancelText": { "type": String, "attr": "cancel-text" }, "dayNames": { "type": "Any", "attr": "day-names" }, "dayShortNames": { "type": "Any", "attr": "day-short-names" }, "dayValues": { "type": "Any", "attr": "day-values" }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "displayFormat": { "type": String, "attr": "display-format" }, "doneText": { "type": String, "attr": "done-text" }, "hourValues": { "type": "Any", "attr": "hour-values" }, "max": { "type": String, "attr": "max", "mutable": true }, "min": { "type": String, "attr": "min", "mutable": true }, "minuteValues": { "type": "Any", "attr": "minute-values" }, "monthNames": { "type": "Any", "attr": "month-names" }, "monthShortNames": { "type": "Any", "attr": "month-short-names" }, "monthValues": { "type": "Any", "attr": "month-values" }, "pickerCtrl": { "connect": "ion-picker-controller" }, "pickerFormat": { "type": String, "attr": "picker-format" }, "pickerOptions": { "type": "Any", "attr": "picker-options" }, "placeholder": { "type": String, "attr": "placeholder" }, "text": { "state": true }, "value": { "type": String, "attr": "value", "mutable": true, "watchCallbacks": ["valueChanged"] }, "yearValues": { "type": "Any", "attr": "year-values" } }; }
    static get events() { return [{ "name": "ionCancel", "method": "ionCancel", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-datetime {\n  position: relative;\n  display: flex;\n  overflow: hidden;\n}\n\n.datetime-cover {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n}\n\n.datetime-text {\n  overflow: hidden;\n  flex: 1;\n  min-width: 16px;\n  min-height: 1.2em;\n  font-size: inherit;\n  line-height: 1.2;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.datetime-disabled,\n.item-datetime-disabled ion-label {\n  opacity: 0.4;\n  pointer-events: none;\n}\n\n.item-label-stacked ion-datetime,\n.item-label-floating ion-datetime {\n  padding-left: 0;\n  width: 100%;\n}\n\n.item .datetime {\n  position: static;\n}\n\n.datetime-md {\n  padding: 13px 8px 13px 16px;\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n}\n\n.datetime-md .datetime-placeholder {\n  color: var(--ion-placeholder-text-md-color, var(--ion-placeholder-text-color, #999));\n}"; }
    static get styleMode() { return "md"; }
}
const DEFAULT_FORMAT = 'MMM D, YYYY';

/**
 * iOS Picker Enter Animation
 */
function iosEnterAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.picker-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.picker-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.26);
    wrapperAnimation.fromTo('translateY', '100%', '0%');
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

/**
 * iOS Picker Leave Animation
 */
function iosLeaveAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.picker-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.picker-wrapper'));
    backdropAnimation.fromTo('opacity', 0.26, 0.01);
    wrapperAnimation.fromTo('translateY', '0%', '100%');
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

class Picker {
    constructor() {
        this.showSpinner = null;
        /**
         * If true, the picker will dismiss when the page changes. Defaults to `false`.
         */
        this.dismissOnPageChange = false;
        /**
         * If true, a backdrop will be displayed behind the picker. Defaults to `true`.
         */
        this.showBackdrop = true;
        /**
         * If true, the picker will be dismissed when the backdrop is clicked. Defaults to `true`.
         */
        this.enableBackdropDismiss = true;
        /**
         * If true, the picker will animate. Defaults to `true`.
         */
        this.willAnimate = true;
        this.buttons = [];
        this.columns = [];
    }
    /**
     * Present the picker overlay after it has been created.
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionPickerWillPresent.emit();
        this.el.style.zIndex = `${20000 + this.pickerId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get('pickerEnter', iosEnterAnimation);
        // build the animation and kick it off
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            if (!this.willAnimate) {
                // if the duration is 0, it won't actually animate I don't think
                // TODO - validate this
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.componentDidEnter();
        });
    }
    /**
     * Dismiss the picker overlay after it has been presented.
     */
    dismiss(data, role) {
        clearTimeout(this.durationTimeout);
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionPickerWillDismiss.emit({
            data,
            role
        });
        const animationBuilder = this.leaveAnimation || this.config.get('pickerLeave', iosLeaveAnimation);
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            return domControllerAsync(this.dom.write, () => {
                this.el.parentNode.removeChild(this.el);
            });
        }).then(() => {
            this.ionPickerDidDismiss.emit({
                data,
                role
            });
        });
    }
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
    componentDidEnter() {
        // blur the currently active element
        const activeElement = document.activeElement;
        activeElement && activeElement.blur && activeElement.blur();
        // If there is a duration, dismiss after that amount of time
        if (typeof this.duration === 'number' && this.duration > 10) {
            this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
        }
        this.ionPickerDidPresent.emit();
    }
    componentDidUnload() {
        this.ionPickerDidUnload.emit();
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    buttonClick(button) {
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
    getSelected() {
        const selected = {};
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
    /**
     * @param {any} button Picker toolbar button
     */
    addButton(button) {
        this.buttons.push(button);
    }
    /**
     * @param {PickerColumn} column Picker toolbar button
     */
    addColumn(column) {
        this.columns.push(column);
    }
    getColumn(name) {
        return this.getColumns().find(column => column.name === name);
    }
    getColumns() {
        return this.columns;
    }
    backdropClick() {
        // TODO !this.disabled
        if (this.enableBackdropDismiss) {
            const cancelBtn = this.buttons.find(b => b.role === 'cancel');
            if (cancelBtn) {
                this.buttonClick(cancelBtn);
            }
            else {
                this.dismiss();
            }
        }
    }
    render() {
        // TODO: cssClass
        const buttons = this.buttons
            .map(b => {
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
        // RENDER TODO
        // <ion-backdrop (click)="bdClick()"></ion-backdrop>
        // <div class="picker-wrapper">
        //   <div class="picker-toolbar">
        //     <div *ngFor="let b of d.buttons" class="picker-toolbar-button" [ngClass]="b.cssRole">
        //       <ion-button (click)="btnClick(b)" [ngClass]="b.cssClass" class="picker-button" clear>
        //         {{b.text}}
        //       </ion-button>
        //     </div>
        //   </div>
        //   <div class="picker-columns">
        //     <div class="picker-above-highlight"></div>
        //     <div *ngFor="let c of d.columns" [col]="c" class="picker-col" (ionChange)="_colChange($event)"></div>
        //     <div class="picker-below-highlight"></div>
        //   </div>
        // </div>
        return [
            h("ion-backdrop", { onClick: this.backdropClick.bind(this), class: {
                    'picker-backdrop': true,
                    'hide-backdrop': !this.showBackdrop
                } }),
            h("div", { class: 'picker-wrapper', role: 'dialog' },
                h("div", { class: 'picker-toolbar' }, buttons.map(b => h("div", { class: buttonWrapperClass(b) },
                    h("button", { onClick: () => this.buttonClick(b), class: buttonClass(b) }, b.text)))),
                h("div", { class: 'picker-columns' },
                    h("div", { class: 'picker-above-highlight' }),
                    columns.map(c => h("ion-picker-column", { col: c })),
                    h("div", { class: 'picker-below-highlight' })))
        ];
    }
    static get is() { return "ion-picker"; }
    static get host() { return { "theme": "picker" }; }
    static get properties() { return { "addButton": { "method": true }, "addColumn": { "method": true }, "animationCtrl": { "connect": "ion-animation-controller" }, "buttons": { "type": "Any", "attr": "buttons" }, "columns": { "type": "Any", "attr": "columns" }, "config": { "context": "config" }, "content": { "type": String, "attr": "content" }, "cssClass": { "type": String, "attr": "css-class" }, "dismiss": { "method": true }, "dismissOnPageChange": { "type": Boolean, "attr": "dismiss-on-page-change" }, "dom": { "context": "dom" }, "duration": { "type": Number, "attr": "duration" }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "getColumn": { "method": true }, "getColumns": { "method": true }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "pickerId": { "type": Number, "attr": "picker-id" }, "present": { "method": true }, "showBackdrop": { "type": Boolean, "attr": "show-backdrop" }, "showSpinner": { "state": true }, "spinner": { "state": true }, "willAnimate": { "type": Boolean, "attr": "will-animate" } }; }
    static get events() { return [{ "name": "ionPickerDidLoad", "method": "ionPickerDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPickerDidPresent", "method": "ionPickerDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPickerWillPresent", "method": "ionPickerWillPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPickerWillDismiss", "method": "ionPickerWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPickerDidDismiss", "method": "ionPickerDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPickerDidUnload", "method": "ionPickerDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-picker {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 1000;\n  display: block;\n  width: 100%;\n  height: 100%;\n  contain: strict;\n  -webkit-font-smoothing: antialiased;\n  font-smoothing: antialiased;\n}\n\n.picker-toolbar {\n  z-index: 1;\n  width: 100%;\n  contain: strict;\n}\n\n.picker-wrapper {\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: auto;\n  transform: translate3d(0,  100%,  0);\n  position: absolute;\n  z-index: 10;\n  display: flex;\n  overflow: hidden;\n  flex-direction: column;\n  width: 100%;\n  max-width: 500px;\n  contain: strict;\n}\n\n.picker-columns {\n  margin-bottom: constant(safe-area-inset-bottom);\n  margin-bottom: env(safe-area-inset-bottom);\n  position: relative;\n  display: flex;\n  overflow: hidden;\n  justify-content: center;\n  contain: strict;\n}\n\n.picker-col {\n  box-sizing: content-box;\n  position: relative;\n  display: flex;\n  flex: 1;\n  justify-content: center;\n  height: 100%;\n  contain: content;\n}\n\n.picker-opts {\n  position: relative;\n  flex: 1;\n  max-width: 100%;\n}\n\n.picker-prefix {\n  text-align: right;\n  text-align: end;\n  position: relative;\n  flex: 2;\n  min-width: 45%;\n  max-width: 50%;\n  white-space: nowrap;\n}\n\n.picker-suffix {\n  text-align: left;\n  text-align: start;\n  position: relative;\n  flex: 2;\n  min-width: 45%;\n  max-width: 50%;\n  white-space: nowrap;\n}\n\n.picker-opt {\n  left: 0;\n  top: 0;\n  text-align: center;\n  position: absolute;\n  display: block;\n  overflow: hidden;\n  width: 100%;\n  border: 0;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  will-change: transform;\n  contain: strict;\n}\n\n.picker-opt.picker-opt-disabled {\n  pointer-events: none;\n}\n\n.picker-opt-disabled {\n  opacity: 0;\n}\n\n.picker-opts-left {\n  justify-content: flex-start;\n}\n\n.picker-opts-right {\n  justify-content: flex-end;\n}\n\n.picker-above-highlight,\n.picker-below-highlight {\n  display: none;\n  pointer-events: none;\n}\n\n.picker-button {\n  border: 0;\n  font-family: inherit;\n}\n\n.picker-opt:active, .picker-opt:focus,\n.picker-button:active,\n.picker-button:focus {\n  outline: none;\n}\n\n.picker-md {\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n}\n\n.picker-md .picker-wrapper {\n  height: 260px;\n  border-top: 0.55px solid var(--ion-item-md-border-color, var(--ion-item-border-color, #dedede));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.picker-md .picker-toolbar {\n  display: flex;\n  justify-content: flex-end;\n  height: 44px;\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.picker-md .picker-button,\n.picker-md .picker-button.activated {\n  margin: 0;\n  padding: 0 1.1em;\n  height: 44px;\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  background: transparent;\n  box-shadow: none;\n}\n\n.picker-md .picker-columns {\n  height: 216px;\n  perspective: 1800px;\n}\n\n.picker-md .picker-col {\n  padding: 0 8px;\n  transform-style: preserve-3d;\n}\n\n.picker-md .picker-prefix,\n.picker-md .picker-suffix,\n.picker-md .picker-opts {\n  top: 77px;\n  font-size: 22px;\n  line-height: 42px;\n  color: var(--ion-item-md-text-color, var(--ion-item-text-color, var(--ion-text-color, #000)));\n  transform-style: preserve-3d;\n  pointer-events: none;\n}\n\n.picker-md .picker-opt {\n  margin: 0;\n  padding: 0;\n  height: 43px;\n  font-size: 22px;\n  line-height: 42px;\n  color: var(--ion-item-md-text-color, var(--ion-item-text-color, var(--ion-text-color, #000)));\n  background: transparent;\n  transition-timing-function: ease-out;\n  backface-visibility: hidden;\n  pointer-events: auto;\n}\n\n.picker-md .picker-prefix,\n.picker-md .picker-suffix,\n.picker-md .picker-opt.picker-opt-selected {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.picker-md .picker-above-highlight {\n  left: 0;\n  top: 0;\n  transform: translate3d(0,  0,  90px);\n  position: absolute;\n  z-index: 10;\n  width: 100%;\n  height: 81px;\n  border-bottom: 1px solid var(--ion-item-md-border-color, var(--ion-item-border-color, #dedede));\n  background: linear-gradient(to bottom, var(--ion-background-md-color, var(--ion-background-color, #fff)) 20%, rgba(255, 255, 255, var(--ion-alpha-md-high, var(--ion-alpha-high, 0.75))) 100%);\n}\n\n.picker-md .picker-below-highlight {\n  left: 0;\n  top: 115px;\n  transform: translate3d(0,  0,  90px);\n  position: absolute;\n  z-index: 11;\n  width: 100%;\n  height: 119px;\n  border-top: 1px solid var(--ion-item-md-border-color, var(--ion-item-border-color, #dedede));\n  background: linear-gradient(to top, var(--ion-background-md-color, var(--ion-background-color, #fff)) 30%, rgba(255, 255, 255, var(--ion-alpha-md-high, var(--ion-alpha-high, 0.75))) 100%);\n}"; }
    static get styleMode() { return "md"; }
}
function buttonWrapperClass(button) {
    const buttonClass = {
        'picker-toolbar-button': true,
    };
    if (button.role) {
        buttonClass[`picker-toolbar-${button.role}`] = true;
    }
    return buttonClass;
}
function buttonClass(button) {
    return Object.assign({ 'picker-button': true }, getClassMap(button.cssClass));
}

class PickerColumnCmp {
    constructor() {
        this.pos = [];
        this.y = 0;
    }
    componentWillLoad() {
        let pickerRotateFactor = 0;
        let pickerScaleFactor = 0.81;
        if (this.mode === 'ios') {
            pickerRotateFactor = -0.46;
            pickerScaleFactor = 1;
        }
        this.rotateFactor = pickerRotateFactor;
        this.scaleFactor = pickerScaleFactor;
    }
    componentDidLoad() {
        // get the scrollable element within the column
        const colEl = this.el.querySelector('.picker-opts');
        // get the height of one option
        this.optHeight = (colEl.firstElementChild ? colEl.firstElementChild.clientHeight : 0);
        // TODO block goback-swipe and menu-swipe
        // this.activeBlock = 'goback-swipe menu-swipe';
        this.refresh();
    }
    componentDidUnload() {
        // TODO block goback-swipe and menu-swipe
        // this.activeBlock = 'goback-swipe menu-swipe';
    }
    optClick(ev, index) {
        if (!this.velocity) {
            ev.preventDefault();
            ev.stopPropagation();
            this.setSelected(index, 150);
        }
    }
    setSelected(selectedIndex, duration) {
        // if there is a selected index, then figure out it's y position
        // if there isn't a selected index, then just use the top y position
        const y = (selectedIndex > -1) ? ((selectedIndex * this.optHeight) * -1) : 0;
        this.velocity = 0;
        // set what y position we're at
        this.update(y, duration, true, true);
    }
    update(y, duration, saveY, emitChange) {
        // ensure we've got a good round number :)
        y = Math.round(y);
        let i;
        let button;
        let opt;
        let optOffset;
        let visible;
        let translateY;
        let translateZ;
        let rotateX;
        let transform;
        let selected;
        const parent = this.el.querySelector('.picker-opts');
        const children = parent.children;
        const length = children.length;
        const selectedIndex = this.col.selectedIndex = Math.min(Math.max(Math.round(-y / this.optHeight), 0), length - 1);
        const durationStr = (duration === 0) ? null : duration + 'ms';
        const scaleStr = `scale(${this.scaleFactor})`;
        for (i = 0; i < length; i++) {
            button = children[i];
            opt = this.col.options[i];
            optOffset = (i * this.optHeight) + y;
            visible = true;
            transform = '';
            if (this.rotateFactor !== 0) {
                rotateX = optOffset * this.rotateFactor;
                if (Math.abs(rotateX) > 90) {
                    visible = false;
                }
                else {
                    translateY = 0;
                    translateZ = 90;
                    transform = `rotateX(${rotateX}deg) `;
                }
            }
            else {
                translateZ = 0;
                translateY = optOffset;
                if (Math.abs(translateY) > 170) {
                    visible = false;
                }
            }
            selected = selectedIndex === i;
            if (visible) {
                transform += `translate3d(0px,${translateY}px,${translateZ}px) `;
                if (this.scaleFactor !== 1 && !selected) {
                    transform += scaleStr;
                }
            }
            else {
                transform = 'translate3d(-9999px,0px,0px)';
            }
            // Update transition duration
            if (duration !== opt.duration) {
                opt.duration = duration;
                button.style.transitionDuration = durationStr;
            }
            // Update transform
            if (transform !== opt.transform) {
                opt.transform = transform;
                button.style.transform = transform;
            }
            // Update selected item
            if (selected !== opt.selected) {
                opt.selected = selected;
                if (selected) {
                    button.classList.add(PICKER_OPT_SELECTED);
                }
                else {
                    button.classList.remove(PICKER_OPT_SELECTED);
                }
            }
        }
        this.col.prevSelected = selectedIndex;
        if (saveY) {
            this.y = y;
        }
        if (emitChange) {
            if (this.lastIndex === undefined) {
                // have not set a last index yet
                this.lastIndex = this.col.selectedIndex;
            }
            else if (this.lastIndex !== this.col.selectedIndex) {
                // new selected index has changed from the last index
                // update the lastIndex and emit that it has changed
                this.lastIndex = this.col.selectedIndex;
                // TODO ionChange event
                // var ionChange = this.ionChange;
                // if (ionChange.observers.length > 0) {
                //   this._zone.run(ionChange.emit.bind(ionChange, this.col.options[this.col.selectedIndex]));
                // }
            }
        }
    }
    decelerate() {
        let y = 0;
        if (isNaN(this.y) || !this.optHeight) {
            // fallback in case numbers get outta wack
            this.update(y, 0, true, true);
        }
        else if (Math.abs(this.velocity) > 0) {
            // still decelerating
            this.velocity *= DECELERATION_FRICTION;
            // do not let it go slower than a velocity of 1
            this.velocity = (this.velocity > 0)
                ? Math.max(this.velocity, 1)
                : Math.min(this.velocity, -1);
            y = Math.round(this.y - this.velocity);
            if (y > this.minY) {
                // whoops, it's trying to scroll up farther than the options we have!
                y = this.minY;
                this.velocity = 0;
            }
            else if (y < this.maxY) {
                // gahh, it's trying to scroll down farther than we can!
                y = this.maxY;
                this.velocity = 0;
            }
            const notLockedIn = (y % this.optHeight !== 0 || Math.abs(this.velocity) > 1);
            this.update(y, 0, true, !notLockedIn);
            if (notLockedIn) {
                // isn't locked in yet, keep decelerating until it is
                this.dom.raf(() => this.decelerate());
            }
        }
        else if (this.y % this.optHeight !== 0) {
            // needs to still get locked into a position so options line up
            const currentPos = Math.abs(this.y % this.optHeight);
            // create a velocity in the direction it needs to scroll
            this.velocity = (currentPos > (this.optHeight / 2) ? 1 : -1);
            this.decelerate();
        }
        const currentIndex = Math.max(Math.abs(Math.round(y / this.optHeight)), 0);
        // TODO
        // if (currentIndex !== this.lastTempIndex) {
        //   // Trigger a haptic event for physical feedback that the index has changed
        //   this._haptic.gestureSelectionChanged();
        // }
        this.lastTempIndex = currentIndex;
    }
    // TODO should this check disabled?
    canStart() {
        return true;
    }
    onDragStart(detail) {
        console.debug('picker, onDragStart', detail, this.startY);
        // We have to prevent default in order to block scrolling under the picker
        // but we DO NOT have to stop propagation, since we still want
        // some "click" events to capture
        if (detail.event) {
            // TODO this errors
            // detail.event.preventDefault();
        }
        // remember where the pointer started from
        this.startY = detail.startY;
        // reset everything
        this.velocity = 0;
        this.pos.length = 0;
        this.pos.push(this.startY, Date.now());
        const options = this.col.options;
        let minY = (options.length - 1);
        let maxY = 0;
        for (let i = 0; i < options.length; i++) {
            if (!options[i].disabled) {
                minY = Math.min(minY, i);
                maxY = Math.max(maxY, i);
            }
        }
        this.minY = (minY * this.optHeight * -1);
        this.maxY = (maxY * this.optHeight * -1);
        return true;
    }
    onDragMove(detail) {
        if (detail.event) {
            detail.event.preventDefault();
            detail.event.stopPropagation();
        }
        console.debug('picker, onDragMove', detail);
        const currentY = detail.currentY;
        this.pos.push(currentY, Date.now());
        if (this.startY === null) {
            return;
        }
        // update the scroll position relative to pointer start position
        let y = this.y + (currentY - this.startY);
        if (y > this.minY) {
            // scrolling up higher than scroll area
            y = Math.pow(y, 0.8);
            this.bounceFrom = y;
        }
        else if (y < this.maxY) {
            // scrolling down below scroll area
            y += Math.pow(this.maxY - y, 0.9);
            this.bounceFrom = y;
        }
        else {
            this.bounceFrom = 0;
        }
        this.update(y, 0, false, false);
        const currentIndex = Math.max(Math.abs(Math.round(y / this.optHeight)), 0);
        if (currentIndex !== this.lastTempIndex) {
            this.lastTempIndex = currentIndex;
        }
    }
    onDragEnd(detail) {
        if (this.startY === null) {
            return;
        }
        console.debug('picker, onDragEnd', detail);
        this.velocity = 0;
        if (this.bounceFrom > 0) {
            // bounce back up
            this.update(this.minY, 100, true, true);
            return;
        }
        else if (this.bounceFrom < 0) {
            // bounce back down
            this.update(this.maxY, 100, true, true);
            return;
        }
        const endY = detail.currentY;
        this.pos.push(endY, Date.now());
        const endPos = (this.pos.length - 1);
        let startPos = endPos;
        const timeRange = (Date.now() - 100);
        // move pointer to position measured 100ms ago
        for (let i = endPos; i > 0 && this.pos[i] > timeRange; i -= 2) {
            startPos = i;
        }
        if (startPos !== endPos) {
            // compute relative movement between these two points
            const timeOffset = (this.pos[endPos] - this.pos[startPos]);
            const movedTop = (this.pos[startPos - 1] - this.pos[endPos - 1]);
            // based on XXms compute the movement to apply for each render step
            const velocity = ((movedTop / timeOffset) * FRAME_MS);
            this.velocity = clamp(-MAX_PICKER_SPEED, velocity, MAX_PICKER_SPEED);
        }
        if (Math.abs(endY - this.startY) > 3) {
            const y = this.y + (endY - this.startY);
            this.update(y, 0, true, true);
        }
        this.startY = null;
        this.decelerate();
    }
    refresh() {
        let min = this.col.options.length - 1;
        let max = 0;
        const options = this.col.options;
        for (let i = 0; i < options.length; i++) {
            if (!options[i].disabled) {
                min = Math.min(min, i);
                max = Math.max(max, i);
            }
        }
        const selectedIndex = clamp(min, this.col.selectedIndex, max);
        if (this.col.prevSelected !== selectedIndex) {
            const y = (selectedIndex * this.optHeight) * -1;
            this.velocity = 0;
            this.update(y, 150, true, false);
        }
    }
    hostData() {
        return {
            class: {
                'picker-opts-left': this.col.align === 'left',
                'picker-opts-right': this.col.align === 'right'
            },
            style: {
                'max-width': this.col.columnWidth
            }
        };
    }
    render() {
        const col = this.col;
        const options = this.col.options
            .map(o => {
            if (typeof o === 'string') {
                o = { text: o };
            }
            return o;
        })
            .filter(clientInformation => clientInformation !== null);
        const results = [];
        if (col.prefix) {
            results.push(h("div", { class: 'picker-prefix', style: { width: col.prefixWidth } }, col.prefix));
        }
        results.push(h("ion-gesture", Object.assign({}, {
            'canStart': this.canStart.bind(this),
            'onStart': this.onDragStart.bind(this),
            'onMove': this.onDragMove.bind(this),
            'onEnd': this.onDragEnd.bind(this),
            'gestureName': 'picker-swipe',
            'gesturePriority': 10,
            'type': 'pan',
            'direction': 'y',
            'maxAngle': 20,
            'threshold': 10,
            'attachTo': 'parent',
            'block': this.activeBlock
        })), h("div", { class: 'picker-opts', style: { maxWidth: col.optionsWidth } }, options.map((o, index) => h("button", { class: { 'picker-opt': true, 'picker-opt-disabled': o.disabled }, "disable-activated": true, onClick: () => this.optClick(event, index) }, o.text))));
        if (col.suffix) {
            results.push(h("div", { class: 'picker-suffix', style: { width: col.suffixWidth } }, col.suffix));
        }
        return results;
    }
    static get is() { return "ion-picker-column"; }
    static get host() { return { "theme": "picker-col" }; }
    static get properties() { return { "col": { "type": "Any", "attr": "col" }, "dom": { "context": "dom" }, "el": { "elementRef": true } }; }
}
const PICKER_OPT_SELECTED = 'picker-opt-selected';
const DECELERATION_FRICTION = 0.97;
const FRAME_MS = (1000 / 60);
const MAX_PICKER_SPEED = 60;

let ids = 0;
const pickers = new Map();
class PickerController {
    create(opts) {
        // create ionic's wrapping ion-picker component
        const pickerElement = document.createElement('ion-picker');
        // give this picker a unique id
        pickerElement.pickerId = ids++;
        // convert the passed in picker options into props
        // that get passed down into the new picker
        Object.assign(pickerElement, opts);
        // append the picker element to the document body
        const appRoot = document.querySelector('ion-app') || document.body;
        appRoot.appendChild(pickerElement);
        return pickerElement.componentOnReady();
    }
    dismiss(data, role, pickerId = -1) {
        pickerId = pickerId >= 0 ? pickerId : getHighestId();
        const picker = pickers.get(pickerId);
        if (!picker) {
            return Promise.reject('picker does not exist');
        }
        return picker.dismiss(data, role);
    }
    getTop() {
        return pickers.get(getHighestId());
    }
    pickerWillPresent(ev) {
        pickers.set(ev.target.pickerId, ev.target);
    }
    pickerWillDismiss(ev) {
        pickers.delete(ev.target.pickerId);
    }
    escapeKeyUp() {
        removeLastPicker();
    }
    static get is() { return "ion-picker-controller"; }
    static get properties() { return { "create": { "method": true }, "dismiss": { "method": true }, "getTop": { "method": true } }; }
}
function getHighestId() {
    let minimum = -1;
    pickers.forEach((_picker, id) => {
        if (id > minimum) {
            minimum = id;
        }
    });
    return minimum;
}
function removeLastPicker() {
    const toRemove = pickers.get(getHighestId());
    return toRemove ? toRemove.dismiss() : Promise.resolve();
}

export { Datetime as IonDatetime, Picker as IonPicker, PickerColumnCmp as IonPickerColumn, PickerController as IonPickerController };
