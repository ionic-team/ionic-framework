# ion-range

The Range slider lets users select from a range of values by moving
the slider knob. It can accept dual knobs, but by default one knob
controls the value of the range.

## Range Labels

Labels can be placed on either side of the range by adding the
`slot="start"` or `slot="end"` to the element. The element doesn't have to
be an `ion-label`, it can be added to any element to place it to the
left or right of the range.

## Custom Pin Formatters

When using a pin, the default behavior is to round the value that gets displayed using `Math.round()`. This behavior can be customized by passing in a formatter function to the `pinFormatter` property. See the [Usage](#usage) section for an example.

## Interfaces

### RangeChangeEventDetail

```typescript
interface RangeChangeEventDetail {
  value: RangeValue;
}
```

### RangeCustomEvent

While not required, this interface can be used in place of the `CustomEvent` interface for stronger typing with Ionic events emitted from this component.

```typescript
interface RangeCustomEvent extends CustomEvent {
  detail: RangeChangeEventDetail;
  target: HTMLIonRangeElement;
}
```

## Types

### RangeValue

```typescript
type RangeValue = number | { lower: number, upper: number };
```

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-list>
  <ion-item>
    <ion-range color="danger" [pin]="true"></ion-range>
  </ion-item>

  <ion-item>
    <ion-range min="-200" max="200" color="secondary">
      <ion-label slot="start">-200</ion-label>
      <ion-label slot="end">200</ion-label>
    </ion-range>
  </ion-item>

  <ion-item>
    <ion-range min="20" max="80" step="2">
      <ion-icon size="small" slot="start" name="sunny"></ion-icon>
      <ion-icon slot="end" name="sunny"></ion-icon>
    </ion-range>
  </ion-item>

  <ion-item>
    <ion-range min="1000" max="2000" step="100" snaps="true" color="secondary"></ion-range>
  </ion-item>

  <ion-item>
    <ion-range min="1000" max="2000" step="100" snaps="true" ticks="false" color="secondary"></ion-range>
  </ion-item>

  <ion-item>
    <ion-range dualKnobs="true" min="21" max="72" step="3" snaps="true"></ion-range>
  </ion-item>
  
  <ion-item>
    <ion-range min="0" max="100" [pinFormatter]="customFormatter" [pin]="true"></ion-range>
  </ion-item>
</ion-list>
```

```typescript
import { Component } from '@angular/core';

@Component({…})
export class MyComponent {
  constructor() {}
  
  public customFormatter(value: number) {
    return `${value}%`
  }
}
```


### Javascript

```html
<ion-list>
  <ion-item>
    <ion-range color="danger" pin="true"></ion-range>
  </ion-item>

  <ion-item>
    <ion-range min="-200" max="200" color="secondary">
      <ion-label slot="start">-200</ion-label>
      <ion-label slot="end">200</ion-label>
    </ion-range>
  </ion-item>

  <ion-item>
    <ion-range min="20" max="80" step="2">
      <ion-icon size="small" slot="start" name="sunny"></ion-icon>
      <ion-icon slot="end" name="sunny"></ion-icon>
    </ion-range>
  </ion-item>

  <ion-item>
    <ion-range min="1000" max="2000" step="100" snaps="true" color="secondary"></ion-range>
  </ion-item>

  <ion-item>
    <ion-range min="1000" max="2000" step="100" snaps="true" ticks="false" color="secondary"></ion-range>
  </ion-item>

  <ion-item>
    <ion-range dual-knobs="true" min="21" max="72" step="3" snaps="true"></ion-range>
  </ion-item>
  
  <ion-item>
    <ion-range min="0" max="100" pin="true" id="custom-range"></ion-range>
  </ion-item>
</ion-list>

<script>
  const customRange = document.querySelector('#custom-range');
  customRange.pinFormatter = (value) => `${value}%`; 
</script>
```


### React

```tsx
import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonRange, IonLabel, IonIcon, IonItemDivider } from '@ionic/react';
import { sunny } from 'ionicons/icons';
import { RangeValue } from '@ionic/core';

export const RangeExamples: React.FC = () => {

  const [value, setValue] = useState(0);
  const [rangeValue, setRangeValue] = useState<{
    lower: number;
    upper: number;
  }>({ lower: 0, upper: 0 });
  
  const customFormatter = (value: number) => `${value}%`;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>IonRange Examples</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItemDivider>Default</IonItemDivider>
          <IonItem>
            <IonRange pin={true} value={value} onIonChange={e => setValue(e.detail.value as number)} />
          </IonItem>
          <IonItem>
            <IonLabel>Value: {value}</IonLabel>
          </IonItem>

          <IonItemDivider>Min & Max</IonItemDivider>
          <IonItem>
            <IonRange min={-200} max={200} color="secondary">
              <IonLabel slot="start">-200</IonLabel>
              <IonLabel slot="end">200</IonLabel>
            </IonRange>
          </IonItem>

          <IonItemDivider>Icons</IonItemDivider>
          <IonItem>
            <IonRange min={20} max={80} step={2}>
              <IonIcon size="small" slot="start" icon={sunny} />
              <IonIcon slot="end" icon={sunny} />
            </IonRange>
          </IonItem>

          <IonItemDivider>With Snaps & Ticks</IonItemDivider>
          <IonItem>
            <IonRange min={1000} max={2000} step={100} snaps={true} color="secondary" />
          </IonItem>

          <IonItemDivider>With Snaps & No Ticks</IonItemDivider>
          <IonItem>
            <IonRange min={1000} max={2000} step={100} snaps={true} ticks={false} color="secondary" />
          </IonItem>

          <IonItemDivider>Dual Knobs</IonItemDivider>
          <IonItem>
            <IonRange dualKnobs={true} min={0} max={60} step={3} snaps={true} onIonChange={e => setRangeValue(e.detail.value as any)} />
          </IonItem>
          <IonItem>
            <IonLabel>Value: lower: {rangeValue.lower} upper: {rangeValue.upper}</IonLabel>
          </IonItem>
          
          <IonItem>
            <IonRange min={0} max={100} pinFormatter={customFormatter} pin={true}></IonRange>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'range-example',
  styleUrl: 'range-example.css'
})
export class RangeExample {
  private customFormatter = (value: number) => `${value}%`;
  
  render() {
    return [
      <ion-list>
        <ion-item>
          <ion-range color="danger" pin={true}></ion-range>
        </ion-item>

        <ion-item>
          <ion-range min={-200} max={200} color="secondary">
            <ion-label slot="start">-200</ion-label>
            <ion-label slot="end">200</ion-label>
          </ion-range>
        </ion-item>

        <ion-item>
          <ion-range min={20} max={80} step={2}>
            <ion-icon size="small" slot="start" name="sunny"></ion-icon>
            <ion-icon slot="end" name="sunny"></ion-icon>
          </ion-range>
        </ion-item>

        <ion-item>
          <ion-range min={1000} max={2000} step={100} snaps={true} color="secondary"></ion-range>
        </ion-item>

        <ion-item>
          <ion-range min={1000} max={2000} step={100} snaps={true} ticks={false} color="secondary"></ion-range>
        </ion-item>

        <ion-item>
          <ion-range dualKnobs={true} min={21} max={72} step={3} snaps={true}></ion-range>
        </ion-item>
        
        <ion-item>
          <ion-range min="0" max="100" pinFormatter={this.customFormatter} pin={true}></ion-range>
        </ion-item>
      </ion-list>
    ];
  }
}
```


### Vue

```html
<template>
  <ion-list>
    <ion-item>
      <ion-range color="danger" :pin="true"></ion-range>
    </ion-item>

    <ion-item>
      <ion-range min="-200" max="200" color="secondary">
        <ion-label slot="start">-200</ion-label>
        <ion-label slot="end">200</ion-label>
      </ion-range>
    </ion-item>

    <ion-item>
      <ion-range min="20" max="80" step="2">
        <ion-icon size="small" slot="start" name="sunny"></ion-icon>
        <ion-icon slot="end" name="sunny"></ion-icon>
      </ion-range>
    </ion-item>

    <ion-item>
      <ion-range min="1000" max="2000" step="100" snaps="true" color="secondary"></ion-range>
    </ion-item>

    <ion-item>
      <ion-range min="1000" max="2000" step="100" snaps="true" ticks="false" color="secondary"></ion-range>
    </ion-item>

    <ion-item>
      <ion-range ref="rangeDualKnobs" dual-knobs="true" min="21" max="72" step="3" snaps="true"></ion-range>
    </ion-item>
    
    <ion-item>
      <ion-range min="0" max="100" :pin-formatter="customFormatter" :pin="true"></ion-range>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonList, IonRange } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {  IonItem, IonLabel, IonList, IonRange },
  mounted() {
    // Sets initial value for dual-knob ion-range
    this.$refs.rangeDualKnobs.value = { lower: 24, upper: 42 };
  },
  setup() {
    const customFormatter = (value: number) => `${value}%`;
    
    return { customFormatter };
  }
});
</script>
```



## Properties

| Property       | Attribute    | Description                                                                                                                                                                                                                                                            | Type                                          | Default                                        |
| -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| `color`        | `color`      | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                         | `undefined`                                    |
| `debounce`     | `debounce`   | How long, in milliseconds, to wait to trigger the `ionChange` event after each change in the range value. This also impacts form bindings such as `ngModel` or `v-model`.                                                                                              | `number`                                      | `0`                                            |
| `disabled`     | `disabled`   | If `true`, the user cannot interact with the range.                                                                                                                                                                                                                    | `boolean`                                     | `false`                                        |
| `dualKnobs`    | `dual-knobs` | Show two knobs.                                                                                                                                                                                                                                                        | `boolean`                                     | `false`                                        |
| `max`          | `max`        | Maximum integer value of the range.                                                                                                                                                                                                                                    | `number`                                      | `100`                                          |
| `min`          | `min`        | Minimum integer value of the range.                                                                                                                                                                                                                                    | `number`                                      | `0`                                            |
| `mode`         | `mode`       | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                               | `undefined`                                    |
| `name`         | `name`       | The name of the control, which is submitted with the form data.                                                                                                                                                                                                        | `string`                                      | `''`                                           |
| `pin`          | `pin`        | If `true`, a pin with integer value is shown when the knob is pressed.                                                                                                                                                                                                 | `boolean`                                     | `false`                                        |
| `pinFormatter` | --           | A callback used to format the pin text. By default the pin text is set to `Math.round(value)`.                                                                                                                                                                         | `(value: number) => string \| number`         | `(value: number): number => Math.round(value)` |
| `snaps`        | `snaps`      | If `true`, the knob snaps to tick marks evenly spaced based on the step property value.                                                                                                                                                                                | `boolean`                                     | `false`                                        |
| `step`         | `step`       | Specifies the value granularity.                                                                                                                                                                                                                                       | `number`                                      | `1`                                            |
| `ticks`        | `ticks`      | If `true`, tick marks are displayed based on the step value. Only applies when `snaps` is `true`.                                                                                                                                                                      | `boolean`                                     | `true`                                         |
| `value`        | `value`      | the value of the range.                                                                                                                                                                                                                                                | `number \| { lower: number; upper: number; }` | `0`                                            |


## Events

| Event       | Description                                  | Type                                  |
| ----------- | -------------------------------------------- | ------------------------------------- |
| `ionBlur`   | Emitted when the range loses focus.          | `CustomEvent<void>`                   |
| `ionChange` | Emitted when the value property has changed. | `CustomEvent<RangeChangeEventDetail>` |
| `ionFocus`  | Emitted when the range has focus.            | `CustomEvent<void>`                   |


## Slots

| Slot      | Description                                                                        |
| --------- | ---------------------------------------------------------------------------------- |
| `"end"`   | Content is placed to the right of the range slider in LTR, and to the left in RTL. |
| `"start"` | Content is placed to the left of the range slider in LTR, and to the right in RTL. |


## Shadow Parts

| Part            | Description                                |
| --------------- | ------------------------------------------ |
| `"bar"`         | The inactive part of the bar.              |
| `"bar-active"`  | The active part of the bar.                |
| `"knob"`        | The handle that is used to drag the range. |
| `"pin"`         | The counter that appears above a knob.     |
| `"tick"`        | An inactive tick mark.                     |
| `"tick-active"` | An active tick mark.                       |


## CSS Custom Properties

| Name                      | Description                        |
| ------------------------- | ---------------------------------- |
| `--bar-background`        | Background of the range bar        |
| `--bar-background-active` | Background of the active range bar |
| `--bar-border-radius`     | Border radius of the range bar     |
| `--bar-height`            | Height of the range bar            |
| `--height`                | Height of the range                |
| `--knob-background`       | Background of the range knob       |
| `--knob-border-radius`    | Border radius of the range knob    |
| `--knob-box-shadow`       | Box shadow of the range knob       |
| `--knob-size`             | Size of the range knob             |
| `--pin-background`        | Background of the range pin        |
| `--pin-color`             | Color of the range pin             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
