# ion-toolbar

A Toolbar is a generic bar that is positioned above or below content.
When toolbars are placed within an `<ion-header>` or `<ion-footer>`,
the toolbars stay fixed in their respective location. When placed within
`<ion-content>`, toolbars will scroll with the content.


### Buttons in a Toolbar

Buttons placed in a toolbar should be placed inside of the `<ion-buttons>`
element. An exception to this is a [menuToggle](../../menu/MenuToggle) button.
It should not be placed inside of the `<ion-buttons>` element. Both the
`<ion-buttons>` element and the `menuToggle` can be positioned inside of the
toolbar using different properties. The below chart has a description of each
property.

| Property    | Description                                                                                                           |
|-------------|-----------------------------------------------------------------------------------------------------------------------|
| `start`     | Positions element to the left of the content in `ios` mode, and directly to the right in `md` mode.                   |
| `end`       | Positions element to the right of the content in `ios` mode, and to the far right in `md` mode.                       |
| `left`      | Positions element to the left of all other elements.                                                                  |
| `right`     | Positions element to the right of all other elements.                                                                 |


### Header / Footer Box Shadow and Border
In `md` mode, the `<ion-header>` will receive a box-shadow on the bottom, and the
`<ion-footer>` will receive a box-shadow on the top.  In `ios` mode, the `<ion-header>`
will receive a border on the bottom, and the `<ion-footer>` will receive a border on the
top. Both the `md` box-shadow and the `ios` border can be removed by adding the `no-border`
attribute to the element.

```html
<ion-header no-border>
  <ion-toolbar>
    <ion-title>Header</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  ...
</ion-content>

<ion-footer no-border>
  <ion-toolbar>
    <ion-title>Footer</ion-title>
  </ion-toolbar>
</ion-footer>
```

```html

<ion-header no-border>

  <ion-toolbar>
    <ion-title>My Toolbar Title</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-title>I'm a subheader</ion-title>
  </ion-toolbar>

<ion-header>


<ion-content>

  <ion-toolbar>
    <ion-title>Scrolls with the content</ion-title>
  </ion-toolbar>

</ion-content>


<ion-footer no-border>

  <ion-toolbar>
    <ion-title>I'm a footer</ion-title>
  </ion-toolbar>

</ion-footer>
 ```


<!-- Auto Generated Below -->


## Properties

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### translucent

boolean

If true, adds transparency to the header.
Note: In order to scroll content behind the header, the `fullscreen`
attribute needs to be set on the content.
Only affects `ios` mode. Defaults to `false`.


## Attributes

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### translucent

boolean

If true, adds transparency to the header.
Note: In order to scroll content behind the header, the `fullscreen`
attribute needs to be set on the content.
Only affects `ios` mode. Defaults to `false`.



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
