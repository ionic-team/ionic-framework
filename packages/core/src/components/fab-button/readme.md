# ion-fab-button

Floating Action Buttons (FABs) represent the primary action in an application. By default, they have a circular shape. When pressed, the button may open more related actions. As the name suggests, FABs generally float over the content in a fixed position. This is not achieved exclusively by using an `<ion-fab-button>FAB</ion-fab-button>`. They need to be wrapped with an `<ion-fab>` component in order to be fixed over the content:

```html
<ion-content>
  <!-- Fixed Floating Action Button that does not scroll with the content -->
  <ion-fab>
    <ion-fab-button>Button</ion-fab-button>
  </ion-fab>

  <!-- Default Floating Action Button that scrolls with the content.-->
  <ion-fab-button>Button</ion-fab-button>
</ion-content>
```

If the FAB button is not wrapped with `<ion-fab>`, it will scroll with the content. FAB buttons have a default size, a mini size and can accept different colors:

```html
<ion-content>
  <ion-fab-button>Default</ion-fab-button>

  <!-- Mini -->
  <ion-fab-button mini>Mini</ion-fab-button>

  <!-- Colors -->
  <ion-fab-button color="primary">Primary</ion-fab-button>
  <ion-fab-button color="secondary">Secondary</ion-fab-button>
  <ion-fab-button color="danger">Danger</ion-fab-button>
  <ion-fab-button color="light">Light</ion-fab-button>
  <ion-fab-button color="dark">Dark</ion-fab-button>
</ion-content>
```


<!-- Auto Generated Below -->


## Properties

#### activated

boolean


#### color

string


#### disabled

boolean


#### href

string


#### mode




#### show

boolean


#### toggleActive




#### translucent

boolean


## Attributes

#### activated

boolean


#### color

string


#### disabled

boolean


#### href

string


#### mode




#### show

boolean


#### toggle-active




#### translucent

boolean



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
