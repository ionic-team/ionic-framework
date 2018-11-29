# ion-grid


The grid is a powerful mobile-first flexbox system for building custom layouts.

It is composed of three units — a grid, [row(s)](../Row) and [column(s)]((../Col)). Columns will expand to fill the row, and will resize to fit additional columns. It is based on a 12 column layout with different breakpoints based on the screen size. The number of columns can be customized using CSS.

See [Grid Layout](/docs/layout/grid) for more information.

<!-- Auto Generated Below -->


## Usage

### Angular/javascript

```html
<ion-grid>
  <ion-row>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="6">
      ion-col [size="6"]
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="3">
      ion-col [size="3"]
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col size="3">
      ion-col [size="3"]
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="3">
      ion-col [size="3"]
    </ion-col>
    <ion-col size="3" offset="3">
      ion-col [size="3"] [offset="3"]
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
      <br>#
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col align-self-start>
      ion-col [start]
    </ion-col>
    <ion-col align-self-center>
      ion-col [center]
    </ion-col>
    <ion-col align-self-end>
      ion-col [end]
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row align-items-start>
    <ion-col>
      [start] ion-col
    </ion-col>
    <ion-col>
      [start] ion-col
    </ion-col>
    <ion-col align-self-end>
      [start] ion-col [end]
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row align-items-center>
    <ion-col>
      [center] ion-col
    </ion-col>
    <ion-col>
      [center] ion-col
    </ion-col>
    <ion-col>
      [center] ion-col
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row align-items-end>
    <ion-col>
      [end] ion-col
    </ion-col>
    <ion-col align-self-start>
      [end] ion-col [start]
    </ion-col>
    <ion-col>
      [end] ion-col
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="12" size-sm>
      ion-col [size="12"] [size-sm]
    </ion-col>
    <ion-col size="12" size-sm>
      ion-col [size="12"] [size-sm]
    </ion-col>
    <ion-col size="12" size-sm>
      ion-col [size="12"] [size-sm]
    </ion-col>
    <ion-col size="12" size-sm>
      ion-col [size="12"] [size-sm]
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="12" size-md>
      ion-col [size="12"] [size-md]
    </ion-col>
    <ion-col size="12" size-md>
      ion-col [size="12"] [size-md]
    </ion-col>
    <ion-col size="12" size-md>
      ion-col [size="12"] [size-md]
    </ion-col>
    <ion-col size="12" size-md>
      ion-col [size="12"] [size-md]
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="6" size-lg offset="3">
      ion-col [size="6"] [size-lg] [offset="3"]
    </ion-col>
    <ion-col size="3" size-lg>
      ion-col [size="3"] [size-lg]
    </ion-col>
  </ion-row>
</ion-grid>
```



## Properties

| Property | Attribute | Description                                                           | Type      | Default |
| -------- | --------- | --------------------------------------------------------------------- | --------- | ------- |
| `fixed`  | `fixed`   | If `true`, the grid will have a fixed width based on the screen size. | `boolean` | `false` |


## CSS Custom Properties

| Name                    | Description                           |
| ----------------------- | ------------------------------------- |
| `--ion-grid-padding`    | Padding for the Grid                  |
| `--ion-grid-padding-lg` | Padding for the Grid on lg screens    |
| `--ion-grid-padding-md` | Padding for the Grid on md screens    |
| `--ion-grid-padding-sm` | Padding for the Grid on sm screens    |
| `--ion-grid-padding-xl` | Padding for the Grid on xl screens    |
| `--ion-grid-padding-xs` | Padding for the Grid on xs screens    |
| `--ion-grid-width`      | Width of the fixed Grid               |
| `--ion-grid-width-lg`   | Width of the fixed Grid on lg screens |
| `--ion-grid-width-md`   | Width of the fixed Grid on md screens |
| `--ion-grid-width-sm`   | Width of the fixed Grid on sm screens |
| `--ion-grid-width-xl`   | Width of the fixed Grid on xl screens |
| `--ion-grid-width-xs`   | Width of the fixed Grid on xs screens |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
