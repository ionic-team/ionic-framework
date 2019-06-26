# ion-select

Selects are form controls to select an option, or options, from a set of options, similar to a native `<select>` element. When a user taps the select, a dialog appears with all of the options in a large, easy to select list.

A select should be used with child `<ion-select-option>` elements. If the child option is not given a `value` attribute then its text will be used as the value.

If `value` is set on the `<ion-select>`, the selected option will be chosen based on that value. Otherwise, the `selected` attribute can be used on the `<ion-select-option>`.


## Interfaces

By default, select uses the [AlertController API](../alert-controller) to open up the overlay of options in an alert. The interface can be changed to use the [ActionSheetController API](../action-sheet-controller) or [PopoverController API](../popover-controller) by passing `action-sheet` or `popover`, respectively, to the `interface` property. Read on to the other sections for the limitations of the different interfaces.


## Single Selection

By default, the select allows the user to select only one option. The alert interface presents users with a radio button styled list of options. The action sheet interface can only be used with a single value select. The select component's value receives the value of the selected option's value.


### Multiple Selection

By adding the `multiple` attribute to select, users are able to select multiple options. When multiple options can be selected, the alert overlay presents users with a checkbox styled list of options. The select component's value receives an array of all of the selected option values.

Note: the `action-sheet` and `popover` interfaces will not work with multiple selection.

## Object Value References

When using objects for select values, it is possible for the identities of these objects to change if they are coming from a server or database, while the selected value's identity remains the same. For example, this can occur when an existing record with the desired object value is loaded into the select, but the newly retrieved select options now have different identities. This will result in the select appearing to have no value at all, even though the original selection in still intact.

By default, the select uses object equality (`===`) to determine if an option is selected. This can be overridden by providing a property name or a function to the `compareWith` property.

## Select Buttons

By default, the alert has two buttons: `Cancel` and `OK`. Each button's text can be customized using the `cancelText` and `okText` properties.

The `action-sheet` and `popover` interfaces do not have an `OK` button, clicking on any of the options will automatically close the overlay and select that value. The `popover` interface does not have a `Cancel` button, clicking on the backdrop will close the overlay.


## Interface Options

Since select uses the alert, action sheet and popover interfaces, options can be passed to these components through the `interfaceOptions` property. This can be used to pass a custom header, subheader, css class, and more. See the [AlertController API docs](../alert-controller), [ActionSheetController API docs](../action-sheet-controller), and [PopoverController API docs](../popover-controller) for the properties that each interface accepts.


<!-- Auto Generated Below -->


## Usage

### Angular

## Single Selection

```html
<ion-list>
  <ion-list-header>Single Selection</ion-list-header>

  <ion-item>
    <ion-label>Gender</ion-label>
    <ion-select placeholder="Select One">
      <ion-select-option value="f">Female</ion-select-option>
      <ion-select-option value="m">Male</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Hair Color</ion-label>
    <ion-select value="brown" okText="Okay" cancelText="Dismiss">
      <ion-select-option value="brown">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>

</ion-list>
```

## Multiple Selection

```html
<ion-list>
  <ion-list-header>Multiple Selection</ion-list-header>

  <ion-item>
    <ion-label>Toppings</ion-label>
    <ion-select multiple="true" cancelText="Nah" okText="Okay!">
      <ion-select-option value="bacon">Bacon</ion-select-option>
      <ion-select-option value="olives">Black Olives</ion-select-option>
      <ion-select-option value="xcheese">Extra Cheese</ion-select-option>
      <ion-select-option value="peppers">Green Peppers</ion-select-option>
      <ion-select-option value="mushrooms">Mushrooms</ion-select-option>
      <ion-select-option value="onions">Onions</ion-select-option>
      <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
      <ion-select-option value="pineapple">Pineapple</ion-select-option>
      <ion-select-option value="sausage">Sausage</ion-select-option>
      <ion-select-option value="Spinach">Spinach</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Pets</ion-label>
    <ion-select multiple="true">
      <ion-select-option value="bird" selected>Bird</ion-select-option>
      <ion-select-option value="cat">Cat</ion-select-option>
      <ion-select-option value="dog" selected>Dog</ion-select-option>
      <ion-select-option value="honeybadger">Honey Badger</ion-select-option>
    </ion-select>
  </ion-item>
</ion-list>
```

## Objects as Values

```html
<ion-list>
  <ion-list-header>Objects as Values (compareWith)</ion-list-header>
  
  <ion-item>
    <ion-label>Users</ion-label>
    <ion-select [compareWith]="compareWith">
      <ion-select-option *ngFor="let user of users">{{user.first + ' ' + user.last}}</ion-select-option>
    </ion-select>
  </ion-item>
</ion-list>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'select-example',
  templateUrl: 'select-example.html',
  styleUrls: ['./select-example.css'],
})
export class SelectExample {
  users: any[] = [
    {
      id: 1,
      first: 'Alice',
      last: 'Smith',
    },
    {
      id: 2,
      first: 'Bob',
      last: 'Davis',
    },
    {
      id: 3,
      first: 'Charlie',
      last: 'Rosenburg',
    }
  ];

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  compareWith = compareWithFn;
}
```

## Interface Options

```html
<ion-list>
  <ion-list-header>Interface Options</ion-list-header>

  <ion-item>
    <ion-label>Alert</ion-label>
    <ion-select [interfaceOptions]="customAlertOptions" interface="alert" multiple="true" placeholder="Select One">
      <ion-select-option value="bacon">Bacon</ion-select-option>
      <ion-select-option value="olives">Black Olives</ion-select-option>
      <ion-select-option value="xcheese">Extra Cheese</ion-select-option>
      <ion-select-option value="peppers">Green Peppers</ion-select-option>
      <ion-select-option value="mushrooms">Mushrooms</ion-select-option>
      <ion-select-option value="onions">Onions</ion-select-option>
      <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
      <ion-select-option value="pineapple">Pineapple</ion-select-option>
      <ion-select-option value="sausage">Sausage</ion-select-option>
      <ion-select-option value="Spinach">Spinach</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Popover</ion-label>
    <ion-select [interfaceOptions]="customPopoverOptions" interface="popover" placeholder="Select One">
      <ion-select-option value="brown">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Action Sheet</ion-label>
    <ion-select [interfaceOptions]="customActionSheetOptions" interface="action-sheet" placeholder="Select One">
      <ion-select-option value="red">Red</ion-select-option>
      <ion-select-option value="purple">Purple</ion-select-option>
      <ion-select-option value="yellow">Yellow</ion-select-option>
      <ion-select-option value="orange">Orange</ion-select-option>
      <ion-select-option value="green">Green</ion-select-option>
    </ion-select>
  </ion-item>

</ion-list>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'select-example',
  templateUrl: 'select-example.html',
  styleUrls: ['./select-example.css'],
})
export class SelectExample {
  customAlertOptions: any = {
    header: 'Pizza Toppings',
    subHeader: 'Select your toppings',
    message: '$1.00 per topping',
    translucent: true
  };

  customPopoverOptions: any = {
    header: 'Hair Color',
    subHeader: 'Select your hair color',
    message: 'Only select your dominant hair color'
  };

  customActionSheetOptions: any = {
    header: 'Colors',
    subHeader: 'Select your favorite color'
  };
}
```


### Javascript

## Single Selection

```html
<ion-list>
  <ion-list-header>Single Selection</ion-list-header>

  <ion-item>
    <ion-label>Gender</ion-label>
    <ion-select placeholder="Select One">
      <ion-select-option value="f">Female</ion-select-option>
      <ion-select-option value="m">Male</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Hair Color</ion-label>
    <ion-select value="brown" ok-text="Okay" cancel-text="Dismiss">
      <ion-select-option value="brown">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>

</ion-list>
```

## Multiple Selection

```html
<ion-list>
  <ion-list-header>Multiple Selection</ion-list-header>

  <ion-item>
    <ion-label>Toppings</ion-label>
    <ion-select multiple="true" cancel-text="Nah" ok-text="Okay!">
      <ion-select-option value="bacon">Bacon</ion-select-option>
      <ion-select-option value="olives">Black Olives</ion-select-option>
      <ion-select-option value="xcheese">Extra Cheese</ion-select-option>
      <ion-select-option value="peppers">Green Peppers</ion-select-option>
      <ion-select-option value="mushrooms">Mushrooms</ion-select-option>
      <ion-select-option value="onions">Onions</ion-select-option>
      <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
      <ion-select-option value="pineapple">Pineapple</ion-select-option>
      <ion-select-option value="sausage">Sausage</ion-select-option>
      <ion-select-option value="Spinach">Spinach</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Pets</ion-label>
    <ion-select multiple="true">
      <ion-select-option value="bird" selected>Bird</ion-select-option>
      <ion-select-option value="cat">Cat</ion-select-option>
      <ion-select-option value="dog" selected>Dog</ion-select-option>
      <ion-select-option value="honeybadger">Honey Badger</ion-select-option>
    </ion-select>
  </ion-item>
</ion-list>
```

## Objects as Values

```html
<ion-list>
  <ion-list-header>Objects as Values (compareWith)</ion-list-header>

  <ion-item>
    <ion-label>Users</ion-label>
    <ion-select id="objectSelectCompareWith"></ion-select>
  </ion-item>
</ion-list>
```

```javascript
  let objectOptions = [
    {
      id: 1,
      first: 'Alice',
      last: 'Smith',
    },
    {
      id: 2,
      first: 'Bob',
      last: 'Davis',
    },
    {
      id: 3,
      first: 'Charlie',
      last: 'Rosenburg',
    }
  ];

  let compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  let objectSelectElement = document.getElementById('objectSelectCompareWith');
  objectSelectElement.compareWith = compareWithFn;
  
  objectOptions.forEach((option, i) => {
    let selectOption = document.createElement('ion-select-option');
    selectOption.value = option;
    selectOption.textContent = option.first + ' ' + option.last;
    selectOption.selected = (i === 0);
    
    objectSelectElement.appendChild(selectOption)
  });
}
```

## Interface Options

```html
<ion-list>
  <ion-list-header>Interface Options</ion-list-header>

  <ion-item>
    <ion-label>Alert</ion-label>
    <ion-select id="customAlertSelect" interface="alert" multiple="true" placeholder="Select One">
      <ion-select-option value="bacon">Bacon</ion-select-option>
      <ion-select-option value="olives">Black Olives</ion-select-option>
      <ion-select-option value="xcheese">Extra Cheese</ion-select-option>
      <ion-select-option value="peppers">Green Peppers</ion-select-option>
      <ion-select-option value="mushrooms">Mushrooms</ion-select-option>
      <ion-select-option value="onions">Onions</ion-select-option>
      <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
      <ion-select-option value="pineapple">Pineapple</ion-select-option>
      <ion-select-option value="sausage">Sausage</ion-select-option>
      <ion-select-option value="Spinach">Spinach</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Popover</ion-label>
    <ion-select id="customPopoverSelect" interface="popover" placeholder="Select One">
      <ion-select-option value="brown">Brown</ion-select-option>
      <ion-select-option value="blonde">Blonde</ion-select-option>
      <ion-select-option value="black">Black</ion-select-option>
      <ion-select-option value="red">Red</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Action Sheet</ion-label>
    <ion-select id="customActionSheetSelect" interface="action-sheet" placeholder="Select One">
      <ion-select-option value="red">Red</ion-select-option>
      <ion-select-option value="purple">Purple</ion-select-option>
      <ion-select-option value="yellow">Yellow</ion-select-option>
      <ion-select-option value="orange">Orange</ion-select-option>
      <ion-select-option value="green">Green</ion-select-option>
    </ion-select>
  </ion-item>

</ion-list>
```

```javascript
var customAlertSelect = document.getElementById('customAlertSelect');
var customAlertOptions = {
  header: 'Pizza Toppings',
  subHeader: 'Select your toppings',
  message: '$1.00 per topping',
  translucent: true
};
customAlertSelect.interfaceOptions = customAlertOptions;

var customPopoverSelect = document.getElementById('customPopoverSelect');
var customPopoverOptions = {
  header: 'Hair Color',
  subHeader: 'Select your hair color',
  message: 'Only select your dominant hair color'
};
customPopoverSelect.interfaceOptions = customPopoverOptions;

var customActionSheetSelect = document.getElementById('customActionSheetSelect');
var customActionSheetOptions = {
  header: 'Colors',
  subHeader: 'Select your favorite color'
};
customActionSheetSelect.interfaceOptions = customActionSheetOptions;
```


### React

```tsx
import React from 'react';
import {
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonContent
} from '@ionic/react';

const customAlertOptions = {
  header: 'Pizza Toppings',
  subHeader: 'Select your toppings',
  message: '$1.00 per topping',
  translucent: true
};

const customPopoverOptions = {
  header: 'Hair Color',
  subHeader: 'Select your hair color',
  message: 'Only select your dominant hair color'
};

const customActionSheetOptions = {
  header: 'Colors',
  subHeader: 'Select your favorite color'
};

const objectOptions = [
  {
    id: 1,
    first: 'Alice',
    last: 'Smith'
  },
  {
    id: 2,
    first: 'Bob',
    last: 'Davis'
  },
  {
    id: 3,
    first: 'Charlie',
    last: 'Rosenburg'
  }
];

const compareWith = (o1: any, o2: any) => {
  return o1 && o2 ? o1.id === o2.id : o1 === o2;
};

export const SelectExample: React.FunctionComponent = () => (
  <IonContent>
    ## Single Selection
    <IonList>
      <IonListHeader>Single Selection</IonListHeader>

      <IonItem>
        <IonLabel>Gender</IonLabel>
        <IonSelect placeholder="Select One">
          <IonSelectOption value="f">Female</IonSelectOption>
          <IonSelectOption value="m">Male</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>Hair Color</IonLabel>
        <IonSelect value="brown" okText="Okay" cancelText="Dismiss">
          <IonSelectOption value="brown">Brown</IonSelectOption>
          <IonSelectOption value="blonde">Blonde</IonSelectOption>
          <IonSelectOption value="black">Black</IonSelectOption>
          <IonSelectOption value="red">Red</IonSelectOption>
        </IonSelect>
      </IonItem>
    </IonList>
    ## Multiple Selection
    <IonList>
      <IonListHeader>Multiple Selection</IonListHeader>

      <IonItem>
        <IonLabel>Toppings</IonLabel>
        <IonSelect multiple={true} cancelText="Nah" okText="Okay!">
          <IonSelectOption value="bacon">Bacon</IonSelectOption>
          <IonSelectOption value="olives">Black Olives</IonSelectOption>
          <IonSelectOption value="xcheese">Extra Cheese</IonSelectOption>
          <IonSelectOption value="peppers">Green Peppers</IonSelectOption>
          <IonSelectOption value="mushrooms">Mushrooms</IonSelectOption>
          <IonSelectOption value="onions">Onions</IonSelectOption>
          <IonSelectOption value="pepperoni">Pepperoni</IonSelectOption>
          <IonSelectOption value="pineapple">Pineapple</IonSelectOption>
          <IonSelectOption value="sausage">Sausage</IonSelectOption>
          <IonSelectOption value="Spinach">Spinach</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>Pets</IonLabel>
        <IonSelect multiple={true}>
          <IonSelectOption value="bird" selected>
            Bird
          </IonSelectOption>
          <IonSelectOption value="cat">Cat</IonSelectOption>
          <IonSelectOption value="dog" selected>
            Dog
          </IonSelectOption>
          <IonSelectOption value="honeybadger">Honey Badger</IonSelectOption>
        </IonSelect>
      </IonItem>
    </IonList>
    ## Objects as Values
    <IonList>
      <IonListHeader>Objects as Values (compareWith)</IonListHeader>
      <IonItem>
        <IonLabel>Users</IonLabel>
        <IonSelect compareWith={compareWith}>
          {objectOptions.map((object, i) => {
            return (
              <IonSelectOption key={object.id} value={object.id}>
                {object.first} {object.last}
              </IonSelectOption>
            );
          })}
        </IonSelect>
      </IonItem>
    </IonList>
    ## Interface Options
    <IonList>
      <IonListHeader>Interface Options</IonListHeader>

      <IonItem>
        <IonLabel>Alert</IonLabel>
        <IonSelect
          interfaceOptions={customAlertOptions}
          interface="alert"
          multiple={true}
          placeholder="Select One"
        >
          <IonSelectOption value="bacon">Bacon</IonSelectOption>
          <IonSelectOption value="olives">Black Olives</IonSelectOption>
          <IonSelectOption value="xcheese">Extra Cheese</IonSelectOption>
          <IonSelectOption value="peppers">Green Peppers</IonSelectOption>
          <IonSelectOption value="mushrooms">Mushrooms</IonSelectOption>
          <IonSelectOption value="onions">Onions</IonSelectOption>
          <IonSelectOption value="pepperoni">Pepperoni</IonSelectOption>
          <IonSelectOption value="pineapple">Pineapple</IonSelectOption>
          <IonSelectOption value="sausage">Sausage</IonSelectOption>
          <IonSelectOption value="Spinach">Spinach</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>Popover</IonLabel>
        <IonSelect interfaceOptions={customPopoverOptions} interface="popover" placeholder="Select One">
          <IonSelectOption value="brown">Brown</IonSelectOption>
          <IonSelectOption value="blonde">Blonde</IonSelectOption>
          <IonSelectOption value="black">Black</IonSelectOption>
          <IonSelectOption value="red">Red</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>Action Sheet</IonLabel>
        <IonSelect
          interfaceOptions={customActionSheetOptions}
          interface="action-sheet"
          placeholder="Select One"
        >
          <IonSelectOption value="red">Red</IonSelectOption>
          <IonSelectOption value="purple">Purple</IonSelectOption>
          <IonSelectOption value="yellow">Yellow</IonSelectOption>
          <IonSelectOption value="orange">Orange</IonSelectOption>
          <IonSelectOption value="green">Green</IonSelectOption>
        </IonSelect>
      </IonItem>
    </IonList>
  </IonContent>
);
```


### Vue

## Single Selection

```html
<template>
  <ion-list>
    <ion-list-header>Single Selection</ion-list-header>

    <ion-item>
      <ion-label>Gender</ion-label>
      <ion-select placeholder="Select One">
        <ion-select-option value="f">Female</ion-select-option>
        <ion-select-option value="m">Male</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label>Hair Color</ion-label>
      <ion-select value="brown" okText="Okay" cancelText="Dismiss">
        <ion-select-option value="brown">Brown</ion-select-option>
        <ion-select-option value="blonde">Blonde</ion-select-option>
        <ion-select-option value="black">Black</ion-select-option>
        <ion-select-option value="red">Red</ion-select-option>
      </ion-select>
    </ion-item>

  </ion-list>
</template>
```

## Multiple Selection

```html
<template>
  <ion-list>
    <ion-list-header>Multiple Selection</ion-list-header>

    <ion-item>
      <ion-label>Toppings</ion-label>
      <ion-select multiple="true" cancelText="Nah" okText="Okay!">
        <ion-select-option value="bacon">Bacon</ion-select-option>
        <ion-select-option value="olives">Black Olives</ion-select-option>
        <ion-select-option value="xcheese">Extra Cheese</ion-select-option>
        <ion-select-option value="peppers">Green Peppers</ion-select-option>
        <ion-select-option value="mushrooms">Mushrooms</ion-select-option>
        <ion-select-option value="onions">Onions</ion-select-option>
        <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
        <ion-select-option value="pineapple">Pineapple</ion-select-option>
        <ion-select-option value="sausage">Sausage</ion-select-option>
        <ion-select-option value="Spinach">Spinach</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label>Pets</ion-label>
      <ion-select multiple="true">
        <ion-select-option value="bird" selected>Bird</ion-select-option>
        <ion-select-option value="cat">Cat</ion-select-option>
        <ion-select-option value="dog" selected>Dog</ion-select-option>
        <ion-select-option value="honeybadger">Honey Badger</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>
</template>
```

## Interface Options

```html
<template>
  <ion-list>
    <ion-list-header>Interface Options</ion-list-header>

    <ion-item>
      <ion-label>Alert</ion-label>
      <ion-select :interfaceOptions="customAlertOptions" interface="alert" multiple="true" placeholder="Select One">
        <ion-select-option value="bacon">Bacon</ion-select-option>
        <ion-select-option value="olives">Black Olives</ion-select-option>
        <ion-select-option value="xcheese">Extra Cheese</ion-select-option>
        <ion-select-option value="peppers">Green Peppers</ion-select-option>
        <ion-select-option value="mushrooms">Mushrooms</ion-select-option>
        <ion-select-option value="onions">Onions</ion-select-option>
        <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
        <ion-select-option value="pineapple">Pineapple</ion-select-option>
        <ion-select-option value="sausage">Sausage</ion-select-option>
        <ion-select-option value="Spinach">Spinach</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label>Popover</ion-label>
      <ion-select :interfaceOptions="customPopoverOptions" interface="popover" placeholder="Select One">
        <ion-select-option value="brown">Brown</ion-select-option>
        <ion-select-option value="blonde">Blonde</ion-select-option>
        <ion-select-option value="black">Black</ion-select-option>
        <ion-select-option value="red">Red</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label>Action Sheet</ion-label>
      <ion-select :interfaceOptions]="customActionSheetOptions" interface="action-sheet" placeholder="Select One">
        <ion-select-option value="red">Red</ion-select-option>
        <ion-select-option value="purple">Purple</ion-select-option>
        <ion-select-option value="yellow">Yellow</ion-select-option>
        <ion-select-option value="orange">Orange</ion-select-option>
        <ion-select-option value="green">Green</ion-select-option>
      </ion-select>
    </ion-item>

  </ion-list>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    customAlertOptions: any = {
      header: 'Pizza Toppings',
      subHeader: 'Select your toppings',
      message: '$1.00 per topping',
      translucent: true
    };

    customPopoverOptions: any = {
      header: 'Hair Color',
      subHeader: 'Select your hair color',
      message: 'Only select your dominant hair color'
    };

    customActionSheetOptions: any = {
      header: 'Colors',
      subHeader: 'Select your favorite color'
    };
  }
</script>
```



## Properties

| Property           | Attribute           | Description                                                                                                                                                                                                                                                                                                                                                                       | Type                                                                                 | Default        |
| ------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------- |
| `cancelText`       | `cancel-text`       | The text to display on the cancel button.                                                                                                                                                                                                                                                                                                                                         | `string`                                                                             | `'Cancel'`     |
| `compareWith`      | `compare-with`      | A property name or function used to compare object values                                                                                                                                                                                                                                                                                                                         | `((currentValue: any, compareValue: any) => boolean) \| null \| string \| undefined` | `undefined`    |
| `disabled`         | `disabled`          | If `true`, the user cannot interact with the select.                                                                                                                                                                                                                                                                                                                              | `boolean`                                                                            | `false`        |
| `interface`        | `interface`         | The interface the select should use: `action-sheet`, `popover` or `alert`.                                                                                                                                                                                                                                                                                                        | `"action-sheet" \| "alert" \| "popover"`                                             | `'alert'`      |
| `interfaceOptions` | `interface-options` | Any additional options that the `alert`, `action-sheet` or `popover` interface can take. See the [AlertController API docs](../../alert/AlertController/#create), the [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the [PopoverController API docs](../../popover/PopoverController/#create) for the create options for each interface. | `any`                                                                                | `{}`           |
| `mode`             | `mode`              | The mode determines which platform styles to use.                                                                                                                                                                                                                                                                                                                                 | `"ios" \| "md"`                                                                      | `undefined`    |
| `multiple`         | `multiple`          | If `true`, the select can accept multiple values.                                                                                                                                                                                                                                                                                                                                 | `boolean`                                                                            | `false`        |
| `name`             | `name`              | The name of the control, which is submitted with the form data.                                                                                                                                                                                                                                                                                                                   | `string`                                                                             | `this.inputId` |
| `okText`           | `ok-text`           | The text to display on the ok button.                                                                                                                                                                                                                                                                                                                                             | `string`                                                                             | `'OK'`         |
| `placeholder`      | `placeholder`       | The text to display when the select is empty.                                                                                                                                                                                                                                                                                                                                     | `null \| string \| undefined`                                                        | `undefined`    |
| `selectedText`     | `selected-text`     | The text to display instead of the selected option's value.                                                                                                                                                                                                                                                                                                                       | `null \| string \| undefined`                                                        | `undefined`    |
| `value`            | `value`             | the value of the select.                                                                                                                                                                                                                                                                                                                                                          | `any`                                                                                | `undefined`    |


## Events

| Event       | Description                              | Type                                   |
| ----------- | ---------------------------------------- | -------------------------------------- |
| `ionBlur`   | Emitted when the select loses focus.     | `CustomEvent<void>`                    |
| `ionCancel` | Emitted when the selection is cancelled. | `CustomEvent<void>`                    |
| `ionChange` | Emitted when the value has changed.      | `CustomEvent<SelectChangeEventDetail>` |
| `ionFocus`  | Emitted when the select has focus.       | `CustomEvent<void>`                    |


## Methods

### `open(event?: UIEvent | undefined) => Promise<any>`

Open the select overlay. The overlay is either an alert, action sheet, or popover,
depending on the `interface` property on the `ion-select`.

#### Returns

Type: `Promise<any>`




## CSS Custom Properties

| Name               | Description                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `--padding-bottom` | Bottom padding of the select                                                                              |
| `--padding-end`    | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the select |
| `--padding-start`  | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the select |
| `--padding-top`    | Top padding of the select                                                                                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
