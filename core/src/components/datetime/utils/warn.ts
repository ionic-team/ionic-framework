import { printIonWarning } from '@utils/logging';

import type { DatetimePresentation, FormatOptions } from '../datetime-interface';

/**
 * If a time zone is provided in the format options, the rendered text could
 * differ from what was selected in the Datetime, which could cause
 * confusion.
 */
export const warnIfTimeZoneProvided = (formatOptions?: FormatOptions) => {
  if (
    formatOptions?.date?.timeZone ||
    formatOptions?.date?.timeZoneName ||
    formatOptions?.time?.timeZone ||
    formatOptions?.time?.timeZoneName
  ) {
    printIonWarning('Datetime: "timeZone" and "timeZoneName" are not supported in "formatOptions".');
  }
};

export const checkForPresentationFormatMismatch = (
  presentation: DatetimePresentation,
  formatOptions?: FormatOptions
) => {
  // formatOptions is not required
  if (!formatOptions) return;

  // If formatOptions is provided, the date and/or time objects are required, depending on the presentation
  switch (presentation) {
    case 'date':
    case 'month-year':
    case 'month':
    case 'year':
      if (formatOptions.date === undefined) {
        printIonWarning(`Datetime: The '${presentation}' presentation requires a date object in formatOptions.`);
      }
      break;
    case 'time':
      if (formatOptions.time === undefined) {
        printIonWarning(`Datetime: The 'time' presentation requires a time object in formatOptions.`);
      }
      break;
    case 'date-time':
    case 'time-date':
      if (formatOptions.date === undefined && formatOptions.time === undefined) {
        printIonWarning(
          `Datetime: The '${presentation}' presentation requires either a date or time object (or both) in formatOptions.`
        );
      }
      break;
  }
};
