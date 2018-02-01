# ion-text

The text component is a simple component that can be used to style the text color of any element. The `ion-text` element should wrap the element in order to change the text color of that element.


```html
<ion-text color="secondary">
  <h1>H1: The quick brown fox jumps over the lazy dog</h1>
</ion-text>

<ion-text color="primary">
  <h2>H2: The quick brown fox jumps over the lazy dog</h2>
</ion-text>

<ion-text color="light">
  <h3>H3: The quick brown fox jumps over the lazy dog</h3>
</ion-text>

<ion-text color="danger">
  <h4 >H4: The quick brown fox jumps over the lazy dog</h4>
</ion-text>

<ion-text color="dark">
  <h5>H5: The quick brown fox jumps over the lazy dog</h5>
</ion-text>

<p>
  I saw a werewolf with a Chinese menu in his hand.
  Walking through the <ion-text color="danger"><sub>streets</sub></ion-text> of Soho in the rain.
  He <ion-text color="primary"><i>was</i></ion-text> looking for a place called Lee Ho Fook's.
  Gonna get a <ion-text color="secondary"><a>big dish of beef chow mein.</a></ion-text>
  <ion-text color="danger"><ion-icon name="cut"></ion-icon></ion-text>
</p>
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
