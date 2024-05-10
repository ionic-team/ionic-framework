# Sass Guidelines

- [Definitions](#definitions)
- [Scope](#scope)
- [Historical Usage](#historical-usage)
- [Current Usage](#current-usage)
- [Recommended Usage](#recommended-usage)
  * [Comments](#comments)
  * [Variables](#variables)
    + [✅ Global](#-global)
    + [✅ Theming](#-theming)
    + [✅ Reusable values](#-reusable-values)
    + [✅ Media queries](#-media-queries)
    + [✅ Dynamic calculations](#-dynamic-calculations)
    + [🚫 Consistency](#-consistency)
    + [🚫 Text Alignment](#-text-alignment)
    + [🚫 Structural Changes](#-structural-changes)
    + [🚫 Font Properties](#-font-properties)

## Definitions

**Sass:** An extension to CSS that reduces the repetition in CSS and allows developers to use shared functions, mixins and variables. [^1]

**Members:** Refers to variables, functions and mixins in Sass.

## Scope

Sass provides members that make it easier to reuse code throughout the Ionic Framework repository. Variables hold values that can be used by other stylesheets. Mixins define reusable blocks of styles that can be included in other selectors. Functions allow the manipulation of values and can perform calculations.

The purpose of this document is to identify the scenarios in which Sass variables should be used.

## Historical Usage

In Ionic Framework v1 through v3, the project was built with Sass variables that developers could change at runtime. While the default values were provided by Ionic Framework, anyone developing with it could override these values to rebuild the Ionic Framework CSS with their own values. [^2]

Due to this, Ionic Framework documented the Sass variables as part of the public API using `@prop` comments as early as [v2.0.0](https://github.com/ionic-team/ionic-framework/blob/v2.0.0/src/components/alert/alert.ios.scss):

```scss
// alert.ios.scss

/// @prop - Max width of the alert
$alert-ios-max-width:                           270px !default;

/// @prop - Border radius of the alert
$alert-ios-border-radius:                       13px !default;
```

If a Sass variable was deprecated or hidden from the public API, the `@prop` comment would be removed, or it would never be added, as seen in [v3.9.2](https://github.com/ionic-team/ionic-framework/blob/v3.9.2/src/components/alert/alert.ios.scss#L18-L19):

```scss
// alert.ios.scss

// deprecated
$alert-ios-head-padding:                        null !default;
```

To ensure proper documentation of variables for customizing Ionic Framework, Sass variables were added for components even if they were not used multiple times within the same component or elsewhere:

```scss
// alert.ios.scss

/// @prop - Text color of the label for the checked radio alert
$alert-ios-radio-label-text-color-checked:      $alert-ios-button-text-color !default;

.alert-ios [aria-checked=true] .alert-radio-label {
  color: $alert-ios-radio-label-text-color-checked;
}
```

## Current Usage

The abundance of Sass variables currently in Ionic Framework is a result of their historical usage, being used to rebuild the CSS and customize Ionic Framework components.

The comments for Sass variables are also still visible today in [v8.1.0](https://github.com/ionic-team/ionic-framework/blob/v8.1.0/core/src/components/alert/alert.ios.vars.scss), even though they are no longer used by any documentation generators:

```scss
// alert.ios.vars.scss

/// @prop - Max width of the alert
$alert-ios-max-width:                                   dynamic-font-clamp(1, 270px, 1.2);

/// @prop - Border radius of the alert
$alert-ios-border-radius:                               13px;
```

These comments aren't necessary when the naming describes its use thoroughly. The comments for the variables above do not need to be there, as it is fairly obvious what they are used for.

However, the comment for the following variable might be helpful in explaining where it is used because on first glance it reads like it could be used for a sub title inside of a title:

```scss
// action-sheet.ios.vars.scss

/// @prop - Font weight of the action sheet title when it has a sub title
$action-sheet-ios-title-with-sub-title-font-weight:               600;
```

It could be argued though that the comment doesn't really help, as seeing the variable in use will explain its purpose the best. Additionally, this is an example of a variable that isn't necessary, given it is only used in one place, which is why it is so specific in the first place.

## Recommended Usage

There are two things that need to be outlined here: when we should use comments and when we should use variables. The sections below detail the recommended usage for each of these.

### Comments

We should update the comments for Sass variables in one of the following ways:

1. If we don't intend to ever publicly document the Sass variables again, we should update the comments to remove the syntax that was added for documentation generation:
    ```diff
    // alert.ios.vars.scss

    -/// @prop - Border radius of the alert
    +// Border radius of the alert
    $alert-ios-border-radius:                               13px;
    ```

2. If we don't find the comments to be helpful, and want to stick with keeping the variable names specific, we should remove the comments entirely:
    ```diff
    // alert.ios.vars.scss

    -/// @prop - Border radius of the alert
    $alert-ios-border-radius:                               13px;
    ```

3. If we find the comments to be helpful for certain variables or situations, like when there are math calculations involved, we should keep only the comments that are necessary to explain what is going on:
    ```diff
    -/// @prop - Height of the alert button
    /**
    * We want the height of the button to
    * scale with the text so the next never runs
    * into the edge of the button. We change the height
    * instead of adding padding because we would need to offset
    * the height the padding and the border. Since the border uses
    * a hairline (<1px) width, this will cause subpixel rendering
    * differences across browsers.
    */
    $alert-ios-button-height:                           dynamic-font-min(1, 44px);
    ```

### Variables

The table below outlines the recommended approach for when to use Sass variables. Each scenario links to a section that explains it in more detail.

|    | Scenario                                                       |
| ---| ---------------------------------------------------------------|
| ✅ | [Global](#white_check_mark-global)                             |
| ✅ | [Theming](#white_check_mark-theming)                           |
| ✅ | [Reusable values](#white_check_mark-reusable-values)           |
| ✅ | [Media queries](#white_check_mark-media-queries)               |
| ✅ | [Dynamic calculations](#white_check_mark-dynamic-calculations) |
| 🚫 | [Consistency](#no_entry_sign-consistency)                      |
| 🚫 | [Text Alignment](#no_entry_sign-text-alignment)                |
| 🚫 | [Structural Changes](#no_entry_sign-structural-changes)        |
| 🚫 | [Font Properties](#no_entry_sign-font-properties)              |

#### ✅ Global

Global variables that are used in multiple places include `font-family`, `z-index`, and `opacity`. These should continue to be set in variables as they affect multiple components that use them.

Example of global variables:

```scss
// ionic.globals.scss

$font-family-base:              var(--ion-font-family, inherit);

$hairlines-width:               .55px;

$placeholder-opacity:           0.6;
```

#### ✅ Theming

Storing colors and other design-related values makes it easy to update an entire theme by modifying a few variables.

Example of theme variables:

```scss
// ionic.theme.default.scss

$background-color-value:        #fff;
$background-color-rgb-value:    255, 255, 255;

$text-color-value:              #000;
$text-color-rgb-value:          0, 0, 0;

$background-color:              var(--ion-background-color, $background-color-value);
$background-color-rgb:          var(--ion-background-color-rgb, $background-color-rgb-value);
$text-color:                    var(--ion-text-color, $text-color-value);
$text-color-rgb:                var(--ion-text-color-rgb, $text-color-rgb-value);
```

```scss
// ionic.theme.default.ios.scss

$backdrop-ios-color:            var(--ion-backdrop-color, #000);
$overlay-ios-background-color:  var(--ion-overlay-background-color, var(--ion-color-step-100, #f9f9f9));
```

#### ✅ Reusable values

Use variables for values that are repeated throughout stylesheets, such as spacing, `border-radius`, `font-size`, or any other value used in multiple places. A value should only be considered reusable if it is used more than once and related among the elements it is being applied to in some way. For instance, a value is not considered related if it changes a common property, such as border style. While many components use `border-style: solid`, it does not need to be stored unless these components will require updates with design changes. Currently, the border styles have consistently been set to `solid`, with the exception of `none` for a CSS reset.

Example of reusable values:

<table>
<thead>
<tr>
<th>Do ✅</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// alert.ios.vars.scss

/// @prop - Padding end of the alert head
$alert-ios-head-padding-end:     16px;

/// @prop - Padding start of the alert head
$alert-ios-head-padding-start:   $alert-ios-head-padding-end;
```

```scss
// alert.ios.scss

.alert-head {
  padding-top: 12px;
  padding-inline-end: $alert-ios-head-padding-end;
  padding-bottom: 7px;
  padding-inline-start: $alert-ios-head-padding-start;
}
```

</td>
</tr>
<tr></tr>
<tr>
<th>Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// alert.ios.vars.scss

/// @prop - Padding top of the alert head
$alert-ios-head-padding-top:     12px;

/// @prop - Padding bottom of the alert head
$alert-ios-head-padding-bottom:  7px;
```

```scss
// alert.ios.scss

.alert-head {
  padding-top: $alert-ios-head-padding-top;
  padding-bottom: $alert-ios-head-padding-bottom;
}
```

</td>
</tr>
</table>

If a value is shared among multiple components, it should be made into a [global variable](#white_check_mark-global) instead of importing the variable from a specific component. For example, variables that are shared between list components (item, item divider, list header) should be defined in a global theme file:

<table>
<thead>
<tr>
<th>Do ✅</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// ionic.theme.default.md.scss

$global-md-item-padding-end: 16px;
$global-md-item-padding-start: $global-md-item-padding-end;
```

```scss
// item.md.vars.scss

@import "../../themes/ionic.globals.md";

/// @prop - Padding end for the item content
$item-md-padding-end: $global-md-item-padding-end;

/// @prop - Padding start for the item content
$item-md-padding-start: $global-md-item-padding-start;
```

```scss
// item-divider.md.vars.scss

@import "../../themes/ionic.globals.md";

/// @prop - Padding start for the divider
$item-divider-md-padding-start: $global-md-item-padding-start;

/// @prop - Padding end for the divider
$item-divider-md-padding-end: $global-md-item-padding-end;
```

</td>
</tr>
<tr></tr>
<tr>
<th>Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// item.md.vars.scss

@import "../../themes/ionic.globals.md";

/// @prop - Padding end for the item content
$item-md-padding-end:                   16px;

/// @prop - Padding start for the item content
$item-md-padding-start:                 16px;
```

```scss
// item-divider.md.vars.scss

@import "../../themes/ionic.globals.md";
@import "../item/item.md.vars";

/// @prop - Padding start for the divider
$item-divider-md-padding-start:        $item-md-padding-start;

/// @prop - Padding end for the divider
$item-divider-md-padding-end:          $item-md-padding-end;
```

</td>
</tr>
</table>

> [!TIP]
> The names of the global variables are just an example. We do not currently have a naming convention for global variables.

#### ✅ Media queries

Define breakpoints for responsive design to allow easy adjustments as needed.

Example of breakpoints used by media queries:

```scss
// ionic.globals.scss

// The minimum dimensions at which your layout will change,
// adapting to different screen sizes, for use in media queries
$screen-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
);
```

#### ✅ Dynamic calculations

Variables can be useful for dynamic calculations, such as storing a base font size in a variable and then using it in calculations for other font sizes or spacing values. Variables should not be used for storing a function call, even if the function itself has dynamic calculations.

<table>
<thead>
<tr>
<th>Do ✅</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// chip.vars.scss

/// @prop - Unitless font size of the chip before scaling
$chip-base-font-size: 14;

/// @prop - Font size of the chip in rem before scaling
$chip-base-font-size-rem: #{math.div($chip-base-font-size, 16)}rem;

/// @prop - Size of an icon within a chip (in em to scale as the font size of the chip scales)
$chip-icon-size: math.div(20em, $chip-base-font-size);

/// @prop - Size of an avatar within a chip (in em to scale as the font size of the chip scales)
$chip-avatar-size: math.div(24em, $chip-base-font-size);
```

</td>
</tr>
<tr></tr>
<tr>
<th>Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// alert.vars.scss

/// @prop - Font size of the alert button
$alert-button-font-size:          dynamic-font(14px);
```

</td>
</tr>
</table>

#### 🚫 Consistency

While we usually aim for consistency across different modes, this isn't always necessary when dealing with Sass variables. If certain styles are present in one mode but absent in another, there's no need to include a Sass variable for the mode lacking those styles.

For example, the color of the label changes when focused in `md` mode. However, in `ios`, the label does not receive different styling when focused, therefore it does not require the same styles or a Sass variable defined:

<table>
<thead>
<tr>
<th>Do ✅</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// label.md.vars.scss

/// @prop - Text color of the stacked/floating label when it is focused
$label-md-text-color-focused:            ion-color(primary, base);
```

```scss
// label.md.scss

:host-context(.ion-focused).label-stacked:not(.ion-color),
:host-context(.ion-focused).label-floating:not(.ion-color),
:host-context(.item-has-focus).label-stacked:not(.ion-color),
:host-context(.item-has-focus).label-floating:not(.ion-color) {
  color: $label-md-text-color-focused;
}
```

</td>
</tr>
<tr></tr>
<tr>
<th>Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// label.ios.vars.scss

/// @prop - Text color of the stacked/floating label when it is focused
$label-ios-text-color-focused:         null;
```

```scss
// label.ios.scss

:host-context(.ion-focused).label-stacked:not(.ion-color),
:host-context(.ion-focused).label-floating:not(.ion-color),
:host-context(.item-has-focus).label-stacked:not(.ion-color),
:host-context(.item-has-focus).label-floating:not(.ion-color) {
  color: $label-ios-text-color-focused;
}
```

</td>
</tr>
</table>

#### 🚫 Text Alignment

A text alignment property should not be stored in a Sass variable, even if it is used in multiple places. This is because the alignment may be tied to a specific design, and the design may change, causing them to become disconnected.

<table>
<thead>
<tr>
<th>Do ✅</th>
<th>Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// action-sheet.ios.scss

:host {
  text-align: center;
}

.action-sheet-title {
  text-align: center;
}
```

</td>
<td valign="top">

```scss
// action-sheet.ios.vars.scss

/// @prop - Text align of the action sheet
$action-sheet-ios-text-align:        center;
```

```scss
// action-sheet.ios.scss

:host {
  text-align: $action-sheet-ios-text-align;
}

.action-sheet-title {
  text-align: $action-sheet-ios-text-align;
}
```

</td>
</tr>
</table>


#### 🚫 Structural Changes

Variables should not be used when they are structural changes of an element. This includes `display` properties, `flex` properties, `grid` properties, and more.

<table>
<thead>
<tr>
<th>Do ✅</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// alert.ios.scss

.alert-button-group {
  flex-wrap: wrap;
}

.alert-button {
  flex: 1 1 auto;
}
```

</td>
</tr>
<tr></tr>
<tr>
<th>Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">


```scss
// alert.ios.vars.scss

/// @prop - Flex wrap of the alert button group
$alert-ios-button-group-flex-wrap:        wrap;

/// @prop - Flex of the alert button
$alert-ios-button-flex:                   1 1 auto;
```

```scss
// alert.ios.scss

.alert-button-group {
  flex-wrap: $alert-ios-button-group-flex-wrap;
}

.alert-button {
  flex: $alert-ios-button-flex;
}
```

</td>
</tr>
</table>

#### 🚫 Font Properties

We shouldn't use variables for changing things such as `font-size` or `font-weight`, as these are not changed based on a theme and do not need to be updated globally. When updating the `font-size` and `font-weight` for these elements, it will always be done on a case-by-case basis:

<table>
<thead>
<tr>
<th>Do ✅</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// action-sheet.ios.scss

.action-sheet-title {
  font-size: dynamic-font-min(1, 13px);
  font-weight: 400;
}

.action-sheet-sub-title {
  font-size: dynamic-font-min(1, 13px);
  font-weight: 400;
}
```

</td>
</tr>
<tr></tr>
<tr>
<th>Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top">

```scss
// action-sheet.ios.vars.scss

/// @prop - Font size of the action sheet title
$action-sheet-ios-title-font-size:          dynamic-font-min(1, 13px);

/// @prop - Font weight of the action sheet title
$action-sheet-ios-title-font-weight:        400;

/// @prop - Font size of the action sheet sub title
$action-sheet-ios-sub-title-font-size:      dynamic-font-min(1, 13px);
```

```scss
// action-sheet.ios.scss

.action-sheet-title {
  font-size: $action-sheet-ios-title-font-size;
  font-weight: $action-sheet-ios-title-font-weight;
}

.action-sheet-sub-title {
  font-size: $action-sheet-ios-sub-title-font-size;
  font-weight: $action-sheet-ios-title-font-weight;
}
```

</td>
</tr>
</table>

[^1]: Sass Documentation, https://sass-lang.com/documentation/

[^2]: Ionic Framework v3 Documentation - Theming - Overriding Ionic Variables, https://ionicframework.com/docs/v3/theming/overriding-ionic-variables/
