# ion-datetime-button

Datetime Button is component that is used with [Datetime](./datetime). It renders buttons with the localized selected date and time. Clicking the date button will cause the paired datetime to render a date selection interface. Clicking the time button will cause the paired datetime to render a time selection. When paired with [Popover](./popover) it can be used to easily show a datetime in an overlay.

## Accessibility

### Keyboard Navigation

`ion-datetime-button` has keyboard support for navigating between the focusable buttons inside of the component. The following table details what each key does:

| Key                | Function                                                     |
| ------------------ | ------------------------------------------------------------ |
| `Tab`              | Moves focus to the next focusable button.                    |
| `Shift` + `Tab`    | Moves focus to the previous focusable button.                |
| `Space` or `Enter` | Clicks the focusable button.                                 |

### ARIA

Each button rendered inside of `ion-datetime-button` has `aria-expanded` set. This is used to indicate to assistive technologies that interacting with the button can be used to expand or collapse the datetime.

Note that if developers use their own buttons in the `date-button` or `time-button` slots, they will need to handle the `aria-expanded` logic themselves.