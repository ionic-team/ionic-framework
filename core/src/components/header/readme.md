# ion-header

Header is a parent component that holds the toolbar component.
It's important to note that ion-header needs to be the one of the three root elements of a page



<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-title>My Navigation Bar</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-title>Subheader</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content></ion-content>
```



## Properties

| Property      | Attribute     | Description                                                                                                                                               | Type            |
| ------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `mode`        | `mode`        | The mode determines which platform styles to use.                                                                                                         | `"ios" \| "md"` |
| `translucent` | `translucent` | If `true`, the header will be translucent. Note: In order to scroll content behind the header, the `fullscreen` attribute needs to be set on the content. | `boolean`       |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
