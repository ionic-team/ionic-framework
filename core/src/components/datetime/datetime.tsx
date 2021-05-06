import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, DatetimeChangeEventDetail, DatetimeOptions, Mode, StyleEventDetail } from '../../interface';
import { renderHiddenInput } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part text - The value of the datetime.
 * @part placeholder - The placeholder of the datetime.
 *
 * @slot title - The title of the datetime. Only visible
 * when presentationStyle="overlay".
 * @slot buttons - The buttons in the datetime. Only
 * visible when presentationStyle="overlay".
 * @slot cover - The trigger element that opens a datetime.
 * Only visible when presentationStyle="overlay".
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

  private inputId = `ion-dt-${datetimeIds++}`;

  @Element() el!: HTMLIonDatetimeElement;

  @State() isPresented = false;

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

  /**
   * The maximum datetime allowed. Value must be a date string
   * following the
   * [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime),
   * `1996-12-19`. The format does not have to be specific to an exact
   * datetime. For example, the maximum could just be the year, such as `1994`.
   * Defaults to the end of this year.
   */
  @Prop({ mutable: true }) max?: string;

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
   * Full names for each month name. This can be used to provide
   * locale month names. Defaults to English.
   */
  @Prop() monthNames?: string[] | string;

  /**
   * Short abbreviated names for each month name. This can be used to provide
   * locale month names. Defaults to English.
   */
  @Prop() monthShortNames?: string[] | string;

  /**
   * Full day of the week names. This can be used to provide
   * locale names for each day in the week. Defaults to English.
   */
  @Prop() dayNames?: string[] | string;

  /**
   * Short abbreviated day of the week names. This can be used to provide
   * locale names for each day in the week. Defaults to English.
   * Defaults to: `['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']`
   */
  @Prop() dayShortNames?: string[] | string;

  /**
   * The text to display when there's no date selected yet.
   * Using lowercase to match the input attribute
   */
  @Prop() placeholder?: string | null;

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
   * How the datetime component should be presented.
   * `'inline'` will be display it directly in your template.
   * `'overlay'` will display the calendar style in a modal on
   * mobile and in a popover on desktop. The wheel style will
   * be displayed inside of a picker.
   */
  @Prop() presentationStyle: 'overlay' | 'inline' = 'inline';

  /**
   * Any additional options that the modal, popover, or
   * picker interfaces can accept.
   * See the [Modal API docs](../modal) for the modal options.
   * See the [Popover API docs](../popover) for the popover options.
   * See the [Picker API docs](../picker) for the picker options.
   */
  @Prop() overlayOptions?: DatetimeOptions;

  /**
   * If `true`, users can select a range of dates.
   */
  @Prop() range = false;

  /**
   * Defines the maximum number of individual dates a user can
   * select. Must be a positive integer greater than `0`.
   * Does not apply when `range="true"`.
   */
  @Prop() maxSelectableDates = 1;

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

  componentWillLoad() {
    this.emitStyle();
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'datetime': true,
      'has-placeholder': this.placeholder != null,
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

  private renderButtons() {
    return (
      <slot name="buttons">
        <ion-buttons>
          <ion-button color={this.color} onClick={() => this.dismiss()}>Cancel</ion-button>
          <ion-button color={this.color} onClick={() => this.dismiss()}>Ok</ion-button>
        </ion-buttons>
      </slot>
    );
  }

  private renderTitle(mode: Mode) {
    /**
     * On iOS there is no default title
     * shown. User can slot in a custom title.
     */
    const defaultTitle = mode === 'md' ? 'Select Date' : '';

    return (
      <slot name="title">
        {mode !== 'ios' && defaultTitle}
      </slot>
    );
  }

  private renderCover() {
    return (
      <div onClick={() => this.open()}>
        <slot name="cover">
          <ion-button class="default">Datetime Default Cover</ion-button>
        </slot>
      </div>
    )
  }

  private renderInline() {
    return [
      'inline datetime'
    ]
  }

  private renderOverlay(mode: Mode) {
    return [
      this.renderCover(),
      this.renderOverlayComponent(mode)
    ]
  }

  private renderOverlayComponent(mode: Mode) {
    if (!this.isPresented) { return; }

    return [
      this.renderTitle(mode),
      this.renderButtons()
    ]
  }

  render() {
    const { name, value, disabled, el, color, presentationStyle } = this;
    const mode = getIonMode(this);

    renderHiddenInput(true, el, name, value, disabled);

    return (
      <Host
        class={{
          ...createColorClasses(color, {
            [mode]: true
          })
        }}
      >
        {presentationStyle === 'inline' ? this.renderInline() : this.renderOverlay(mode)}
      </Host>
    );
  }
}

let datetimeIds = 0;
