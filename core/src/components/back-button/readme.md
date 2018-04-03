# ion-back-button

A back button is a component that allows you navigate back into app history. To
add a back button to your view, all you need is:

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
```

The back button component is smart enough to know what to render and what content to show.

If, however, you want more control over what is shown in the back button, you use the
`text` and `icon` properties.

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button text="Volver" icon="add"></ion-back-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
```

Or no button text at all:


```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button text="" icon="add"></ion-back-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
```


<!-- Auto Generated Below -->


## Properties

#### defaultHref

string


#### icon

string


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### text



The text property is used to provide custom text for the back button while using the
default look-and-feel.


## Attributes

#### default-href

string


#### icon

string


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### text



The text property is used to provide custom text for the back button while using the
default look-and-feel.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
