import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, State, h } from '@stencil/core';
import { componentOnReady, addEventListener, raf } from '@utils/helpers';
import { printIonError } from '@utils/logging';
import { createColorClasses } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color, DatetimePresentation } from '../../interface';
import { getToday } from '../datetime/utils/data';
import { getFormattedTime, getMonthAndYear, getMonthDayAndYear, getLocalizedDateTime } from '../datetime/utils/format';
import { is24Hour } from '../datetime/utils/helpers';
import { parseDate } from '../datetime/utils/parse';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-datetime-button',
  styleUrls: {
    ios: 'datetime-button.ios.scss',
    md: 'datetime-button.md.scss',
  },
  shadow: true,
})
export class DatetimeButton implements ComponentInterface {
  private datetimeEl: HTMLIonDatetimeElement | null = null;
  private overlayEl: HTMLElement | null = null;

  @State() datetimePresentation?: DatetimePresentation;
  @State() dateText?: string;
  @State() timeText?: string;
  @State() selectedButton?: 'date' | 'time';
  @State() datetimeActive = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color = 'primary';

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The ID of the `ion-datetime` instance
   * associated with the datetime button.
   */
  @Prop() datetime?: string;

  async componentWillLoad() {
    const { datetime } = this;
    if (!datetime) {
      printIonError(
        'An ID associated with an ion-datetime instance is required for ion-datetime-button to function properly.'
      );
      return;
    }

    const datetimeEl = (this.datetimeEl = document.getElementById(datetime) as HTMLIonDatetimeElement | null);
    if (!datetimeEl) {
      printIonError(`No ion-datetime instance found for ID '${datetime}'.`);
      return;
    }

    /**
     * Since the datetime can be used in any context (overlays, accordion, etc)
     * we track when it is visible to determine when it is active.
     * This informs which button is highlighted as well as the
     * aria-expanded state.
     */
    const io = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const ev = entries[0];
        this.datetimeActive = ev.isIntersecting;
      },
      {
        threshold: 0.01,
      }
    );

    io.observe(datetimeEl);

    /**
     * Get a reference to any modal/popover
     * the datetime is being used in so we can
     * correctly size it when it is presented.
     */
    this.overlayEl = datetimeEl.closest('ion-modal, ion-popover');

    componentOnReady(datetimeEl, () => {
      datetimeEl.size = 'cover';
      const datetimePresentation = (this.datetimePresentation = datetimeEl.presentation || 'date-time');

      this.setDateTimeText();
      addEventListener(datetimeEl, 'ionChange', this.setDateTimeText);

      /**
       * Configure the initial selected button
       * in the event that the datetime is displayed
       * without clicking one of the datetime buttons.
       */
      switch (datetimePresentation) {
        case 'date-time':
        case 'date':
        case 'month-year':
        case 'month':
        case 'year':
          this.selectedButton = 'date';
          break;
        case 'time-date':
        case 'time':
          this.selectedButton = 'time';
          break;
        default:
          break;
      }
    });
  }

  /**
   * Check the value property on the linked
   * ion-datetime and then format it according
   * to the locale specified on ion-datetime.
   */
  private setDateTimeText = () => {
    const { datetimeEl, datetimePresentation } = this;

    if (!datetimeEl) {
      return;
    }

    const { value, locale, hourCycle } = datetimeEl;

    /**
     * Both ion-datetime and ion-datetime-button default
     * to today's date and time if no value is set.
     */
    const parsedDatetime = parseDate(value || getToday());
    const use24Hour = is24Hour(locale, hourCycle);

    switch (datetimePresentation) {
      case 'date-time':
      case 'time-date':
        this.dateText = getMonthDayAndYear(locale, parsedDatetime);
        this.timeText = getFormattedTime(parsedDatetime, use24Hour);
        break;
      case 'date':
        this.dateText = getMonthDayAndYear(locale, parsedDatetime);
        break;
      case 'time':
        this.timeText = getFormattedTime(parsedDatetime, use24Hour);
        break;
      case 'month-year':
        this.dateText = getMonthAndYear(locale, parsedDatetime);
        break;
      case 'month':
        this.dateText = getLocalizedDateTime(locale, parsedDatetime, { month: 'long' });
        break;
      case 'year':
        this.dateText = getLocalizedDateTime(locale, parsedDatetime, { year: 'numeric' });
        break;
      default:
        break;
    }
  };

  private handleDateClick = () => {
    const { datetimeEl, datetimePresentation } = this;

    if (!datetimeEl) {
      return;
    }

    /**
     * When clicking the date button,
     * we need to make sure that only a date
     * picker is displayed. For presentation styles
     * that display content other than a date picker,
     * we need to update the presentation style.
     */
    switch (datetimePresentation) {
      case 'date-time':
      case 'time-date':
        datetimeEl.presentation = 'date';
        break;
      default:
        break;
    }

    /**
     * Track which button was clicked
     * so that it can have the correct
     * activated styles applied when
     * the modal/popover containing
     * the datetime is opened.
     */
    this.selectedButton = 'date';

    this.setOverlaySize();
  };

  private handleTimeClick = () => {
    const { datetimeEl, datetimePresentation } = this;

    if (!datetimeEl) {
      return;
    }

    /**
     * When clicking the time button,
     * we need to make sure that only a time
     * picker is displayed. For presentation styles
     * that display content other than a time picker,
     * we need to update the presentation style.
     */
    switch (datetimePresentation) {
      case 'date-time':
      case 'time-date':
        datetimeEl.presentation = 'time';
        break;
      default:
        break;
    }

    /**
     * Track which button was clicked
     * so that it can have the correct
     * activated styles applied when
     * the modal/popover containing
     * the datetime is opened.
     */
    this.selectedButton = 'time';

    this.setOverlaySize();
  };

  /**
   * If the datetime is presented in an
   * overlay, the datetime and overlay
   * should be appropriately size.
   * These classes provide default sizing values
   * that developers can customize.
   */
  private setOverlaySize = () => {
    const { overlayEl, datetimeEl } = this;

    if (!overlayEl || !datetimeEl) {
      return;
    }

    const { presentation } = datetimeEl;

    /**
     * All datetime overlays should have
     * a consistent width and border radius.
     * This is controlled by the ion-datetime-button-overlay
     * class which developers can customize globally.
     */
    overlayEl.classList.add('ion-datetime-button-overlay');

    /**
     * Wheel picker styles in datetime always
     * have a fixed height of 200px. This is
     * because the buttons/headers are not shown
     * with the wheel picker by design.
     */
    const hasWheelPicker = ['month', 'year', 'month-year', 'time'].includes(presentation);
    const needsWiderWheel = presentation === 'month-year';

    if (hasWheelPicker) {
      overlayEl.style.setProperty('--height', `200px`);

      /**
       * The default sizing for month-year
       * is too small, so we it to 300px so
       * the text is not cut off.
       */
      if (needsWiderWheel) {
        overlayEl.style.setProperty('--width', '300px');
      }

      /**
       * If we are not using the
       * wheel picker then we need to automatically
       * determine the height of the datetime by
       * looking at scrollHeight. We look at scrollHeight
       * as it will give us the height of the datetime
       * even if it overflows outside of the overlay initially.
       *
       * We also wait a frame to allow the browser to
       * unhide the overlay and calculate the size
       * of the datetime.
       *
       * Doing this means developers can control the size
       * of the overlay by setting the height of
       * the datetime directly.
       */
    } else {
      overlayEl.style.setProperty('--width', '300px');

      raf(() => {
        overlayEl.style.setProperty('--height', `${datetimeEl.scrollHeight}px`);
      });
    }
  };

  render() {
    const { color, dateText, timeText, datetimePresentation, selectedButton, datetimeActive } = this;
    const showDateTarget =
      !datetimePresentation ||
      ['date-time', 'time-date', 'date', 'month', 'year', 'month-year'].includes(datetimePresentation);
    const showTimeTarget = !datetimePresentation || ['date-time', 'time-date', 'time'].includes(datetimePresentation);
    const mode = getIonMode(this);

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
          [`${selectedButton}-active`]: datetimeActive,
        })}
      >
        {showDateTarget && (
          <div class="date-target-container" onClick={() => this.handleDateClick()}>
            <slot name="date-target">
              {/*
                The button is added inside of the <slot> so that
                devs do not create nested interactives if they
                decide to add in a custom ion-button.
              */}
              <button id="date-button" aria-expanded={datetimeActive ? 'true' : 'false'}>
                {dateText}
              </button>
            </slot>
          </div>
        )}

        {showTimeTarget && (
          <div class="time-target-container" onClick={() => this.handleTimeClick()}>
            <slot name="time-target">
              <button id="time-button" aria-expanded={datetimeActive ? 'true' : 'false'}>
                {timeText}
              </button>
            </slot>
          </div>
        )}
      </Host>
    );
  }
}
