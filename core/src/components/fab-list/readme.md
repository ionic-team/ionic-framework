# ion-fab-list

The `ion-fab-list` element is a container for multiple fab buttons. This collection of fab buttons contains actions related to the main fab button and is flung out on click. To specify what side the buttons should appear on, set the `side` property to 'start', 'end', 'top', 'bottom'

<!-- Auto Generated Below -->


## Usage

### Angular/javascript

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



## Properties

| Property    | Attribute   | Description                                                         | Type                                    | Default    |
| ----------- | ----------- | ------------------------------------------------------------------- | --------------------------------------- | ---------- |
| `activated` | `activated` | If `true`, the fab list will be show all fab buttons in the list.   | `boolean`                               | `false`    |
| `side`      | `side`      | The side the fab list will show on relative to the main fab button. | `"bottom" \| "end" \| "start" \| "top"` | `'bottom'` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
