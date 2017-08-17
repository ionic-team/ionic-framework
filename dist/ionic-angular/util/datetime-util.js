import { isBlank, isPresent, isString } from './util';
/**
 * @param {?} template
 * @param {?} value
 * @param {?} locale
 * @return {?}
 */
export function renderDateTime(template, value, locale) {
    if (isBlank(value)) {
        return '';
    }
    var /** @type {?} */ tokens = [];
    var /** @type {?} */ hasText = false;
    FORMAT_KEYS.forEach(function (format, index) {
        if (template.indexOf(format.f) > -1) {
            var /** @type {?} */ token = '{' + index + '}';
            var /** @type {?} */ text = renderTextFormat(format.f, ((value))[format.k], value, locale);
            if (!hasText && text && isPresent(((value))[format.k])) {
                hasText = true;
            }
            tokens.push(token, text);
            template = template.replace(format.f, token);
        }
    });
    if (!hasText) {
        return '';
    }
    for (var /** @type {?} */ i = 0; i < tokens.length; i += 2) {
        template = template.replace(tokens[i], tokens[i + 1]);
    }
    return template;
}
/**
 * @param {?} format
 * @param {?} value
 * @param {?} date
 * @param {?} locale
 * @return {?}
 */
export function renderTextFormat(format, value, date, locale) {
    if (format === FORMAT_DDDD || format === FORMAT_DDD) {
        try {
            value = (new Date(date.year, date.month - 1, date.day)).getDay();
            if (format === FORMAT_DDDD) {
                return (isPresent(locale.dayNames) ? locale.dayNames : DAY_NAMES)[value];
            }
            return (isPresent(locale.dayShortNames) ? locale.dayShortNames : DAY_SHORT_NAMES)[value];
        }
        catch (e) { }
        return '';
    }
    if (format === FORMAT_A) {
        return date ? date.hour < 12 ? 'AM' : 'PM' : isPresent(value) ? value.toUpperCase() : '';
    }
    if (format === FORMAT_a) {
        return date ? date.hour < 12 ? 'am' : 'pm' : isPresent(value) ? value : '';
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
        return (isPresent(locale.monthNames) ? locale.monthNames : MONTH_NAMES)[value - 1];
    }
    if (format === FORMAT_MMM) {
        return (isPresent(locale.monthShortNames) ? locale.monthShortNames : MONTH_SHORT_NAMES)[value - 1];
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
/**
 * @param {?} format
 * @param {?} min
 * @param {?} max
 * @return {?}
 */
export function dateValueRange(format, min, max) {
    var /** @type {?} */ opts = [];
    var /** @type {?} */ i;
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
/**
 * @param {?} year
 * @param {?} month
 * @param {?} day
 * @param {?=} hour
 * @param {?=} minute
 * @return {?}
 */
export function dateSortValue(year, month, day, hour, minute) {
    if (hour === void 0) { hour = 0; }
    if (minute === void 0) { minute = 0; }
    return parseInt("1" + fourDigit(year) + twoDigit(month) + twoDigit(day) + twoDigit(hour) + twoDigit(minute), 10);
}
/**
 * @param {?} data
 * @return {?}
 */
export function dateDataSortValue(data) {
    if (data) {
        return dateSortValue(data.year, data.month, data.day, data.hour, data.minute);
    }
    return -1;
}
/**
 * @param {?} month
 * @param {?} year
 * @return {?}
 */
export function daysInMonth(month, year) {
    return (month === 4 || month === 6 || month === 9 || month === 11) ? 30 : (month === 2) ? isLeapYear(year) ? 29 : 28 : 31;
}
/**
 * @param {?} year
 * @return {?}
 */
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
var /** @type {?} */ ISO_8601_REGEXP = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
var /** @type {?} */ TIME_REGEXP = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
/**
 * @param {?} val
 * @return {?}
 */
export function parseDate(val) {
    // manually parse IS0 cuz Date.parse cannot be trusted
    // ISO 8601 format: 1994-12-15T13:47:20Z
    var /** @type {?} */ parse;
    if (isPresent(val) && val !== '') {
        // try parsing for just time first, HH:MM
        parse = TIME_REGEXP.exec(val);
        if (isPresent(parse)) {
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
    for (var /** @type {?} */ i = 1; i < 8; i++) {
        parse[i] = (parse[i] !== undefined ? parseInt(parse[i], 10) : null);
    }
    var /** @type {?} */ tzOffset = 0;
    if (isPresent(parse[9]) && isPresent(parse[10])) {
        // hours
        tzOffset = parseInt(parse[10], 10) * 60;
        if (isPresent(parse[11])) {
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
/**
 * @param {?} existingData
 * @param {?} newData
 * @return {?}
 */
export function updateDate(existingData, newData) {
    if (isPresent(newData) && newData !== '') {
        if (isString(newData)) {
            // new date is a string, and hopefully in the ISO format
            // convert it to our DateTimeData if a valid ISO
            newData = parseDate(newData);
            if (newData) {
                // successfully parsed the ISO string to our DateTimeData
                Object.assign(existingData, newData);
                return true;
            }
        }
        else if ((isPresent(newData.year) || isPresent(newData.hour) || isPresent(newData.month) || isPresent(newData.day) || isPresent(newData.minute) || isPresent(newData.second))) {
            // newData is from of a datetime picker's selected values
            // update the existing DateTimeData data with the new values
            // do some magic for 12-hour values
            if (isPresent(newData.ampm) && isPresent(newData.hour)) {
                if (newData.ampm.value === 'pm') {
                    newData.hour.value = (newData.hour.value === 12 ? 12 : newData.hour.value + 12);
                }
                else {
                    newData.hour.value = (newData.hour.value === 12 ? 0 : newData.hour.value);
                }
            }
            // merge new values from the picker's selection
            // to the existing DateTimeData values
            for (var /** @type {?} */ k in newData) {
                ((existingData))[k] = newData[k].value;
            }
            return true;
        }
        // eww, invalid data
        console.warn("Error parsing date: \"" + newData + "\". Please provide a valid ISO 8601 datetime format: https://www.w3.org/TR/NOTE-datetime");
    }
    else {
        // blank data, clear everything out
        for (var /** @type {?} */ k in existingData) {
            delete ((existingData))[k];
        }
    }
    return false;
}
/**
 * @param {?} template
 * @return {?}
 */
export function parseTemplate(template) {
    var /** @type {?} */ formats = [];
    template = template.replace(/[^\w\s]/gi, ' ');
    FORMAT_KEYS.forEach(function (format) {
        if (format.f.length > 1 && template.indexOf(format.f) > -1 && template.indexOf(format.f + format.f.charAt(0)) < 0) {
            template = template.replace(format.f, ' ' + format.f + ' ');
        }
    });
    var /** @type {?} */ words = template.split(' ').filter(function (w) { return w.length > 0; });
    words.forEach(function (word, i) {
        FORMAT_KEYS.forEach(function (format) {
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
/**
 * @param {?} date
 * @param {?} format
 * @return {?}
 */
export function getValueFromFormat(date, format) {
    if (format === FORMAT_A || format === FORMAT_a) {
        return (date.hour < 12 ? 'am' : 'pm');
    }
    if (format === FORMAT_hh || format === FORMAT_h) {
        return (date.hour > 12 ? date.hour - 12 : date.hour);
    }
    return ((date))[convertFormatToKey(format)];
}
/**
 * @param {?} format
 * @return {?}
 */
export function convertFormatToKey(format) {
    for (var /** @type {?} */ k in FORMAT_KEYS) {
        if (FORMAT_KEYS[k].f === format) {
            return FORMAT_KEYS[k].k;
        }
    }
    return null;
}
/**
 * @param {?} data
 * @return {?}
 */
export function convertDataToISO(data) {
    // https://www.w3.org/TR/NOTE-datetime
    var /** @type {?} */ rtn = '';
    if (isPresent(data)) {
        if (isPresent(data.year)) {
            // YYYY
            rtn = fourDigit(data.year);
            if (isPresent(data.month)) {
                // YYYY-MM
                rtn += '-' + twoDigit(data.month);
                if (isPresent(data.day)) {
                    // YYYY-MM-DD
                    rtn += '-' + twoDigit(data.day);
                    if (isPresent(data.hour)) {
                        // YYYY-MM-DDTHH:mm:SS
                        rtn += "T" + twoDigit(data.hour) + ":" + twoDigit(data.minute) + ":" + twoDigit(data.second);
                        if (data.millisecond > 0) {
                            // YYYY-MM-DDTHH:mm:SS.SSS
                            rtn += '.' + threeDigit(data.millisecond);
                        }
                        if (isBlank(data.tzOffset) || data.tzOffset === 0) {
                            // YYYY-MM-DDTHH:mm:SSZ
                            rtn += 'Z';
                        }
                        else {
                            // YYYY-MM-DDTHH:mm:SS+/-HH:mm
                            rtn += (data.tzOffset > 0 ? '+' : '-') + twoDigit(Math.floor(data.tzOffset / 60)) + ':' + twoDigit(data.tzOffset % 60);
                        }
                    }
                }
            }
        }
        else if (isPresent(data.hour)) {
            // HH:mm
            rtn = twoDigit(data.hour) + ':' + twoDigit(data.minute);
            if (isPresent(data.second)) {
                // HH:mm:SS
                rtn += ':' + twoDigit(data.second);
                if (isPresent(data.millisecond)) {
                    // HH:mm:SS.SSS
                    rtn += '.' + threeDigit(data.millisecond);
                }
            }
        }
    }
    return rtn;
}
/**
 * @param {?} val
 * @return {?}
 */
function twoDigit(val) {
    return ('0' + (isPresent(val) ? Math.abs(val) : '0')).slice(-2);
}
/**
 * @param {?} val
 * @return {?}
 */
function threeDigit(val) {
    return ('00' + (isPresent(val) ? Math.abs(val) : '0')).slice(-3);
}
/**
 * @param {?} val
 * @return {?}
 */
function fourDigit(val) {
    return ('000' + (isPresent(val) ? Math.abs(val) : '0')).slice(-4);
}
var /** @type {?} */ FORMAT_YYYY = 'YYYY';
var /** @type {?} */ FORMAT_YY = 'YY';
var /** @type {?} */ FORMAT_MMMM = 'MMMM';
var /** @type {?} */ FORMAT_MMM = 'MMM';
var /** @type {?} */ FORMAT_MM = 'MM';
var /** @type {?} */ FORMAT_M = 'M';
var /** @type {?} */ FORMAT_DDDD = 'DDDD';
var /** @type {?} */ FORMAT_DDD = 'DDD';
var /** @type {?} */ FORMAT_DD = 'DD';
var /** @type {?} */ FORMAT_D = 'D';
var /** @type {?} */ FORMAT_HH = 'HH';
var /** @type {?} */ FORMAT_H = 'H';
var /** @type {?} */ FORMAT_hh = 'hh';
var /** @type {?} */ FORMAT_h = 'h';
var /** @type {?} */ FORMAT_mm = 'mm';
var /** @type {?} */ FORMAT_m = 'm';
var /** @type {?} */ FORMAT_ss = 'ss';
var /** @type {?} */ FORMAT_s = 's';
var /** @type {?} */ FORMAT_A = 'A';
var /** @type {?} */ FORMAT_a = 'a';
var /** @type {?} */ FORMAT_KEYS = [
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
var /** @type {?} */ DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
var /** @type {?} */ DAY_SHORT_NAMES = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
];
var /** @type {?} */ MONTH_NAMES = [
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
var /** @type {?} */ MONTH_SHORT_NAMES = [
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
var /** @type {?} */ VALID_AMPM_PREFIX = [
    FORMAT_hh, FORMAT_h, FORMAT_mm, FORMAT_m, FORMAT_ss, FORMAT_s
];
//# sourceMappingURL=datetime-util.js.map