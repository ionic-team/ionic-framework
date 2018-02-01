# ion-note

Notes are text elements generally used as subtitles that provide more information. Notes are styled to appear grey by default.

```html
<!-- Default Note -->
<ion-note>Default Note</ion-note>

<!-- Note Colors -->
<ion-note color="primary">Primary Note</ion-note>
<ion-note color="secondary">Secondary Note</ion-note>
<ion-note color="danger">Danger Note</ion-note>
<ion-note color="light">Light Note</ion-note>
<ion-note color="dark">Dark Note</ion-note>

<!-- Notes in a List -->
<ion-list>
  <ion-item>
    <ion-label>Note (End)</ion-label>
    <ion-note slot="end">On</ion-note>
  </ion-item>

  <ion-item>
    <ion-note slot="start">Off</ion-note>
    <ion-label>Note (Start)</ion-label>
  </ion-item>
</ion-list>
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



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
