import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { addMonths, addYears, eachDayOfInterval, eachYearOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';

import { getIonMode } from '../../global/ionic-global';
import { createAnimation } from '../../utils/animation/animation';
import { Gesture, GestureDetail } from '../../utils/gesture';

import { DAY_SHORT_NAMES } from './calendar-util';

/**
 * @virtualProp {'ios' | 'md'} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-calendar',
  shadow: true,
  styleUrls: {
    ios: 'calendar.ios.scss',
    md: 'calendar.md.scss'
  }
})
export class Calendar implements ComponentInterface {
  private monthsWrapper!: HTMLElement;
  private today: Date = new Date();
  private gesture?: Gesture;
  private dragging = false;

  @Element() el!: HTMLElement;

  @State() calendarYears: number[] = [];
  @State() showYears = false;
  @State() viewDate!: Date;

  /**
   * An array of javascript dates that are available for selection.
   * e.g. [new Date()] this would only allow today to be selected.
   * for large dater date sets, consider using disabledBeforeDate and disabledAfterDate
   */
  @Prop() availableDates?: Date[] = [];

  /**
   * Disables any date before the date entered
   * e.g. passing new Date() would mean users could not select anything after today
   */
  @Prop() disabledAfterDate?: Date;

  /**
   * Disables any date after the date entered
   * e.g. passing new Date() would mean users could not select anything before today
   */
  @Prop() disabledBeforeDate?: Date;

  /**
   * Dates that users will not be able to select
   * e.g. [new Date()] would mean users could not select today
   */
  @Prop() disabledDates?: Date[];

  /**
   * Weekdays that users will not be able to select (optional)
   * e.g. [0,6] would mean users could not select Sunday or Saturday
   */
  @Prop() disabledDays?: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];

  /**
   * An array of javascript dates that are shown as selected on the page.
   * e.g. [new Date()]
   */
  @Prop() selectedDates: Date[] = [];

  /**
   * Year to display on the calendar, defaults to current year.
   */
  @Prop() year: number = this.today.getFullYear();

  /**
   * Month index to display on the calendar, defaults to current month.
   * e.g. January is 0, February is 1
   */
  @Prop() month: number = this.today.getMonth();

  /**
   * If `true`, the user cannot interact with the calendar.
   */
  @Prop() disabled = false;
  @Watch('disabled')
  disabledChanged() {
    if (this.gesture) {
      this.gesture.enable(!this.disabled && !this.showYears);
    }
  }

  /**
   * Emitted when a date is tapped/clicked on. Value is emitted as an ISO String date
   */
  @Event() ionSelectDate!: EventEmitter<{ value: string }>;

  componentWillLoad() {
    this.viewDate = new Date(this.year, this.month, new Date().getDate());
  }

  async componentDidLoad() {
    this.monthsWrapper = this.el.shadowRoot?.querySelector(
      '.months-wrapper'
    ) as HTMLElement;
    this.gesture = (await import('../../utils/gesture')).createGesture({
      el: this.monthsWrapper,
      gestureName: 'calendar-swipe',
      gesturePriority: 100,
      threshold: 5,
      canStart: () => !this.showYears,
      onStart: () => this.onStart(),
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev),
    });
    this.disabledChanged();
  }

  getMonthTitle(month: -1 | 0 | 1) {
    const date = addMonths(this.viewDate, month);
    return format(date, 'MMMM yyyy');
  }

  getViewDays(month: -1 | 0 | 1) {
    const date = addMonths(this.viewDate, month);
    return this.getCalendarDaysFromDate(date);
  }

  getCalendarDaysFromDate(date: Date) {
    const monthStart = startOfMonth(date);
    const start = startOfWeek(monthStart);
    const monthEnd = endOfMonth(date);
    const end = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start, end });
    return days;
  }

  getCalendarYearsFromDate(date: Date) {
    const start = addYears(date, -14);
    const end = addYears(date, 13);
    const years = eachYearOfInterval({ start, end });
    // this.calendarChange.emit({ start, end });
    // 28 years in the view will show 4 columns 7 rows
    // current year in the middle (ish)
    return years.map(year => year.getFullYear());
  }

  selectYear(year: number) {
    const newDate = this.viewDate.setFullYear(year);
    this.viewDate = new Date(newDate);
    this.toggleYearView();
  }

  animateCalendar(direction: 'forward' | 'backward') {
    return new Promise(resolve => {
      const fromMonth = this.el.shadowRoot?.querySelector(
        '.current-month .month-days'
      ) as HTMLElement;
      const fromMonthTitle = this.el.shadowRoot?.querySelector(
        '.current-month .calendar-title-wrapper'
      ) as HTMLElement;
      const toMonth = this.el.shadowRoot?.querySelector(
        `${
          direction === 'forward' ? '.next-month' : '.previous-month'
        } .month-days`
      ) as HTMLElement;
      const toMonthTitle = this.el.shadowRoot?.querySelector(
        `${
          direction === 'forward' ? '.next-month' : '.previous-month'
        } .calendar-title-wrapper`
      ) as HTMLElement;
      const duration = 300;
      const fromMonthAnimation = createAnimation();
      fromMonthAnimation
        .addElement([fromMonth, fromMonthTitle])
        .fromTo(
          'transform',
          'translateX(0%)',
          direction === 'forward' ? 'translateX(-3%)' : 'translateX(3%)'
        )
        .fromTo('opacity', '1', '0')
        .duration(duration)
        .play();
      const toMonthAnimation = createAnimation();
      toMonthAnimation
        .addElement([toMonth, toMonthTitle])
        .duration(duration)
        .fromTo(
          'transform',
          direction === 'forward' ? 'translateX(-97%)' : 'translateX(97%)',
          direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)'
        )
        .fromTo('opacity', '0', '1')
        .delay(duration)
        .onFinish(() => {
          toMonthAnimation.destroy();
          fromMonthAnimation.destroy();
          resolve();
        })
        .play();
    });
  }

  async nextMonth(animate: boolean) {
    if (animate) {
      await this.animateCalendar('forward');
    }
    this.viewDate = addMonths(this.viewDate, 1);
  }

  async previousMonth(animate: boolean) {
    if (animate) {
      await this.animateCalendar('backward');
    }
    this.viewDate = addMonths(this.viewDate, -1);
  }

  nextYear() {
    const currentMax = this.calendarYears[this.calendarYears.length - 1];
    const newMin = currentMax + 1;
    const newMax = newMin + 27;
    const years = [];
    for (let i = newMin; i <= newMax; i++) {
      years.push(i);
    }
    this.calendarYears = years;
  }

  previousYear() {
    const currentMin = this.calendarYears[0];
    const newMin = currentMin - 28;
    const newMax = newMin + 27;
    const years = [];
    for (let i = newMin; i <= newMax; i++) {
      years.push(i);
    }
    this.calendarYears = years;
  }

  selectDate(date: Date) {
    this.ionSelectDate.emit({ value: date.toISOString() });
  }

  toggleYearView() {
    this.showYears = !this.showYears;
    const yearsWrapper = this.el.shadowRoot?.querySelector(
      '.current-month .years-wrapper'
    ) as HTMLElement;
    const monthWrapper = this.el.shadowRoot?.querySelector(
      '.current-month .month'
    ) as HTMLElement;
    const duration = 150;
    const yearsAnimation = createAnimation();
    yearsAnimation
      .addElement(yearsWrapper)
      .fromTo(
        'transform',
        this.showYears ? 'translateY(-5px)' : 'translateY(0)',
        this.showYears ? 'translateY(0)' : 'translateY(-5px)'
      )
      .fromTo(
        'opacity',
        this.showYears ? '0' : '1',
        this.showYears ? '1' : '0'
      )
      .duration(duration)
      .beforeStyles({ display: 'flex' })
      .afterStyles(
        this.showYears
          ? { display: 'flex', opacity: 1 }
          : { display: 'none', opacity: 0 }
      )
      .delay(this.showYears ? duration : 0)
      .play();
    const monthAnimation = createAnimation();
    monthAnimation
      .addElement(monthWrapper)
      .fromTo(
        'transform',
        this.showYears ? 'translateY(0px)' : 'translateY(5px)',
        this.showYears ? 'translateY(5px)' : 'translateY(0px)'
      )
      .fromTo(
        'opacity',
        this.showYears ? '1' : '0',
        this.showYears ? '0' : '1'
      )
      .delay(this.showYears ? 0 : duration)
      .duration(duration)
      .play();
    if (this.showYears) {
      this.calendarYears = this.getCalendarYearsFromDate(this.viewDate);
    }
    this.disabledChanged();
  }

  isToday(date: Date) {
    return (
      this.today.getDate() === date.getDate() &&
      this.today.getMonth() === date.getMonth() &&
      this.today.getFullYear() === date.getFullYear()
    );
  }

  isCurrentMonth(date: Date, month: -1 | 0 | 1) {
    const viewMonth = addMonths(this.viewDate, month).getMonth();
    return viewMonth === date.getMonth();
  }

  isDateSelected(date: Date) {
    if (this.selectedDates.length === 0) {
      return false;
    }
    return this.isDateInArray(date, this.selectedDates);
  }

  isDateInArray(date: Date, dateArray: Date[]) {
    return dateArray.some(d => (
      d &&
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    ));
  }

  isYearSelected(year: number) {
    return this.viewDate.getFullYear() === year;
  }

  isCurrentYear(year: number) {
    const thisYear = this.today.getFullYear();
    return thisYear === year;
  }

  onStart() {
    this.dragging = true;
    this.monthsWrapper.style.transition = 'none';
  }

  onMove(ev: GestureDetail) {
    this.monthsWrapper.style.transform = `translateX(${ev.deltaX}px)`;
  }

  onEnd(ev: GestureDetail) {
    this.dragging = false;
    this.monthsWrapper.style.transition = '0.3s ease-out';
    const threshold = 60;
    if (ev.deltaX > threshold) {
      this.monthsWrapper.style.transform = `translateX(100%)`;
      setTimeout(() => {
        this.previousMonth(false);
        this.monthsWrapper.style.transition = 'none';
        this.monthsWrapper.style.transform = `translateX(0%)`;
      }, 300);
    } else if (ev.deltaX < -threshold) {
      this.monthsWrapper.style.transform = `translateX(-100%)`;
      setTimeout(() => {
        this.nextMonth(false);
        this.monthsWrapper.style.transition = 'none';
        this.monthsWrapper.style.transform = `translateX(0%)`;
      }, 300);
    } else {
      this.monthsWrapper.style.transform = '';
    }
  }

  disablePrevious() {
    return false;
  }

  disableNext() {
    return false;
  }

  handleMouseUp = () => {
    if (this.dragging) {
      window.addEventListener('click', this.captureClick, true);
    }
  }

  captureClick = (e: MouseEvent) => {
    e.stopPropagation();
    // Stop the click from being propagated after dragging/mouseup.
    window.removeEventListener('click', this.captureClick, true);
  }

  isDateDisabled(date: Date) {
    if (this.disabled) {
      return true;
    }
    let disabled = false;
    if (this.availableDates && this.availableDates.length > 0) {
      disabled = !this.isDateInArray(date, this.availableDates);
    }
    if (!disabled && this.disabledDates && this.disabledDates.length > 0) {
      disabled = this.isDateInArray(date, this.disabledDates);
    }
    if (!disabled && this.disabledBeforeDate) {
      disabled = date < this.disabledBeforeDate;
    }
    if (!disabled && this.disabledAfterDate) {
      disabled = date > this.disabledAfterDate;
    }
    if (!disabled && this.disabledDays && this.disabledDays.length > 0) {
      const weekday = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      disabled = this.disabledDays.indexOf(weekday) !== -1;
    }
    return disabled;
  }

  getDayView(day: Date, month: -1 | 0 | 1) {
    const disabled = this.isDateDisabled(day);
    return (
      <div
        class={{
          'day-outer': true,
          'day-selected': this.isDateSelected(day),
          today: this.isToday(day),
          'not-current-month': !this.isCurrentMonth(day, month),
          'disabled': disabled
        }}
      >
        <div>
          <div onClick={() => disabled ? null : this.selectDate(day)} class="day-inner">
            {day.getDate()}
            <ion-ripple-effect />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        onMouseUp={this.handleMouseUp}
        class={{
          [mode]: true,
          // Used internally for styling
          [`calendar-${mode}`]: true
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div class="months-wrapper">
            {([-1, 0, 1] as (1 | 0 | -1)[]).map(month => (
              <div
                class={{
                  'month-wrapper': true,
                  'previous-month': month === -1,
                  'current-month': month === 0,
                  'next-month': month === 1
                }}
              >
                <div class="calendar-header">
                  <div class="calendar-title-wrapper">
                    <ion-button
                      class="month-title"
                      fill="clear"
                      onClick={() => this.toggleYearView()}
                    >
                      {this.getMonthTitle(month)}
                      <ion-icon
                        size="small"
                        name={this.showYears ? 'caret-up' : 'caret-down'}
                        slot="end"
                      />
                    </ion-button>
                  </div>
                  <div />
                  <ion-button
                    class="previous"
                    fill="clear"
                    shape="round"
                    disabled={this.disablePrevious()}
                    onClick={() => this.showYears ? this.previousYear() : this.previousMonth(true)}
                  >
                    <ion-icon
                      size="small"
                      color="medium"
                      name="chevron-back"
                      slot="icon-only"
                    />
                  </ion-button>
                  <ion-button
                    class="next"
                    fill="clear"
                    shape="round"
                    disabled={this.disableNext()}
                    onClick={() => this.showYears ? this.nextYear() : this.nextMonth(true)}
                  >
                    <ion-icon
                      size="small"
                      color="medium"
                      name="chevron-forward"
                      slot="icon-only"
                    />
                  </ion-button>
                </div>
                <div
                  class={{
                    'calendar-content': true,
                    'show-years': this.showYears
                  }}
                >
                  <div class="month">
                    <div class="week-days">
                      {DAY_SHORT_NAMES.map(weekday => (
                        <div>{weekday}</div>
                      ))}
                    </div>
                    <div class="month-days">
                      {this.getViewDays(month).map(day => this.getDayView(day, month))}
                    </div>
                  </div>
                  {month === 0 ? (
                    <div class="years-wrapper">
                      {this.calendarYears.map(year => (
                        <div
                          class={{
                            'year-outer': true,
                            'year-current': this.isCurrentYear(year),
                            'year-selected': this.isYearSelected(year)
                          }}
                        >
                          <div
                            onClick={() => this.selectYear(year)}
                            class="year-inner"
                          >
                            {year}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Host>
    );
  }
}
