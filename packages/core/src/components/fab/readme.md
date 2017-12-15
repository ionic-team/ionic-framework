# ion-fab

The `<ion-fab>` element is a container element that places the FAB button (`<ion-fab-button>`) in a fixed position that does not scroll with the content. It is also used to display a list of FAB buttons. It accepts the following attributes to position the FAB button element with respect to the content:

```
[top] - Places the container at the top of the content
[bottom] - Places the container at the bottom of the content
[left] - Places the container on the left
[right] - Places the container on the right
[middle] - Places the container in the middle vertically
[center] - Places the container in the center horizontally
[edge] - Used to place the container between the content and the header/footer
```


```html
<!-- this fab is placed at the top right -->
<ion-content>
  <ion-fab top right>
    <ion-fab-button>Button</ion-fab-button>
  </ion-fab>

  <!-- this fab is placed at the center of the content -->
  <ion-fab center middle>
    <ion-fab-button>Button</ion-fab-button>
  </ion-fab>
</ion-content>
```

Ionic's FAB also supports FAB lists. This is a list of related buttons that show when the main FAB button is clicked.

The same `ion-fab` container can contain several `ion-fab-list` elements with different side values:
`top`, `bottom`, `left` and `right`. If side is ommited, the default is `bottom`.


```html
<ion-content>
  <!-- this fab is placed at bottom right -->
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
</ion-content>
```


<!-- Auto Generated Below -->


## Methods

#### close()

Close an active FAB list container



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
