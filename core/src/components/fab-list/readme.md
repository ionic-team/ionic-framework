# ion-fab-list

The `ion-fab-list` element is a container for multiple FAB buttons. This collection of FAB buttons contains actions related to the main FAB button and is flung out on click. To specify the side of the main button to show the list on, use the following:

```
[top] - Show the list of buttons above the main FAB button
[bottom] - Show the list of buttons under the main FAB button
[start] - Show the list of buttons on the start side of the main FAB button (i.e. on the left in LTR, on the right in RTL)
[end] - Show the list of buttons on the end side of the main FAB button (i.e. on the right in LTR, on the left in RTL)
```

```html
<ion-fab vertical="bottom" horizontal="end">
  <ion-fab-button>Share</ion-fab-button>
  <ion-fab-list side="top">
    <ion-fab-button>Facebook</ion-fab-button>
    <ion-fab-button>Twitter</ion-fab-button>
    <ion-fab-button>Youtube</ion-fab-button>
  </ion-fab-list>
  <ion-fab-list side="start">
    <ion-fab-button>Vimeo</ion-fab-button>
  </ion-fab-list>
</ion-fab>
```


<!-- Auto Generated Below -->


## Properties

#### activated

boolean

If true, the fab list will be show all fab buttons in the list. Defaults to `false`.


#### side

string

The side the fab list will show on relative to the main fab button. Defaults to `'bottom'`.


## Attributes

#### activated

boolean

If true, the fab list will be show all fab buttons in the list. Defaults to `false`.


#### side

string

The side the fab list will show on relative to the main fab button. Defaults to `'bottom'`.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
