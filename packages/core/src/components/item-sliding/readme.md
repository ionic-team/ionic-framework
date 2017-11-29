# ion-item-sliding

A sliding item is a list item that can be swiped to reveal buttons. It requires
an [Item](../Item) component as a child and a [List](../../list/List) component as
a parent. All buttons to reveal can be placed in the `<ion-item-options>` element.

```html
<ion-list>
  <ion-item-sliding #item>
    <ion-item>
      Item
    </ion-item>
    <ion-item-options side="left">
      <ion-button (click)="favorite(item)">Favorite</ion-button>
      <ion-button color="danger" (click)="share(item)">Share</ion-button>
    </ion-item-options>

    <ion-item-options side="right">
      <ion-button (click)="unread(item)">Unread</ion-button>
    </ion-item-options>
  </ion-item-sliding>
</ion-list>
```


### Swipe Direction

By default, the buttons are revealed when the sliding item is swiped from right to left,
so the buttons are placed in the right side. But it's also possible to reveal them
in the right side (sliding from left to right) by setting the `side` attribute
on the `ion-item-options` element. Up to 2 `ion-item-options` can used at the same time
in order to reveal two different sets of buttons depending the swipping direction.

```html
<ion-item-options side="right">
  <ion-button (click)="archive(item)">
    <ion-icon name="archive"></ion-icon>
    Archive
  </ion-button>
</ion-item-options>

<ion-item-options side="left">
  <ion-button (click)="archive(item)">
    <ion-icon name="archive"></ion-icon>
    Archive
  </ion-button>
</ion-item-options>
```


### Listening for events (ionDrag) and (ionSwipe)
It's possible to know the current relative position of the sliding item by subscribing
to the (ionDrag)` event.

```html
<ion-item-sliding (ionDrag)="logDrag($event)">
  <ion-item>Item</ion-item>
  <ion-item-options>
    <ion-button>Favorite</ion-button>
  </ion-item-options>
</ion-item-sliding>
```


### Button Layout
If an icon is placed with text in the option button, by default it will
display the icon on top of the text. This can be changed to display the icon
to the left of the text by setting `icon-start` as an attribute on the
`<ion-item-options>` element.

```html
<ion-item-options icon-start>
   <ion-button (click)="archive(item)">
     <ion-icon name="archive"></ion-icon>
     Archive
   </ion-button>
 </ion-item-options>

```


### Expandable Options

Options can be expanded to take up the full width of the item if you swipe past
a certain point. This can be combined with the `ionSwipe` event to call methods
on the class.

```html

<ion-item-sliding (ionSwipe)="delete(item)">
  <ion-item>Item</ion-item>
  <ion-item-options>
    <ion-button expandable (click)="delete(item)">Delete</ion-button>
  </ion-item-options>
</ion-item-sliding>
```

We can call `delete` by either clicking the button, or by doing a full swipe on the item.



<!-- Auto Generated Below -->


## Events

#### ionDrag


## Methods

#### close()


#### closeOpened()


#### getOpenAmount()


#### getSlidingPercent()



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
