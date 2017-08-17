export declare function renderDateTime(template: string, value: DateTimeData, locale: LocaleData): string;
export declare function renderTextFormat(format: string, value: any, date: DateTimeData, locale: LocaleData): string;
export declare function dateValueRange(format: string, min: DateTimeData, max: DateTimeData): any[];
export declare function dateSortValue(year: number, month: number, day: number, hour?: number, minute?: number): number;
export declare function dateDataSortValue(data: DateTimeData): number;
export declare function daysInMonth(month: number, year: number): number;
export declare function isLeapYear(year: number): boolean;
export declare function parseDate(val: any): DateTimeData;
export declare function updateDate(existingData: DateTimeData, newData: any): boolean;
export declare function parseTemplate(template: string): string[];
export declare function getValueFromFormat(date: DateTimeData, format: string): any;
export declare function convertFormatToKey(format: string): string;
export declare function convertDataToISO(data: DateTimeData): string;
export interface DateTimeData {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
    tzOffset?: number;
}
export interface LocaleData {
    monthNames?: string[];
    monthShortNames?: string[];
    dayNames?: string[];
    dayShortNames?: string[];
}
