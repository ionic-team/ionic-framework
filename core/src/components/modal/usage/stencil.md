### Inline Modal

```tsx
import { Component, Element, h } from '@stencil/core';
import { actionSheetController } from '@ionic/core';

@Component({
  tag: 'modal-example',
  styleUrl: 'modal-example.css'
})
export class ModalExample {
  @Element() el: any;
  
  componentDidLoad() {
    this.routerOutlet = this.el.closest('ion-router-outlet');
  }
  
  async canDismiss() {
    const actionSheet = await actionSheetController.create({
      header: 'Are you sure you want to discard your changes?',
      buttons: [
        {
          text: 'Discard Changes',
          role: 'destructive'
        },
        {
          text: 'Keep Editing',
          role: 'cancel'
        }
      ]
    });
    
    await actionSheet.present();
    
    const { role } = await actionSheet.onDidDismiss();
    
    if (role === 'destructive') {
      return true;
    }
    
    return false;
  }
  
  render() {
    return (
      <div>
        {/* Default */}
        <ion-modal isOpen={true}>
          <ion-content>Modal Content</ion-content>
        </ion-modal>
        
        {/* Use a trigger */}
        <ion-button id="trigger-button">Click to open modal</ion-button>
        <ion-modal trigger="trigger-button">
          <ion-content>Modal Content</ion-content>
        </ion-modal>
        
        {/* Sheet Modal */}
        <ion-modal
          isOpen={true}
          breakpoints={[0.1, 0.5, 1]}
          initialBreakpoint={0.5}
        >
          <ion-content>Modal Content</ion-content>
        </ion-modal>
        
        {/* Card Modal */}
        <ion-modal
          isOpen={true}
          swipeToClose={true}
          presentingElement={this.routerOutlet}
        >
          <ion-content>Modal Content</ion-content>
        </ion-modal>
        
        {/* Passing Props */}
        <ion-modal isOpen={true}>
          <app-stencil-component title="Ionic"></app-stencil-component>
        </ion-modal>
        
        {/* Require Action Sheet confirmation before dismissing */}
        <ion-modal isOpen={true} canDismiss={() => this.canDismiss()}>
          <ion-content>Modal Content</ion-content>
        </ion-modal>
      </div>
    )
  }
}
```

### Modal Controller 

```tsx
import { Component, h } from '@stencil/core';

import { modalController } from '@ionic/core';

@Component({
  tag: 'modal-example',
  styleUrl: 'modal-example.css'
})
export class ModalExample {
  async presentModal() {
    const modal = await modalController.create({
      component: 'page-modal',
      cssClass: 'my-custom-class'
    });
    await modal.present();
  }
}
```

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'page-modal',
  styleUrl: 'page-modal.css',
})
export class PageModal {
  render() {
    return [
      <ion-list>
        <ion-item>
          <ion-label>Documentation</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Feedback</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Settings</ion-label>
        </ion-item>
      </ion-list>
    ];
  }
}
```

> If you need a wrapper element inside of your modal component, we recommend using a `<div class="ion-page">` so that the component dimensions are still computed properly.

### Passing Data

During creation of a modal, data can be passed in through the `componentProps`.
The previous example can be written to include data:

```tsx
async presentModal() {
  const modal = await modalController.create({
    component: 'page-modal',
    cssClass: 'my-custom-class',
    componentProps: {
      'firstName': 'Douglas',
      'lastName': 'Adams',
      'middleInitial': 'N'
    }
  });
  await modal.present();
}
```

To get the data passed into the `componentProps`, set each one as a `@Prop`:

```tsx
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'page-modal',
  styleUrl: 'page-modal.css',
})
export class PageModal {
  // Data passed in by componentProps
  @Prop() firstName: string;
  @Prop() lastName: string;
  @Prop() middleInitial: string;
}
```

### Dismissing a Modal

A modal can be dismissed by calling the dismiss method on the modal controller and optionally passing any data from the modal.

```tsx
export class ModalPage {
  ...

  dismiss(data?: any) {
    // dismiss the closest modal and optionally pass back data
    (this.el.closest('ion-modal') as any).dismiss({
      'dismissed': true
    });
  }
}
```

After being dismissed, the data can be read in through the `onWillDismiss` or `onDidDismiss` attached to the modal after creation:

```tsx
const { data } = await modal.onWillDismiss();
console.log(data);
```

### Card Modals

Modals in iOS mode have the ability to be presented in a card-style and swiped to close. The card-style presentation and swipe to close gesture are not mutually exclusive, meaning you can pick and choose which features you want to use. For example, you can have a card-style modal that cannot be swiped or a full sized modal that can be swiped.

> Card style modals when running on iPhone-sized devices do not have backdrops. As a result, the `--backdrop-opacity` variable will not have any effect.

```tsx
import { Component, Element, h } from '@stencil/core';

import { modalController } from '@ionic/core';

@Component({
  tag: 'modal-example',
  styleUrl: 'modal-example.css'
})
export class ModalExample {
  @Element() el: any;

  async presentModal() {
    const modal = await modalController.create({
      component: 'page-modal',
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.el.closest('ion-router-outlet'),
    });
    await modal.present();
  }

}
```

In most scenarios, using the `ion-router-outlet` element as the `presentingElement` is fine. In cases where you are presenting a card-style modal from within another modal, you should pass in the top-most `ion-modal` element as the `presentingElement`.

```tsx
async presentModal() {
  const modal = await modalController.create({
    component: 'page-modal',
    cssClass: 'my-custom-class',
    swipeToClose: true,
    presentingElement: await modalController.getTop() // Get the top-most ion-modal
  });
  await modal.present();
}
```


### Sheet Modals

**Controller**
```tsx
import { Component, Element, h } from '@stencil/core';

import { modalController } from '@ionic/core';

@Component({
  tag: 'modal-example',
  styleUrl: 'modal-example.css'
})
export class ModalExample {
  @Element() el: any;

  async presentModal() {
    const modal = await modalController.create({
      component: 'page-modal',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1]
      
    });
    await modal.present();
  }
}
```

**Inline**
```tsx
import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'modal-example',
  styleUrl: 'modal-example.css'
})
export class ModalExample {
  @State() isModalOpen: boolean = false;

  render() {
    return [
      <ion-modal
        isOpen={isModalOpen} 
        initialBreakpoint={0.5} 
        breakpoints={[0, 0.5, 1]}
      >
        <page-modal></page-modal>
      <ion-modal>
    ]
  }
}
```