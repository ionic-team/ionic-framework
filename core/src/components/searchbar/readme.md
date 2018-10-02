# ion-searchbar

Searchbars represent a text field that can be used to search through a collection. They can be displayed inside of a toolbar or the main content.

A Searchbar should be used instead of an input to search lists. A clear button is displayed upon entering input in the searchbar's text field. Clicking on the clear button will erase the text field and the input will remain focused. A cancel button can be enabled which will clear the input and lose the focus upon click.



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description                                                                                                                                                                                                                                                            | Type      |
| ------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `animated`         | `animated`           | If true, enable searchbar animation. Default `false`.                                                                                                                                                                                                                  | `boolean` |
| `autocomplete`     | `autocomplete`       | Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.                                                                                                                                                                                       | `string`  |
| `autocorrect`      | `autocorrect`        | Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.                                                                                                                                                                                        | `string`  |
| `cancelButtonIcon` | `cancel-button-icon` | Set the cancel button icon. Only applies to `md` mode. Defaults to `"md-arrow-back"`.                                                                                                                                                                                  | `string`  |
| `cancelButtonText` | `cancel-button-text` | Set the the cancel button text. Only applies to `ios` mode. Default: `"Cancel"`.                                                                                                                                                                                       | `string`  |
| `clearIcon`        | `clear-icon`         | Set the clear icon. Defaults to `"close-circle"` for `ios` and `"close"` for `md`.                                                                                                                                                                                     | `string`  |
| `color`            | `color`              | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`   |
| `debounce`         | `debounce`           | Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `250`.                                                                                                                                                 | `number`  |
| `mode`             | `mode`               | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`    |
| `placeholder`      | `placeholder`        | Set the input's placeholder. Default `"Search"`.                                                                                                                                                                                                                       | `string`  |
| `searchIcon`       | `search-icon`        | The icon to use as the search icon. Defaults to `"search"`.                                                                                                                                                                                                            | `string`  |
| `showCancelButton` | `show-cancel-button` | If true, show the cancel button. Default `false`.                                                                                                                                                                                                                      | `boolean` |
| `spellcheck`       | `spellcheck`         | If true, enable spellcheck on the input. Default `false`.                                                                                                                                                                                                              | `boolean` |
| `type`             | `type`               | Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.                                                                                                                                    | `string`  |
| `value`            | `value`              | the value of the searchbar.                                                                                                                                                                                                                                            | `string`  |


## Events

| Event       | Description                                     |
| ----------- | ----------------------------------------------- |
| `ionBlur`   | Emitted when the input loses focus.             |
| `ionCancel` | Emitted when the cancel button is clicked.      |
| `ionChange` | Emitted when the value has changed.             |
| `ionClear`  | Emitted when the clear input button is clicked. |
| `ionFocus`  | Emitted when the input has focus.               |
| `ionInput`  | Emitted when a keyboard input ocurred.          |


## Methods

| Method     | Description |
| ---------- | ----------- |
| `setFocus` |             |


## CSS Custom Properties

| Name                        | Description                              |
| --------------------------- | ---------------------------------------- |
| `--background`              | Background of the searchbar              |
| `--cancel-button-color`     | Color of the searchbar cancel button     |
| `--clear-button-color`      | Color of the searchbar clear button      |
| `--color`                   | Color of the searchbar text              |
| `--icon-color`              | Color of the searchbar icon              |
| `--placeholder-color`       | Color of the searchbar placeholder       |
| `--placeholder-font-style`  | Font style of the searchbar placeholder  |
| `--placeholder-font-weight` | Font weight of the searchbar placeholder |
| `--placeholder-opacity`     | Opacity of the searchbar placeholder     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
