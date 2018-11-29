# ion-item-divider

Item Dividers are block elements that can be used to separate items in a list. They are similar to list headers, but instead of being placed at the top of a list, they should go in between groups of like items.

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-item-divider>
  <ion-label>
    Basic Item Divider
  </ion-label>
</ion-item-divider>

<ion-item-divider color="secondary">
  <ion-label>
    Secondary Item Divider
  </ion-label>
</ion-item-divider>

<!-- Item Dividers in a List -->
<ion-list>
  <ion-item-divider>
    <ion-label>
      Section A
    </ion-label>
  </ion-item-divider>

  <ion-item><ion-label>A1</ion-label></ion-item>
  <ion-item><ion-label>A2</ion-label></ion-item>
  <ion-item><ion-label>A3</ion-label></ion-item>
  <ion-item><ion-label>A4</ion-label></ion-item>
  <ion-item><ion-label>A5</ion-label></ion-item>

  <ion-item-divider>
    <ion-label>
      Section B
    </ion-label>
  </ion-item-divider>

  <ion-item><ion-label>B1</ion-label></ion-item>
  <ion-item><ion-label>B2</ion-label></ion-item>
  <ion-item><ion-label>B3</ion-label></ion-item>
  <ion-item><ion-label>B4</ion-label></ion-item>
  <ion-item><ion-label>B5</ion-label></ion-item>
</ion-list>
```


### Javascript

```html
<ion-item-divider>
  <ion-label>
    Basic Item Divider
  </ion-label>
</ion-item-divider>

<ion-item-divider color="secondary">
  <ion-label>
    Secondary Item Divider
  </ion-label>
</ion-item-divider>

<!-- Item Dividers in a List -->
<ion-list>
  <ion-item-divider>
    <ion-label>
      Section A
    </ion-label>
  </ion-item-divider>

  <ion-item><ion-label>A1</ion-label></ion-item>
  <ion-item><ion-label>A2</ion-label></ion-item>
  <ion-item><ion-label>A3</ion-label></ion-item>
  <ion-item><ion-label>A4</ion-label></ion-item>
  <ion-item><ion-label>A5</ion-label></ion-item>

  <ion-item-divider>
    <ion-label>
      Section B
    </ion-label>
  </ion-item-divider>

  <ion-item><ion-label>B1</ion-label></ion-item>
  <ion-item><ion-label>B2</ion-label></ion-item>
  <ion-item><ion-label>B3</ion-label></ion-item>
  <ion-item><ion-label>B4</ion-label></ion-item>
  <ion-item><ion-label>B5</ion-label></ion-item>
</ion-list>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`  | `color`   | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `mode`   | `mode`    | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |


## CSS Custom Properties

| Name               | Description                        |
| ------------------ | ---------------------------------- |
| `--background`     | Background of the item divider     |
| `--color`          | Color of the item divider          |
| `--padding-bottom` | Bottom padding of the item divider |
| `--padding-end`    | End padding of the item divider    |
| `--padding-start`  | Start padding of the item divider  |
| `--padding-top`    | Top padding of the item divider    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
