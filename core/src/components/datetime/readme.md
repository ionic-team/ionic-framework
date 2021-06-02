# ion-datetime



<!-- Auto Generated Below -->


## Usage

### Angular / javascript / react / stencil / vue





## Properties

| Property             | Attribute              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Type                                             | Default        |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------- |
| `cancelText`         | `cancel-text`          | The text to display on the picker's cancel button.                                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`                                         | `'Cancel'`     |
| `color`              | `color`                | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics).                                                                                                                                                                                                                            | `string \| undefined`                            | `'primary'`    |
| `dayValues`          | `day-values`           | Values used to create the list of selectable days. By default every day is shown for the given month. However, to control exactly which days of the month to display, the `dayValues` input can take a number, an array of numbers, or a string of comma separated numbers. Note that even if the array days have an invalid number for the selected month, like `31` in February, it will correctly not show days which are not valid for the selected month.                                    | `number \| number[] \| string \| undefined`      | `undefined`    |
| `disabled`           | `disabled`             | If `true`, the user cannot interact with the datetime.                                                                                                                                                                                                                                                                                                                                                                                                                                            | `boolean`                                        | `false`        |
| `doneText`           | `done-text`            | The text to display on the picker's "Done" button.                                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`                                         | `'Done'`       |
| `hourValues`         | `hour-values`          | Values used to create the list of selectable hours. By default the hour values range from `0` to `23` for 24-hour, or `1` to `12` for 12-hour. However, to control exactly which hours to display, the `hourValues` input can take a number, an array of numbers, or a string of comma separated numbers.                                                                                                                                                                                         | `number \| number[] \| string \| undefined`      | `undefined`    |
| `locale`             | `locale`               | The locale to use for `ion-datetime`. This impacts month and day name formatting. The `'default'` value refers to the default locale set by your device.                                                                                                                                                                                                                                                                                                                                          | `string`                                         | `'default'`    |
| `max`                | `max`                  | The maximum datetime allowed. Value must be a date string following the [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime), `1996-12-19`. The format does not have to be specific to an exact datetime. For example, the maximum could just be the year, such as `1994`. Defaults to the end of this year.                                                                                                                                                                  | `string \| undefined`                            | `undefined`    |
| `min`                | `min`                  | The minimum datetime allowed. Value must be a date string following the [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime), such as `1996-12-19`. The format does not have to be specific to an exact datetime. For example, the minimum could just be the year, such as `1994`. Defaults to the beginning of the year, 100 years ago from today.                                                                                                                           | `string \| undefined`                            | `undefined`    |
| `minuteValues`       | `minute-values`        | Values used to create the list of selectable minutes. By default the minutes range from `0` to `59`. However, to control exactly which minutes to display, the `minuteValues` input can take a number, an array of numbers, or a string of comma separated numbers. For example, if the minute selections should only be every 15 minutes, then this input value would be `minuteValues="0,15,30,45"`.                                                                                            | `number \| number[] \| string \| undefined`      | `undefined`    |
| `mode`               | `mode`                 | The mode determines which platform styles to use.                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `"ios" \| "md"`                                  | `undefined`    |
| `monthValues`        | `month-values`         | Values used to create the list of selectable months. By default the month values range from `1` to `12`. However, to control exactly which months to display, the `monthValues` input can take a number, an array of numbers, or a string of comma separated numbers. For example, if only summer months should be shown, then this input value would be `monthValues="6,7,8"`. Note that month numbers do *not* have a zero-based index, meaning January's value is `1`, and December's is `12`. | `number \| number[] \| string \| undefined`      | `undefined`    |
| `name`               | `name`                 | The name of the control, which is submitted with the form data.                                                                                                                                                                                                                                                                                                                                                                                                                                   | `string`                                         | `this.inputId` |
| `presentation`       | `presentation`         | Which values you want to select. `'date'` will show a calendar picker to select the month, day, and year. `'time'` will show a time picker to select the hour, minute, and (optionally) AM/PM. `'date-time'` will show the date picker first and time picker second. `'time-date'` will show the time picker first and date picker second.                                                                                                                                                        | `"date" \| "date-time" \| "time" \| "time-date"` | `'date-time'`  |
| `readonly`           | `readonly`             | If `true`, the datetime appears normal but is not interactive.                                                                                                                                                                                                                                                                                                                                                                                                                                    | `boolean`                                        | `false`        |
| `showDefaultButtons` | `show-default-buttons` | If `true`, the default "Cancel" and "OK" buttons will be rendered at the bottom of the `ion-datetime` component. Developers can also use the `button` slot if they want to customize these buttons. If custom buttons are set in the `button` slot then the default buttons will not be rendered.                                                                                                                                                                                                 | `boolean`                                        | `false`        |
| `showDefaultTitle`   | `show-default-title`   | If `true`, a header will be shown above the calendar picker. On `ios` mode this will include the slotted title, and on `md` mode this will include the slotted title and the selected date.                                                                                                                                                                                                                                                                                                       | `boolean`                                        | `false`        |
| `value`              | `value`                | The value of the datetime as a valid ISO 8601 datetime string.                                                                                                                                                                                                                                                                                                                                                                                                                                    | `null \| string \| undefined`                    | `undefined`    |
| `yearValues`         | `year-values`          | Values used to create the list of selectable years. By default the year values range between the `min` and `max` datetime inputs. However, to control exactly which years to display, the `yearValues` input can take a number, an array of numbers, or string of comma separated numbers. For example, to show upcoming and recent leap years, then this input's value would be `yearValues="2024,2020,2016,2012,2008"`.                                                                         | `number \| number[] \| string \| undefined`      | `undefined`    |


## Events

| Event       | Description                                         | Type                                     |
| ----------- | --------------------------------------------------- | ---------------------------------------- |
| `ionBlur`   | Emitted when the datetime loses focus.              | `CustomEvent<void>`                      |
| `ionCancel` | Emitted when the datetime selection was cancelled.  | `CustomEvent<void>`                      |
| `ionChange` | Emitted when the value (selected date) has changed. | `CustomEvent<DatetimeChangeEventDetail>` |
| `ionFocus`  | Emitted when the datetime has focus.                | `CustomEvent<void>`                      |


## Methods

### `cancel(closeOverlay?: boolean) => Promise<void>`

Emits the ionCancel event and
optionally closes the popover
or modal that the datetime was
presented in.

#### Returns

Type: `Promise<void>`



### `confirm(closeOverlay?: boolean) => Promise<void>`

Confirms the selected datetime value, updates the
`value` property, and optionally closes the popover
or modal that the datetime was presented in.

#### Returns

Type: `Promise<void>`



### `reset(value?: string | undefined) => Promise<void>`

Resets the internal state of the datetime
but does not update the value.

#### Returns

Type: `Promise<void>`




## Slots

| Slot        | Description                  |
| ----------- | ---------------------------- |
| `"buttons"` | The buttons in the datetime. |
| `"title"`   | The title of the datetime.   |


## CSS Custom Properties

| Name                     | Description                                                                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--background`           | The primary background of the datetime component.                                                                                                                       |
| `--background-active`    | The background of the active interactive components. This is the selected date in the date picker. In the time picker this is the active input and active AM/PM button. |
| `--background-secondary` | The secondary background of the datetime component. This is the background of the header in the date picker and the dial and inputs in the time picker.                 |
| `--color`                | The primary body text color.                                                                                                                                            |
| `--color-active`         | The text color of any active text. Applies to the "today" date in the calendar picker. In the time picker this applies to the active input and active AM/PM buttons.    |
| `--color-secondary`      | The color for the days of the week, next and previous buttons, and the AM/PM buttons.                                                                                   |
| `--dial-background`      | The background of the dial and arm in the time picker.                                                                                                                  |
| `--dial-color`           | The color of the text that is selected by the dial in the time picker.                                                                                                  |
| `--padding-bottom`       | Bottom padding of the datetime                                                                                                                                          |
| `--padding-end`          | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the datetime                                                             |
| `--padding-start`        | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the datetime                                                             |
| `--padding-top`          | Top padding of the datetime                                                                                                                                             |
| `--placeholder-color`    | Color of the datetime placeholder                                                                                                                                       |
| `--title-color`          | The text color of the title.                                                                                                                                            |


## Dependencies

### Depends on

- [ion-buttons](../buttons)
- [ion-button](../button)
- [ion-item](../item)
- [ion-label](../label)
- ion-icon
- [ion-segment](../segment)
- [ion-segment-button](../segment-button)

### Graph
```mermaid
graph TD;
  ion-datetime --> ion-buttons
  ion-datetime --> ion-button
  ion-datetime --> ion-item
  ion-datetime --> ion-label
  ion-datetime --> ion-icon
  ion-datetime --> ion-segment
  ion-datetime --> ion-segment-button
  ion-button --> ion-ripple-effect
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-segment-button --> ion-ripple-effect
  style ion-datetime fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
