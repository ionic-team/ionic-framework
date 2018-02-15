# ion-back-button

A back button is a component that allows you navigate back into app history. To
add a back button to your view, all you need is:

```html
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</ion-page>
```

The back button component is smart enough to know what to render and what content to show.

If, however, you want more control over what is shown in the back button, you can pass your own button markup.

```html
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button>
          <ion-button>
              Button Text
            <ion-icon name="add" slot="start"></ion-icon>
          </ion-button>
        </ion-back-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</ion-page>
```

Or no button text at all:


```html
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button>
          <ion-button>
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-back-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</ion-page>
```


<!-- Auto Generated Below -->


## Properties

#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### text

string

The text property is used to provide custom text for the back button while using the
default look-and-feel


## Attributes

#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### text

string

The text property is used to provide custom text for the back button while using the
default look-and-feel



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
