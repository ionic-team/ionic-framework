### Single Selection

```tsx
import React, { useState } from 'react';
import { IonContent, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption, IonPage, IonItemDivider } from '@ionic/react';

export const SingleSelection: React.FC = () => {

  const [gender, setGender] = useState<string>();
  const [hairColor, setHairColor] = useState<string>('brown');

  return (
    <IonPage>
      <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>
              Single Selection
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Gender</IonLabel>
            <IonSelect value={gender} placeholder="Select One" onIonChange={e => setGender(e.detail.value)}>
              <IonSelectOption value="female">Female</IonSelectOption>
              <IonSelectOption value="male">Male</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Hair Color</IonLabel>
            <IonSelect value={hairColor} okText="Okay" cancelText="Dismiss" onIonChange={e => setHairColor(e.detail.value)}>
              <IonSelectOption value="brown">Brown</IonSelectOption>
              <IonSelectOption value="blonde">Blonde</IonSelectOption>
              <IonSelectOption value="black">Black</IonSelectOption>
              <IonSelectOption value="red">Red</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItemDivider>Your Selections</IonItemDivider>
          <IonItem>Gender: {gender ?? '(none selected)'}</IonItem>
          <IonItem>Hair Color: {hairColor}</IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
```


### Multiple Selection

```tsx
import React, { useState } from 'react';
import { IonContent, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption, IonPage, IonItemDivider } from '@ionic/react';

export const MultipleSelection: React.FC = () => {

  const [toppings, setToppings] = useState<string[]>([]);
  const [pets, setPets] = useState<string[]>(['bird', 'dog']);

  return (
    <IonPage>
      <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>
              Multiple Selection
        </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Toppings</IonLabel>
            <IonSelect value={toppings} multiple={true} cancelText="Nah" okText="Okay!" onIonChange={e => setToppings(e.detail.value)}>
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
            <IonSelect multiple={true} value={pets} onIonChange={e => setPets(e.detail.value)}>
              <IonSelectOption value="bird">Bird</IonSelectOption>
              <IonSelectOption value="cat">Cat</IonSelectOption>
              <IonSelectOption value="dog">Dog</IonSelectOption>
              <IonSelectOption value="honeybadger">Honey Badger</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItemDivider>Your Selections</IonItemDivider>
          <IonItem>Toppings: {toppings.length ? toppings.reduce((curr, prev) => prev + ', ' + curr, '') : '(none selected)'}</IonItem>
          <IonItem>Pets: {pets.length ? pets.reduce((curr, prev) => prev + ', ' + curr, '') : '(none selected)'}</IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
```


### Objects as Values

```tsx
import React, { useState } from 'react';
import { IonContent, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption, IonPage, IonItemDivider } from '@ionic/react';

const users = [
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
    last: 'Rosenburg',
  }
];

type User = typeof users[number];

const compareWith = (o1: User, o2: User) => {
  return o1 && o2 ? o1.id === o2.id : o1 === o2;
};

export const ObjectSelection: React.FC = () => {

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  return (
    <IonPage>
      <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>
              Objects as Values (compareWith)
            </IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>Users</IonLabel>
            <IonSelect compareWith={compareWith} value={selectedUsers} multiple onIonChange={e => setSelectedUsers(e.detail.value)}>
              {users.map(user => (
                <IonSelectOption key={user.id} value={user}>
                  {user.first} {user.last}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItemDivider>Selected Users</IonItemDivider>
          {selectedUsers.length ?
            selectedUsers.map(user => <IonItem key={user.id}>{user.first} {user.last}</IonItem>) :
            <IonItem>(none selected)</IonItem>
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};
```


### Interface Options

```tsx
import React, { useState } from 'react';
import { IonContent, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption, IonPage, IonItemDivider } from '@ionic/react';

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

export const InterfaceOptionsSelection: React.FC = () => {

  const [toppings, setToppings] = useState<string[]>([]);
  const [hairColor, setHairColor] = useState<string>('brown');
  const [color, setColor] = useState<string>();

  return (
    <IonPage>
      <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>
              Interface Options
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Alert</IonLabel>
            <IonSelect
              interfaceOptions={customAlertOptions}
              interface="alert"
              multiple={true}
              placeholder="Select One"
              onIonChange={e => setToppings(e.detail.value)}
              value={toppings}
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
            <IonSelect
              interfaceOptions={customPopoverOptions}
              interface="popover"
              placeholder="Select One"
              onIonChange={e => setHairColor(e.detail.value)}
              value={hairColor}>
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
              onIonChange={e => setColor(e.detail.value)}
              value={color}
            >
              <IonSelectOption value="red">Red</IonSelectOption>
              <IonSelectOption value="purple">Purple</IonSelectOption>
              <IonSelectOption value="yellow">Yellow</IonSelectOption>
              <IonSelectOption value="orange">Orange</IonSelectOption>
              <IonSelectOption value="green">Green</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItemDivider>Your Selections</IonItemDivider>
          <IonItem>Toppings: {toppings.length ? toppings.reduce((curr, prev) => prev + ', ' + curr, '') : '(none selected)'}</IonItem>
          <IonItem>Hair Color: {hairColor}</IonItem>
          <IonItem>Color: {color ?? '(none selected)'}</IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
```