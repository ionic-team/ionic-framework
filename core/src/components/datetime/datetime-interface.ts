export interface DatetimeChangeEventDetail {
  value?: string | string[] | null;
}

export interface DatetimeCustomEvent extends CustomEvent {
  detail: DatetimeChangeEventDetail;
  target: HTMLIonDatetimeElement;
}

export interface DatetimeParts {
  month: number;
  day: number | null;
  year: number;
  dayOfWeek?: number | null;
  hour?: number;
  minute?: number;
  ampm?: 'am' | 'pm';
}

export type DatetimePresentation = 'date-time' | 'time-date' | 'date' | 'time' | 'month' | 'year' | 'month-year';

export type TitleSelectedDatesFormatter = (selectedDates: string[]) => string;

export type DatetimeHighlightStyle =
  | {
    textColor: string;
    backgroundColor?: string;
  }
  | {
    textColor?: string;
    backgroundColor: string;
  };

export type DatetimeHighlight = { date: string } & DatetimeHighlightStyle;

export type DatetimeHighlightCallback = (dateIsoString: string) => DatetimeHighlightStyle | undefined;

export type DatetimeHourCycle = 'h11' | 'h12' | 'h23' | 'h24';

export type TimeFormatOptions = { time: Intl.DateTimeFormatOptions };
export type DateFormatOptions = { date: Intl.DateTimeFormatOptions };
export type DatetimeFormatOptions = TimeFormatOptions | DateFormatOptions;
