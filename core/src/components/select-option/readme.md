# ion-select-option

Select Options are components that are child elements of a Select. Each option defined is passed and displayed in the Select dialog. For more information, see the [Select docs](../select).

## Customization

Each `ion-select-option` component that is added as a child of an `ion-select` is passed to the interface to display it in the dialog. It's important to note that the `ion-select-option` element itself is hidden from the view. This means that attempting to style it will not have any effect on the option in the dialog:

```css
/* DOES NOT work */
ion-select-option {
  color: red;
}
```

Instead, each interface option has the class `.select-interface-option` which can be styled. Keep in mind that due to the overlays being scoped components the selector by itself will not work and a custom `cssClass` is recommended to be passed to the interface.

```css
/* This will NOT work on its own */
.select-interface-option {
  color: red;
}

/*
 * "my-custom-interface" needs to be passed in through
 * the cssClass of the interface options for this to work
 */
.my-custom-interface .select-interface-option {
  color: red;
}
```

> Note: Some interfaces require more in depth styling due to how the options are rendered. See usage for expanded information on this.

The options can be styled individually by adding your own class on the `ion-select-option` which gets passed to the interface option. See the [Usage](#usage) section below for examples of styling and setting individual classes on options.


<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<ion-item>
  <ion-label>Select</ion-label>
  <ion-select>
    <ion-select-option value="brown">Brown</ion-select-option>
    <ion-select-option value="blonde">Blonde</ion-select-option>
    <ion-select-option value="black">Black</ion-select-option>
    <ion-select-option value="red">Red</ion-select-option>
  </ion-select>
</ion-item>
```

### Customizing Options

```html
<ion-item>
  <ion-label>Select: Alert Interface</ion-label>
  <ion-select class="custom-options">
    <ion-select-option value="brown">Brown</ion-select-option>
    <ion-select-option value="blonde">Blonde</ion-select-option>
    <ion-select-option value="black">Black</ion-select-option>
    <ion-select-option value="red">Red</ion-select-option>
  </ion-select>
</ion-item>

<ion-item>
  <ion-label>Select: Alert Interface (Multiple Selection)</ion-label>
  <ion-select class="custom-options" multiple="true">
    <ion-select-option value="brown">Brown</ion-select-option>
    <ion-select-option value="blonde">Blonde</ion-select-option>
    <ion-select-option value="black">Black</ion-select-option>
    <ion-select-option value="red">Red</ion-select-option>
  </ion-select>
</ion-item>

<ion-item>
  <ion-label>Select: Popover Interface</ion-label>
  <ion-select interface="popover" class="custom-options">
    <ion-select-option value="brown">Brown</ion-select-option>
    <ion-select-option value="blonde">Blonde</ion-select-option>
    <ion-select-option value="black">Black</ion-select-option>
    <ion-select-option value="red">Red</ion-select-option>
  </ion-select>
</ion-item>

<ion-item>
  <ion-label>Select: Action Sheet Interface</ion-label>
  <ion-select interface="action-sheet" class="custom-options">
    <ion-select-option value="brown">Brown</ion-select-option>
    <ion-select-option value="blonde">Blonde</ion-select-option>
    <ion-select-option value="black">Black</ion-select-option>
    <ion-select-option value="red">Red</ion-select-option>
  </ion-select>
</ion-item>
```

```css
/* Popover Interface: set color for the popover using Item's CSS variables */
.my-custom-interface .select-interface-option {
  --color: #971e49;
  --color-hover: #79193b;
}

/* Action Sheet Interface: set color for the action sheet using its button CSS variables */
.my-custom-interface .select-interface-option {
  --button-color: #971e49;
  --button-color-hover: #79193b;
}

/* Alert Interface: set color for alert options (single selection) */
.my-custom-interface .select-interface-option .alert-radio-label {
  color: #971e49;
}

/* Alert Interface: set color for alert options (multiple selection) */
.my-custom-interface .select-interface-option .alert-checkbox-label {
  color: #971e49;
}

/* Alert Interface: set color for checked alert options (single selection) */
.my-custom-interface .select-interface-option[aria-checked=true] .alert-radio-label {
  color: #79193b;
}

/* Alert Interface: set color for checked alert options (multiple selection) */
.my-custom-interface .select-interface-option[aria-checked=true] .alert-checkbox-label {
  color: #79193b;
}
```

```javascript
// Pass a custom class to each select interface for styling
const selects = document.querySelectorAll('.custom-options');

for (var i = 0; i < selects.length; i++) {
  selects[i].interfaceOptions = {
    cssClass: 'my-custom-interface'
  };
};
```

> Note: In the CSS examples, some of the selectors could be combined together, but are separated out in order to better explain what each selector is for.

### Customizing Individual Options

To customize an individual option, set a class on the `ion-select-option`:

```html
<ion-item>
  <ion-label>Select</ion-label>
  <ion-select class="custom-options" interface="popover">
    <ion-select-option value="brown" class="brown-option">Brown</ion-select-option>
    <ion-select-option value="blonde">Blonde</ion-select-option>
    <ion-select-option value="black">Black</ion-select-option>
    <ion-select-option value="red">Red</ion-select-option>
  </ion-select>
</ion-item>
```

```css
/* Popover Interface: set color for the popover using Item's CSS variables */
.my-custom-interface .brown-option {
  --color: #5e3e2c;
  --color-hover: #362419;
}
```

```javascript
// Pass a custom class to each select interface for styling
const select = document.querySelector('.custom-options');
select.interfaceOptions = {
  cssClass: 'my-custom-interface'
};
```


### React

```tsx
import React from 'react';
import { IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonPage } from '@ionic/react';

export const SelectOptionExample: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonItem>
          <IonLabel>Select</IonLabel>
          <IonSelect>
            <IonSelectOption value="brown">Brown</IonSelectOption>
            <IonSelectOption value="blonde">Blonde</IonSelectOption>
            <IonSelectOption value="black">Black</IonSelectOption>
            <IonSelectOption value="red">Red</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};
```

### Customizing Options

```tsx
import React from 'react';
import { IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonPage } from '@ionic/react';

const options = {
  cssClass: 'my-custom-interface'
};

export const SelectOptionExample: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonItem>
          <IonLabel>Select: Alert Interface</IonLabel>
          <IonSelect interfaceOptions={options}>
            <IonSelectOption value="brown">Brown</IonSelectOption>
            <IonSelectOption value="blonde">Blonde</IonSelectOption>
            <IonSelectOption value="black">Black</IonSelectOption>
            <IonSelectOption value="red">Red</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Select: Alert Interface (Multiple Selection)</IonLabel>
          <IonSelect interfaceOptions={options} multiple={true}>
            <IonSelectOption value="brown">Brown</IonSelectOption>
            <IonSelectOption value="blonde">Blonde</IonSelectOption>
            <IonSelectOption value="black">Black</IonSelectOption>
            <IonSelectOption value="red">Red</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Select: Popover Interface</IonLabel>
          <IonSelect interface="popover" interfaceOptions={options}>
            <IonSelectOption value="brown">Brown</IonSelectOption>
            <IonSelectOption value="blonde">Blonde</IonSelectOption>
            <IonSelectOption value="black">Black</IonSelectOption>
            <IonSelectOption value="red">Red</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Select: Action Sheet Interface</IonLabel>
          <IonSelect interface="action-sheet" interfaceOptions={options}>
            <IonSelectOption value="brown">Brown</IonSelectOption>
            <IonSelectOption value="blonde">Blonde</IonSelectOption>
            <IonSelectOption value="black">Black</IonSelectOption>
            <IonSelectOption value="red">Red</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};
```

```css
/* Popover Interface: set color for the popover using Item's CSS variables */
.my-custom-interface .select-interface-option {
  --color: #971e49;
  --color-hover: #79193b;
}

/* Action Sheet Interface: set color for the action sheet using its button CSS variables */
.my-custom-interface .select-interface-option {
  --button-color: #971e49;
  --button-color-hover: #79193b;
}

/* Alert Interface: set color for alert options (single selection) */
.my-custom-interface .select-interface-option .alert-radio-label {
  color: #971e49;
}

/* Alert Interface: set color for alert options (multiple selection) */
.my-custom-interface .select-interface-option .alert-checkbox-label {
  color: #971e49;
}

/* Alert Interface: set color for checked alert options (single selection) */
.my-custom-interface .select-interface-option[aria-checked=true] .alert-radio-label {
  color: #79193b;
}

/* Alert Interface: set color for checked alert options (multiple selection) */
.my-custom-interface .select-interface-option[aria-checked=true] .alert-checkbox-label {
  color: #79193b;
}
```

> Note: In the CSS examples, some of the selectors could be combined together, but are separated out in order to better explain what each selector is for.


### Customizing Individual Options

To customize an individual option, set a class on the `ion-select-option`:

```tsx
import React from 'react';
import { IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonPage } from '@ionic/react';

const options = {
  cssClass: 'my-custom-interface'
};

export const SelectOptionExample: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonItem>
          <IonLabel>Select</IonLabel>
          <IonSelect interface="popover" interfaceOptions={options}>
            <IonSelectOption value="brown" class="brown-option">Brown</IonSelectOption>
            <IonSelectOption value="blonde">Blonde</IonSelectOption>
            <IonSelectOption value="black">Black</IonSelectOption>
            <IonSelectOption value="red">Red</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};
```

```css
/* Popover Interface: set color for the popover using Item's CSS variables */
.my-custom-interface .brown-option {
  --color: #5e3e2c;
  --color-hover: #362419;
}
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'select-option-example',
  styleUrl: 'select-option-example.css'
})
export class SelectOptionExample {
  render() {
    return [
      <ion-item>
        <ion-label>Select</ion-label>
        <ion-select>
          <ion-select-option value="brown">Brown</ion-select-option>
          <ion-select-option value="blonde">Blonde</ion-select-option>
          <ion-select-option value="black">Black</ion-select-option>
          <ion-select-option value="red">Red</ion-select-option>
        </ion-select>
      </ion-item>
    ];
  }
}
```

### Customizing Options

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'select-option-example',
  styleUrl: 'select-option-example.css'
})
export class SelectOptionExample {
  options = {
    cssClass: 'my-custom-interface'
  };

  render() {
    return [
      <ion-item>
        <ion-label>Select: Alert Interface</ion-label>
        <ion-select interfaceOptions={options}>
          <ion-select-option value="brown">Brown</ion-select-option>
          <ion-select-option value="blonde">Blonde</ion-select-option>
          <ion-select-option value="black">Black</ion-select-option>
          <ion-select-option value="red">Red</ion-select-option>
        </ion-select>
      </ion-item>,

      <ion-item>
        <ion-label>Select: Alert Interface (Multiple Selection)</ion-label>
        <ion-select interfaceOptions={options} multiple={true}>
          <ion-select-option value="brown">Brown</ion-select-option>
          <ion-select-option value="blonde">Blonde</ion-select-option>
          <ion-select-option value="black">Black</ion-select-option>
          <ion-select-option value="red">Red</ion-select-option>
        </ion-select>
      </ion-item>,

      <ion-item>
        <ion-label>Select: Popover Interface</ion-label>
        <ion-select interface="popover" interfaceOptions={options}>
          <ion-select-option value="brown">Brown</ion-select-option>
          <ion-select-option value="blonde">Blonde</ion-select-option>
          <ion-select-option value="black">Black</ion-select-option>
          <ion-select-option value="red">Red</ion-select-option>
        </ion-select>
      </ion-item>,

      <ion-item>
        <ion-label>Select: Action Sheet Interface</ion-label>
        <ion-select interface="action-sheet" interfaceOptions={options}>
          <ion-select-option value="brown">Brown</ion-select-option>
          <ion-select-option value="blonde">Blonde</ion-select-option>
          <ion-select-option value="black">Black</ion-select-option>
          <ion-select-option value="red">Red</ion-select-option>
        </ion-select>
      </ion-item>
    ];
  }
}
```

```css
/* Popover Interface: set color for the popover using Item's CSS variables */
.my-custom-interface .select-interface-option {
  --color: #971e49;
  --color-hover: #79193b;
}

/* Action Sheet Interface: set color for the action sheet using its button CSS variables */
.my-custom-interface .select-interface-option {
  --button-color: #971e49;
  --button-color-hover: #79193b;
}

/* Alert Interface: set color for alert options (single selection) */
.my-custom-interface .select-interface-option .alert-radio-label {
  color: #971e49;
}

/* Alert Interface: set color for alert options (multiple selection) */
.my-custom-interface .select-interface-option .alert-checkbox-label {
  color: #971e49;
}

/* Alert Interface: set color for checked alert options (single selection) */
.my-custom-interface .select-interface-option[aria-checked=true] .alert-radio-label {
  color: #79193b;
}

/* Alert Interface: set color for checked alert options (multiple selection) */
.my-custom-interface .select-interface-option[aria-checked=true] .alert-checkbox-label {
  color: #79193b;
}
```

> Note: In the CSS examples, some of the selectors could be combined together, but are separated out in order to better explain what each selector is for.

### Customizing Individual Options

To customize an individual option, set a class on the `ion-select-option`:

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'select-option-example',
  styleUrl: 'select-option-example.css'
})
export class SelectOptionExample {
  options = {
    cssClass: 'my-custom-interface'
  };

  render() {
    return [
      <ion-item>
        <ion-label>Select</ion-label>
        <ion-select interface="popover" interfaceOptions={options}>
          <ion-select-option value="brown" class="brown-option">Brown</ion-select-option>
          <ion-select-option value="blonde">Blonde</ion-select-option>
          <ion-select-option value="black">Black</ion-select-option>
          <ion-select-option value="red">Red</ion-select-option>
        </ion-select>
      </ion-item>
    ];
  }
}
```

```css
/* Popover Interface: set color for the popover using Item's CSS variables */
.my-custom-interface .brown-option {
  --color: #5e3e2c;
  --color-hover: #362419;
}
```


### Vue

```html
<template>
  <ion-item>
    <ion-label>Select</ion-label>
    <ion-select>
      <ion-select-option value="brown">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>
</template>
```

### Customizing Options

```html
<template>
  <ion-item>
    <ion-label>Select: Alert Interface</ion-label>
    <ion-select :interface-options="options">
      <ion-select-option value="brown">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Select: Alert Interface (Multiple Selection)</ion-label>
    <ion-select :interface-options="options" multiple="true">
      <ion-select-option value="brown">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Select: Popover Interface</ion-label>
    <ion-select interface="popover" :interface-options="options">
      <ion-select-option value="brown">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Select: Action Sheet Interface</ion-label>
    <ion-select interface="action-sheet" :interface-options="options">
      <ion-select-option value="brown">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>
</template>


<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    options: any = {
      cssClass: 'my-custom-interface'
    };
  }
</script>
```

```css
/* Popover Interface: set color for the popover using Item's CSS variables */
.my-custom-interface .select-interface-option {
  --color: #971e49;
  --color-hover: #79193b;
}

/* Action Sheet Interface: set color for the action sheet using its button CSS variables */
.my-custom-interface .select-interface-option {
  --button-color: #971e49;
  --button-color-hover: #79193b;
}

/* Alert Interface: set color for alert options (single selection) */
.my-custom-interface .select-interface-option .alert-radio-label {
  color: #971e49;
}

/* Alert Interface: set color for alert options (multiple selection) */
.my-custom-interface .select-interface-option .alert-checkbox-label {
  color: #971e49;
}

/* Alert Interface: set color for checked alert options (single selection) */
.my-custom-interface .select-interface-option[aria-checked=true] .alert-radio-label {
  color: #79193b;
}

/* Alert Interface: set color for checked alert options (multiple selection) */
.my-custom-interface .select-interface-option[aria-checked=true] .alert-checkbox-label {
  color: #79193b;
}
```

> Note: In the CSS examples, some of the selectors could be combined together, but are separated out in order to better explain what each selector is for.


### Customizing Individual Options

To customize an individual option, set a class on the `ion-select-option`:

```html
<template>
  <ion-item>
    <ion-label>Select</ion-label>
    <ion-select interface="popover" :interface-options="options">
      <ion-select-option value="brown" class="brown-option">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    options: any = {
      cssClass: 'my-custom-interface'
    };
  }
</script>
```

```css
/* Popover Interface: set color for the popover using Item's CSS variables */
.my-custom-interface .brown-option {
  --color: #5e3e2c;
  --color-hover: #362419;
}
```



## Properties

| Property   | Attribute  | Description                                                 | Type      | Default     |
| ---------- | ---------- | ----------------------------------------------------------- | --------- | ----------- |
| `disabled` | `disabled` | If `true`, the user cannot interact with the select option. | `boolean` | `false`     |
| `value`    | `value`    | The text value of the option.                               | `any`     | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
