# ion-toolbar

Toolbars are positioned above or below content. When a toolbar is placed in an `<ion-header>` it will appear fixed at the top of the content, and when it is in an `<ion-footer>` it will appear fixed at the bottom. Fullscreen content will scroll behind a toolbar in a header or footer. When placed within an `<ion-content>`, toolbars will scroll with the content.


### Buttons

Buttons placed in a toolbar should be placed inside of the `<ion-buttons>` element. The `<ion-buttons>` element can be positioned inside of the toolbar using a named slot. The below chart has a description of each slot.

| Slot         | Description                                                                                              |
|--------------|----------------------------------------------------------------------------------------------------------|
| `secondary`  | Positions element to the `left` of the content in `ios` mode, and directly to the `right` in `md` mode.  |
| `primary`    | Positions element to the `right` of the content in `ios` mode, and to the far `right` in `md` mode.      |
| `start`      | Positions to the `left` of the content in LTR, and to the `right` in RTL.                                |
| `end`        | Positions to the `right` of the content in LTR, and to the `left` in RTL.                                |


### Borders

In `md` mode, the `<ion-header>` will receive a box-shadow on the bottom, and the `<ion-footer>` will receive a box-shadow on the top.  In `ios` mode, the `<ion-header>` will receive a border on the bottom, and the `<ion-footer>` will receive a border on the top. Both the `md` box-shadow and the `ios` border can be removed by adding the `no-border` attribute to the element.



<!-- Auto Generated Below -->


## Properties

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### translucent

boolean

If true, the toolbar will be translucent.
Note: In order to scroll content behind the toolbar, the `fullscreen`
attribute needs to be set on the content.
Defaults to `false`.


## Attributes

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### translucent

boolean

If true, the toolbar will be translucent.
Note: In order to scroll content behind the toolbar, the `fullscreen`
attribute needs to be set on the content.
Defaults to `false`.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
