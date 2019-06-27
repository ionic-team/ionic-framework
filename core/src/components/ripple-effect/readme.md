# ion-ripple-effect

The ripple effect component adds the [Material Design ink ripple interaction effect](https://material.io/develop/web/components/ripples/). This component can be used without a button and can be added to any component.


<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<div>
  <ion-ripple-effect></ion-ripple-effect>
  A plain div with a ripple effect
</div>

<button>
  <ion-ripple-effect></ion-ripple-effect>
  Button
</button>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                                                                                                                         | Type                       | Default     |
| -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------- |
| `type`   | `type`    | Sets the type of ripple-effect:  - `bounded`: the ripple effect expands from the user's click position - `unbounded`: the ripple effect expands from the center of the button and overflows the container.  NOTE: Surfaces for bounded ripples should have the overflow property set to hidden, while surfaces for unbounded ripples should have it set to visible. | `"bounded" \| "unbounded"` | `'bounded'` |


## Methods

### `addRipple(x: number, y: number) => Promise<() => void>`

Adds the ripple effect to the parent element.

#### Returns

Type: `Promise<() => void>`




## Dependencies

### Used by

 - [ion-action-sheet](../action-sheet)
 - [ion-alert](../alert)
 - [ion-back-button](../back-button)
 - [ion-button](../button)
 - [ion-card](../card)
 - [ion-chip](../chip)
 - [ion-fab-button](../fab-button)
 - [ion-item](../item)
 - [ion-item-option](../item-option)
 - [ion-menu-button](../menu-button)
 - [ion-segment-button](../segment-button)
 - [ion-tab-button](../tab-button)
 - [ion-toast](../toast)

### Graph
```mermaid
graph TD;
  ion-action-sheet --> ion-ripple-effect
  ion-alert --> ion-ripple-effect
  ion-back-button --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  ion-card --> ion-ripple-effect
  ion-chip --> ion-ripple-effect
  ion-fab-button --> ion-ripple-effect
  ion-item --> ion-ripple-effect
  ion-item-option --> ion-ripple-effect
  ion-menu-button --> ion-ripple-effect
  ion-segment-button --> ion-ripple-effect
  ion-tab-button --> ion-ripple-effect
  ion-toast --> ion-ripple-effect
  style ion-ripple-effect fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
