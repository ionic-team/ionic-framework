# ion-fab-list

The `ion-fab-list` element is a container for multiple FAB buttons. This collection of FAB buttons contains actions related to the main FAB button and is flung out on click. To specify the side of the main button to show the list on, use the following:

```
[top] - Show the list of buttons above the main FAB button
[bottom] - Show the list of buttons under the main FAB button
[left] - Show the list of buttons to the left of the main FAB button
[right] - Show the list of buttons to the right of the main FAB button
```

```html
<ion-fab bottom right>
  <ion-fab-button>Share</ion-fab-button>
  <ion-fab-list side="top">
    <ion-fab-button>Facebook</ion-fab-button>
    <ion-fab-button>Twitter</ion-fab-button>
    <ion-fab-button>Youtube</ion-fab-button>
  </ion-fab-list>
  <ion-fab-list side="left">
    <ion-fab-button>Vimeo</ion-fab-button>
  </ion-fab-list>
</ion-fab>
```


<!-- Auto Generated Below -->


## Properties

#### activated

boolean


## Attributes

#### activated

boolean



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
