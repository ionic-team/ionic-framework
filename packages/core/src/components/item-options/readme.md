# ion-item-options

The option buttons for an `ion-item-sliding`. These buttons can be placed either on the left or right side.
You can combine the `(ionSwipe)` event plus the `expandable` directive to create a full swipe action for the item.


```html
<ion-item-sliding>
  <ion-item>
    Item 1
  </ion-item>
  <ion-item-options side="right" (ionSwipe)="saveItem(item)">
    <ion-item-option expandable (click)="saveItem(item)">
      <ion-icon name="star"></ion-icon>
    </ion-item-option>
  </ion-item-options>
</ion-item-sliding>
```


<!-- Auto Generated Below -->


## Properties

#### side



The side the option button should be on. Defaults to `"right"`.
If you have multiple `ion-item-options`, a side must be provided for each.


## Attributes

#### side



The side the option button should be on. Defaults to `"right"`.
If you have multiple `ion-item-options`, a side must be provided for each.


## Events

#### ionSwipe

Emitted when the item has been fully swiped.


## Methods

#### fireSwipeEvent()


#### isRightSide()


#### width()



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
