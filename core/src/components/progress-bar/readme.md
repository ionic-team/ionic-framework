# ion-progress-bar

ion-progress-bar is a horizontal progress bar to visualize the progression of an operation and activity. You can choose between two types: `determinate` and `indeterminate`.

## Progress Type

### Determinate

If the percentage of an operation is known, you should use the determinate type. This is the default type and the progress is represented by the `value` property.

A buffer shows circles as animation to indicate some activity. If the `buffer` property is smaller than 1 you can show the addditional buffering progress. 

### Indeterminate

If an operation is in progress and it's not necessary to indicate how long it will take.

If you add `reversed="true"`, you receive a query which is used to indicate pre-loading.

<!-- Auto Generated Below -->


## Usage

### Javascript

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

export const ProgressbarExample: React.FunctionComponent = () => (
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



## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                               | Default         |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------- |
| `buffer`   | `buffer`   | If the buffer and value are smaller than 1, the buffer circles will show. The buffer should be between [0, 1].                                                                                                                                                         | `number`                           | `1`             |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`              | `undefined`     |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                    | `undefined`     |
| `reversed` | `reversed` | If true, reverse the progress bar direction.                                                                                                                                                                                                                           | `boolean`                          | `false`         |
| `type`     | `type`     | The state of the progress bar, based on if the time the process takes is known or not. Default options are: `"determinate"` (no animation), `"indeterminate"` (animate from left to right).                                                                            | `"determinate" \| "indeterminate"` | `'determinate'` |
| `value`    | `value`    | The value determines how much of the active bar should display when the `type` is `"determinate"`. The value should be between [0, 1].                                                                                                                                 | `number`                           | `0`             |


## CSS Custom Properties

| Name                    | Description                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `--background`          | Same as --buffer-background when using a determinate progress bar, otherwise it styles the background of the ion-progress-bar itself. |
| `--buffer-background`   | Color of the buffer bar                                                                                                               |
| `--progress-background` | Color of the progress bar                                                                                                             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
