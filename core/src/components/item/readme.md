# ion-item

Items are elements that can contain text, icons, avatars, images, inputs, and any other native or custom elements. Generally they are placed in a list with other items. Items can be swiped, deleted, reordered, edited, and more.


## Detail Arrows

By default, clickable items will display a right arrow icon on `ios` mode. To hide the right arrow icon on clickable elements, set the `detail` property to `false`. To show the right arrow icon on an item that doesn't display it naturally, add the `detail` attribute to the item.

<!--

TODO add this functionality back as a css variable

This feature is not enabled by default on clickable items for the `md` mode, but it can be enabled by setting the following CSS variable:

```css
--item-detail-push-show: true;
```

See the [theming documentation](/docs/theming/css-variables) for more information.

-->


## Item Placement

Item uses named [slots](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) in order to position content. This logic makes it possible to write a complex item with simple, understandable markup without having to worry about styling and positioning the elements.

The below chart details the item slots and where it will place the element inside of the item:

| Slot    | Description                                                                 |
|---------|-----------------------------------------------------------------------------|
| `start` | Placed to the left of all other content in LTR, and to the `right` in RTL.  |
| `end`   | Placed to the right of all other content in LTR, and to the `right` in RTL. |
| none    | Placed inside of the input wrapper.                                         |


### Text Alignment

Items left align text and add an ellipsis when the text is wider than the item. See the [Utility Attributes Documentation](/docs/layout/css-utilities) for attributes that can be added to `<ion-item>` to transform the text.


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                            | Type                              |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `button`          | `button`           | If true, a button tag will be rendered and the item will be tappable. Defaults to `false`.                                                                                                                                                                             | `boolean`                         |
| `color`           | `color`            | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`                           |
| `detailIcon`      | `detail-icon`      | The icon to use when `detail` is set to `true`. Defaults to `"ios-arrow-forward"`.                                                                                                                                                                                     | `string`                          |
| `detail`          | `detail`           | If true, a detail arrow will appear on the item. Defaults to `false` unless the `mode` is `ios` and an `href`, `onclick` or `button` property is present.                                                                                                              | `boolean`                         |
| `disabled`        | `disabled`         | If true, the user cannot interact with the item. Defaults to `false`.                                                                                                                                                                                                  | `boolean`                         |
| `href`            | `href`             | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.                                                                                                                                                | `string`                          |
| `lines`           | `lines`            | How the bottom border should be displayed on the item. Available options: `"full"`, `"inset"`, `"none"`.                                                                                                                                                               | `"full"`, `"inset"`, `"none"`     |
| `mode`            | `mode`             | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`                            |
| `routerDirection` | `router-direction` | When using a router, it specifies the transition direction when navigating to another page using `href`.                                                                                                                                                               | `RouterDirection`                 |
| `state`           | `state`            |                                                                                                                                                                                                                                                                        | `"valid"`, `"invalid"`, `"focus"` |
| `type`            | `type`             | The type of the button. Only used when an `onclick` or `button` property is present. Possible values are: `"submit"`, `"reset"` and `"button"`. Default value is: `"button"`                                                                                           | `"submit"`, `"reset"`, `"button"` |


## CSS Custom Properties

| Name                     | Description                      |
| ------------------------ | -------------------------------- |
| `--background`           | Background of the item           |
| `--background-activated` | Background of the activated item |
| `--border-color`         | Color of the item border         |
| `--border-radius`        | Radius of the item border        |
| `--border-style`         | Style of the item border         |
| `--border-width`         | Width of the item border         |
| `--box-shadow`           | Box shadow of the item           |
| `--color`                | Color of the item                |
| `--detail-icon-color`    | Color of the item detail icon    |
| `--inner-border-width`   | Width of the item inner border   |
| `--inner-box-shadow`     | Box shadow of the item inner     |
| `--inner-padding-bottom` | Bottom padding of the item inner |
| `--inner-padding-end`    | End padding of the item inner    |
| `--inner-padding-start`  | Start padding of the item inner  |
| `--inner-padding-top`    | Top padding of the item inner    |
| `--min-height`           | Minimum height of the item       |
| `--padding-bottom`       | Bottom padding of the item       |
| `--padding-end`          | End padding of the item          |
| `--padding-start`        | Start padding of the item        |
| `--padding-top`          | Top padding of the item          |
| `--transition`           | Transition of the item           |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
