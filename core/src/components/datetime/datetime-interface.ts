export interface DatetimeOptions {
  tmp?: string;
}

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
  tzOffset?: number;
}

export type DatetimePresentation = 'date-time' | 'time-date' | 'date' | 'time' | 'month' | 'year' | 'month-year';

export type TitleSelectedDatesFormatter = (selectedDates: string[]) => string;

export type DatetimeHighlightStyle =
  | {
      color: string;
      backgroundColor?: string;
    }
  | {
      color?: string;
      backgroundColor: string;
    };

export type DatetimeHighlight = { date: string } & DatetimeHighlightStyle;

export type DatetimeHighlightCallback = (dateIsoString: string) => DatetimeHighlightStyle | undefined;
