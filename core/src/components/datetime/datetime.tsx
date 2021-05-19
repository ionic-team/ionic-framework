import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h, writeTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, DatetimeChangeEventDetail, Mode, StyleEventDetail } from '../../interface';
import { raf, renderHiddenInput } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';

import {
  DatetimeParts,
  calculateHourFromAMPM,
  convert12HourTo24Hour,
  generateMonths,
  generateTime,
  getCalendarDayState,
  getDaysOfMonth,
  getDaysOfWeek,
  getEndOfWeek,
  getMonthAndDay,
  getMonthAndYear,
  getNextDay,
  getNextMonth,
  getNextWeek,
  getPartsFromCalendarDay,
  getPreviousDay,
  getPreviousMonth,
  getPreviousWeek,
  getStartOfWeek,
  is24Hour,
  parseDate,
  shouldRenderViewButtons,
  shouldRenderViewFooter,
  shouldRenderViewHeader
} from './datetime.utils';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot title - The title of the datetime. Only visible
 * when presentationStyle="overlay".
 * @slot buttons - The buttons in the datetime. Only
 * visible when presentationStyle="overlay".
 */
@Component({
  tag: 'ion-datetime',
  styleUrls: {
    ios: 'datetime.ios.scss',
    md: 'datetime.md.scss'
  },
  shadow: true
})
export class Datetime implements ComponentInterface {

  private presentationType: DatetimePresentationType = DatetimePresentationType.Inline;
  private inputId = `ion-dt-${datetimeIds++}`;
  private showDefaultTitleAndButtons = true;
  private calendarBodyRef?: HTMLElement;
  private timeBaseRef?: HTMLElement;
  private timeHourRef?: HTMLElement;
  private timeMinuteRef?: HTMLElement;

  private minParts?: any;
  private maxParts?: any;

  @State() activeParts = {
    month: 5,
    day: 12,
    year: 2021
  }

  @State() workingParts: DatetimeParts = {
    month: 5,
    day: 12,
    year: 2021,
    hour: 13,
    minute: 52,
    ampm: 'pm'
  }

  private todayParts = {
    month: 5,
    day: 14,
    year: 2021
  }

  @Element() el!: HTMLIonDatetimeElement;

  @State() isPresented = false;
  @State() private view: DatetimeView = DatetimeView.Calendar;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color = 'primary';

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * If `true`, the user cannot interact with the datetime.
   */
  @Prop() disabled = false;

  /**
   * If `true`, the datetime appears normal but is not interactive.
   */
  @Prop() readonly = false;

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
  }

  /**
   * The display format of the date and time as text that shows
   * within the item. When the `pickerFormat` input is not used, then the
   * `displayFormat` is used for both display the formatted text, and determining
   * the datetime picker's columns. See the `pickerFormat` input description for
   * more info. Defaults to `MMM D, YYYY`.
   */
  @Prop() displayFormat = 'MMM D, YYYY';

  /**
   * The timezone to use for display purposes only. See
   * [Date.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)
   * for a list of supported timezones. If no value is provided, the
   * component will default to displaying times in the user's local timezone.
   */
  @Prop() displayTimezone?: string;

  /**
   * The format of the date and time picker columns the user selects.
   * A datetime input can have one or many datetime parts, each getting their
   * own column which allow individual selection of that particular datetime part. For
   * example, year and month columns are two individually selectable columns which help
   * choose an exact date from the datetime picker. Each column follows the string
   * parse format. Defaults to use `displayFormat`.
   */
  @Prop() pickerFormat?: string;

  /**
   * The text to display on the picker's cancel button.
   */
  @Prop() cancelText = 'Cancel';

  /**
   * The text to display on the picker's "Done" button.
   */
  @Prop() doneText = 'Done';

  /**
   * Values used to create the list of selectable years. By default
   * the year values range between the `min` and `max` datetime inputs. However, to
   * control exactly which years to display, the `yearValues` input can take a number, an array
   * of numbers, or string of comma separated numbers. For example, to show upcoming and
   * recent leap years, then this input's value would be `yearValues="2024,2020,2016,2012,2008"`.
   */
  @Prop() yearValues?: number[] | number | string;

  /**
   * Values used to create the list of selectable months. By default
   * the month values range from `1` to `12`. However, to control exactly which months to
   * display, the `monthValues` input can take a number, an array of numbers, or a string of
   * comma separated numbers. For example, if only summer months should be shown, then this
   * input value would be `monthValues="6,7,8"`. Note that month numbers do *not* have a
   * zero-based index, meaning January's value is `1`, and December's is `12`.
   */
  @Prop() monthValues?: number[] | number | string;

  /**
   * Values used to create the list of selectable days. By default
   * every day is shown for the given month. However, to control exactly which days of
   * the month to display, the `dayValues` input can take a number, an array of numbers, or
   * a string of comma separated numbers. Note that even if the array days have an invalid
   * number for the selected month, like `31` in February, it will correctly not show
   * days which are not valid for the selected month.
   */
  @Prop() dayValues?: number[] | number | string;

  /**
   * Values used to create the list of selectable hours. By default
   * the hour values range from `0` to `23` for 24-hour, or `1` to `12` for 12-hour. However,
   * to control exactly which hours to display, the `hourValues` input can take a number, an
   * array of numbers, or a string of comma separated numbers.
   */
  @Prop() hourValues?: number[] | number | string;

  /**
   * Values used to create the list of selectable minutes. By default
   * the minutes range from `0` to `59`. However, to control exactly which minutes to display,
   * the `minuteValues` input can take a number, an array of numbers, or a string of comma
   * separated numbers. For example, if the minute selections should only be every 15 minutes,
   * then this input value would be `minuteValues="0,15,30,45"`.
   */
  @Prop() minuteValues?: number[] | number | string;

  /**
   * The locale to use for `ion-datetime`. This
   * impacts month and day name formatting.
   * The `'default'` value refers to the default
   * locale set by your device.
   */
  @Prop() locale = 'default';

  /**
   * The value of the datetime as a valid ISO 8601 datetime string.
   */
  @Prop({ mutable: true }) value?: string | null;

  /**
   * Update the datetime value when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    this.emitStyle();
    this.ionChange.emit({
      value: this.value
    });
  }

  /**
   * Which type of datetime picker that should be used.
   * `'calendar'` will display a calendar picker with a
   * time input.
   * `'wheel'` will display a scrollable list of date
   * and time options.
   */
  @Prop() interactionStyle: 'calendar' | 'wheel' = 'calendar';

  /**
   * Emitted when the datetime selection was cancelled.
   */
  @Event() ionCancel!: EventEmitter<void>;

  /**
   * Emitted when the value (selected date) has changed.
   */
  @Event() ionChange!: EventEmitter<DatetimeChangeEventDetail>;

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

  private initializeKeyboardListeners = () => {
    const root = this.el!.shadowRoot!;
    /**
     * Get a reference to the month
     * element we are currently viewing.
     */
    const currentMonth = this.calendarBodyRef!.querySelector('.calendar-month:nth-of-type(2)')!;

    /**
     * When focusing the calendar body, we want to pass focus
     * to the working day, but other days should
     * only be accessible using the arrow keys. Pressing
     * Tab should jump between bodies of selectable content.
     */
    this.calendarBodyRef!.addEventListener('focusin', ev => {
    const relatedTarget = ev.relatedTarget as HTMLElement;
    if (ev.target !== this.calendarBodyRef) { return; }

    if (relatedTarget?.classList.contains('calendar-day')) {
      const prevButton = root.querySelector('.calendar-next-prev ion-button:last-of-type') as HTMLElement;
      prevButton.focus();
    } else {
      this.focusWorkingDay(currentMonth);
    }
  });

    /**
     * We must use keydown not keyup as we want
     * to prevent scrolling when using the arrow keys.
     */
    this.calendarBodyRef!.addEventListener('keydown', (ev: KeyboardEvent) => {
      const activeElement = root.activeElement;
      if (!activeElement || !activeElement.classList.contains('calendar-day')) { return; }

      const parts = getPartsFromCalendarDay(activeElement as HTMLElement)

      switch (ev.key) {
        case 'ArrowDown':
          ev.preventDefault();
          this.workingParts = { ...getNextWeek(parts) as any };
          break;
        case 'ArrowUp':
          ev.preventDefault();
          this.workingParts = { ...getPreviousWeek(parts) as any };
          break;
        case 'ArrowRight':
          ev.preventDefault();
          this.workingParts = { ...getNextDay(parts) as any };
          break;
        case 'ArrowLeft':
          ev.preventDefault();
          this.workingParts = { ...getPreviousDay(parts) as any };
          break;
        case 'Home':
          ev.preventDefault();
          this.workingParts = { ...getStartOfWeek(parts) as any };
          break;
        case 'End':
          ev.preventDefault();
          this.workingParts = { ...getEndOfWeek(parts) as any };
          break;
        case 'PageUp':
          ev.preventDefault();
          this.workingParts = { ...getPreviousMonth(parts) as any }
          break;
        case 'PageDown':
          ev.preventDefault();
          this.workingParts = { ...getNextMonth(parts) as any }
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
       * Give view a change to re-render
       */
      requestAnimationFrame(() => this.focusWorkingDay(currentMonth));
    })
  }

  private focusWorkingDay = (currentMonth: Element) => {
    /**
     * Get the number of padding days so
     * we know how much to offset our next selector by
     * to grab the correct calenday-day element.
     */
    const padding = currentMonth.querySelectorAll('.calendar-day-padding');
    const { day } = this.workingParts;

    if (day === null) { return; }

    /**
     * Get the calendar day element
     * and focus it.
     */
    const dayEl = currentMonth.querySelector(`.calendar-day:nth-of-type(${padding.length + day})`) as HTMLElement | null
    if (dayEl) {
      dayEl.focus();
    }
  }

  private processMinParts = () => {
    if (this.min === undefined) {
      this.minParts = undefined;
      return;
    }

    const { month, day, year, hour, minute } = parseDate(this.min);

    this.minParts = {
      month,
      day,
      year,
      hour,
      minute
    }
  }

  private processMaxParts = () => {
    if (this.max === undefined) {
      this.maxParts = undefined;
      return;
    }

    const { month, day, year, hour, minute } = parseDate(this.max);

    this.maxParts = {
      month,
      day,
      year,
      hour,
      minute
    }
  }

  connectedCallback() {
    const modalOrPopover = this.el.closest('ion-modal, ion-popover');
    if (modalOrPopover) {
      this.presentationType = (modalOrPopover.tagName === 'ION-MODAL') ? DatetimePresentationType.Modal : DatetimePresentationType.Popover;
      modalOrPopover.classList.add('overlay-datetime');
    }
  }

  componentDidLoad() {
    const { calendarBodyRef, timeBaseRef, timeHourRef, timeMinuteRef } = this;
    if (!calendarBodyRef) { return; }

    const mode = getIonMode(this);

    /**
     * For performance reasons, we only render 3
     * months at a time: The current month, the previous
     * month, and the next month. We have IntersectionObservers
     * on the previous and next month elements to append/prepend
     * new months.
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

    /**
     * Before setting up the IntersectionObserver,
     * scroll the middle month into view.
     */
    writeTask(() => {
      workingMonth.scrollIntoView(false);

      let endIO: IntersectionObserver | undefined;
      let startIO: IntersectionObserver | undefined;
      const ioCallback = (callbackType: 'start' | 'end', entries: IntersectionObserverEntry[]) => {
        const refIO = (callbackType === 'start') ? startIO : endIO;
        const refMonth = (callbackType === 'start') ? startMonth : endMonth;
        const refMonthFn = (callbackType === 'start') ? getPreviousMonth : getNextMonth;

        /**
         * If the month is not fully in view, do not do anything
         */
        const ev = entries[0];
        if (!ev.isIntersecting) { return; }

        /**
         * On iOS, we need to set pointer-events: none
         * when the user is almost done with the gesture
         * so that they cannot quickly swipe while
         * the scrollable container is snapping.
         * Updating the container while snapping
         * causes WebKit to snap incorrectly.
         */
        if (mode === 'ios') {
          const ratio = ev.intersectionRatio;
          const shouldDisable = Math.abs(ratio - 0.7) <= 0.1;

          if (shouldDisable) {
            calendarBodyRef.style.setProperty('pointer-events', 'none');
            return;
          }
        }

        /**
         * Prevent scrolling for other browsers
         * to give the DOM time to update and the container
         * time to properly snap.
         */
        calendarBodyRef.style.setProperty('overflow', 'hidden');

        /**
         * Remove the IO temporarily
         * otherwise you can sometimes get duplicate
         * events when rubber banding.
         */
        if (refIO === undefined) { return; }
        refIO.disconnect();

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
          const { month, year, day } = refMonthFn(this.workingParts);

          this.workingParts = {
            month,
            day: day!,
            year
          }

          workingMonth.scrollIntoView(false);
          calendarBodyRef.style.removeProperty('overflow');
          calendarBodyRef.style.removeProperty('pointer-events');

          /**
           * Now that state has been updated
           * and the correct month is in view,
           * we can resume the IO.
           */
          // tslint:disable-next-line
          if (refIO === undefined) { return; }
          refIO.observe(refMonth);
        });
      }

      /**
       * Listen on the first month to
       * prepend a new month and on the last
       * month to append a new month.
       * The 0.7 threshold is required on ios
       * so that we can remove pointer-events
       * when adding new months.
       * Adding to a scroll snapping container
       * while the container is snapping does not
       * completely work as expected in WebKit.
       * Adding pointer-events: none allows us to
       * avoid these issues.
       *
       * This should be fine on Chromium, but
       * when you set pointer-events: none
       * it applies to active gestures which is not
       * something WebKit does.
       */
      endIO = new IntersectionObserver(ev => ioCallback('end', ev), {
        threshold: mode === 'ios' ? [0.7, 1] : 1,
        root: calendarBodyRef
      });
      endIO.observe(endMonth);

      startIO = new IntersectionObserver(ev => ioCallback('start', ev), {
        threshold: mode === 'ios' ? [0.7, 1] : 1,
        root: calendarBodyRef
      });
      startIO.observe(startMonth);

      this.initializeKeyboardListeners();
    });

    if (timeBaseRef && timeHourRef && timeMinuteRef) {
      let timeout: any;
      const scrollCallback = (colType: string) => {
        raf(() => {
          if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
          }

          const activeCol = colType === 'hour' ? timeHourRef : timeMinuteRef;
          const otherCol = colType === 'hour' ? timeMinuteRef : timeHourRef;

          timeBaseRef.classList.add('time-base-active');
          activeCol.classList.add('time-column-active');

          timeout = setTimeout(() => {
            timeBaseRef.classList.remove('time-base-active');
            activeCol.classList.remove('time-column-active');
            otherCol.classList.remove('time-column-active');

            const bbox = activeCol.getBoundingClientRect();
            if (colType === 'hour') {
              const activeElement = this.el!.shadowRoot!.elementFromPoint(bbox.x + 1, bbox.y + 1)!;
              const value = parseInt(activeElement.getAttribute('data-value')!, 10);

              this.workingParts = {
                ...this.workingParts,
                hour: value
              }
            } else {
              const activeElement = this.el!.shadowRoot!.elementFromPoint(bbox.x - 1, bbox.y + 1)!;
              const value = parseInt(activeElement.getAttribute('data-value')!, 10);

              this.workingParts = {
                ...this.workingParts,
                minute: value
              }
            }
          }, 250);
        });
      }
      timeHourRef.addEventListener('scroll', () => scrollCallback('hour'));
      timeMinuteRef.addEventListener('scroll', () => scrollCallback('minute'));
    }
  }

  componentWillLoad() {
    this.processMinParts();
    this.processMaxParts();
    this.emitStyle();

    /**
     * Buttons and titles should only be shown
     * by default when in a modal; however,
     * developers can slot in their own buttons and
     * titles if they want to override this behavior.
     */
    const isModal = this.el.closest('ion-modal');
    this.showDefaultTitleAndButtons = (isModal) ? true : false;
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'datetime': true,
      // 'has-placeholder': this.placeholder != null,
      // 'has-value': this.hasValue(),
      'interactive-disabled': this.disabled,
    });
  }

  /**
   * Opens the datetime overlay.
   * Only applies when `presentationStyle="overlay"`.
   */
  @Method()
  async open() {
    console.log('[Stubbed]: open()')
    this.isPresented = true;
  }

  /**
   * Dismisses the datetime overlay.
   * Only applies when `presentationStyle="overlay"`.
   */
  @Method()
  async dismiss() {
    console.log('[Stubbed]: dismiss()')
    this.isPresented = false;
  }

  private toggleView = () => {
    this.view = (this.view === DatetimeView.Calendar) ? DatetimeView.Time : DatetimeView.Calendar;
  }

  private nextMonth = () => {
    const { calendarBodyRef } = this;
    if (!calendarBodyRef) { return; }

    const nextMonth = calendarBodyRef.querySelector('.calendar-month:last-of-type');
    if (!nextMonth) { return; }

    nextMonth.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  }

  private prevMonth = () => {
    const { calendarBodyRef } = this;
    if (!calendarBodyRef) { return; }

    const prevMonth = calendarBodyRef.querySelector('.calendar-month:first-of-type');
    if (!prevMonth) { return; }

    prevMonth.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  }

  private renderFooter(mode: Mode) {
    const hasSlottedButtons = this.el.querySelector('[slot="buttons"]') !== null;
    if (!shouldRenderViewFooter(mode, this.presentationType, hasSlottedButtons)) { return; }

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
          {shouldRenderViewButtons(mode) && <div class="datetime-view-buttons">
            <ion-buttons>
              <ion-button onClick={() => this.toggleView()}>
                <ion-icon slot="icon-only" icon={this.view === DatetimeView.Calendar ? 'time-outline' : 'calendar-clear-outline'} lazy={false}></ion-icon>
              </ion-button>
              <ion-button>
                <ion-icon slot="icon-only" icon="pizza-outline" lazy={false}></ion-icon>
              </ion-button>
            </ion-buttons>
          </div>}

          <div class="datetime-action-buttons">
            <slot name="buttons">
              {this.showDefaultTitleAndButtons && <ion-buttons>
                <ion-button color={this.color} onClick={() => this.dismiss()}>{this.cancelText}</ion-button>
                <ion-button color={this.color} onClick={() => this.dismiss()}>{this.doneText}</ion-button>
              </ion-buttons> }
            </slot>
          </div>
        </div>
      </div>
    );
  }

  private renderCalendarHeader(mode: Mode) {
    return (
      <div class="calendar-header">
        <div class="calendar-action-buttons">
          <div class="calendar-month-year">
            <ion-item button detail={false} lines="none">
              <ion-label>
                {getMonthAndYear(this.locale, this.workingParts)} <ion-icon icon={mode === 'ios' ? 'chevron-forward' : 'caret-down-sharp'} lazy={false}></ion-icon>
              </ion-label>
            </ion-item>
          </div>

          <div class="calendar-next-prev">
            <ion-buttons>
              <ion-button onClick={() => this.prevMonth()}>
                <ion-icon slot="icon-only" icon="chevron-back" lazy={false}></ion-icon>
              </ion-button>
              <ion-button onClick={() => this.nextMonth()}>
                <ion-icon slot="icon-only" icon="chevron-forward" lazy={false}></ion-icon>
              </ion-button>
            </ion-buttons>
          </div>
        </div>
        <div class="calendar-days-of-week">
          {getDaysOfWeek(this.locale, mode).map(d => {
            return <div class="day-of-week">{d}</div>
          })}
        </div>
      </div>
    )
  }

  private renderMonth(month: number, year: number) {
    return (
      <div class="calendar-month">
        <div class="calendar-month-grid">
          {getDaysOfMonth(month, year).map((dateObject, index) => {
            const { day, dayOfWeek } = dateObject;
            const referenceParts = { month, day, year };
            const { isActive, isToday, ariaLabel, ariaSelected, disabled } = getCalendarDayState(this.locale, referenceParts, this.activeParts, this.todayParts, this.minParts, this.maxParts);

            return (
              <button
                tabindex="-1"
                data-day={day}
                data-month={month}
                data-year={year}
                data-index={index}
                data-day-of-week={dayOfWeek}
                disabled={disabled}
                class={{
                  'calendar-day-padding': day === null,
                  'calendar-day': true,
                  'calendar-day-active': isActive,
                  'calendar-day-today': isToday
                }}
                aria-selected={ariaSelected}
                aria-label={ariaLabel}
                onClick={() => {
                  if (day === null) { return; }

                  this.activeParts = {
                    month,
                    day,
                    year
                  }
                }}
              >{day}</button>
            )
          })}
        </div>
      </div>
    )
  }

  private renderCalendarBody() {
    return (
      <div class="calendar-body" ref={el => this.calendarBodyRef = el} tabindex="0">
        {generateMonths(this.workingParts).map(({ month, year }) => {
          return this.renderMonth(month, year);
        })}
      </div>
    )
  }

  private renderCalendar(mode: Mode) {
    return (
      <div class="datetime-calendar">
        {this.renderCalendarHeader(mode)}
        {this.renderCalendarBody()}
      </div>
    )
  }

  private renderTime() {
    const use24Hour = is24Hour(this.locale);
    const { ampm } = this.workingParts;
    const { hours, minutes } = generateTime(this.locale, this.workingParts, this.minParts, this.maxParts);

     // TODO: can we hardcode these values?
    const addPadding = (v: number) => {
      const vString = v.toString();
      if (vString.length > 1) { return vString; }

      return `0${vString}`;
    }

    /**
     * If PM, then internal value should
     * be converted to 24-hr time.
     * Does not apply when public
     * values are already 24-hr time.
     */
    const getHourValue = (hour: number) => {
      if (use24Hour) { return hour; }

      return convert12HourTo24Hour(hour, ampm);
    }
    return (
      <div class="datetime-time">
        <div class="time-header">Time</div>
        <div class="time-body">
          <div class="time-base" ref={el => this.timeBaseRef = el}>
            <div class="time-wrapper">
              <div
                class="time-column"
                aria-label="Hours"
                role="slider"
                ref={el => this.timeHourRef = el}
                tabindex="0"
              >
                { hours.map(hour => {
                  return (
                    <div
                      class="time-item"
                      data-value={getHourValue(hour)}
                    >{addPadding(hour)}</div>
                  )
                })}
              </div>
              <div class="time-separator">:</div>
              <div
                class="time-column"
                aria-label="Minutes"
                role="slider"
                ref={el => this.timeMinuteRef = el}
                tabindex="0"
              >
                { minutes.map(minute => {
                  return (
                    <div
                      class="time-item"
                      data-value={minute}
                    >{addPadding(minute)}</div>
                  )
                })}
              </div>
            </div>
          </div>
          { !use24Hour && <div class="time-ampm">
            <ion-segment
              value={this.workingParts.ampm}
              onIonChange={(ev: CustomEvent) => {

                /**
                 * Since datetime uses 24-hour time internally
                 * we need to update the working hour here as well
                 * if the user is using a 12-hour time format.
                 */
                const { value } = ev.detail;
                const hour = calculateHourFromAMPM(this.workingParts, value);

                this.workingParts = {
                  ...this.workingParts,
                  ampm: value,
                  hour
                }
              }}
            >
              <ion-segment-button value="am">AM</ion-segment-button>
              <ion-segment-button value="pm">PM</ion-segment-button>
            </ion-segment>
          </div> }
        </div>
      </div>
    )
  }

  private renderCalendarViewHeader(mode: Mode) {
    const hasSlottedTitle = this.el.querySelector('[slot="title"]') !== null;
    if (!shouldRenderViewHeader(mode, this.presentationType, hasSlottedTitle)) { return; }

    /**
     * On iOS there is no default title
     * shown. User can slot in a custom title.
     */
    const defaultTitle = mode === 'md' ? 'Select Date' : '';

    return (
      <div class="datetime-header">
        <div class="datetime-title">
          <slot name="title">{defaultTitle}</slot>
        </div>
        {mode === 'md' && <div class="datetime-selected-date">
          {getMonthAndDay(this.locale, this.activeParts)}
        </div>}
      </div>
    );
  }

  private renderCalendarView(mode: Mode) {
    return [
      this.renderCalendarViewHeader(mode),
      this.renderCalendar(mode),
      this.renderFooter(mode)
    ]
  }

  private renderTimeView(mode: Mode) {
    return [
      this.renderCalendarViewHeader(mode),
      this.renderTime(),
      this.renderFooter(mode)
    ]
  }

  private renderCalendarAndTimeViews(mode: Mode) {
    return [
      this.renderCalendarViewHeader(mode),
      this.renderCalendar(mode),
      this.renderTime(),
      this.renderFooter(mode)
    ]
  }

  private renderDatetime(mode: Mode) {
    const { view } = this;

    if (mode === 'ios') {
      return this.renderCalendarAndTimeViews(mode);
    } else {
      return view === DatetimeView.Calendar ? this.renderCalendarView(mode) : this.renderTimeView(mode);
    }
  }

  render() {
    const { name, value, disabled, el, color, isPresented, readonly } = this;
    const mode = getIonMode(this);

    renderHiddenInput(true, el, name, value, disabled);

    return (
      <Host
        aria-disabled={disabled ? 'true' : null}
        class={{
          ...createColorClasses(color, {
            [mode]: true,
            ['datetime-presented']: isPresented,
            ['datetime-readonly']: readonly,
            ['datetime-disabled']: disabled
          })
        }}
      >
        {this.renderDatetime(mode)}
      </Host>
    );
  }
}

let datetimeIds = 0;

const enum DatetimeView {
  Calendar = 'calendar',
  Time = 'time'
}

const enum DatetimePresentationType {
  Modal = 'modal',
  Popover = 'popover',
  Inline = 'inline'
}
