# ion-checkbox

Checkboxes allow the selection of multiple options from a set of options. They appear as checked (ticked) when activated. Clicking on a checkbox will toggle the `checked` property. They can also be checked programmatically by setting the `checked` property.




<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default Checkbox -->
<ion-checkbox></ion-checkbox>

<!-- Disabled Checkbox -->
<ion-checkbox disabled="true"></ion-checkbox>

<!-- Checked Checkbox -->
<ion-checkbox checked="true"></ion-checkbox>

<!-- Checkbox Colors -->
<ion-checkbox color="primary"></ion-checkbox>
<ion-checkbox color="secondary"></ion-checkbox>
<ion-checkbox color="danger"></ion-checkbox>
<ion-checkbox color="light"></ion-checkbox>
<ion-checkbox color="dark"></ion-checkbox>

<!-- Checkboxes in a List -->
<ion-list>
  <ion-item *ngFor="let entry of form">
    <ion-label>{{entry.val}}</ion-label>
    <ion-checkbox slot="end" [(ngModel)]="entry.isChecked"></ion-checkbox>
  </ion-item>
</ion-list>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  public form = [
      { val: 'Pepperoni', isChecked: true },
      { val: 'Sausage', isChecked: false },
      { val: 'Mushroom', isChecked: false }
    ];
}
```


### Javascript

```html
<!-- Default Checkbox -->
<ion-checkbox></ion-checkbox>

<!-- Disabled Checkbox -->
<ion-checkbox disabled></ion-checkbox>

<!-- Checked Checkbox -->
<ion-checkbox checked></ion-checkbox>

<!-- Checkbox Colors -->
<ion-checkbox color="primary"></ion-checkbox>
<ion-checkbox color="secondary"></ion-checkbox>
<ion-checkbox color="danger"></ion-checkbox>
<ion-checkbox color="light"></ion-checkbox>
<ion-checkbox color="dark"></ion-checkbox>

<!-- Checkboxes in a List -->
<ion-list>
  <ion-item>
    <ion-label>Pepperoni</ion-label>
    <ion-checkbox slot="end" value="pepperoni" checked></ion-checkbox>
  </ion-item>

  <ion-item>
    <ion-label>Sausage</ion-label>
    <ion-checkbox slot="end" value="sausage" disabled></ion-checkbox>
  </ion-item>

  <ion-item>
    <ion-label>Mushrooms</ion-label>
    <ion-checkbox slot="end" value="mushrooms"></ion-checkbox>
  </ion-item>
</ion-list>
```


### React

```tsx
import React from 'react';
import { IonCheckbox, IonList, IonItem, IonLabel, IonContent } from '@ionic/react';

const form = [
  { val: 'Pepperoni', isChecked: true },
  { val: 'Sausage', isChecked: false },
  { val: 'Mushroom', isChecked: false }
];

export const CheckboxExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default Checkbox --*/}
    <IonCheckbox />

    {/*-- Disabled Checkbox --*/}
    <IonCheckbox disabled={true} />

    {/*-- Checked Checkbox --*/}
    <IonCheckbox checked={true} />

    {/*-- Checkbox Colors --*/}
    <IonCheckbox color="primary" />
    <IonCheckbox color="secondary" />
    <IonCheckbox color="danger" />
    <IonCheckbox color="light" />
    <IonCheckbox color="dark" />

    {/*-- Checkboxes in a List --*/}
    <IonList>
      { form.map(({val, isChecked}) => (
        <IonItem key={val}>
          <IonLabel>{val}</IonLabel>
          <IonCheckbox slot="end" value={val} checked={isChecked} />
        </IonItem>
      )) }
    </IonList>
  </IonContent>
);
```


### Vue

```html
<template>
  <!-- Default Checkbox -->
  <ion-checkbox></ion-checkbox>

  <!-- Disabled Checkbox -->
  <ion-checkbox disabled="true"></ion-checkbox>

  <!-- Checked Checkbox -->
  <ion-checkbox checked="true"></ion-checkbox>

  <!-- Checkbox Colors -->
  <ion-checkbox color="primary"></ion-checkbox>
  <ion-checkbox color="secondary"></ion-checkbox>
  <ion-checkbox color="danger"></ion-checkbox>
  <ion-checkbox color="light"></ion-checkbox>
  <ion-checkbox color="dark"></ion-checkbox>

  <!-- Checkboxes in a List -->
  <ion-list>
    <ion-item v-for="entry in form">
      <ion-label>{{entry.val}}</ion-label>
      <ion-checkbox slot="end" v-on:input="entry.checked = $event.target.value" v-bind:value="entry.isChecked"></ion-checkbox>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    form = [
      { val: 'Pepperoni', isChecked: true },
      { val: 'Sausage', isChecked: false },
      { val: 'Mushroom', isChecked: false }
    ];
  }
</script>
```



## Properties

| Property        | Attribute       | Description                                                                                                                                                                                                                                                            | Type                  | Default        |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------- |
| `checked`       | `checked`       | If `true`, the checkbox is selected.                                                                                                                                                                                                                                   | `boolean`             | `false`        |
| `color`         | `color`         | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined`    |
| `disabled`      | `disabled`      | If `true`, the user cannot interact with the checkbox.                                                                                                                                                                                                                 | `boolean`             | `false`        |
| `indeterminate` | `indeterminate` | If `true`, the checkbox will visually appear as indeterminate.                                                                                                                                                                                                         | `boolean`             | `false`        |
| `mode`          | `mode`          | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined`    |
| `name`          | `name`          | The name of the control, which is submitted with the form data.                                                                                                                                                                                                        | `string`              | `this.inputId` |
| `value`         | `value`         | The value of the toggle does not mean if it's checked or not, use the `checked` property for that.  The value of a toggle is analogous to the value of a `<input type="checkbox">`, it's only used when the toggle participates in a native `<form>`.                  | `string`              | `'on'`         |


## Events

| Event       | Description                                    | Type                                     |
| ----------- | ---------------------------------------------- | ---------------------------------------- |
| `ionBlur`   | Emitted when the toggle loses focus.           | `CustomEvent<void>`                      |
| `ionChange` | Emitted when the checked property has changed. | `CustomEvent<CheckboxChangeEventDetail>` |
| `ionFocus`  | Emitted when the toggle has focus.             | `CustomEvent<void>`                      |


## CSS Custom Properties

| Name                     | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `--background`           | Background of the checkbox icon                |
| `--background-checked`   | Background of the checkbox icon when checked   |
| `--border-color`         | Border color of the checkbox icon              |
| `--border-color-checked` | Border color of the checkbox icon when checked |
| `--border-radius`        | Border radius of the checkbox icon             |
| `--border-style`         | Border style of the checkbox icon              |
| `--border-width`         | Border width of the checkbox icon              |
| `--checkmark-color`      | Color of the checkbox checkmark when checked   |
| `--size`                 | Size of the checkbox icon                      |
| `--transition`           | Transition of the checkbox icon                |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
