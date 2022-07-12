import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, State, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import type { Color, DatetimePresentation } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-datetime-button',
  styleUrl: 'datetime-button.scss',
  shadow: true,
})
export class DatetimeButton implements ComponentInterface {
  // STUBs
  @State() datetimePresentation?: DatetimePresentation = 'date-time';
  @State() dateText?: string = 'May 1, 2022';
  @State() timeText?: string = '12:30 PM';

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

  render() {
    const { color, dateText, timeText, datetimePresentation } = this;

    const showDateTarget =
      !datetimePresentation ||
      ['date-time', 'time-date', 'date', 'month', 'year', 'month-year'].includes(datetimePresentation);
    const showTimeTarget = !datetimePresentation || ['date-time', 'time-date', 'time'].includes(datetimePresentation);
    const mode = getIonMode(this);

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
        })}
      >
        {showDateTarget && (
          <div class="date-target-container">
            <slot name="date-target">
              {/*
                The button is added inside of the <slot> so that
                devs do not create nested interactives if they
                decide to add in a custom ion-button.
              */}
              <button id="date-button">{dateText}</button>
            </slot>
          </div>
        )}

        {showTimeTarget && (
          <div class="time-target-container">
            <slot name="time-target">
              <button id="time-button">{timeText}</button>
            </slot>
          </div>
        )}
      </Host>
    );
  }
}
