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
