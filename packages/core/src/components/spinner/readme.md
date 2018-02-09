# ion-spinner

The `ion-spinner` component provides a variety of animated SVG spinners.
Spinners enables you to give users feedback that the app is actively
processing/thinking/waiting/chillin’ out, or whatever you’d like it to indicate.
By default, the `ion-refresher` feature uses this spinner component while it's
the refresher is in the `refreshing` state.

Ionic offers a handful of spinners out of the box, and by default, it will use
the appropriate spinner for the platform on which it’s running.

<table class="table spinner-table">
 <tr>
   <th>
     <code>lines</code>
   </th>
   <td>
     <ion-spinner name="lines"></ion-spinner>
   </td>
 </tr>
 <tr>
   <th>
     <code>lines-small</code>
   </th>
   <td>
     <ion-spinner name="lines-small"></ion-spinner>
   </td>
 </tr>
 <tr>
   <th>
     <code>bubbles</code>
   </th>
   <td>
     <ion-spinner name="bubbles"></ion-spinner>
   </td>
 </tr>
 <tr>
   <th>
     <code>circles</code>
   </th>
   <td>
     <ion-spinner name="circles"></ion-spinner>
   </td>
 </tr>
 <tr>
   <th>
     <code>crescent</code>
   </th>
   <td>
     <ion-spinner name="crescent"></ion-spinner>
   </td>
 </tr>
 <tr>
   <th>
     <code>dots</code>
   </th>
   <td>
     <ion-spinner name="dots"></ion-spinner>
   </td>
 </tr>
</table>

The following code would use the default spinner for the platform it's
running from. If it's neither iOS or Android, it'll default to use `ios`.

```html
<ion-spinner></ion-spinner>
```

By setting the `name` property, you can specify which predefined spinner to
use, no matter what the platform is.

```html
<ion-spinner name="bubbles"></ion-spinner>
```

## Styling SVG with CSS
One cool thing about SVG is its ability to be styled with CSS! One thing to note
is that some of the CSS properties on an SVG element have different names. For
example, SVG uses the term `stroke` instead of `border`, and `fill` instead
of `background-color`.

```css
ion-spinner{
  width: 28px;
  height: 28px;
  stroke: #444;
  fill: #222;
}
```


<!-- Auto Generated Below -->


## Properties

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### duration

number

How long it takes it to do one loop.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### name

string

SVG spinner name.


#### paused

boolean

If true, pause the animation.


## Attributes

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### duration

number

How long it takes it to do one loop.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### name

string

SVG spinner name.


#### paused

boolean

If true, pause the animation.



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
