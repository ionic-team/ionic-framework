# ion-progress-bar

Progress bars inform users about the status of ongoing processes, such as loading an app, submitting a form, or saving updates. There are two types of progress bars: `determinate` and `indeterminate`.

## Progress Type

### Determinate

Determinate is the default type. It should be used when the percentage of an operation is known. The progress is represented by setting the `value` property. This can be used to show the progress increasing from 0 to 100% of the track.

If the `buffer` property is set, a buffer stream will show with animated circles to indicate activity. The value of the `buffer` property will also be represented by how much visible track there is. If the value of `buffer` is less than the `value` property, there will be no visible track. If `buffer` is equal to `1` then the buffer stream will be hidden.

### Indeterminate

The indeterminate type should be used when it is unknown how long the process will take. The progress bar is not tied to the `value`, instead it continually slides along the track until the process is complete.

<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<!-- Default Progressbar -->
<ion-progress-bar></ion-progress-bar>

<!-- Default Progressbar with 50 percent -->
<ion-progress-bar value="0.5"></ion-progress-bar>

<!-- Colorize Progressbar -->
<ion-progress-bar color="primary" value="0.5"></ion-progress-bar>
<ion-progress-bar color="secondary" value="0.5"></ion-progress-bar>

<!-- Other types -->
<ion-progress-bar value="0.25" buffer="0.5"></ion-progress-bar>
<ion-progress-bar type="indeterminate"></ion-progress-bar>
<ion-progress-bar type="indeterminate" reversed="true"></ion-progress-bar>
```


### React

```tsx
import React from 'react';
import { IonProgressBar, IonContent } from '@ionic/react';

export const ProgressbarExample: React.FC = () => (
  <IonContent>
    {/*-- Default Progressbar --*/}
    <IonProgressBar></IonProgressBar><br />

    {/*-- Default Progressbar with 50 percent --*/}
    <IonProgressBar value={0.5}></IonProgressBar><br />

    {/*-- Colorize Progressbar --*/}
    <IonProgressBar color="primary" value={0.5}></IonProgressBar><br />
    <IonProgressBar color="secondary" value={0.5}></IonProgressBar><br />

    {/*-- Other types --*/}
    <IonProgressBar value={0.25} buffer={0.5}></IonProgressBar><br />
    <IonProgressBar type="indeterminate"></IonProgressBar><br />
    <IonProgressBar type="indeterminate" reversed={true}></IonProgressBar><br />
  </IonContent>
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'progress-bar-example',
  styleUrl: 'progress-bar-example.css'
})
export class ProgressBarExample {
  render() {
    return [
      // Default Progressbar
      <ion-progress-bar></ion-progress-bar>,

      // Default Progressbar with 50 percent
      <ion-progress-bar value={0.5}></ion-progress-bar>,

      // Colorize Progressbar
      <ion-progress-bar color="primary" value={0.5}></ion-progress-bar>,
      <ion-progress-bar color="secondary" value={0.5}></ion-progress-bar>,

      // Other types
      <ion-progress-bar value={0.25} buffer={0.5}></ion-progress-bar>,
      <ion-progress-bar type="indeterminate"></ion-progress-bar>,
      <ion-progress-bar type="indeterminate" reversed={true}></ion-progress-bar>
    ];
  }
}
```


### Vue

```html
<template>
  <!-- Default Progressbar -->
  <ion-progress-bar></ion-progress-bar>

  <!-- Default Progressbar with 50 percent -->
  <ion-progress-bar value="0.5"></ion-progress-bar>

  <!-- Colorize Progressbar -->
  <ion-progress-bar color="primary" value="0.5"></ion-progress-bar>
  <ion-progress-bar color="secondary" value="0.5"></ion-progress-bar>

  <!-- Other types -->
  <ion-progress-bar value="0.25" buffer="0.5"></ion-progress-bar>
  <ion-progress-bar type="indeterminate"></ion-progress-bar>
  <ion-progress-bar type="indeterminate" reversed="true"></ion-progress-bar>
</template>

<script>
import { IonProgressBar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonProgressBar }
});
</script>
```



## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                               | Default         |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------- |
| `buffer`   | `buffer`   | If the buffer and value are smaller than 1, the buffer circles will show. The buffer should be between [0, 1].                                                                                                                                                         | `number`                           | `1`             |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`              | `undefined`     |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                    | `undefined`     |
| `reversed` | `reversed` | If true, reverse the progress bar direction.                                                                                                                                                                                                                           | `boolean`                          | `false`         |
| `type`     | `type`     | The state of the progress bar, based on if the time the process takes is known or not. Default options are: `"determinate"` (no animation), `"indeterminate"` (animate from left to right).                                                                            | `"determinate" \| "indeterminate"` | `'determinate'` |
| `value`    | `value`    | The value determines how much of the active bar should display when the `type` is `"determinate"`. The value should be between [0, 1].                                                                                                                                 | `number`                           | `0`             |


## Shadow Parts

| Part         | Description                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"progress"` | The progress bar that shows the current value when `type` is `"determinate"` and slides back and forth when `type` is `"indeterminate"`.                |
| `"stream"`   | The animated circles that appear while buffering. This only shows when `buffer` is set and `type` is `"determinate"`.                                   |
| `"track"`    | The track bar behind the progress bar. If the `buffer` property is set and `type` is `"determinate"` the track will be the width of the `buffer` value. |


## CSS Custom Properties

| Name                    | Description                                                            |
| ----------------------- | ---------------------------------------------------------------------- |
| `--background`          | Background of the progress track, or the buffer bar if `buffer` is set |
| `--buffer-background`   | DEPRECATED, use `--background` instead                                 |
| `--progress-background` | Background of the progress bar representing the current value          |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
