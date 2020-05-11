### Single Selection

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'select-example',
  styleUrl: 'select-example.css'
})
export class SelectExample {
  render() {
    return [
      <ion-list>
        <ion-list-header>
          <ion-label>
            Single Selection
          </ion-label>
        </ion-list-header>

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
    ];
  }
}
```

### Multiple Selection

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'select-example',
  styleUrl: 'select-example.css'
})
export class SelectExample {
  render() {
    return [
      <ion-list>
        <ion-list-header>
          <ion-label>
            Multiple Selection
          </ion-label>
        </ion-list-header>

        <ion-item>
          <ion-label>Toppings</ion-label>
          <ion-select multiple={true} cancelText="Nah" okText="Okay!">
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
          <ion-select multiple={true} value={['bird', 'dog']}>
            <ion-select-option value="bird">Bird</ion-select-option>
            <ion-select-option value="cat">Cat</ion-select-option>
            <ion-select-option value="dog">Dog</ion-select-option>
            <ion-select-option value="honeybadger">Honey Badger</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    ];
  }
}
```

### Objects as Values

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'select-example',
  styleUrl: 'select-example.css'
})
export class SelectExample {
  private users: any[] = [
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

  compareWith = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  render() {
    return [
      <ion-list>
        <ion-list-header>
          <ion-label>
            Objects as Values (compareWith)
          </ion-label>
        </ion-list-header>

        <ion-item>
          <ion-label>Users</ion-label>
          <ion-select compareWith={this.compareWith}>
            {this.users.map(user =>
            <ion-select-option value={user}>
              {user.first + ' ' + user.last}
            </ion-select-option>
            )}
          </ion-select>
        </ion-item>
      </ion-list>
    ];
  }
}
```

### Interface Options

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'select-example',
  styleUrl: 'select-example.css'
})
export class SelectExample {
  private customAlertOptions: any = {
    header: 'Pizza Toppings',
    subHeader: 'Select your toppings',
    message: '$1.00 per topping',
    translucent: true
  };

  private customPopoverOptions: any = {
    header: 'Hair Color',
    subHeader: 'Select your hair color',
    message: 'Only select your dominant hair color'
  };

  private customActionSheetOptions: any = {
    header: 'Colors',
    subHeader: 'Select your favorite color'
  };

  render() {
    return [
      <ion-list>
        <ion-list-header>
          <ion-label>
            Interface Options
          </ion-label>
        </ion-list-header>

        <ion-item>
          <ion-label>Alert</ion-label>
          <ion-select interfaceOptions={this.customAlertOptions} interface="alert" multiple={true} placeholder="Select One">
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
          <ion-select interfaceOptions={this.customPopoverOptions} interface="popover" placeholder="Select One">
            <ion-select-option value="brown">Brown</ion-select-option>
            <ion-select-option value="blonde">Blonde</ion-select-option>
            <ion-select-option value="black">Black</ion-select-option>
            <ion-select-option value="red">Red</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label>Action Sheet</ion-label>
          <ion-select interfaceOptions={this.customActionSheetOptions} interface="action-sheet" placeholder="Select One">
            <ion-select-option value="red">Red</ion-select-option>
            <ion-select-option value="purple">Purple</ion-select-option>
            <ion-select-option value="yellow">Yellow</ion-select-option>
            <ion-select-option value="orange">Orange</ion-select-option>
            <ion-select-option value="green">Green</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    ];
  }
}
```