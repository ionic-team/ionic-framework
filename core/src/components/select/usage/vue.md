### Single Selection

```html
<template>
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
      <ion-select value="brown" ok-text="Okay" cancel-text="Dismiss">
        <ion-select-option value="brown">Brown</ion-select-option>
        <ion-select-option value="blonde">Blonde</ion-select-option>
        <ion-select-option value="black">Black</ion-select-option>
        <ion-select-option value="red">Red</ion-select-option>
      </ion-select>
    </ion-item>

  </ion-list>
</template>

<script>
import { 
  IonItem, 
  IonLabel, 
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonItem, 
    IonLabel, 
    IonList,
    IonListHeader,
    IonSelect,
    IonSelectOption
  }
});
</script>
```

### Multiple Selection

```html
<template>
  <ion-list>
    <ion-list-header>
      <ion-label>
        Multiple Selection
      </ion-label>
    </ion-list-header>

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
      <ion-select multiple="true" :value=['bird', 'dog']>
        <ion-select-option value="bird">Bird</ion-select-option>
        <ion-select-option value="cat">Cat</ion-select-option>
        <ion-select-option value="dog">Dog</ion-select-option>
        <ion-select-option value="honeybadger">Honey Badger</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>
</template>

<script>
import { 
  IonItem, 
  IonLabel, 
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonItem, 
    IonLabel, 
    IonList,
    IonListHeader,
    IonSelect,
    IonSelectOption
  }
});
</script>
```

### Interface Options

```html
<template>
  <ion-list>
    <ion-list-header>
      <ion-label>
        Interface Options
      </ion-label>
    </ion-list-header>

    <ion-item>
      <ion-label>Alert</ion-label>
      <ion-select :interface-options="customAlertOptions" interface="alert" multiple="true" placeholder="Select One">
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
      <ion-select :interface-options="customPopoverOptions" interface="popover" placeholder="Select One">
        <ion-select-option value="brown">Brown</ion-select-option>
        <ion-select-option value="blonde">Blonde</ion-select-option>
        <ion-select-option value="black">Black</ion-select-option>
        <ion-select-option value="red">Red</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label>Action Sheet</ion-label>
      <ion-select :interface-options="customActionSheetOptions" interface="action-sheet" placeholder="Select One">
        <ion-select-option value="red">Red</ion-select-option>
        <ion-select-option value="purple">Purple</ion-select-option>
        <ion-select-option value="yellow">Yellow</ion-select-option>
        <ion-select-option value="orange">Orange</ion-select-option>
        <ion-select-option value="green">Green</ion-select-option>
      </ion-select>
    </ion-item>

  </ion-list>
</template>

<script>
import { 
  IonItem, 
  IonLabel, 
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonItem, 
    IonLabel, 
    IonList,
    IonListHeader,
    IonSelect,
    IonSelectOption
  },
  setup() {
    const customAlertOptions: any = {
      header: 'Pizza Toppings',
      subHeader: 'Select your toppings',
      message: '$1.00 per topping',
      translucent: true
    };

    const customPopoverOptions: any = {
      header: 'Hair Color',
      subHeader: 'Select your hair color',
      message: 'Only select your dominant hair color'
    };

    const customActionSheetOptions: any = {
      header: 'Colors',
      subHeader: 'Select your favorite color'
    };
    
    return {
      customAlertOptions,
      customPopoverOptions,
      customActionSheetOptions
    }
  }
});
</script>
```
