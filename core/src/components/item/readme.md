# ion-item

Items are elements that can contain text, icons, avatars, images, inputs, and any other native or custom elements. Generally they are placed in a list with other items. Items can be swiped, deleted, reordered, edited, and more.


## Detail Arrows

By default, clickable items will display a right arrow icon on `ios` mode. To hide the right arrow icon on clickable elements, set the `detail` property to `false`. To show the right arrow icon on an item that doesn't display it naturally, add the `detail` attribute to the item.

This feature is not enabled by default on clickable items for the `md` mode, but it can be enabled by setting the following Sass variable:

```scss
$item-md-detail-push-show: true;
```

It can also be turned off by default on clickable items for ios by setting the following Sass variable:

```scss
$item-ios-detail-push-show: false;
```

See the [theming documentation](http://ionicframework.com/docs/theming/overriding-ionic-variables/) for more information on overriding Sass variables.


## Item Placement

Item uses named [slots](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) in order to position content. This logic makes it possible to write a complex item with simple, understandable markup without having to worry about styling and positioning the elements.

The below chart details the item slots and where it will place the element inside of the item:

| Slot    | Description                                                                       |
|---------|-----------------------------------------------------------------------------------|
| `start` | Placed to the left of all other content in LTR, and to the `right` in RTL.        |
| `end`   | Placed to the right of all other content in LTR, and to the `right` in RTL.       |
| none    | Placed inside of the input wrapper.                                               |


### Text Alignment

Items left align text and add an ellipsis when the text is wider than the item. See the [Utility Attributes Documentation](../../../../theming/css-utilities/) for attributes that can be added to `<ion-item>` to transform the text.


<!-- Auto Generated Below -->


## Properties

#### button

boolean

If true, a button tag will be rendered and the item will be tappable. Defaults to `false`.


#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### detail

boolean

If true, a detail arrow will appear on the item. Defaults to `false` unless the `mode`
is `ios` and an `href`, `onclick` or `button` property is present.


#### disabled

boolean

If true, the user cannot interact with the item. Defaults to `false`.


#### href

string

Contains a URL or a URL fragment that the hyperlink points to.
If this property is set, an anchor tag will be rendered.


#### lines

string

How the bottom border should be displayed on the item.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### routerDirection

string

When using a router, it specifies the transition direction when navigating to
another page using `href`.


## Attributes

#### button

boolean

If true, a button tag will be rendered and the item will be tappable. Defaults to `false`.


#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### detail

boolean

If true, a detail arrow will appear on the item. Defaults to `false` unless the `mode`
is `ios` and an `href`, `onclick` or `button` property is present.


#### disabled

boolean

If true, the user cannot interact with the item. Defaults to `false`.


#### href

string

Contains a URL or a URL fragment that the hyperlink points to.
If this property is set, an anchor tag will be rendered.


#### lines

string

How the bottom border should be displayed on the item.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### router-direction

string

When using a router, it specifies the transition direction when navigating to
another page using `href`.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
