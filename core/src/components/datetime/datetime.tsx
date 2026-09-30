import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h, writeTask } from '@stencil/core';
import { startFocusVisible } from '@utils/focus-visible';
import { getElementRoot, raf, renderHiddenInput } from '@utils/helpers';
import { printIonError, printIonWarning } from '@utils/logging';
import { FOCUS_TRAP_DISABLE_CLASS } from '@utils/overlays';
import { isRTL } from '@utils/rtl';
import { createColorClasses } from '@utils/theme';
import { caretDownSharp, caretUpSharp, chevronBack, chevronDown, chevronForward } from 'ionicons/icons';

import { config } from '../../global/config';
import { getIonMode, getIonTheme } from '../../global/ionic-global';
import type { Color, StyleEventDetail, Theme } from '../../interface';

import type {
  DatetimePresentation,
  DatetimeNavigationOrientation,
  DatetimeChangeEventDetail,
  DatetimeParts,
  TitleSelectedDatesFormatter,
  DatetimeHighlight,
  DatetimeHighlightStyle,
  DatetimeHighlightCallback,
  DatetimeHourCycle,
  FormatOptions,
} from './datetime-interface';
import { isSameDay, warnIfValueOutOfBounds, isBefore, isAfter } from './utils/comparison';
import type { WheelColumnOption } from './utils/data';
import {
  generateMonths,
  getDaysOfMonth,
  getDaysOfWeek,
  getToday,
  getMonthColumnData,
  getDayColumnData,
  getYearColumnData,
  getTimeColumnsData,
  getCombinedDateColumnData,
} from './utils/data';
import { formatValue, getLocalizedDateTime, getLocalizedTime, getMonthAndYear } from './utils/format';
import { isLocaleDayPeriodRTL, isMonthFirstLocale, getNumDaysInMonth, getHourCycle } from './utils/helpers';
import {
  calculateHourFromAMPM,
  convertDataToISO,
  getClosestValidDate,
  getEndOfWeek,
  getNextDay,
  getNextMonth,
  getNextWeek,
  getNextYear,
  getPreviousDay,
  getPreviousMonth,
  getPreviousWeek,
  getPreviousYear,
  getStartOfWeek,
  validateParts,
} from './utils/manipulation';
import {
  clampDate,
  convertToArrayOfNumbers,
  getPartsFromCalendarDay,
  parseAmPm,
  parseDate,
  parseMaxParts,
  parseMinParts,
} from './utils/parse';
import {
  getCalendarDayState,
  getHighlightStyles,
  isDayDisabled,
  isMonthDisabled,
  isNextMonthDisabled,
  isPrevMonthDisabled,
} from './utils/state';
import { checkForPresentationFormatMismatch, warnIfTimeZoneProvided } from './utils/validate';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot title - The title of the datetime.
 * @slot buttons - The buttons in the datetime.
 * @slot time-label - The label for the time selector in the datetime.
 *
 * @part wheel - The wheel container when using a wheel style layout, or in the month/year picker when using a grid style layout.
 * @part wheel-item - The individual items when using a wheel style layout, or in the
 * month/year picker when using a grid style layout.
 * @part wheel-item active - The currently selected wheel-item.
 *
 * @part time-button - The button that opens the time picker when using a grid style
 * layout with `presentation="date-time"` or `"time-date"`.
 * @part time-button active - The time picker button when the picker is open.
 *
 * @part calendar-header - The calendar header manages the date navigation controls (month/year picker and previous/next buttons) and the days of the week when using a grid style layout.
 * @part month-year-button - The button that opens the month/year picker when
 * using a grid style layout.
 * @part navigation-button - The buttons used to navigate to the next or previous month when using a grid style layout.
 * @part previous-button - The button used to navigate to the previous month when using a grid style layout.
 * @part next-button - The button used to navigate to the next month when using a grid style layout.
 * @part calendar-days-of-week - The container for the day-of-the-week header (both weekdays and weekends) when using a grid style layout.
 *
 * @part calendar-day - The individual buttons that display a day inside of the datetime
 * calendar.
 * @part calendar-day active - The currently selected calendar day.
 * @part calendar-day today - The calendar day that contains the current day.
 * @part calendar-day disabled - The calendar day that is disabled.
 *
 * @part datetime-header - The datetime header contains the content for the `title` slot and the selected date.
 * @part datetime-title - The element that contains the `title` slot content.
 * @part datetime-selected-date - The element that contains the selected date.
 */
@Component({
  tag: 'ion-datetime',
  styleUrls: {
    ios: 'datetime.ios.scss',
    md: 'datetime.md.scss',
    ionic: 'datetime.ionic.scss',
  },
  shadow: true,
})
export class Datetime implements ComponentInterface {
  private inputId = `ion-dt-${datetimeIds++}`;
  private calendarBodyRef?: HTMLElement;
  private popoverRef?: HTMLIonPopoverElement;
  private intersectionTrackerRef?: HTMLElement;
  private clearFocusVisible?: () => void;
  private parsedMinuteValues?: number[];
  private parsedHourValues?: number[];
  private parsedMonthValues?: number[];
  private parsedYearValues?: number[];
  private parsedDayValues?: number[];

  private destroyCalendarListener?: () => void;
  private destroyKeyboardMO?: () => void;

  // TODO(FW-2832): types (DatetimeParts causes some errors that need untangling)
  private minParts?: any;
  private maxParts?: any;
  private todayParts!: DatetimeParts;
  private defaultParts!: DatetimeParts;
  private loadTimeout: ReturnType<typeof setTimeout> | undefined;
  /**
   * Set true only by `visibleCallback`. Lets `hiddenCallback` ignore the
   * synthetic "not intersecting" entry IntersectionObserver fires on
   * `observe()` when the host mounts offscreen.
   *
   * Don't reset this in `disconnectedCallback`. Overlays disconnect and
   * reconnect the host without re-creating the observers, so a reset there
   * makes `hiddenCallback` miss the dismissal.
   */
  private hasBeenIntersecting = false;

  private prevPresentation: string | null = null;
  // Lets `componentDidRender` spot an axis change and rebuild the scroll listener against the new layout.
  private prevNavigationOrientation: DatetimeNavigationOrientation | null = null;

  private resolveForceDateScrolling?: () => void;

  @State() showMonthAndYear = false;

  @State() activeParts: DatetimeParts | DatetimeParts[] = [];

  @State() workingParts: DatetimeParts = {
    month: 5,
    day: 28,
    year: 2021,
    hour: 13,
    minute: 52,
    ampm: 'pm',
    isAdjacentDay: false,
  };

  @Element() el!: HTMLIonDatetimeElement;

  @State() isTimePopoverOpen = false;

  /**
   * When defined, will force the datetime to render the month
   * containing the specified date. Currently, this should only
   * be used to enable immediately auto-scrolling to the new month,
   * and should then be reset to undefined once the transition is
   * finished and the forced month is now in view.
   *
   * Applies to grid-style datetimes only.
   */
  @State() forceRenderDate?: DatetimeParts;

  /**
   * The month the vertical window is built around. Distinct from
   * `workingParts`, which follows the month nearest the top of the list and
   * therefore changes constantly while scrolling. Re-centering the window is
   * a re-render, so it only happens when the user nears an edge.
   */
  @State() verticalWindowCenter?: DatetimeParts;

  /**
   * Scroll adjustment owed once a rebuilt window has actually rendered, with
   * the month list it was computed for. Refer to `queueVerticalCorrection`.
   */
  private pendingVerticalScrollCorrection?: { amount: number; expected: string };

  /** The list's scroll position just before the patch that rebuilds it. */
  private verticalScrollTopBeforeRender?: number;

  /** Month to bring to the top of the list once the window has rendered. */
  private pendingVerticalInitialScroll?: DatetimeParts;

  /**
   * Months rendered in place of the window while gliding to a month the
   * window does not contain. Refer to `glideToVerticalMonth`.
   */
  @State() verticalSplice?: DatetimeParts[];

  /** Month a glide is heading to. Set for the whole glide. */
  private verticalGlideTarget?: DatetimeParts;

  /** Month to start gliding to once the spliced list has rendered. */
  private pendingVerticalGlide?: DatetimeParts;

  /** Removes the listeners that detect the end of a glide. */
  private stopVerticalGlide?: () => void;

  /**
   * Months rendered either side of the window center. Grows with the height
   * of the list, so a datetime filling a tall container still has months
   * beyond the visible ones to scroll into. Refer to `resizeVerticalWindow`.
   */
  @State() verticalWindowRadius = VERTICAL_WINDOW_RADIUS;

  /** Day to give focus back to once a rebuilt window has rendered. */
  private pendingVerticalRefocus?: DatetimeParts;

  /** Month on screen when the month/year picker opened. */
  private verticalMonthAtPickerOpen?: DatetimeParts;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, refer to [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * If `true`, the user cannot interact with the datetime.
   */
  @Prop() disabled = false;

  /**
   * Formatting options for dates and times.
   * Should include a 'date' and/or 'time' object, each of which is of type [Intl.DateTimeFormatOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options).
   *
   */
  @Prop() formatOptions?: FormatOptions;

  @Watch('formatOptions')
  protected formatOptionsChanged() {
    const { el, formatOptions, presentation } = this;
    checkForPresentationFormatMismatch(el, presentation, formatOptions);
    warnIfTimeZoneProvided(el, formatOptions);
  }

  /**
   * If `true`, the datetime appears normal but the selected date cannot be changed.
   */
  @Prop() readonly = false;

  /**
   * Returns if an individual date (calendar day) is enabled or disabled.
   *
   * If `true`, the day will be enabled/interactive.
   * If `false`, the day will be disabled/non-interactive.
   *
   * The function accepts an ISO 8601 date string of a given day.
   * By default, all days are enabled. Developers can use this function
   * to write custom logic to disable certain days.
   *
   * The function is called for each rendered calendar day, for the previous, current and next month.
   * Custom implementations should be optimized for performance to avoid jank.
   */
  @Prop() isDateEnabled?: (dateIsoString: string) => boolean;

  /**
   * If `true`, the datetime calendar displays a six-week (42-day) layout,
   * including days from the previous and next months to fill the grid.
   * These adjacent days are selectable unless disabled.
   * Has no effect when `navigationOrientation` is `"vertical"`.
   */
  @Prop() showAdjacentDays = false;

  @Watch('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  /**
   * The minimum datetime allowed. Value must be a date string
   * following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * such as `1996-12-19`. The format does not have to be specific to an exact
   * datetime. For example, the minimum could just be the year, such as `1994`.
   * Defaults to the beginning of the year, 100 years ago from today.
   */
  @Prop({ mutable: true }) min?: string;

  @Watch('min')
  protected minChanged() {
    this.processMinParts();
    this.holdVerticalPosition();
  }

  /**
   * The maximum datetime allowed. Value must be a date string
   * following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * `1996-12-19`. The format does not have to be specific to an exact
   * datetime. For example, the maximum could just be the year, such as `1994`.
   * Defaults to the end of this year.
   */
  @Prop({ mutable: true }) max?: string;

  @Watch('max')
  protected maxChanged() {
    this.processMaxParts();
    this.holdVerticalPosition();
  }

  /**
   * Which values you want to select. `"date"` will show
   * a calendar picker to select the month, day, and year. `"time"`
   * will show a time picker to select the hour, minute, and (optionally)
   * AM/PM. `"date-time"` will show the date picker first and time picker second.
   * `"time-date"` will show the time picker first and date picker second.
   */
  @Prop() presentation: DatetimePresentation = 'date-time';

  @Watch('presentation')
  protected presentationChanged() {
    const { el, formatOptions, presentation } = this;
    checkForPresentationFormatMismatch(el, presentation, formatOptions);
  }

  private get isGridStyle() {
    const { presentation, preferWheel } = this;
    const hasDatePresentation = presentation === 'date' || presentation === 'date-time' || presentation === 'time-date';
    return hasDatePresentation && !preferWheel;
  }

  /**
   * Vertical navigation only applies to the calendar grid, so it is gated
   * behind the same check as the grid itself. Everything that branches on
   * the navigation axis should use this rather than reading the prop, so
   * that `navigationOrientation="vertical"` is inert when no grid is shown.
   */
  private get isVerticalNavigation() {
    return this.isGridStyle && this.navigationOrientation === 'vertical';
  }

  /**
   * Vertical never renders adjacent days. A continuous list shows the
   * neighbouring month in full right beside the current one, so an adjacent
   * day would put the same date on screen twice, and selecting it would
   * highlight both. Neither Material nor iOS renders them either.
   */
  private get rendersAdjacentDays() {
    return this.showAdjacentDays && !this.isVerticalNavigation;
  }

  /**
   * The text to display on the picker's cancel button.
   */
  @Prop() cancelText = 'Cancel';

  /**
   * The text to display on the picker's "Done" button.
   */
  @Prop() doneText = 'Done';

  /**
   * The text to display on the picker's "Clear" button.
   */
  @Prop() clearText = 'Clear';

  /**
   * Values used to create the list of selectable years. By default
   * the year values range between the `min` and `max` datetime inputs. However, to
   * control exactly which years to display, the `yearValues` input can take a number, an array
   * of numbers, or string of comma separated numbers. For example, to show upcoming and
   * recent leap years, then this input's value would be `yearValues="2008,2012,2016,2020,2024"`.
   */
  @Prop() yearValues?: number[] | number | string;
  @Watch('yearValues')
  protected yearValuesChanged() {
    this.parsedYearValues = convertToArrayOfNumbers(this.yearValues);
  }

  /**
   * Values used to create the list of selectable months. By default
   * the month values range from `1` to `12`. However, to control exactly which months to
   * display, the `monthValues` input can take a number, an array of numbers, or a string of
   * comma separated numbers. For example, if only summer months should be shown, then this
   * input value would be `monthValues="6,7,8"`. Note that month numbers do *not* have a
   * zero-based index, meaning January's value is `1`, and December's is `12`.
   */
  @Prop() monthValues?: number[] | number | string;
  @Watch('monthValues')
  protected monthValuesChanged() {
    this.parsedMonthValues = convertToArrayOfNumbers(this.monthValues);
  }

  /**
   * Values used to create the list of selectable days. By default
   * every day is shown for the given month. However, to control exactly which days of
   * the month to display, the `dayValues` input can take a number, an array of numbers, or
   * a string of comma separated numbers. Note that even if the array days have an invalid
   * number for the selected month, like `31` in February, it will correctly not show
   * days which are not valid for the selected month.
   */
  @Prop() dayValues?: number[] | number | string;
  @Watch('dayValues')
  protected dayValuesChanged() {
    this.parsedDayValues = convertToArrayOfNumbers(this.dayValues);
  }

  /**
   * Values used to create the list of selectable hours. By default
   * the hour values range from `0` to `23` for 24-hour, or `1` to `12` for 12-hour. However,
   * to control exactly which hours to display, the `hourValues` input can take a number, an
   * array of numbers, or a string of comma separated numbers.
   */
  @Prop() hourValues?: number[] | number | string;
  @Watch('hourValues')
  protected hourValuesChanged() {
    this.parsedHourValues = convertToArrayOfNumbers(this.hourValues);
  }

  /**
   * Values used to create the list of selectable minutes. By default
   * the minutes range from `0` to `59`. However, to control exactly which minutes to display,
   * the `minuteValues` input can take a number, an array of numbers, or a string of comma
   * separated numbers. For example, if the minute selections should only be every 15 minutes,
   * then this input value would be `minuteValues="0,15,30,45"`.
   */
  @Prop() minuteValues?: number[] | number | string;
  @Watch('minuteValues')
  protected minuteValuesChanged() {
    this.parsedMinuteValues = convertToArrayOfNumbers(this.minuteValues);
  }

  /**
   * The locale to use for `ion-datetime`. This
   * impacts month and day name formatting.
   * The `"default"` value refers to the default
   * locale set by your device.
   */
  @Prop() locale = 'default';

  /**
   * The first day of the week to use for `ion-datetime`. The
   * default value is `0` and represents Sunday.
   */
  @Prop() firstDayOfWeek = 0;

  /**
   * A callback used to format the header text that shows how many
   * dates are selected. Only used if there are 0 or more than 1
   * selected (i.e. unused for exactly 1). By default, the header
   * text is set to "numberOfDates days".
   *
   * See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this
   * if you need to access `this` from within the callback.
   */
  @Prop() titleSelectedDatesFormatter?: TitleSelectedDatesFormatter;

  /**
   * If `true`, multiple dates can be selected at once. Only
   * applies to `presentation="date"` and `preferWheel="false"`.
   */
  @Prop() multiple = false;

  /**
   * Used to apply custom text and background colors to specific dates.
   *
   * Can be either an array of objects containing ISO strings and colors,
   * or a callback that receives an ISO string and returns the colors.
   *
   * Only applies to the `date`, `date-time`, and `time-date` presentations,
   * with `preferWheel="false"`.
   */
  @Prop() highlightedDates?: DatetimeHighlight[] | DatetimeHighlightCallback;

  /**
   * The value of the datetime as a valid ISO 8601 datetime string.
   * This should be an array of strings only when `multiple="true"`.
   */
  @Prop({ mutable: true }) value?: string | string[] | null;

  /**
   * Update the datetime value when the value changes
   */
  @Watch('value')
  protected async valueChanged() {
    const { value } = this;

    if (this.hasValue()) {
      this.processValue(value);
    }

    this.emitStyle();
    this.ionValueChange.emit({ value });
  }

  /**
   * If `true`, a header will be shown above the calendar
   * picker. This will include both the slotted title, and
   * the selected date.
   */
  @Prop() showDefaultTitle = false;

  /**
   * If `true`, the default "Cancel" and "OK" buttons
   * will be rendered at the bottom of the `ion-datetime`
   * component. Developers can also use the `button` slot
   * if they want to customize these buttons. If custom
   * buttons are set in the `button` slot then the
   * default buttons will not be rendered.
   */
  @Prop() showDefaultButtons = false;

  /**
   * If `true`, a "Clear" button will be rendered alongside
   * the default "Cancel" and "OK" buttons at the bottom of the `ion-datetime`
   * component. Developers can also use the `button` slot
   * if they want to customize these buttons. If custom
   * buttons are set in the `button` slot then the
   * default buttons will not be rendered.
   */
  @Prop() showClearButton = false;

  /**
   * If `true`, the default "Time" label will be rendered
   * for the time selector of the `ion-datetime` component.
   * Developers can also use the `time-label` slot
   * if they want to customize this label. If a custom
   * label is set in the `time-label` slot then the
   * default label will not be rendered.
   */
  @Prop() showDefaultTimeLabel = true;

  /**
   * The hour cycle of the `ion-datetime`. If no value is set, this is
   * specified by the current locale.
   */
  @Prop() hourCycle?: DatetimeHourCycle;

  /**
   * If `cover`, the `ion-datetime` will expand to cover the full width of its container.
   * If `fixed`, the `ion-datetime` will have a fixed width.
   */
  @Prop() size: 'cover' | 'fixed' = 'fixed';

  /**
   * If `true`, a wheel picker will be rendered instead of a calendar grid
   * where possible. If `false`, a calendar grid will be rendered instead of
   * a wheel picker where possible.
   *
   * A wheel picker can be rendered instead of a grid when `presentation` is
   * one of the following values: `"date"`, `"date-time"`, or `"time-date"`.
   *
   * A wheel picker will always be rendered regardless of
   * the `preferWheel` value when `presentation` is one of the following values:
   * `"time"`, `"month"`, `"month-year"`, or `"year"`.
   */
  @Prop() preferWheel = false;

  /**
   * The axis the calendar grid uses to navigate between months.
   *
   * `"horizontal"` pages left and right. `"vertical"` pages up and down.
   * Both snap one month at a time, and the previous/next buttons work in
   * either orientation.
   *
   * This has no effect when a wheel picker is rendered, or when `presentation`
   * is one of the following values: `"time"`, `"month"`, `"month-year"`, or
   * `"year"`.
   */
  @Prop() navigationOrientation: DatetimeNavigationOrientation = 'horizontal';

  /**
   * Emitted when the datetime selection was cancelled.
   */
  @Event() ionCancel!: EventEmitter<void>;

  /**
   * Emitted when the value (selected date) has changed.
   *
   * This event will not emit when programmatically setting the `value` property.
   */
  @Event() ionChange!: EventEmitter<DatetimeChangeEventDetail>;

  /**
   * Emitted when the value property has changed.
   * This is used to ensure that ion-datetime-button can respond
   * to any value property changes.
   * @internal
   */
  @Event() ionValueChange!: EventEmitter<DatetimeChangeEventDetail>;

  /**
   * Emitted when the datetime has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the datetime loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  /**
   * Emitted when componentDidRender is fired.
   * @internal
   */
  @Event() ionRender!: EventEmitter<void>;

  /**
   * Confirms the selected datetime value, updates the
   * `value` property, and optionally closes the popover
   * or modal that the datetime was presented in.
   *
   * @param closeOverlay If `true`, closes the parent overlay. Defaults to `false`.
   */
  @Method()
  async confirm(closeOverlay = false) {
    const { isCalendarPicker, activeParts, preferWheel, workingParts } = this;

    /**
     * We only update the value if the presentation is not a calendar picker.
     */
    if (activeParts !== undefined || !isCalendarPicker) {
      const activePartsIsArray = Array.isArray(activeParts);
      if (activePartsIsArray && activeParts.length === 0) {
        if (preferWheel) {
          /**
           * If the datetime is using a wheel picker, but the
           * active parts are empty, then the user has confirmed the
           * initial value (working parts) presented to them.
           */
          this.setValue(convertDataToISO(workingParts));
        } else {
          this.setValue(undefined);
        }
      } else {
        this.setValue(convertDataToISO(activeParts));
      }
    }

    if (closeOverlay) {
      this.closeParentOverlay(CONFIRM_ROLE);
    }
  }

  /**
   * Resets the internal state of the datetime but does not update the value.
   * Passing a valid ISO-8601 string will reset the state of the component to the provided date.
   * If no value is provided, the internal state will be reset to the clamped value of the min, max and today.
   *
   * @param startDate A valid [ISO-8601 string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format) to reset the datetime state to.
   */
  @Method()
  async reset(startDate?: string) {
    this.processValue(startDate);
  }

  /**
   * Emits the ionCancel event and
   * optionally closes the popover
   * or modal that the datetime was
   * presented in.
   *
   * @param closeOverlay If `true`, closes the parent overlay. Defaults to `false`.
   */
  @Method()
  async cancel(closeOverlay = false) {
    this.ionCancel.emit();

    if (closeOverlay) {
      this.closeParentOverlay(CANCEL_ROLE);
    }
  }

  /**
   * Returns the default parts the datetime falls back to when no value is set:
   * today's date and time snapped to the closest value allowed by the
   * component's constraints (`min`, `max`, and the `*Values` props).
   *
   * @internal
   */
  @Method()
  async getDefaultPart(): Promise<DatetimeParts> {
    return this.defaultParts;
  }

  private warnIfIncorrectValueUsage = () => {
    const { multiple, value } = this;
    if (!multiple && Array.isArray(value)) {
      /**
       * We do some processing on the `value` array so
       * that it looks more like an array when logged to
       * the console.
       * Example given ['a', 'b']
       * Default toString() behavior: a,b
       * Custom behavior: ['a', 'b']
       */
      printIonWarning(
        `[ion-datetime] - An array of values was passed, but multiple is "false". This is incorrect usage and may result in unexpected behaviors. To dismiss this warning, pass a string to the "value" property when multiple="false".

  Value Passed: [${value.map((v) => `'${v}'`).join(', ')}]
`,
        this.el
      );
    }
  };

  private setValue = (value?: string | string[] | null) => {
    this.value = value;
    this.ionChange.emit({ value });
  };

  /**
   * Returns the DatetimePart interface
   * to use when rendering an initial set of
   * data. This should be used when rendering an
   * interface in an environment where the `value`
   * may not be set. This function works
   * by returning the first selected date and then
   * falling back to defaultParts if no active date
   * is selected.
   */
  private getActivePartsWithFallback = () => {
    const { defaultParts } = this;
    return this.getActivePart() ?? defaultParts;
  };

  private getActivePart = () => {
    const { activeParts } = this;
    return Array.isArray(activeParts) ? activeParts[0] : activeParts;
  };

  private closeParentOverlay = (role: string) => {
    const popoverOrModal = this.el.closest('ion-modal, ion-popover') as
      | HTMLIonModalElement
      | HTMLIonPopoverElement
      | null;
    if (popoverOrModal) {
      popoverOrModal.dismiss(undefined, role);
    }
  };

  private setWorkingParts = (parts: DatetimeParts) => {
    this.workingParts = {
      ...parts,
    };
  };

  private setActiveParts = (parts: DatetimeParts, removeDate = false) => {
    /** if the datetime component is in readonly mode,
     * allow browsing of the calendar without changing
     * the set value
     */
    if (this.readonly) {
      return;
    }

    const { multiple, minParts, maxParts, activeParts } = this;

    /**
     * When setting the active parts, it is possible
     * to set invalid data. For example,
     * when updating January 31 to February,
     * February 31 does not exist. As a result
     * we need to validate the active parts and
     * ensure that we are only setting valid dates.
     * Additionally, we need to update the working parts
     * too in the event that the validated parts are different.
     */
    const validatedParts = validateParts(parts, minParts, maxParts);
    this.setWorkingParts(validatedParts);

    if (multiple) {
      const activePartsArray = Array.isArray(activeParts) ? activeParts : [activeParts];
      if (removeDate) {
        this.activeParts = activePartsArray.filter((p) => !isSameDay(p, validatedParts));
      } else {
        this.activeParts = [...activePartsArray, validatedParts];
      }
    } else {
      this.activeParts = {
        ...validatedParts,
      };
    }

    const hasSlottedButtons = this.el.querySelector('[slot="buttons"]') !== null;
    if (hasSlottedButtons || this.showDefaultButtons) {
      return;
    }

    this.confirm();
  };

  private get isCalendarPicker() {
    const { presentation } = this;
    return presentation === 'date' || presentation === 'date-time' || presentation === 'time-date';
  }

  private initializeKeyboardListeners = () => {
    const calendarBodyRef = this.calendarBodyRef;
    if (!calendarBodyRef) {
      return;
    }

    const root = this.el!.shadowRoot!;

    /**
     * Get a reference to the month
     * element we are currently viewing.
     *
     * Horizontal always shows the middle of its three months, so the second
     * element is stable. Vertical's window is wider and moves as the user
     * scrolls, so the second element is some other month entirely; there the
     * working month is looked up by its date at the moment focus moves.
     */
    const getCurrentMonth = () =>
      this.isVerticalNavigation
        ? calendarBodyRef.querySelector(
            `.calendar-month[data-month="${this.workingParts.month}"][data-year="${this.workingParts.year}"]`
          )
        : calendarBodyRef.querySelector('.calendar-month:nth-of-type(2)');

    const focusCurrentWorkingDay = () => {
      const currentMonth = getCurrentMonth();
      if (currentMonth) {
        this.focusWorkingDay(currentMonth);
      }
    };

    /**
     * When focusing the calendar body, we want to pass focus
     * to the working day, but other days should
     * only be accessible using the arrow keys. Pressing
     * Tab should jump between bodies of selectable content.
     */
    const checkCalendarBodyFocus = (ev: MutationRecord[]) => {
      const record = ev[0];

      /**
       * If calendar body was already focused
       * when this fired or if the calendar body
       * if not currently focused, we should not re-focus
       * the inner day.
       */
      if (record.oldValue?.includes('ion-focused') || !calendarBodyRef.classList.contains('ion-focused')) {
        return;
      }

      focusCurrentWorkingDay();
    };
    const mo = new MutationObserver(checkCalendarBodyFocus);
    mo.observe(calendarBodyRef, { attributeFilter: ['class'], attributeOldValue: true });

    this.destroyKeyboardMO = () => {
      mo?.disconnect();
    };

    /**
     * We must use keydown not keyup as we want
     * to prevent scrolling when using the arrow keys.
     */
    calendarBodyRef.addEventListener('keydown', (ev: KeyboardEvent) => {
      const activeElement = root.activeElement;
      if (!activeElement || !activeElement.classList.contains('calendar-day')) {
        return;
      }

      const parts = getPartsFromCalendarDay(activeElement as HTMLElement);

      let partsToFocus: DatetimeParts | undefined;
      switch (ev.key) {
        case 'ArrowDown':
          ev.preventDefault();
          partsToFocus = getNextWeek(parts);
          break;
        case 'ArrowUp':
          ev.preventDefault();
          partsToFocus = getPreviousWeek(parts);
          break;
        case 'ArrowRight':
          ev.preventDefault();
          partsToFocus = getNextDay(parts);
          break;
        case 'ArrowLeft':
          ev.preventDefault();
          partsToFocus = getPreviousDay(parts);
          break;
        case 'Home':
          ev.preventDefault();
          partsToFocus = getStartOfWeek(parts);
          break;
        case 'End':
          ev.preventDefault();
          partsToFocus = getEndOfWeek(parts);
          break;
        case 'PageUp':
          ev.preventDefault();
          partsToFocus = ev.shiftKey ? getPreviousYear(parts) : getPreviousMonth(parts);
          break;
        case 'PageDown':
          ev.preventDefault();
          partsToFocus = ev.shiftKey ? getNextYear(parts) : getNextMonth(parts);
          break;
        /**
         * Do not preventDefault here
         * as we do not want to override other
         * browser defaults such as pressing Enter/Space
         * to select a day.
         */
        default:
          return;
      }

      /**
       * If the day we want to move focus to is
       * disabled, do not do anything.
       */
      if (isDayDisabled(partsToFocus, this.minParts, this.maxParts)) {
        return;
      }

      this.setWorkingParts({
        ...this.workingParts,
        ...partsToFocus,
      });

      /**
       * Horizontal renders around `workingParts`, so the target month always
       * exists by the next frame. Vertical's window does not follow it, so a
       * month past the edge of the window, such as a year away with
       * Shift+PageDown, has to be rendered and scrolled to first.
       */
      if (this.isVerticalNavigation && !getCurrentMonth()) {
        this.cancelVerticalGlide();
        this.verticalWindowCenter = { month: partsToFocus.month, year: partsToFocus.year, day: null };
        this.pendingVerticalInitialScroll = { ...this.verticalWindowCenter };

        /**
         * The focused day's month is not in the new window at all, so its
         * node is removed rather than moved. Parking and refocusing on the
         * target keeps focus inside the component across the swap.
         */
        this.pendingVerticalRefocus = { ...partsToFocus };
      }

      /**
       * Give view a chance to re-render
       * then move focus to the new working day
       */
      requestAnimationFrame(focusCurrentWorkingDay);
    });
  };

  private focusWorkingDay = (currentMonth: Element) => {
    /**
     * Get the number of offset days so
     * we know how much to offset our next selector by
     * to grab the correct calendar-day element.
     */

    const { day, month, year } = this.workingParts;
    const firstOfMonth = new Date(`${month}/1/${year}`).getDay();
    const offset =
      firstOfMonth >= this.firstDayOfWeek
        ? firstOfMonth - this.firstDayOfWeek
        : 7 - (this.firstDayOfWeek - firstOfMonth);

    if (day === null) {
      return;
    }

    /**
     * Get the calendar day element
     * and focus it.
     */
    const dayEl = currentMonth.querySelector(
      `.calendar-day-wrapper:nth-of-type(${offset + day}) .calendar-day`
    ) as HTMLElement | null;
    if (dayEl) {
      dayEl.focus();
    }
  };

  private processMinParts = () => {
    const { min, defaultParts } = this;
    if (min === undefined) {
      this.minParts = undefined;
      return;
    }

    this.minParts = parseMinParts(min, defaultParts);
  };

  private processMaxParts = () => {
    const { max, defaultParts } = this;

    if (max === undefined) {
      this.maxParts = undefined;
      return;
    }

    this.maxParts = parseMaxParts(max, defaultParts);
  };

  /**
   * Builds the list of months rendered in vertical mode.
   *
   * Horizontal mode renders exactly three months because only one is ever
   * visible. Vertical shows more than one at a time, so the window has to be
   * wider than the viewport plus enough margin either side that the user can
   * scroll without immediately hitting the end.
   *
   * Every block is the same height, so shifting this window by n months moves
   * the content by exactly n block heights. Refer to `recenterVerticalWindow`.
   */
  /**
   * The window deliberately does not follow `workingParts`. That value tracks
   * the month nearest the top of the list and so changes throughout a scroll;
   * rebuilding the window on every change would shift the content under the
   * user and feed the scroll listener its own output. The center moves only
   * when `recenterVerticalWindow` decides it should.
   */
  private generateVerticalMonths(): DatetimeParts[] {
    return this.verticalSplice ?? this.generateVerticalMonthsAround(this.verticalWindowCenter ?? this.workingParts);
  }

  private generateVerticalMonthsAround(center: DatetimeParts): DatetimeParts[] {
    const { minParts, maxParts } = this;

    const months: DatetimeParts[] = [center];

    let previous = center;
    for (let i = 0; i < this.verticalWindowRadius; i++) {
      previous = getPreviousMonth(previous);
      if (minParts !== undefined && isBefore(previous, { ...minParts, day: 1 })) {
        break;
      }
      months.unshift(previous);
    }

    let next = center;
    for (let i = 0; i < this.verticalWindowRadius; i++) {
      next = getNextMonth(next);
      if (maxParts !== undefined && isAfter(next, { ...maxParts, day: 1 })) {
        break;
      }
      months.push(next);
    }

    return months;
  }

  /**
   * The month at the top of the list: the month the user is looking at, which
   * drives both `workingParts` and the decision to re-center the window.
   *
   * Computed from the first rendered month's offset rather than by finding
   * the nearest rendered block, because the viewport can be over the runway,
   * where no month is rendered yet. Every block is the same height, so the
   * month under the viewport follows by arithmetic even there.
   *
   * A spliced list is not contiguous, so during a glide the nearest rendered
   * block is used instead.
   */
  private getVerticalMonthAtTop(calendarBodyRef: HTMLElement): DatetimeParts | undefined {
    const containerTop = calendarBodyRef.getBoundingClientRect().top;
    const monthEls = calendarBodyRef.querySelectorAll<HTMLElement>('.calendar-month');
    const partsOf = (el: HTMLElement) => ({
      month: Number(el.dataset.month),
      year: Number(el.dataset.year),
      day: null,
    });

    if (this.verticalSplice !== undefined) {
      let nearest: HTMLElement | undefined;
      let nearestDistance = Infinity;
      monthEls.forEach((monthEl) => {
        const distance = Math.abs(monthEl.getBoundingClientRect().top - containerTop);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = monthEl;
        }
      });
      return nearest ? partsOf(nearest) : undefined;
    }

    if (monthEls.length === 0 || monthEls[0].offsetHeight === 0) {
      return undefined;
    }

    const first = monthEls[0];
    const blockHeight = first.offsetHeight;

    const monthsFromFirst = Math.round((containerTop - first.getBoundingClientRect().top) / blockHeight);
    let index = monthIndex(partsOf(first)) + monthsFromFirst;

    // The runway only spans the range, so this is a backstop.
    index = Math.min(Math.max(index, this.verticalRangeStart), this.verticalRangeEnd);

    return monthFromIndex(index);
  }

  /**
   * The months the vertical list spans: `min` to `max`, or
   * VERTICAL_DEFAULT_RANGE_YEARS either side of today where one is not set.
   */
  private get verticalRangeStart() {
    const { minParts, defaultParts } = this;
    return minParts !== undefined ? monthIndex(minParts) : monthIndex(defaultParts) - VERTICAL_DEFAULT_RANGE_YEARS * 12;
  }

  private get verticalRangeEnd() {
    const { maxParts, defaultParts } = this;
    return maxParts !== undefined ? monthIndex(maxParts) : monthIndex(defaultParts) + VERTICAL_DEFAULT_RANGE_YEARS * 12;
  }

  /**
   * How many months of empty runway sit before or after a month list: every
   * month between it and the edge of the range.
   *
   * Covering the whole range is what keeps every month at its true position
   * in the scroll content. When the window moves, the runway on each side
   * grows or shrinks by exactly the months the window gave up or took, so
   * the content above the viewport keeps its height and a re-center needs no
   * scroll correction. That matters because WebKit ends a fling the moment
   * `scrollTop` is written: with a runway capped at a year, every re-center
   * corrected the scroll position, and on iOS the list stopped as soon as the
   * finger lifted. At a real `min` or `max` the runway is zero, so the list
   * still stops there.
   */
  private verticalRunwayBefore(months: DatetimeParts[]) {
    return Math.max(0, monthIndex(months[0]) - this.verticalRangeStart);
  }

  private verticalRunwayAfter(months: DatetimeParts[]) {
    return Math.max(0, this.verticalRangeEnd - monthIndex(months[months.length - 1]));
  }

  /**
   * Where a month's block starts in the scroll content of a month list,
   * including the runway above it. Corrections are the difference between
   * this before and after a rebuild, rather than a count of months shifted,
   * because a rebuild that reaches `min` or `max` also adds or removes the
   * runway. A month outside a contiguous list gets its position by
   * arithmetic, which is how a re-center from over the runway is corrected.
   */
  private verticalOffsetOf(months: DatetimeParts[], target: DatetimeParts, blockHeight: number) {
    const found = months.findIndex(({ month, year }) => month === target.month && year === target.year);
    const index = found !== -1 ? found : monthIndex(target) - monthIndex(months[0]);
    return (this.verticalRunwayBefore(months) + index) * blockHeight;
  }

  private initializeVerticalCalendarListener = (calendarBodyRef: HTMLElement) => {
    /**
     * Pin the window now that `workingParts` reflects the resolved value. Up
     * to this point the window follows it, which is what puts the right month
     * on screen for the first render. From here it must stop following, or
     * every scroll would rebuild the window under the user.
     */
    if (this.verticalWindowCenter === undefined) {
      this.verticalWindowCenter = { ...this.workingParts };
    }

    /**
     * Deferred for the same reason as the re-center correction: pinning the
     * window above schedules a render, and the month elements this needs to
     * measure do not exist until it completes.
     */
    this.pendingVerticalInitialScroll = { ...this.workingParts };

    /**
     * On first load the pin above schedules a render, and `componentDidRender`
     * applies the scroll. Re-initializing does not: the listeners are rebuilt
     * each time the datetime becomes visible, such as when a modal reopens,
     * and there the window is already pinned, so nothing renders. The body
     * lost its scroll position while hidden, so without this the list opens
     * at the top of the window instead of on the working month. Whichever of
     * the two runs first consumes the pending scroll.
     */
    raf(() => this.applyPendingVerticalInitialScroll());

    writeTask(() => {
      let scrollTimeout: ReturnType<typeof setTimeout> | undefined;

      const scrollCallback = () => {
        /**
         * Re-centering cannot wait for the scroll to settle. A fling carries
         * far further than the window reaches, about 13 months against the
         * 2.5 left either side of the center, so a debounced re-center let it
         * run into the last rendered month and stop dead. Checking on every
         * scroll event keeps months ahead of the fling. It writes nothing:
         * the runway spans the whole range, so a re-center needs no scroll
         * correction. That matters because WebKit ends a fling on any
         * `scrollTop` write. Refer to `verticalRunwayBefore`.
         *
         * Skipped while a correction is still waiting to be applied, so that
         * scroll events in between do not queue a second one on top of it.
         */
        if (this.verticalGlideTarget === undefined && this.pendingVerticalScrollCorrection === undefined) {
          const visible = this.getVerticalMonthAtTop(calendarBodyRef);
          if (visible) {
            this.recenterVerticalWindow(calendarBodyRef, visible);
          }
        }

        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
          /**
           * A glide owns the scroll position until it ends. Re-centering
           * mid-glide would rebuild the spliced list under the animation.
           */
          if (this.verticalGlideTarget !== undefined) {
            return;
          }

          const visible = this.getVerticalMonthAtTop(calendarBodyRef);
          if (!visible) {
            return;
          }

          const { month, year } = visible;

          /**
           * While a day in the grid has focus and is still on screen, its
           * month is the working month, not whichever month is at the top.
           * Focusing a day nudges the list, and without this the listener
           * would overwrite the month the keyboard just moved to, so the
           * header and the announcement would name the wrong month. Once the
           * focused day scrolls out of view, the top of the list takes over.
           */
          const { workingParts } = this;
          const focusIsOnScreen = this.hasVisibleFocusedDay(calendarBodyRef);
          if (!focusIsOnScreen && (month !== workingParts.month || year !== workingParts.year)) {
            this.setWorkingParts({ ...workingParts, month, year });
          }

          /**
           * The window follows what is on screen regardless of focus, because
           * it exists to keep months rendered around the visible area.
           */
          this.recenterVerticalWindow(calendarBodyRef, { month, year, day: null });
        }, 50);
      };

      calendarBodyRef.addEventListener('scroll', scrollCallback);

      /**
       * The list's height is only a default: a datetime sized by its
       * container can be any height, and can change, such as on rotation.
       */
      const resizeObserver =
        typeof ResizeObserver !== 'undefined'
          ? new ResizeObserver(() => this.resizeVerticalWindow(calendarBodyRef))
          : undefined;
      resizeObserver?.observe(calendarBodyRef);

      this.destroyCalendarListener = () => {
        calendarBodyRef.removeEventListener('scroll', scrollCallback);
        resizeObserver?.disconnect();
      };
    });
  };

  /**
   * Sizes the window to the list. Seven months is enough when about one and
   * a half are visible, but a datetime filling a tall container shows three
   * or more, and the window then has too few months beyond the visible ones
   * for re-centering to keep ahead of the user. The radius is kept at least
   * one more than the number of visible months, which is what lets a
   * re-center around the top month leave room below the last visible one.
   *
   * Growing the window adds months above the visible one, so the list is
   * corrected the same way a re-center is.
   */
  private resizeVerticalWindow(calendarBodyRef: HTMLElement) {
    const blockHeight = this.getVerticalBlockHeight(calendarBodyRef);
    if (blockHeight === 0 || this.verticalGlideTarget !== undefined) {
      return;
    }

    const visibleMonths = Math.ceil(calendarBodyRef.clientHeight / blockHeight);
    const radius = Math.max(VERTICAL_WINDOW_RADIUS, visibleMonths + 1);
    if (radius === this.verticalWindowRadius) {
      return;
    }

    const visible = this.getVerticalMonthAtTop(calendarBodyRef);
    const previousMonths = this.generateVerticalMonths();
    this.verticalWindowRadius = radius;
    const nextMonths = this.generateVerticalMonths();

    /**
     * Skipped while the initial scroll is still pending: that positions the
     * list absolutely once the window renders, and a relative correction on
     * top of it would land a month off.
     */
    if (visible !== undefined && this.pendingVerticalInitialScroll === undefined) {
      this.queueVerticalCorrection(
        this.verticalOffsetOf(nextMonths, visible, blockHeight) -
          this.verticalOffsetOf(previousMonths, visible, blockHeight),
        nextMonths
      );
      this.captureVerticalFocus(calendarBodyRef);
    }
  }

  /**
   * Queues a scroll correction for `componentDidRender`, tied to the month
   * list it was computed for.
   *
   * Two things made applying it on the next `componentDidRender` unreliable.
   * A render already in flight when the window changes still commits the old
   * months, and its `componentDidRender` would apply the correction to them:
   * growing the window from seven months to eleven clamped a two-month
   * correction to the seven-month scroll range. And when the rebuilt list is
   * shorter, the browser clamps the scroll position during the patch, before
   * the correction runs: after a glide the list lost 140px that way. So the
   * correction waits until the DOM shows the expected list, and is applied to
   * the position read just before the patch.
   */
  private queueVerticalCorrection(amount: number, expected: DatetimeParts[]) {
    this.pendingVerticalScrollCorrection = { amount, expected: verticalListSignature(expected) };
  }

  /**
   * Widens the window around `visible` once the user is within
   * VERTICAL_RECENTER_THRESHOLD months of either end of it.
   *
   * Regenerating the window shifts every block, so the scroll position has to
   * be corrected or the calendar appears to jump. Because every block is the
   * same height, the correction is exactly the number of months added above
   * multiplied by the block height, with no measuring of sub-month offsets.
   */
  private recenterVerticalWindow(calendarBodyRef: HTMLElement, visible: DatetimeParts) {
    const months = this.generateVerticalMonths();
    const blockHeight = this.getVerticalBlockHeight(calendarBodyRef);
    if (months.length === 0 || blockHeight === 0) {
      return;
    }

    /**
     * Counted by arithmetic, so a visible month still over the runway, before
     * or after the rendered months, gets an index outside the list.
     */
    const index = monthIndex(visible) - monthIndex(months[0]);

    /**
     * The end is checked against the last visible month, not the top one.
     * In a list taller than two months, the top month can never come within
     * the threshold of the end, because the list runs out of scroll first,
     * so a top-based check never re-centers and scrolling simply stops.
     */
    const lastVisible = index + Math.ceil(calendarBodyRef.clientHeight / blockHeight) - 1;
    const nearStart = index <= VERTICAL_RECENTER_THRESHOLD;
    const nearEnd = lastVisible >= months.length - 1 - VERTICAL_RECENTER_THRESHOLD;
    if (!nearStart && !nearEnd) {
      return;
    }

    /**
     * Work out where the visible month will sit in the rebuilt window before
     * committing to it. If nothing moves there is no point re-rendering.
     */
    const rebuilt = this.generateVerticalMonthsAround(visible);
    const correction =
      this.verticalOffsetOf(rebuilt, visible, blockHeight) - this.verticalOffsetOf(months, visible, blockHeight);

    if (correction === 0 && verticalListSignature(rebuilt) === verticalListSignature(months)) {
      return;
    }

    /**
     * The correction cannot be applied here. Setting the center schedules a
     * re-render, and the new blocks are not in the DOM until it completes, so
     * adjusting scrollTop now would move the list against stale content and
     * the scroll listener would fire again on the result. `componentDidRender`
     * applies it once the DOM matches.
     */
    this.queueVerticalCorrection(correction, rebuilt);
    this.captureVerticalFocus(calendarBodyRef);
    this.verticalWindowCenter = { ...visible };
  }

  /**
   * Remembers the focused day before the window is rebuilt, so
   * `componentDidRender` can give focus back to it.
   *
   * Rebuilding the window makes Stencil move the surviving month nodes, and
   * moving a focused element blurs it. That is not only a pointer problem:
   * keyboard focus near either end of the window scrolls the list into a
   * re-center, so without this every second or third PageDown dropped focus.
   *
   * Only a day still on screen is restored. One the user has scrolled away
   * from with a pointer is left blurred, because restoring focus would pull
   * it back against their own scroll.
   */
  private captureVerticalFocus(calendarBodyRef: HTMLElement) {
    if (!this.hasVisibleFocusedDay(calendarBodyRef)) {
      return;
    }

    const active = this.el.shadowRoot?.activeElement as HTMLElement | null | undefined;
    if (active) {
      this.pendingVerticalRefocus = getPartsFromCalendarDay(active);
    }
  }

  private restoreVerticalFocus(calendarBodyRef: HTMLElement) {
    const { pendingVerticalRefocus: parts } = this;
    this.pendingVerticalRefocus = undefined;
    if (parts === undefined || parts.day === null) {
      return;
    }

    /**
     * Scoped to the day's own month, since the same date can also render as
     * an adjacent day in a neighbour's grid.
     */
    const dayEl = calendarBodyRef.querySelector<HTMLElement>(
      `.calendar-month[data-month="${parts.month}"][data-year="${parts.year}"] .calendar-day[data-month="${parts.month}"][data-day="${parts.day}"][data-year="${parts.year}"]`
    );

    if (dayEl && this.el.shadowRoot?.activeElement !== dayEl) {
      dayEl.focus({ preventScroll: true });
    }
  }

  /**
   * Keeps the month on screen in place when `min` or `max` changes at
   * runtime. The window is clamped to the bounds, so a change can add or
   * remove months above the visible one, which would otherwise shift the
   * list. Horizontal keeps showing its month, even one now out of range, and
   * vertical matches that: the window stays centered on the visible month.
   */
  private holdVerticalPosition() {
    const { calendarBodyRef } = this;
    if (!this.isVerticalNavigation || !calendarBodyRef || this.verticalWindowCenter === undefined) {
      return;
    }

    const visible = this.getVerticalMonthAtTop(calendarBodyRef);
    if (!visible) {
      return;
    }

    this.cancelVerticalGlide();
    this.verticalWindowCenter = visible;
    this.pendingVerticalInitialScroll = { ...visible };
  }

  /**
   * Retries the initial positioning until the calendar body has a height to
   * scroll within. Used when `componentDidRender` fires before layout settles.
   */
  private applyPendingVerticalInitialScroll() {
    const { calendarBodyRef, pendingVerticalInitialScroll } = this;
    if (!calendarBodyRef || pendingVerticalInitialScroll === undefined) {
      return;
    }

    if (calendarBodyRef.clientHeight === 0 || calendarBodyRef.scrollHeight <= calendarBodyRef.clientHeight) {
      raf(() => this.applyPendingVerticalInitialScroll());
      return;
    }

    this.pendingVerticalInitialScroll = undefined;
    this.scrollToVerticalMonth(calendarBodyRef, pendingVerticalInitialScroll, 'instant');
  }

  private hasVisibleFocusedDay(calendarBodyRef: HTMLElement): boolean {
    const active = this.el.shadowRoot?.activeElement as HTMLElement | null | undefined;
    if (!active || !active.classList.contains('calendar-day')) {
      return false;
    }

    const day = active.getBoundingClientRect();
    const body = calendarBodyRef.getBoundingClientRect();
    return day.bottom > body.top && day.top < body.bottom;
  }

  private getVerticalBlockHeight(calendarBodyRef: HTMLElement): number {
    const first = calendarBodyRef.querySelector<HTMLElement>('.calendar-month');
    return first ? first.offsetHeight : 0;
  }

  /**
   * Scrolls a month block to the top of the list. Used on init, by the
   * prev/next buttons, and by `animateToDate` when a value change forces a
   * month that is already in the window.
   *
   * Returns the offset the list is heading to, clamped to its scroll range,
   * or undefined if the month is not rendered.
   */
  private scrollToVerticalMonth(
    calendarBodyRef: HTMLElement,
    target: DatetimeParts,
    behavior: ScrollBehavior
  ): number | undefined {
    const targetEl = calendarBodyRef.querySelector<HTMLElement>(
      `.calendar-month[data-month="${target.month}"][data-year="${target.year}"]`
    );

    if (!targetEl) {
      return undefined;
    }

    /**
     * Deliberately not `offsetTop`. That is measured from the nearest
     * positioned ancestor, which is not the scroll container, so it includes
     * the header and silently scrolls to the wrong month. Measuring against
     * the container's own box is correct regardless of what is positioned.
     */
    const top =
      targetEl.getBoundingClientRect().top - calendarBodyRef.getBoundingClientRect().top + calendarBodyRef.scrollTop;

    calendarBodyRef.scrollTo({ top, left: 0, behavior });

    return Math.min(Math.max(top, 0), calendarBodyRef.scrollHeight - calendarBodyRef.clientHeight);
  }

  /**
   * Animates a value change to any month, however far away, as a glide of
   * one screenful. The same trick horizontal uses in `animateToDate`, adapted
   * to a list: the target is spliced in just past the months on screen, the
   * list glides to it, and the normal window is rebuilt around it afterwards.
   *
   * Scrolling the real distance is not an option. The window only holds a
   * few months, so it would have to re-center many times mid-animation, and
   * each correction would visibly jump.
   *
   * Returns false when the list cannot be measured, so the caller jumps.
   */
  private glideToVerticalMonth(calendarBodyRef: HTMLElement, target: DatetimeParts): boolean {
    const blockHeight = this.getVerticalBlockHeight(calendarBodyRef);
    const anchorParts = this.getVerticalMonthAtTop(calendarBodyRef);
    if (blockHeight === 0 || !anchorParts) {
      return false;
    }

    /**
     * An anchor still over the runway is not rendered, so there is nothing to
     * splice next to; the caller jumps instead.
     */
    const current = this.generateVerticalMonths();
    const anchorIndex = current.findIndex(
      ({ month, year }) => month === anchorParts.month && year === anchorParts.year
    );
    if (anchorIndex === -1) {
      return false;
    }

    const targetMonth = { month: target.month, year: target.year, day: null };
    this.verticalGlideTarget = targetMonth;

    const anchor = current[anchorIndex];
    const aroundTarget = this.generateVerticalMonthsAround(targetMonth);
    const targetIndex = aroundTarget.findIndex(({ month, year }) => month === target.month && year === target.year);
    const anchorInAround = aroundTarget.findIndex(({ month, year }) => month === anchor.month && year === anchor.year);

    /**
     * Months on screen, counting a partly visible one. The splice keeps this
     * many real months in view at every point of the glide: about two
     * standalone, three or more when the datetime fills a tall container.
     */
    const visibleMonths = Math.ceil(calendarBodyRef.clientHeight / blockHeight);

    if (anchorInAround !== -1) {
      /**
       * Near: the window around the target already contains the visible
       * month, so no splice is needed. The window is still rebuilt around
       * the target before gliding, holding the visible month still. Gliding
       * within the current window instead can stop short, because a target
       * near the end of it has too few months below to reach the top.
       */
      this.queueVerticalCorrection(
        this.verticalOffsetOf(aroundTarget, anchor, blockHeight) - this.verticalOffsetOf(current, anchor, blockHeight),
        aroundTarget
      );
      this.verticalWindowCenter = { ...targetMonth };
    } else if (monthIndex(target) > monthIndex(anchor)) {
      /**
       * Forward: keep everything up to the last visible month, then continue
       * with the target, and glide the visible months away. Nothing above the
       * visible month changes, so the list does not move before the glide,
       * and nothing on screen is swapped when it starts.
       */
      this.verticalSplice = [
        ...current.slice(0, Math.min(anchorIndex + visibleMonths, current.length)),
        ...aroundTarget.slice(targetIndex),
      ];
    } else {
      /**
       * Backward: the target, its predecessors, and enough months after it
       * to fill the screen go above the visible month. That changes how many
       * blocks sit above it, so the list is corrected to hold the visible
       * month still before gliding up.
       *
       * The glide therefore ends with only the target's real successors in
       * view and the old months scrolled out of it. With only the target
       * spliced in, the old months would still be on screen when the glide
       * ends, and the rebuild afterwards would visibly swap them.
       */
      const leading = aroundTarget
        .slice(0, targetIndex + visibleMonths)
        .filter((parts) => monthIndex(parts) < monthIndex(anchor));
      const splice = [...leading, ...current.slice(anchorIndex)];
      this.verticalSplice = splice;
      this.queueVerticalCorrection(
        this.verticalOffsetOf(splice, anchor, blockHeight) - this.verticalOffsetOf(current, anchor, blockHeight),
        splice
      );
    }

    // `componentDidRender` starts the glide once the spliced list exists.
    this.pendingVerticalGlide = targetMonth;
    return true;
  }

  private startVerticalGlide(calendarBodyRef: HTMLElement, target: DatetimeParts) {
    const destination = this.scrollToVerticalMonth(calendarBodyRef, target, 'smooth');

    /**
     * `scrollend` is the precise signal, but not every supported browser
     * fires it, so a quiet period after the last scroll event also ends the
     * glide. The timer also covers a glide that turns out to need no scroll,
     * and one the user interrupts.
     */
    let settleTimeout = setTimeout(() => finish(), VERTICAL_GLIDE_SETTLE_MS);

    const onScroll = () => {
      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => finish(), VERTICAL_GLIDE_SETTLE_MS);
    };

    /**
     * Only a `scrollend` at the destination ends the glide. A backward glide
     * is preceded by an instant correction, and the browser reports the end
     * of that too, just after this listener is added. Finishing on it would
     * rebuild the window mid-glide and cut the animation short.
     */
    const onScrollEnd = () => {
      if (destination === undefined || Math.abs(calendarBodyRef.scrollTop - destination) <= 1) {
        finish();
      }
    };

    const stop = () => {
      clearTimeout(settleTimeout);
      calendarBodyRef.removeEventListener('scroll', onScroll);
      calendarBodyRef.removeEventListener('scrollend', onScrollEnd);
      this.stopVerticalGlide = undefined;
    };

    const finish = () => {
      stop();
      this.finishVerticalGlide(calendarBodyRef, target);
    };

    calendarBodyRef.addEventListener('scroll', onScroll);
    calendarBodyRef.addEventListener('scrollend', onScrollEnd);
    this.stopVerticalGlide = stop;
  }

  /**
   * Swaps the spliced list for the normal window around the target. Month
   * containers are keyed, so the target block survives the swap, and the
   * correction for the blocks added or removed above it keeps it in place.
   */
  private finishVerticalGlide(calendarBodyRef: HTMLElement, target: DatetimeParts) {
    const blockHeight = this.getVerticalBlockHeight(calendarBodyRef);
    const current = this.generateVerticalMonths();
    const rebuilt = this.generateVerticalMonthsAround(target);

    if (blockHeight > 0) {
      this.queueVerticalCorrection(
        this.verticalOffsetOf(rebuilt, target, blockHeight) - this.verticalOffsetOf(current, target, blockHeight),
        rebuilt
      );
    }

    this.captureVerticalFocus(calendarBodyRef);
    this.verticalGlideTarget = undefined;
    this.verticalSplice = undefined;
    this.verticalWindowCenter = { ...target };
  }

  /** Abandons a glide in progress and restores the normal window. */
  private cancelVerticalGlide() {
    this.stopVerticalGlide?.();
    this.verticalGlideTarget = undefined;
    this.pendingVerticalGlide = undefined;
    this.verticalSplice = undefined;
  }

  private initializeCalendarListener = () => {
    const calendarBodyRef = this.calendarBodyRef;
    if (!calendarBodyRef) {
      return;
    }

    /**
     * Vertical mode is a continuously scrolling list rather than a pager, so
     * it shares none of the snap detection below. It only has to keep
     * `workingParts` pointing at the month nearest the top of the list, and
     * widen the window before the user reaches either end of it.
     */
    if (this.isVerticalNavigation) {
      this.initializeVerticalCalendarListener(calendarBodyRef);
      return;
    }

    /**
     * For performance reasons, we only render 3
     * months at a time: The current month, the previous
     * month, and the next month. We have a scroll listener
     * on the calendar body to append/prepend new months.
     *
     * We can do this because Stencil is smart enough to not
     * re-create the .calendar-month containers, but rather
     * update the content within those containers.
     *
     * As an added bonus, WebKit has some troubles with
     * scroll-snap-stop: always, so not rendering all of
     * the months in a row allows us to mostly sidestep
     * that issue.
     */
    const months = calendarBodyRef.querySelectorAll('.calendar-month');

    const startMonth = months[0] as HTMLElement;
    const workingMonth = months[1] as HTMLElement;
    const endMonth = months[2] as HTMLElement;
    const mode = getIonMode(this);
    const needsiOSRubberBandFix = mode === 'ios' && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1;

    /**
     * Before setting up the scroll listener,
     * scroll the middle month into view.
     * scrollIntoView() will scroll entire page
     * if element is not in viewport. Use scrollLeft instead.
     */
    writeTask(() => {
      calendarBodyRef.scrollLeft = startMonth.clientWidth * (isRTL(this.el) ? -1 : 1);

      const getChangedMonth = (parts: DatetimeParts): DatetimeParts | undefined => {
        const box = calendarBodyRef.getBoundingClientRect();

        /**
         * If the current scroll position is all the way to the left
         * then we have scrolled to the previous month.
         * Otherwise, assume that we have scrolled to the next
         * month. We have a tolerance of 2px to account for
         * sub pixel rendering.
         *
         * Check below the next line ensures that we did not
         * swipe and abort (i.e. we swiped but we are still on the current month).
         */
        let condition: boolean;
        if (isRTL(this.el)) {
          condition = calendarBodyRef.scrollLeft >= -2;
        } else {
          condition = calendarBodyRef.scrollLeft <= 2;
        }

        const month = condition ? startMonth : endMonth;

        /**
         * The edge of the month must be lined up with
         * the edge of the calendar body in order for
         * the component to update. Otherwise, it
         * may be the case that the user has paused their
         * swipe or the browser has not finished snapping yet.
         * Rather than check if the x values are equal,
         * we give it a tolerance of 2px to account for
         * sub pixel rendering.
         */
        const monthBox = month.getBoundingClientRect();
        if (Math.abs(monthBox.x - box.x) > 2) return;

        /**
         * If we're force-rendering a month, assume we've
         * scrolled to that and return it.
         *
         * If forceRenderDate is ever used in a context where the
         * forced month is not immediately auto-scrolled to, this
         * should be updated to also check whether `month` has the
         * same month and year as the forced date.
         */
        const { forceRenderDate } = this;
        if (forceRenderDate !== undefined) {
          return { month: forceRenderDate.month, year: forceRenderDate.year, day: forceRenderDate.day };
        }

        /**
         * From here, we can determine if the start
         * month or the end month was scrolled into view.
         * If no month was changed, then we can return from
         * the scroll callback early.
         */
        if (month === startMonth) {
          return getPreviousMonth(parts);
        } else if (month === endMonth) {
          return getNextMonth(parts);
        } else {
          return;
        }
      };

      const updateActiveMonth = () => {
        if (needsiOSRubberBandFix) {
          calendarBodyRef.style.removeProperty('pointer-events');
          appliediOSRubberBandFix = false;
        }

        /**
         * If the month did not change
         * then we can return early.
         */
        const newDate = getChangedMonth(this.workingParts);
        if (!newDate) return;

        const { month, day, year } = newDate;

        if (
          isMonthDisabled(
            { month, year, day: null },
            {
              minParts: { ...this.minParts, day: null },
              maxParts: { ...this.maxParts, day: null },
            }
          )
        ) {
          return;
        }

        /**
         * Prevent scrolling for other browsers
         * to give the DOM time to update and the container
         * time to properly snap.
         */
        calendarBodyRef.style.setProperty('overflow', 'hidden');

        /**
         * Use a writeTask here to ensure
         * that the state is updated and the
         * correct month is scrolled into view
         * in the same frame. This is not
         * typically a problem on newer devices
         * but older/slower device may have a flicker
         * if we did not do this.
         */
        writeTask(() => {
          this.setWorkingParts({
            ...this.workingParts,
            month,
            day: day!,
            year,
          });

          calendarBodyRef.scrollLeft = workingMonth.clientWidth * (isRTL(this.el) ? -1 : 1);
          calendarBodyRef.style.removeProperty('overflow');

          if (this.resolveForceDateScrolling) {
            this.resolveForceDateScrolling();
          }

          const activeEl = this.el.shadowRoot!.activeElement as HTMLElement | null;
          if (activeEl && activeEl.classList.contains('calendar-day')) {
            (activeEl.closest('.calendar-body') as HTMLElement | null)?.focus();
          }
        });
      };

      /**
       * When the container finishes scrolling we
       * need to update the DOM with the selected month.
       */
      let scrollTimeout: ReturnType<typeof setTimeout> | undefined;

      /**
       * We do not want to attempt to set pointer-events
       * multiple times within a single swipe gesture as
       * that adds unnecessary work to the main thread.
       */
      let appliediOSRubberBandFix = false;
      const scrollCallback = () => {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        /**
         * On iOS it is possible to quickly rubber band
         * the scroll area before the scroll timeout has fired.
         * This results in users reaching the end of the scrollable
         * container before the DOM has updated.
         * By setting `pointer-events: none` we can ensure that
         * subsequent swipes do not happen while the container
         * is snapping.
         */
        if (!appliediOSRubberBandFix && needsiOSRubberBandFix) {
          calendarBodyRef.style.setProperty('pointer-events', 'none');
          appliediOSRubberBandFix = true;
        }

        // Wait ~3 frames
        scrollTimeout = setTimeout(updateActiveMonth, 50);
      };

      calendarBodyRef.addEventListener('scroll', scrollCallback);

      this.destroyCalendarListener = () => {
        calendarBodyRef.removeEventListener('scroll', scrollCallback);
      };
    });
  };

  connectedCallback() {
    this.clearFocusVisible = startFocusVisible(this.el).destroy;
    this.loadTimeout = setTimeout(() => {
      this.ensureReadyIfVisible();
    }, 100);
  }

  disconnectedCallback() {
    if (this.clearFocusVisible) {
      this.clearFocusVisible();
      this.clearFocusVisible = undefined;
    }
    this.loadTimeoutCleanup();
  }

  /**
   * Clean up all listeners except for the overlay
   * listener. This is so that we can re-create the listeners
   * if the datetime has been hidden/presented by a modal or popover.
   */
  private destroyInteractionListeners = () => {
    const { destroyCalendarListener, destroyKeyboardMO } = this;

    if (destroyCalendarListener !== undefined) {
      destroyCalendarListener();
    }

    if (destroyKeyboardMO !== undefined) {
      destroyKeyboardMO();
    }
  };

  private initializeListeners() {
    this.initializeCalendarListener();
    this.initializeKeyboardListeners();
  }

  /**
   * TODO(FW-6931): Remove this fallback upon solving the root cause
   * Fallback to ensure the datetime becomes ready even if
   * IntersectionObserver never reports it as intersecting.
   *
   * This is primarily used in environments where the observer
   * might not fire as expected, such as when running under
   * synthetic tests that stub IntersectionObserver.
   */
  private ensureReadyIfVisible = () => {
    if (this.el.classList.contains('datetime-ready')) {
      return;
    }

    const rect = this.el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    this.markReady();
  };

  private markReady = () => {
    if (this.el.classList.contains('datetime-ready')) {
      return;
    }
    this.initializeListeners();

    /**
     * TODO FW-2793: Datetime needs a frame to ensure that it
     * can properly scroll contents into view. As a result
     * we hide the scrollable content until after that frame
     * so users do not see the content quickly shifting. The downside
     * is that the content will pop into view a frame after. Maybe there
     * is a better way to handle this?
     */
    writeTask(() => {
      this.el.classList.add('datetime-ready');
    });
  };

  private loadTimeoutCleanup = () => {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = undefined;
    }
  };

  componentDidLoad() {
    const { el, intersectionTrackerRef } = this;

    /**
     * If a scrollable element is hidden using `display: none`,
     * it will not have a scroll height meaning we cannot scroll elements
     * into view. As a result, we will need to wait for the datetime to become
     * visible if used inside of a modal or a popover otherwise the scrollable
     * areas will not have the correct values snapped into place.
     */
    const visibleCallback = (entries: IntersectionObserverEntry[]) => {
      const ev = entries[0];
      if (!ev.isIntersecting) {
        return;
      }

      this.hasBeenIntersecting = true;
      this.markReady();
    };
    const visibleIO = new IntersectionObserver(visibleCallback, { threshold: 0.01, root: el });

    /**
     * Use raf to avoid a race condition between the component loading and
     * its display animation starting (such as when shown in a modal). This
     * could cause the datetime to start at a visibility of 0, erroneously
     * triggering the `hiddenIO` observer below.
     */
    raf(() => visibleIO?.observe(intersectionTrackerRef!));

    /**
     * TODO(FW-6931): Remove this fallback upon solving the root cause
     * Fallback: If IntersectionObserver never reports that the
     * datetime is visible but the host clearly has layout, ensure
     * we still initialize listeners and mark the component as ready.
     *
     * We schedule this after everything has had a chance to run.
     *
     * We also clean up the load timeout to ensure that we don't have multiple timeouts running.
     */
    this.loadTimeoutCleanup();
    this.loadTimeout = setTimeout(() => {
      this.ensureReadyIfVisible();
    }, 100);

    /**
     * We need to clean up listeners when the datetime is hidden
     * in a popover/modal so that we can properly scroll containers
     * back into view if they are re-presented. When the datetime is hidden
     * the scroll areas have scroll widths/heights of 0px, so any snapping
     * we did originally has been lost.
     */
    const hiddenCallback = (entries: IntersectionObserverEntry[]) => {
      const ev = entries[0];
      if (ev.isIntersecting) {
        return;
      }

      // Ignore the initial "not intersecting" entry IntersectionObserver fires on observe().
      if (!this.hasBeenIntersecting) {
        return;
      }
      this.hasBeenIntersecting = false;

      this.destroyInteractionListeners();

      /**
       * When datetime is hidden, we need to make sure that
       * the month/year picker is closed. Otherwise,
       * it will be open when the datetime re-appears
       * and the scroll area of the calendar grid will be 0.
       * As a result, the wrong month will be shown.
       */
      this.showMonthAndYear = false;

      writeTask(() => {
        this.el.classList.remove('datetime-ready');
      });
    };
    const hiddenIO = new IntersectionObserver(hiddenCallback, { threshold: 0, root: el });
    raf(() => hiddenIO?.observe(intersectionTrackerRef!));

    /**
     * Datetime uses Ionic components that emit
     * ionFocus and ionBlur. These events are
     * composed meaning they will cross
     * the shadow dom boundary. We need to
     * stop propagation on these events otherwise
     * developers will see 2 ionFocus or 2 ionBlur
     * events at a time.
     */
    const root = getElementRoot(this.el);
    root.addEventListener('ionFocus', (ev: Event) => ev.stopPropagation());
    root.addEventListener('ionBlur', (ev: Event) => ev.stopPropagation());
  }

  /**
   * When the presentation is changed, all calendar content is recreated,
   * so we need to re-init behavior with the new elements.
   */
  componentWillRender() {
    /**
     * Park focus on the calendar body while the window is rebuilt, as
     * horizontal does when it swaps months. Moving the focused day's node
     * would otherwise blur it to nothing, and the host would emit `ionBlur`
     * and then `ionFocus` when `componentDidRender` gives focus back. The
     * body keeps focus inside the component throughout.
     *
     * Done here, immediately before the patch, rather than when the rebuild
     * is scheduled. Parked any earlier, the body's own focus handling hands
     * focus back to the old day node before the patch moves it.
     */
    const { calendarBodyRef, pendingVerticalRefocus } = this;

    if (this.pendingVerticalScrollCorrection !== undefined && calendarBodyRef) {
      this.verticalScrollTopBeforeRender = calendarBodyRef.scrollTop;
    }

    const active = this.el.shadowRoot?.activeElement;
    if (pendingVerticalRefocus !== undefined && calendarBodyRef && active?.classList.contains('calendar-day')) {
      calendarBodyRef.focus({ preventScroll: true });
    }
  }

  componentDidRender() {
    /**
     * Applied here rather than where it is calculated, because the re-centered
     * window only exists in the DOM once this render has completed.
     */
    const { pendingVerticalInitialScroll, pendingVerticalScrollCorrection } = this;
    if (pendingVerticalInitialScroll !== undefined && this.calendarBodyRef) {
      /**
       * Only once the body can actually scroll. Run earlier, the requested
       * offset is clamped to a container that has not been given its height
       * yet, which silently lands the list at the wrong month.
       */
      const body = this.calendarBodyRef;
      if (body.scrollHeight > body.clientHeight && body.clientHeight > 0) {
        this.pendingVerticalInitialScroll = undefined;
        this.scrollToVerticalMonth(body, pendingVerticalInitialScroll, 'instant');
      } else {
        raf(() => this.applyPendingVerticalInitialScroll());
      }
    }

    if (pendingVerticalScrollCorrection !== undefined && this.calendarBodyRef) {
      const body = this.calendarBodyRef;
      const months = Array.from(body.querySelectorAll<HTMLElement>('.calendar-month')).map((el) => ({
        month: Number(el.dataset.month),
        year: Number(el.dataset.year),
        day: null,
      }));

      if (verticalListSignature(months) === pendingVerticalScrollCorrection.expected) {
        const before = this.verticalScrollTopBeforeRender ?? body.scrollTop;
        this.pendingVerticalScrollCorrection = undefined;
        this.verticalScrollTopBeforeRender = undefined;

        /**
         * A re-center within the range needs no correction, and the write is
         * skipped rather than made with zero: WebKit ends a fling on any
         * `scrollTop` write, even one that does not move the list. The
         * correction is still queued, so that a second re-center does not
         * start while this render is pending.
         */
        if (pendingVerticalScrollCorrection.amount !== 0) {
          body.scrollTop = before + pendingVerticalScrollCorrection.amount;
        }
      }
    }

    // After the correction, so the day is refocused where it will stay.
    if (
      this.pendingVerticalRefocus !== undefined &&
      this.pendingVerticalScrollCorrection === undefined &&
      this.calendarBodyRef
    ) {
      this.restoreVerticalFocus(this.calendarBodyRef);
    }

    // After the correction, so a backward glide starts from a list held still.
    const { pendingVerticalGlide } = this;
    /**
     * Also waits for the target's month to be in the DOM. A forward splice
     * queues no correction, so without this a render already in flight could
     * start the glide before the spliced months exist.
     */
    if (
      pendingVerticalGlide !== undefined &&
      this.pendingVerticalScrollCorrection === undefined &&
      this.calendarBodyRef?.querySelector(
        `.calendar-month[data-month="${pendingVerticalGlide.month}"][data-year="${pendingVerticalGlide.year}"]`
      )
    ) {
      this.pendingVerticalGlide = undefined;
      this.startVerticalGlide(this.calendarBodyRef, pendingVerticalGlide);
    }

    const { presentation, prevPresentation, calendarBodyRef, minParts, preferWheel, forceRenderDate } = this;

    /**
     * TODO(FW-2165)
     * Remove this when https://bugs.webkit.org/show_bug.cgi?id=235960 is fixed.
     * When using `min`, we add `scroll-snap-align: none`
     * to the disabled month so that users cannot scroll to it.
     * This triggers a bug in WebKit where the scroll position is reset.
     * Since the month change logic is handled by a scroll listener,
     * this causes the month to change leading to `scroll-snap-align`
     * changing again, thus changing the scroll position again and causing
     * an infinite loop.
     * This issue only applies to the calendar grid, so we can disable
     * it if the calendar grid is not being used.
     */
    const hasCalendarGrid = !preferWheel && ['date-time', 'time-date', 'date'].includes(presentation);
    if (minParts !== undefined && hasCalendarGrid && calendarBodyRef) {
      const workingMonth = calendarBodyRef.querySelector('.calendar-month:nth-of-type(1)');
      /**
       * We need to make sure the datetime is not in the process
       * of scrolling to a new datetime value if the value
       * is updated programmatically.
       * Otherwise, the datetime will appear to not scroll at all because
       * we are resetting the scroll position to the center of the view.
       * Prior to the datetime's value being updated programmatically,
       * the calendarBodyRef is scrolled such that the middle month is centered
       * in the view. The below code updates the scroll position so the middle
       * month is also centered in the view. Since the scroll position did not change,
       * the scroll callback in this file does not fire,
       * and the resolveForceDateScrolling promise never resolves.
       */
      if (workingMonth && forceRenderDate === undefined && !this.isVerticalNavigation) {
        calendarBodyRef.scrollLeft = workingMonth.clientWidth * (isRTL(this.el) ? -1 : 1);
      }
    }

    /**
     * Switching the navigation axis swaps which scroll offset is meaningful,
     * so the listener has to be rebuilt against the new layout.
     */
    const { navigationOrientation, prevNavigationOrientation } = this;
    const didChangeOrientation =
      prevNavigationOrientation !== null && navigationOrientation !== prevNavigationOrientation;

    this.prevNavigationOrientation = navigationOrientation;

    if (didChangeOrientation) {
      this.cancelVerticalGlide();
      this.destroyInteractionListeners();
      this.initializeListeners();
    }

    if (prevPresentation === null) {
      this.prevPresentation = presentation;
      return;
    }

    if (presentation === prevPresentation) {
      return;
    }
    this.prevPresentation = presentation;

    this.destroyInteractionListeners();

    this.initializeListeners();

    /**
     * The month/year picker from the date interface
     * should be closed as it is not available in non-date
     * interfaces.
     */
    this.showMonthAndYear = false;

    raf(() => {
      this.ionRender.emit();
    });
  }

  private processValue = (value?: string | string[] | null) => {
    const hasValue =
      value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0);
    const valueToProcess = hasValue ? parseDate(value) : this.defaultParts;

    const { minParts, maxParts, workingParts, el } = this;

    this.warnIfIncorrectValueUsage();

    /**
     * Return early if the value wasn't parsed correctly, such as
     * if an improperly formatted date string was provided.
     */
    if (!valueToProcess) {
      return;
    }

    /**
     * Datetime should only warn of out of bounds values
     * if set by the user. If the `value` is undefined,
     * we will default to today's date which may be out
     * of bounds. In this case, the warning makes it look
     * like the developer did something wrong which is
     * not true.
     */
    if (hasValue) {
      warnIfValueOutOfBounds(valueToProcess, minParts, maxParts);
    }

    /**
     * If there are multiple values, clamp to the last one.
     * This is because the last value is the one that the user
     * has most recently interacted with.
     */
    const singleValue = Array.isArray(valueToProcess) ? valueToProcess[valueToProcess.length - 1] : valueToProcess;
    const targetValue = clampDate(singleValue, minParts, maxParts);

    const { month, day, year, hour, minute } = targetValue;
    const ampm = parseAmPm(hour!);

    /**
     * Since `activeParts` indicates a value that been explicitly selected
     * either by the user or the app, only update `activeParts` if the
     * `value` property is set.
     */
    if (hasValue) {
      if (Array.isArray(valueToProcess)) {
        this.activeParts = [...valueToProcess];
      } else {
        this.activeParts = {
          month,
          day,
          year,
          hour,
          minute,
          ampm,
        };
      }
    } else {
      /**
       * Reset the active parts if the value is not set.
       * This will clear the selected calendar day when
       * performing a clear action or using the reset() method.
       */
      this.activeParts = [];
    }

    const didChangeMonth =
      (month !== undefined && month !== workingParts.month) || (year !== undefined && year !== workingParts.year);
    const bodyIsVisible = el.classList.contains('datetime-ready');
    const { isGridStyle, showMonthAndYear } = this;

    /**
     * Vertical never animates through `animateToDate`. That mechanism belongs
     * to the pager: it steps one month with `nextMonth`/`prevMonth` and waits
     * on a promise only the horizontal listener resolves, so it cannot reach a
     * month the window has not rendered. Vertical glides instead, under the
     * same conditions horizontal animates, and otherwise jumps.
     */
    if (this.isVerticalNavigation && didChangeMonth) {
      /**
       * A second value change mid-glide jumps rather than splicing a list
       * that is itself spliced.
       */
      const wasGliding = this.verticalGlideTarget !== undefined;
      this.cancelVerticalGlide();

      this.setWorkingParts({ month, day, year, hour, minute, ampm });

      const { calendarBodyRef } = this;
      const canGlide =
        !wasGliding &&
        bodyIsVisible &&
        !showMonthAndYear &&
        calendarBodyRef !== undefined &&
        this.verticalWindowCenter !== undefined &&
        config.getBoolean('animated', true);

      if (canGlide && this.glideToVerticalMonth(calendarBodyRef, targetValue)) {
        return;
      }

      this.verticalWindowCenter = { ...targetValue };
      this.pendingVerticalInitialScroll = { ...targetValue };
      return;
    }

    if (isGridStyle && didChangeMonth && bodyIsVisible && !showMonthAndYear) {
      /**
       * Only animate if:
       * 1. We're using grid style (wheel style pickers should just jump to new value)
       * 2. The month and/or year actually changed, and both are defined (otherwise there's nothing to animate to)
       * 3. The calendar body is visible (prevents animation when in collapsed datetime-button, for example)
       * 4. The month/year picker is not open (since you wouldn't see the animation anyway)
       */
      this.animateToDate(targetValue);
    } else {
      this.setWorkingParts({
        month,
        day,
        year,
        hour,
        minute,
        ampm,
      });
    }
  };

  private animateToDate = async (targetValue: DatetimeParts) => {
    const { workingParts } = this;

    /**
     * Tell other render functions that we need to force the
     * target month to appear in place of the actual next/prev month.
     * Because this is a State variable, a rerender will be triggered
     * automatically, updating the rendered months.
     */
    this.forceRenderDate = targetValue;

    /**
     * Flag that we've started scrolling to the forced date.
     * The resolve function will be called by the datetime's
     * scroll listener when it's done updating everything.
     * This is a replacement for making prev/nextMonth async,
     * since the logic we're waiting on is in a listener.
     */
    const forceDateScrollingPromise = new Promise<void>((resolve) => {
      this.resolveForceDateScrolling = resolve;
    });

    /**
     * Animate smoothly to the forced month. This will also update
     * workingParts and correct the surrounding months for us.
     */
    const targetMonthIsBefore = isBefore(targetValue, workingParts);
    targetMonthIsBefore ? this.prevMonth() : this.nextMonth();
    await forceDateScrollingPromise;
    this.resolveForceDateScrolling = undefined;
    this.forceRenderDate = undefined;
  };

  componentWillLoad() {
    const { el, formatOptions, highlightedDates, multiple, navigationOrientation, presentation, preferWheel } = this;

    if (navigationOrientation === 'vertical' && !this.isGridStyle) {
      printIonWarning(
        `[ion-datetime] - navigationOrientation="vertical" only applies to the calendar grid, so it has no effect with preferWheel="true" or presentation="${presentation}".`,
        el
      );
    }

    if (this.isVerticalNavigation && this.showAdjacentDays) {
      printIonWarning(
        '[ion-datetime] - showAdjacentDays has no effect when navigationOrientation="vertical". A continuous list already shows the neighbouring months in full.',
        el
      );
    }

    if (multiple) {
      if (presentation !== 'date') {
        printIonWarning('[ion-datetime] - Multiple date selection is only supported for presentation="date".', el);
      }

      if (preferWheel) {
        printIonWarning('[ion-datetime] - Multiple date selection is not supported with preferWheel="true".', el);
      }
    }

    if (highlightedDates !== undefined) {
      if (presentation !== 'date' && presentation !== 'date-time' && presentation !== 'time-date') {
        printIonWarning(
          '[ion-datetime] - The highlightedDates property is only supported with the date, date-time, and time-date presentations.',
          el
        );
      }

      if (preferWheel) {
        printIonWarning('[ion-datetime] - The highlightedDates property is not supported with preferWheel="true".', el);
      }
    }

    if (formatOptions) {
      checkForPresentationFormatMismatch(el, presentation, formatOptions);
      warnIfTimeZoneProvided(el, formatOptions);
    }

    const hourValues = (this.parsedHourValues = convertToArrayOfNumbers(this.hourValues));
    const minuteValues = (this.parsedMinuteValues = convertToArrayOfNumbers(this.minuteValues));
    const monthValues = (this.parsedMonthValues = convertToArrayOfNumbers(this.monthValues));
    const yearValues = (this.parsedYearValues = convertToArrayOfNumbers(this.yearValues));
    const dayValues = (this.parsedDayValues = convertToArrayOfNumbers(this.dayValues));

    const todayParts = (this.todayParts = parseDate(getToday())!);

    this.processMinParts();
    this.processMaxParts();

    this.defaultParts = getClosestValidDate({
      refParts: todayParts,
      monthValues,
      dayValues,
      yearValues,
      hourValues,
      minuteValues,
      minParts: this.minParts,
      maxParts: this.maxParts,
    });

    this.processValue(this.value);

    this.emitStyle();
  }

  private emitStyle() {
    this.ionStyle.emit({
      interactive: true,
      datetime: true,
      'interactive-disabled': this.disabled,
    });
  }

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  private hasValue = () => {
    return this.value != null;
  };

  private nextMonth = () => {
    const calendarBodyRef = this.calendarBodyRef;
    if (!calendarBodyRef) {
      return;
    }

    const nextMonth = calendarBodyRef.querySelector('.calendar-month:last-of-type');
    if (!nextMonth) {
      return;
    }

    const scrollMode = config.getBoolean('animated', true) ? 'smooth' : 'instant';

    /**
     * Overshooting by two months lets the browser clamp to the end of the
     * scroll range, which is where the next month sits. The same trick is
     * used on both axes.
     */
    if (this.isVerticalNavigation) {
      this.scrollToVerticalMonth(calendarBodyRef, getNextMonth(this.workingParts), scrollMode);
      return;
    }

    const left = (nextMonth as HTMLElement).offsetWidth * 2;

    calendarBodyRef.scrollTo({
      top: 0,
      left: left * (isRTL(this.el) ? -1 : 1),
      behavior: scrollMode,
    });
  };

  private prevMonth = () => {
    const calendarBodyRef = this.calendarBodyRef;
    if (!calendarBodyRef) {
      return;
    }

    const prevMonth = calendarBodyRef.querySelector('.calendar-month:first-of-type');
    if (!prevMonth) {
      return;
    }

    const scrollMode = config.getBoolean('animated', true) ? 'smooth' : 'instant';

    if (this.isVerticalNavigation) {
      this.scrollToVerticalMonth(calendarBodyRef, getPreviousMonth(this.workingParts), scrollMode);
      return;
    }

    const left = (prevMonth as HTMLElement).offsetWidth * 2;

    calendarBodyRef.scrollTo({
      top: 0,
      left: left * (isRTL(this.el) ? 1 : -1),
      behavior: scrollMode,
    });
  };

  private toggleMonthAndYearView = () => {
    const opening = !this.showMonthAndYear;
    this.showMonthAndYear = opening;

    if (!this.isVerticalNavigation) {
      return;
    }

    if (opening) {
      this.cancelVerticalGlide();
      this.verticalMonthAtPickerOpen = { ...this.workingParts };
      return;
    }

    /**
     * The picker's wheels only set `workingParts`. Horizontal renders around
     * that, so closing the picker shows the chosen month. Vertical's window
     * does not follow `workingParts`, so it is moved explicitly, and only if
     * the choice changed: an unchanged close keeps the exact scroll position.
     * It jumps rather than glides, as horizontal does here.
     */
    const { verticalMonthAtPickerOpen: before, workingParts } = this;
    this.verticalMonthAtPickerOpen = undefined;
    if (before && before.month === workingParts.month && before.year === workingParts.year) {
      return;
    }

    const chosen = { month: workingParts.month, year: workingParts.year, day: null };
    this.verticalWindowCenter = chosen;
    this.pendingVerticalInitialScroll = { ...chosen };
  };

  /**
   * Universal render methods
   * These are pieces of datetime that
   * are rendered independently of presentation.
   */

  private renderFooter() {
    const theme = getIonTheme(this);
    const { disabled, readonly, showDefaultButtons, showClearButton } = this;
    /**
     * The cancel, clear, and confirm buttons
     * should not be interactive if the datetime
     * is disabled or readonly.
     */
    const isButtonDisabled = disabled || readonly;
    const confirmFill = theme === 'ionic' ? 'solid' : undefined;
    const hasSlottedButtons = this.el.querySelector('[slot="buttons"]') !== null;
    if (!hasSlottedButtons && !showDefaultButtons && !showClearButton) {
      return;
    }

    const clearButtonClick = () => {
      this.reset();
      this.setValue(undefined);
    };

    /**
     * By default we render two buttons:
     * Cancel - Dismisses the datetime and
     * does not update the `value` prop.
     * OK - Dismisses the datetime and
     * updates the `value` prop.
     */
    return (
      <div class="datetime-footer">
        <div class="datetime-buttons">
          <div
            class={{
              ['datetime-action-buttons']: true,
              ['has-clear-button']: this.showClearButton,
            }}
          >
            <slot name="buttons">
              {showDefaultButtons && (
                <ion-button
                  id="cancel-button"
                  color={this.color}
                  onClick={() => this.cancel(true)}
                  disabled={isButtonDisabled}
                >
                  {this.cancelText}
                </ion-button>
              )}
              <div class="datetime-action-buttons-container">
                {showClearButton && (
                  <ion-button
                    id="clear-button"
                    color={this.color}
                    onClick={() => clearButtonClick()}
                    disabled={isButtonDisabled}
                  >
                    {this.clearText}
                  </ion-button>
                )}
                {showDefaultButtons && (
                  <ion-button
                    id="confirm-button"
                    fill={confirmFill}
                    color={this.color}
                    onClick={() => this.confirm(true)}
                    disabled={isButtonDisabled}
                  >
                    {this.doneText}
                  </ion-button>
                )}
              </div>
            </slot>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Wheel picker render methods
   */

  private renderWheelPicker(forcePresentation: string = this.presentation) {
    /**
     * If presentation="time-date" we switch the
     * order of the render array here instead of
     * manually reordering each date/time picker
     * column with CSS. This allows for additional
     * flexibility if we need to render subsets
     * of the date/time data or do additional ordering
     * within the child render functions.
     */
    const renderArray =
      forcePresentation === 'time-date'
        ? [this.renderTimePickerColumns(forcePresentation), this.renderDatePickerColumns(forcePresentation)]
        : [this.renderDatePickerColumns(forcePresentation), this.renderTimePickerColumns(forcePresentation)];
    return <ion-picker class={FOCUS_TRAP_DISABLE_CLASS}>{renderArray}</ion-picker>;
  }

  private renderDatePickerColumns(forcePresentation: string) {
    return forcePresentation === 'date-time' || forcePresentation === 'time-date'
      ? this.renderCombinedDatePickerColumn()
      : this.renderIndividualDatePickerColumns(forcePresentation);
  }

  private renderCombinedDatePickerColumn() {
    const { defaultParts, disabled, workingParts, locale, minParts, maxParts, todayParts, isDateEnabled } = this;

    /**
     * By default, generate a range of 3 months:
     * Previous month, current month, and next month
     */
    const monthsToRender = generateMonths(workingParts);
    const lastMonth = monthsToRender[monthsToRender.length - 1];

    /**
     * Ensure that users can select the entire window of dates.
     */
    monthsToRender[0].day = 1;
    lastMonth.day = getNumDaysInMonth(lastMonth.month, lastMonth.year);

    /**
     * Narrow the dates rendered based on min/max dates (if any).
     * The `min` date is used if the min is after the generated min month.
     * The `max` date is used if the max is before the generated max month.
     * This ensures that the sliding window always stays at 3 months
     * but still allows future dates to be lazily rendered based on any min/max
     * constraints.
     */
    const min = minParts !== undefined && isAfter(minParts, monthsToRender[0]) ? minParts : monthsToRender[0];
    const max = maxParts !== undefined && isBefore(maxParts, lastMonth) ? maxParts : lastMonth;

    const result = getCombinedDateColumnData(
      locale,
      todayParts,
      min,
      max,
      this.parsedDayValues,
      this.parsedMonthValues
    );

    let items = result.items;
    const parts = result.parts;

    if (isDateEnabled) {
      items = items.map((itemObject, index) => {
        const referenceParts = parts[index];

        let disabled;
        try {
          /**
           * The `isDateEnabled` implementation is try-catch wrapped
           * to prevent exceptions in the user's function from
           * interrupting the calendar rendering.
           */
          disabled = !isDateEnabled(convertDataToISO(referenceParts));
        } catch (e) {
          printIonError(
            '[ion-datetime] - Exception thrown from provided `isDateEnabled` function. Please check your function and try again.',
            e
          );
        }

        return {
          ...itemObject,
          disabled,
        };
      });
    }

    /**
     * If we have selected a day already, then default the column
     * to that value. Otherwise, set it to the default date.
     */
    const todayString =
      workingParts.day !== null
        ? `${workingParts.year}-${workingParts.month}-${workingParts.day}`
        : `${defaultParts.year}-${defaultParts.month}-${defaultParts.day}`;

    return (
      <ion-picker-column
        part={WHEEL_PART}
        aria-label="Select a date"
        class="date-column"
        color={this.color}
        disabled={disabled}
        value={todayString}
        onIonChange={(ev: CustomEvent) => {
          const { value } = ev.detail;
          const findPart = parts.find(({ month, day, year }) => value === `${year}-${month}-${day}`);

          // Read live so parts a sibling column just committed are included.
          const activePart = this.getActivePartsWithFallback();

          this.setWorkingParts({
            ...this.workingParts,
            ...findPart,
          });

          this.setActiveParts({
            ...activePart,
            ...findPart,
          });

          ev.stopPropagation();
        }}
      >
        {items.map((item) => (
          <ion-picker-column-option
            color={this.color}
            part={item.value === todayString ? `${WHEEL_ITEM_PART} ${WHEEL_ITEM_ACTIVE_PART}` : WHEEL_ITEM_PART}
            key={item.value}
            disabled={item.disabled}
            value={item.value}
          >
            {item.text}
          </ion-picker-column-option>
        ))}
      </ion-picker-column>
    );
  }

  private renderIndividualDatePickerColumns(forcePresentation: string) {
    const { workingParts, isDateEnabled } = this;
    const shouldRenderMonths = forcePresentation !== 'year' && forcePresentation !== 'time';
    const months = shouldRenderMonths
      ? getMonthColumnData(this.locale, workingParts, this.minParts, this.maxParts, this.parsedMonthValues)
      : [];

    const shouldRenderDays = forcePresentation === 'date';
    let days = shouldRenderDays
      ? getDayColumnData(this.locale, workingParts, this.minParts, this.maxParts, this.parsedDayValues)
      : [];

    if (isDateEnabled) {
      days = days.map((dayObject) => {
        const { value } = dayObject;
        const valueNum = typeof value === 'string' ? parseInt(value) : value;
        const referenceParts: DatetimeParts = {
          month: workingParts.month,
          day: valueNum,
          year: workingParts.year,
        };

        let disabled;
        try {
          /**
           * The `isDateEnabled` implementation is try-catch wrapped
           * to prevent exceptions in the user's function from
           * interrupting the calendar rendering.
           */
          disabled = !isDateEnabled(convertDataToISO(referenceParts));
        } catch (e) {
          printIonError(
            '[ion-datetime] - Exception thrown from provided `isDateEnabled` function. Please check your function and try again.',
            e
          );
        }

        return {
          ...dayObject,
          disabled,
        };
      });
    }

    const shouldRenderYears = forcePresentation !== 'month' && forcePresentation !== 'time';
    const years = shouldRenderYears
      ? getYearColumnData(this.locale, this.defaultParts, this.minParts, this.maxParts, this.parsedYearValues)
      : [];

    /**
     * Certain locales show the day before the month.
     */
    const showMonthFirst = isMonthFirstLocale(this.locale, { month: 'numeric', day: 'numeric' });

    let renderArray = [];
    if (showMonthFirst) {
      renderArray = [
        this.renderMonthPickerColumn(months),
        this.renderDayPickerColumn(days),
        this.renderYearPickerColumn(years),
      ];
    } else {
      renderArray = [
        this.renderDayPickerColumn(days),
        this.renderMonthPickerColumn(months),
        this.renderYearPickerColumn(years),
      ];
    }

    return renderArray;
  }

  private renderDayPickerColumn(days: WheelColumnOption[]) {
    if (days.length === 0) {
      return [];
    }

    const { disabled, workingParts } = this;

    const pickerColumnValue = (workingParts.day !== null ? workingParts.day : this.defaultParts.day) ?? undefined;

    return (
      <ion-picker-column
        part={WHEEL_PART}
        aria-label="Select a day"
        class="day-column"
        color={this.color}
        disabled={disabled}
        value={pickerColumnValue}
        onIonChange={(ev: CustomEvent) => {
          // Read live so parts a sibling column just committed are included.
          const activePart = this.getActivePartsWithFallback();

          this.setWorkingParts({
            ...this.workingParts,
            day: ev.detail.value,
          });

          this.setActiveParts({
            ...activePart,
            day: ev.detail.value,
          });

          ev.stopPropagation();
        }}
      >
        {days.map((day) => (
          <ion-picker-column-option
            color={this.color}
            part={day.value === pickerColumnValue ? `${WHEEL_ITEM_PART} ${WHEEL_ITEM_ACTIVE_PART}` : WHEEL_ITEM_PART}
            key={day.value}
            disabled={day.disabled}
            value={day.value}
          >
            {day.text}
          </ion-picker-column-option>
        ))}
      </ion-picker-column>
    );
  }

  private renderMonthPickerColumn(months: WheelColumnOption[]) {
    if (months.length === 0) {
      return [];
    }

    const { disabled, workingParts } = this;

    return (
      <ion-picker-column
        part={WHEEL_PART}
        aria-label="Select a month"
        class="month-column"
        color={this.color}
        disabled={disabled}
        value={workingParts.month}
        onIonChange={(ev: CustomEvent) => {
          // Read live so parts a sibling column just committed are included.
          const activePart = this.getActivePartsWithFallback();

          this.setWorkingParts({
            ...this.workingParts,
            month: ev.detail.value,
          });

          // Month wheel is navigation-only in multi-select mode as a fix for https://github.com/ionic-team/ionic-framework/issues/29673
          if (!this.multiple) {
            this.setActiveParts({
              ...activePart,
              month: ev.detail.value,
            });
          }

          ev.stopPropagation();
        }}
      >
        {months.map((month) => (
          <ion-picker-column-option
            color={this.color}
            part={month.value === workingParts.month ? `${WHEEL_ITEM_PART} ${WHEEL_ITEM_ACTIVE_PART}` : WHEEL_ITEM_PART}
            key={month.value}
            disabled={month.disabled}
            value={month.value}
          >
            {month.text}
          </ion-picker-column-option>
        ))}
      </ion-picker-column>
    );
  }
  private renderYearPickerColumn(years: WheelColumnOption[]) {
    if (years.length === 0) {
      return [];
    }

    const { disabled, workingParts } = this;

    return (
      <ion-picker-column
        part={WHEEL_PART}
        aria-label="Select a year"
        class="year-column"
        color={this.color}
        disabled={disabled}
        value={workingParts.year}
        onIonChange={(ev: CustomEvent) => {
          // Read live so parts a sibling column just committed are included.
          const activePart = this.getActivePartsWithFallback();

          this.setWorkingParts({
            ...this.workingParts,
            year: ev.detail.value,
          });

          // Year wheel is navigation-only in multi-select mode as a fix for https://github.com/ionic-team/ionic-framework/issues/29673
          if (!this.multiple) {
            this.setActiveParts({
              ...activePart,
              year: ev.detail.value,
            });
          }

          ev.stopPropagation();
        }}
      >
        {years.map((year) => (
          <ion-picker-column-option
            color={this.color}
            part={year.value === workingParts.year ? `${WHEEL_ITEM_PART} ${WHEEL_ITEM_ACTIVE_PART}` : WHEEL_ITEM_PART}
            key={year.value}
            disabled={year.disabled}
            value={year.value}
          >
            {year.text}
          </ion-picker-column-option>
        ))}
      </ion-picker-column>
    );
  }
  private renderTimePickerColumns(forcePresentation: string) {
    if (['date', 'month', 'month-year', 'year'].includes(forcePresentation)) {
      return [];
    }

    /**
     * If a user has not selected a date,
     * then we should show all times. If the
     * user has selected a date (even if it has
     * not been confirmed yet), we should apply
     * the max and min restrictions so that the
     * time picker shows values that are
     * appropriate for the selected date.
     */
    const activePart = this.getActivePart();
    const userHasSelectedDate = activePart !== undefined;

    const { hoursData, minutesData, dayPeriodData } = getTimeColumnsData(
      this.locale,
      this.workingParts,
      this.hourCycle,
      userHasSelectedDate ? this.minParts : undefined,
      userHasSelectedDate ? this.maxParts : undefined,
      this.parsedHourValues,
      this.parsedMinuteValues
    );

    return [
      this.renderHourPickerColumn(hoursData),
      this.renderMinutePickerColumn(minutesData),
      this.renderDayPeriodPickerColumn(dayPeriodData),
    ];
  }

  private renderHourPickerColumn(hoursData: WheelColumnOption[]) {
    const { disabled } = this;
    if (hoursData.length === 0) return [];

    const activePart = this.getActivePartsWithFallback();

    return (
      <ion-picker-column
        part={WHEEL_PART}
        aria-label="Select an hour"
        color={this.color}
        disabled={disabled}
        value={activePart.hour}
        numericInput
        onIonChange={(ev: CustomEvent) => {
          // Read live so parts a sibling column just committed are included.
          this.setWorkingParts({
            ...this.workingParts,
            hour: ev.detail.value,
          });

          this.setActiveParts({
            ...this.getActivePartsWithFallback(),
            hour: ev.detail.value,
          });

          ev.stopPropagation();
        }}
      >
        {hoursData.map((hour) => (
          <ion-picker-column-option
            color={this.color}
            part={hour.value === activePart.hour ? `${WHEEL_ITEM_PART} ${WHEEL_ITEM_ACTIVE_PART}` : WHEEL_ITEM_PART}
            key={hour.value}
            disabled={hour.disabled}
            value={hour.value}
          >
            {hour.text}
          </ion-picker-column-option>
        ))}
      </ion-picker-column>
    );
  }
  private renderMinutePickerColumn(minutesData: WheelColumnOption[]) {
    const { disabled } = this;
    if (minutesData.length === 0) return [];

    const activePart = this.getActivePartsWithFallback();

    return (
      <ion-picker-column
        part={WHEEL_PART}
        aria-label="Select a minute"
        color={this.color}
        disabled={disabled}
        value={activePart.minute}
        numericInput
        onIonChange={(ev: CustomEvent) => {
          // Read live so parts a sibling column just committed are included.
          this.setWorkingParts({
            ...this.workingParts,
            minute: ev.detail.value,
          });

          this.setActiveParts({
            ...this.getActivePartsWithFallback(),
            minute: ev.detail.value,
          });

          ev.stopPropagation();
        }}
      >
        {minutesData.map((minute) => (
          <ion-picker-column-option
            color={this.color}
            part={minute.value === activePart.minute ? `${WHEEL_ITEM_PART} ${WHEEL_ITEM_ACTIVE_PART}` : WHEEL_ITEM_PART}
            key={minute.value}
            disabled={minute.disabled}
            value={minute.value}
          >
            {minute.text}
          </ion-picker-column-option>
        ))}
      </ion-picker-column>
    );
  }
  private renderDayPeriodPickerColumn(dayPeriodData: WheelColumnOption[]) {
    const { disabled } = this;
    if (dayPeriodData.length === 0) {
      return [];
    }

    const activePart = this.getActivePartsWithFallback();
    const isDayPeriodRTL = isLocaleDayPeriodRTL(this.locale);

    return (
      <ion-picker-column
        part={WHEEL_PART}
        aria-label="Select a day period"
        style={isDayPeriodRTL ? { order: '-1' } : {}}
        color={this.color}
        disabled={disabled}
        value={activePart.ampm}
        onIonChange={(ev: CustomEvent) => {
          // Read live so parts a sibling column just committed are included.
          const currentParts = this.workingParts;
          const hour = calculateHourFromAMPM(currentParts, ev.detail.value);

          this.setWorkingParts({
            ...currentParts,
            ampm: ev.detail.value,
            hour,
          });

          this.setActiveParts({
            ...this.getActivePartsWithFallback(),
            ampm: ev.detail.value,
            hour,
          });

          ev.stopPropagation();
        }}
      >
        {dayPeriodData.map((dayPeriod) => (
          <ion-picker-column-option
            color={this.color}
            part={
              dayPeriod.value === activePart.ampm ? `${WHEEL_ITEM_PART} ${WHEEL_ITEM_ACTIVE_PART}` : WHEEL_ITEM_PART
            }
            key={dayPeriod.value}
            disabled={dayPeriod.disabled}
            value={dayPeriod.value}
          >
            {dayPeriod.text}
          </ion-picker-column-option>
        ))}
      </ion-picker-column>
    );
  }

  private renderWheelView(forcePresentation?: string) {
    const { locale } = this;
    const showMonthFirst = isMonthFirstLocale(locale);
    const columnOrder = showMonthFirst ? 'month-first' : 'year-first';
    return (
      <div
        class={{
          [`wheel-order-${columnOrder}`]: true,
        }}
      >
        {this.renderWheelPicker(forcePresentation)}
      </div>
    );
  }

  /**
   * Grid Render Methods
   */

  private renderCalendarHeader(theme: Theme) {
    const { disabled, datetimeNextIcon, datetimePreviousIcon, datetimeCollapsedIcon, datetimeExpandedIcon } = this;

    const prevMonthDisabled = disabled || isPrevMonthDisabled(this.workingParts, this.minParts, this.maxParts);
    const nextMonthDisabled = disabled || isNextMonthDisabled(this.workingParts, this.maxParts);

    // don't use the inheritAttributes util because it removes dir from the host, and we still need that
    const hostDir = this.el.getAttribute('dir') || undefined;

    return (
      <div class="calendar-header" part="calendar-header">
        {/*
          Announces the visible month when `workingParts` changes.

          Rendered in both orientations rather than vertical only. Horizontal
          has the same gap today, and fixing it for one axis would make the
          two behave differently for assistive technology. It matters most in
          vertical, where months slide past continuously and the gesture
          alone tells a screen reader user nothing.

          `aria-atomic` with a single region that is overwritten means a fast
          scroll announces the month landed on, not every month crossed.
        */}
        <div class="calendar-month-year-announce" aria-live="polite" aria-atomic="true">
          {getMonthAndYear(this.locale, this.workingParts)}
        </div>
        <div class="calendar-action-buttons">
          <div class="calendar-month-year">
            <button
              class={{
                'calendar-month-year-toggle': true,
                'ion-activatable': true,
                'ion-focusable': true,
              }}
              part="month-year-button"
              disabled={disabled}
              aria-label={this.showMonthAndYear ? 'Hide year picker' : 'Show year picker'}
              onClick={() => this.toggleMonthAndYearView()}
            >
              <span id="toggle-wrapper">
                {getMonthAndYear(this.locale, this.workingParts)}
                {theme !== 'ionic' && (
                  <ion-icon
                    aria-hidden="true"
                    icon={this.showMonthAndYear ? datetimeExpandedIcon : datetimeCollapsedIcon}
                    lazy={false}
                    flipRtl={true}
                  ></ion-icon>
                )}
              </span>
              {theme === 'md' && <ion-ripple-effect></ion-ripple-effect>}
            </button>
          </div>

          {/*
            Vertical never renders the arrows. Neither native reference does:
            Material's vertical picker and the iOS Calendar month view both
            rely on the next month being partly visible, which already tells
            the user the list scrolls. PageUp and PageDown still move by a
            month from a focused day.
          */}
          {!this.isVerticalNavigation && (
            <div class="calendar-next-prev">
              <ion-button
                aria-label="Previous month"
                disabled={prevMonthDisabled}
                onClick={() => this.prevMonth()}
                part="navigation-button previous-button"
              >
                <ion-icon
                  dir={hostDir}
                  aria-hidden="true"
                  slot="icon-only"
                  icon={datetimePreviousIcon}
                  lazy={false}
                  flipRtl
                ></ion-icon>
              </ion-button>
              <ion-button
                aria-label="Next month"
                disabled={nextMonthDisabled}
                onClick={() => this.nextMonth()}
                part="navigation-button next-button"
              >
                <ion-icon
                  dir={hostDir}
                  aria-hidden="true"
                  slot="icon-only"
                  icon={datetimeNextIcon}
                  lazy={false}
                  flipRtl
                ></ion-icon>
              </ion-button>
            </div>
          )}
        </div>
        <div class="calendar-days-of-week" aria-hidden="true" part="calendar-days-of-week">
          {getDaysOfWeek(this.locale, theme, this.firstDayOfWeek % 7).map((d) => {
            return <div class="day-of-week">{d}</div>;
          })}
        </div>
      </div>
    );
  }
  private renderMonth(month: number, year: number) {
    const { disabled, readonly } = this;

    const yearAllowed = this.parsedYearValues === undefined || this.parsedYearValues.includes(year);
    const monthAllowed = this.parsedMonthValues === undefined || this.parsedMonthValues.includes(month);
    const isCalMonthDisabled = !yearAllowed || !monthAllowed;
    const isDatetimeDisabled = disabled || readonly;
    const swipeDisabled =
      disabled ||
      isMonthDisabled(
        {
          month,
          year,
          day: null,
        },
        {
          // The day is not used when checking if a month is disabled.
          // Users should be able to access the min or max month, even if the
          // min/max date is out of bounds (e.g. min is set to Feb 15, Feb should not be disabled).
          minParts: { ...this.minParts, day: null },
          maxParts: { ...this.maxParts, day: null },
        }
      );
    // The working month should never have swipe disabled.
    // Otherwise the CSS scroll snap will not work and the user
    // can free-scroll the calendar.
    const isWorkingMonth = this.workingParts.month === month && this.workingParts.year === year;

    const activePart = this.getActivePartsWithFallback();

    const isVertical = this.isVerticalNavigation;
    const monthHeadingId = `${this.inputId}-month-${year}-${month}`;

    return (
      <div
        /**
         * Horizontal only ever shows one month, so the other two are hidden
         * from screen readers. Vertical shows several at once, so every month
         * in the window is real content.
         */
        aria-hidden={!isVertical && !isWorkingMonth ? 'true' : null}
        class={{
          'calendar-month': true,
          // Prevents scroll snap swipe gestures for months outside of the min/max bounds
          'calendar-month-disabled': !isVertical && !isWorkingMonth && swipeDisabled,
        }}
        data-month={month}
        data-year={year}
        /**
         * Horizontal deliberately reuses its three containers by position:
         * the scroll reset depends on the middle one staying put while its
         * contents change. Vertical cannot, because its window shifts by
         * several months at a time, and a reused container would keep focus
         * while repainting as a different month. Keying by date keeps July
         * as July, so a focused day stays the day the user moved to.
         */
        key={isVertical ? `${year}-${month}` : undefined}
      >
        {isVertical && (
          <div class="calendar-month-heading" id={monthHeadingId} part="month-heading">
            {getMonthAndYear(this.locale, { month, year, day: null })}
          </div>
        )}
        <div
          class="calendar-month-grid"
          role={isVertical ? 'group' : undefined}
          aria-labelledby={isVertical ? monthHeadingId : null}
        >
          {getDaysOfMonth(month, year, this.firstDayOfWeek % 7, this.rendersAdjacentDays).map((dateObject, index) => {
            const { day, dayOfWeek, isAdjacentDay } = dateObject;
            const { el, highlightedDates, isDateEnabled, multiple, rendersAdjacentDays } = this;
            let _month = month;
            let _year = year;
            if (rendersAdjacentDays && isAdjacentDay && day !== null) {
              if (day > 20) {
                // Leading with the adjacent day from the previous month
                // if its a adjacent day and is higher than '20' (last week even in feb)
                if (month === 1) {
                  _year = year - 1;
                  _month = 12;
                } else {
                  _month = month - 1;
                }
              } else if (day < 15) {
                // Leading with the adjacent day from the next month
                // if its a adjacent day and is lower than '15' (first two weeks)
                if (month === 12) {
                  _year = year + 1;
                  _month = 1;
                } else {
                  _month = month + 1;
                }
              }
            }

            const referenceParts = { month: _month, day, year: _year, isAdjacentDay };
            const isCalendarPadding = day === null;
            const {
              isActive,
              isToday,
              ariaLabel,
              ariaSelected,
              disabled: isDayDisabled,
              text,
            } = getCalendarDayState(
              this.locale,
              referenceParts,
              this.activeParts,
              this.todayParts,
              this.minParts,
              this.maxParts,
              this.parsedDayValues
            );

            const dateIsoString = convertDataToISO(referenceParts);

            let isCalDayDisabled = isCalMonthDisabled || isDayDisabled;

            if (!isCalDayDisabled && isDateEnabled !== undefined) {
              try {
                /**
                 * The `isDateEnabled` implementation is try-catch wrapped
                 * to prevent exceptions in the user's function from
                 * interrupting the calendar rendering.
                 */
                isCalDayDisabled = !isDateEnabled(dateIsoString);
              } catch (e) {
                printIonError(
                  '[ion-datetime] - Exception thrown from provided `isDateEnabled` function. Please check your function and try again.',
                  el,
                  e
                );
              }
            }

            /**
             * Some days are constrained through max & min or allowed dates
             * and also disabled because the component is readonly or disabled.
             * These need to be displayed differently.
             */
            const isCalDayConstrained = isCalDayDisabled && isDatetimeDisabled;

            const isButtonDisabled = isCalDayDisabled || isDatetimeDisabled;

            let dateStyle: DatetimeHighlightStyle | undefined = undefined;

            /**
             * Custom highlight styles should not override the style for selected dates,
             * nor apply to "filler days" at the start of the grid.
             */
            if (highlightedDates !== undefined && !isActive && day !== null && !isAdjacentDay) {
              dateStyle = getHighlightStyles(highlightedDates, dateIsoString, el);
            }

            let dateParts = undefined;

            // "Filler days" at the beginning of the grid should not get the calendar day
            // CSS parts added to them
            if (!isCalendarPadding && !isAdjacentDay) {
              dateParts = `calendar-day${isActive ? ' active' : ''}${isToday ? ' today' : ''}${
                isCalDayDisabled ? ' disabled' : ''
              }`;
            } else if (isAdjacentDay) {
              dateParts = `calendar-day${isCalDayDisabled ? ' disabled' : ''}`;
            }

            return (
              <div class="calendar-day-wrapper">
                <button
                  // We need to use !important for the inline styles here because
                  // otherwise the CSS shadow parts will override these styles.
                  // See https://github.com/WICG/webcomponents/issues/847
                  // Both the CSS shadow parts and highlightedDates styles are
                  // provided by the developer, but highlightedDates styles should
                  // always take priority.
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('color', `${dateStyle ? dateStyle.textColor : ''}`, 'important');
                      el.style.setProperty(
                        'background-color',
                        `${dateStyle ? dateStyle.backgroundColor : ''}`,
                        'important'
                      );
                      el.style.setProperty('border', `${dateStyle ? dateStyle.border : ''}`, 'important');
                    }
                  }}
                  tabindex="-1"
                  data-day={day}
                  data-month={_month}
                  data-year={_year}
                  data-index={index}
                  data-day-of-week={dayOfWeek}
                  disabled={isButtonDisabled}
                  class={{
                    'calendar-day-padding': isCalendarPadding,
                    'calendar-day': true,
                    'calendar-day-active': isActive,
                    'calendar-day-constrained': isCalDayConstrained,
                    'calendar-day-today': isToday,
                    'calendar-day-adjacent-day': isAdjacentDay,
                  }}
                  part={dateParts}
                  aria-hidden={isCalendarPadding ? 'true' : null}
                  aria-selected={ariaSelected}
                  aria-label={ariaLabel}
                  onClick={() => {
                    if (isCalendarPadding) {
                      return;
                    }

                    if (isAdjacentDay) {
                      // The user selected a day outside the current month. Ignore this button, as the month will be re-rendered.
                      this.el.blur();
                      this.activeParts = { ...activePart, ...referenceParts };
                      this.animateToDate(referenceParts);
                      this.confirm();
                    } else {
                      this.setWorkingParts({
                        ...this.workingParts,
                        ...referenceParts,
                      });

                      // Multiple only needs date info so we can wipe out other fields like time.
                      if (multiple) {
                        this.setActiveParts(referenceParts, isActive);
                      } else {
                        this.setActiveParts({
                          ...activePart,
                          ...referenceParts,
                        });
                      }
                    }
                  }}
                >
                  {text}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  private renderCalendarBody() {
    return (
      <div class="calendar-body ion-focusable" ref={(el) => (this.calendarBodyRef = el)} tabindex="0">
        {this.isVerticalNavigation
          ? this.renderVerticalMonths()
          : generateMonths(this.workingParts, this.forceRenderDate).map(({ month, year }) => {
              return this.renderMonth(month, year);
            })}
      </div>
    );
  }
  /**
   * The vertical months, with empty runway before and after them. A fling
   * travels further than the rendered months reach, and on a slow device the
   * re-center that extends them can take longer to render than the fling
   * takes to arrive, so without runway the fling stops dead at the last
   * rendered month. This is how virtualized lists on the web avoid the same
   * wall: the scroll range stays longer than what is rendered, and the user
   * may briefly see blank space instead of hitting a false end.
   */
  private renderVerticalMonths() {
    const months = this.generateVerticalMonths();
    const runway = (key: string, count: number) =>
      count > 0 && (
        <div
          key={key}
          class="calendar-runway"
          aria-hidden="true"
          style={{ height: `calc(var(--internal-month-block-height) * ${count})` }}
        ></div>
      );

    return [
      runway('runway-before', this.verticalRunwayBefore(months)),
      ...months.map(({ month, year }) => this.renderMonth(month, year)),
      runway('runway-after', this.verticalRunwayAfter(months)),
    ];
  }

  private renderCalendar(theme: Theme) {
    return (
      <div class="datetime-calendar" key="datetime-calendar">
        {this.renderCalendarHeader(theme)}
        {this.renderCalendarBody()}
      </div>
    );
  }

  private renderTimeLabel() {
    const hasSlottedTimeLabel = this.el.querySelector('[slot="time-label"]') !== null;
    if (!hasSlottedTimeLabel && !this.showDefaultTimeLabel) {
      return;
    }

    return <slot name="time-label">Time</slot>;
  }

  private renderTimeOverlay() {
    const { disabled, hourCycle, isTimePopoverOpen, locale, formatOptions } = this;
    const computedHourCycle = getHourCycle(locale, hourCycle);
    const activePart = this.getActivePartsWithFallback();

    return [
      <div class="time-header">{this.renderTimeLabel()}</div>,
      <button
        class={{
          'time-body': true,
          'time-body-active': isTimePopoverOpen,
        }}
        part={`time-button${isTimePopoverOpen ? ' active' : ''}`}
        aria-expanded="false"
        aria-haspopup="true"
        disabled={disabled}
        onClick={async (ev) => {
          const { popoverRef } = this;

          if (popoverRef) {
            this.isTimePopoverOpen = true;

            popoverRef.present(
              new CustomEvent('ionShadowTarget', {
                detail: {
                  ionShadowTarget: ev.target,
                },
              })
            );

            await popoverRef.onWillDismiss();

            this.isTimePopoverOpen = false;
          }
        }}
      >
        {getLocalizedTime(locale, activePart, computedHourCycle, formatOptions?.time)}
      </button>,
      <ion-popover
        alignment="center"
        translucent
        overlayIndex={1}
        arrow={false}
        onWillPresent={(ev) => {
          /**
           * Intersection Observers do not consistently fire between Blink and Webkit
           * when toggling the visibility of the popover and trying to scroll the picker
           * column to the correct time value.
           *
           * This will correctly scroll the element position to the correct time value,
           * before the popover is fully presented.
           */
          const cols = (ev.target! as HTMLElement).querySelectorAll('ion-picker-column');
          // TODO (FW-615): Potentially remove this when intersection observers are fixed in picker column
          cols.forEach((col) => col.scrollActiveItemIntoView());
        }}
        style={{
          '--offset-y': '-10px',
          '--min-width': 'fit-content',
        }}
        // Allow native browser keyboard events to support up/down/home/end key
        // navigation within the time picker.
        keyboardEvents
        ref={(el) => (this.popoverRef = el)}
      >
        {this.renderWheelPicker('time')}
      </ion-popover>,
    ];
  }

  private getHeaderSelectedDateText() {
    const { activeParts, formatOptions, multiple, titleSelectedDatesFormatter } = this;
    const isArray = Array.isArray(activeParts);

    let headerText: string;
    if (multiple && isArray && activeParts.length !== 1) {
      headerText = `${activeParts.length} days`; // default/fallback for multiple selection
      if (titleSelectedDatesFormatter !== undefined) {
        try {
          headerText = titleSelectedDatesFormatter(convertDataToISO(activeParts));
        } catch (e) {
          printIonError('[ion-datetime] - Exception in provided `titleSelectedDatesFormatter`:', e);
        }
      }
    } else {
      // for exactly 1 day selected (multiple set or not), show a formatted version of that
      headerText = getLocalizedDateTime(
        this.locale,
        this.getActivePartsWithFallback(),
        formatOptions?.date ?? { weekday: 'short', month: 'short', day: 'numeric' }
      );
    }

    return headerText;
  }

  private renderHeader(showExpandedHeader = true) {
    const hasSlottedTitle = this.el.querySelector('[slot="title"]') !== null;
    if (!hasSlottedTitle && !this.showDefaultTitle) {
      return;
    }

    return (
      <div class="datetime-header" part="datetime-header">
        <div class="datetime-title" part="datetime-title">
          <slot name="title">Select Date</slot>
        </div>
        {showExpandedHeader && (
          <div class="datetime-selected-date" part="datetime-selected-date">
            {this.getHeaderSelectedDateText()}
          </div>
        )}
      </div>
    );
  }

  /**
   * Render time picker inside of datetime.
   * Do not pass color prop to segment on
   * iOS mode. MD segment has been customized and
   * should take on the color prop, but iOS
   * should just be the default segment.
   */
  private renderTime() {
    const { presentation } = this;
    const timeOnlyPresentation = presentation === 'time';

    return (
      <div class="datetime-time">{timeOnlyPresentation ? this.renderWheelPicker() : this.renderTimeOverlay()}</div>
    );
  }

  /**
   * Renders the month/year picker that is
   * displayed on the calendar grid.
   * The .datetime-year class has additional
   * styles that let us show/hide the
   * picker when the user clicks on the
   * toggle in the calendar header.
   */
  private renderCalendarViewMonthYearPicker() {
    return <div class="datetime-year">{this.renderWheelView('month-year')}</div>;
  }

  /**
   * Render entry point
   * All presentation types are rendered from here.
   */

  private renderDatetime(theme: Theme) {
    const { presentation, preferWheel } = this;

    /**
     * Certain presentation types have separate grid and wheel displays.
     * If preferWheel is true then we should show a wheel picker instead.
     */
    const hasWheelVariant = presentation === 'date' || presentation === 'date-time' || presentation === 'time-date';
    if (preferWheel && hasWheelVariant) {
      return [this.renderHeader(false), this.renderWheelView(), this.renderFooter()];
    }

    switch (presentation) {
      case 'date-time':
        return [
          this.renderHeader(),
          this.renderCalendar(theme),
          this.renderCalendarViewMonthYearPicker(),
          this.renderTime(),
          this.renderFooter(),
        ];
      case 'time-date':
        return [
          this.renderHeader(),
          this.renderTime(),
          this.renderCalendar(theme),
          this.renderCalendarViewMonthYearPicker(),
          this.renderFooter(),
        ];
      case 'time':
        return [this.renderHeader(false), this.renderTime(), this.renderFooter()];
      case 'month':
      case 'month-year':
      case 'year':
        return [this.renderHeader(false), this.renderWheelView(), this.renderFooter()];
      default:
        return [
          this.renderHeader(),
          this.renderCalendar(theme),
          this.renderCalendarViewMonthYearPicker(),
          this.renderFooter(),
        ];
    }
  }

  /**
   * Get the icon to use for the next icon.
   * Use the icon set in the config.
   * If no icon is set in the config, use the default icon.
   */
  get datetimeNextIcon(): string {
    return config.get('datetimeNextIcon', chevronForward);
  }

  /**
   * Get the icon to use for the previous icon.
   * Use the icon set in the config.
   * If no icon is set in the config, use the default icon.
   */
  get datetimePreviousIcon(): string {
    return config.get('datetimePreviousIcon', chevronBack);
  }

  /**
   * Get the icon to use for the show month and year icon.
   * Use the icon set in the config.
   * If no icon is set in the config, use the default icon.
   */
  get datetimeCollapsedIcon(): string | undefined {
    // Determine the theme and map to the default icon
    const theme = getIonTheme(this);
    const defaultIcon = theme === 'ios' ? chevronForward : caretDownSharp;

    return config.get('datetimeCollapsedIcon', defaultIcon);
  }

  /**
   * Get the icon to use for the hide month and year icon.
   * Use the icon set in the config.
   * If no icon is set in the config, use the default icon.
   */
  get datetimeExpandedIcon(): string | undefined {
    // Determine the theme and map to the default icon
    const theme = getIonTheme(this);
    const defaultIcon = theme === 'ios' ? chevronDown : caretUpSharp;

    return config.get('datetimeExpandedIcon', defaultIcon);
  }

  render() {
    const {
      name,
      value,
      disabled,
      el,
      color,
      readonly,
      showMonthAndYear,
      preferWheel,
      presentation,
      size,
      isGridStyle,
      isVerticalNavigation,
    } = this;
    const theme = getIonTheme(this);
    const isMonthAndYearPresentation =
      presentation === 'year' || presentation === 'month' || presentation === 'month-year';
    const shouldShowMonthAndYear = showMonthAndYear || isMonthAndYearPresentation;
    const monthYearPickerOpen = showMonthAndYear && !isMonthAndYearPresentation;
    const hasDatePresentation = presentation === 'date' || presentation === 'date-time' || presentation === 'time-date';
    const hasWheelVariant = hasDatePresentation && preferWheel;

    renderHiddenInput(true, el, name, formatValue(value), disabled);

    return (
      <Host
        aria-disabled={disabled ? 'true' : null}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        class={{
          ...createColorClasses(color, {
            [theme]: true,
            ['datetime-readonly']: readonly,
            ['datetime-disabled']: disabled,
            'show-month-and-year': shouldShowMonthAndYear,
            'month-year-picker-open': monthYearPickerOpen,
            [`datetime-presentation-${presentation}`]: true,
            [`datetime-size-${size}`]: true,
            [`datetime-prefer-wheel`]: hasWheelVariant,
            [`datetime-grid`]: isGridStyle,
            [NAVIGATION_VERTICAL_CLASS]: isVerticalNavigation,
          }),
        }}
      >
        {/*
          WebKit has a quirk where IntersectionObserver callbacks are delayed until after
          an accelerated animation finishes if the "root" specified in the config is the
          browser viewport (the default behavior if "root" is not specified). This means
          that when presenting a datetime in a modal on iOS the calendar body appears
          blank until the modal animation finishes.

          We can work around this by observing .intersection-tracker and using the host
          (ion-datetime) as the "root". This allows the IO callback to fire the moment
          the datetime is visible. The .intersection-tracker element should not have
          dimensions or additional styles, and it should not be positioned absolutely
          otherwise the IO callback may fire at unexpected times.
        */}
        <div class="intersection-tracker" ref={(el) => (this.intersectionTrackerRef = el)}></div>
        {this.renderDatetime(theme)}
      </Host>
    );
  }
}

let datetimeIds = 0;
const CANCEL_ROLE = 'datetime-cancel';
const CONFIRM_ROLE = 'datetime-confirm';
const WHEEL_PART = 'wheel';
const WHEEL_ITEM_PART = 'wheel-item';
const WHEEL_ITEM_ACTIVE_PART = `active`;
const NAVIGATION_VERTICAL_CLASS = 'datetime-navigation-vertical';

/**
 * How many months the vertical window holds either side of its center. Has to
 * cover the visible area plus enough margin that the user can scroll without
 * immediately reaching the end. Refer to the design doc's open question on
 * tuning this against a real device.
 */
const VERTICAL_WINDOW_RADIUS = 3;

/** How close to an edge of the window the user can get before it re-centers. */
const VERTICAL_RECENTER_THRESHOLD = 1;

/** Quiet period after the last scroll event that ends a glide without `scrollend`. */
const VERTICAL_GLIDE_SETTLE_MS = 150;

/**
 * How far the vertical list reaches either side of today when `min` or `max`
 * is not set. At the largest theme's block height that is about 800,000px of
 * scroll content, well within what browsers support.
 */
const VERTICAL_DEFAULT_RANGE_YEARS = 100;

/** Identifies a rendered month list by its first month and its length. */
const verticalListSignature = (months: DatetimeParts[]) =>
  months.length === 0 ? '' : `${months[0].year}-${months[0].month}:${months.length}`;

/** Months since year 0, for ordering months without a day. */
const monthIndex = ({ month, year }: DatetimeParts) => year * 12 + month;

/** The inverse of `monthIndex`. */
const monthFromIndex = (index: number): DatetimeParts => {
  const year = Math.floor((index - 1) / 12);
  return { month: index - year * 12, year, day: null };
};
