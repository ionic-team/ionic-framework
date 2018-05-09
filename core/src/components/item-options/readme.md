# ion-item-options

The option buttons for an `ion-item-sliding`. These buttons can be placed either on the [start or end side](#side-description).
You can combine the `(ionSwipe)` event plus the `expandable` directive to create a full swipe action for the item.


```html
<ion-item-sliding>
  <ion-item>
    Item 1
  </ion-item>
  <ion-item-options side="end" (ionSwipe)="saveItem(item)">
    <ion-item-option expandable (click)="saveItem(item)">
      <ion-icon name="star"></ion-icon>
    </ion-item-option>
  </ion-item-options>
</ion-item-sliding>
```

### Side description

| Side         | Position                                                        | Swipe direction                                                   |
|--------------|-----------------------------------------------------------------|-------------------------------------------------------------------|
| `start`      | To the `left` of the content in LTR, and to the `right` in RTL. | From `left` to `right` in LTR, and from `right` to `left` in RTL. |
| `end`        | To the `right` of the content in LTR, and to the `left` in RTL. | From `right` to `left` in LTR, and from `left` to `right` in RTL. |


<!-- Auto Generated Below -->


## Properties

#### side

string

The side the option button should be on.
Possible values: `"start"` and `"end"`.
Defaults to `"end"`.
If you have multiple `ion-item-options`, a side must be provided for each.


## Attributes

#### side

string

The side the option button should be on.
Possible values: `"start"` and `"end"`.
Defaults to `"end"`.
If you have multiple `ion-item-options`, a side must be provided for each.


## Events

#### ionSwipe

Emitted when the item has been fully swiped.


## Methods

#### fireSwipeEvent()


#### isEndSide()


#### width()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
