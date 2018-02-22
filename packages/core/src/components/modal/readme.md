# ion-modal

A Modal is a dialog that appears on top of the app's content, and must be dismissed by the app before interaction can resume. It is useful as a select component when there are a lot of options to choose from, or when filtering items in a list, as well as many other use cases.


### Creating

Modals can be created using a [Modal Controller](../../modal-controller/ModalController). They can be customized by passing modal options in the modal controller's create method.


```javascript
async function presentModal() {
  // initialize controller
  const modalController = document.querySelector('ion-modal-controller');
  await modalController.componentOnReady();

  // create component to open
  const element = document.createElement('ion-page');
  element.innerHTML = `
  <ion-header>
    <ion-toolbar>
      <ion-title>Super Modal</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <h1>Content of doom</h1>
    <div>Here's some more content</div>
    <ion-button class="dismiss">Dismiss Modal</ion-button>
  </ion-content>
  `;

  // listen for close event
  const button = element.querySelector('ion-button');
  button.addEventListener('click', () => {
    modalController.dismiss();
  });

  // present the modal
  const modalElement = await modalController.create({
    component: element
  });
  modalElement.present();
}
```

<!-- Auto Generated Below -->


## Properties

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### component

any

The component to display inside of the modal.


#### cssClass

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### data

any

The data to pass to the modal component.


#### delegate




#### enableBackdropDismiss

boolean

If true, the modal will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enterAnimation



Animation to use when the modal is presented.


#### leaveAnimation



Animation to use when the modal is dismissed.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### overlayId

number


#### showBackdrop

boolean

If true, a backdrop will be displayed behind the modal. Defaults to `true`.


#### willAnimate

boolean

If true, the modal will animate. Defaults to `true`.


## Attributes

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### component

any

The component to display inside of the modal.


#### css-class

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### data

any

The data to pass to the modal component.


#### delegate




#### enable-backdrop-dismiss

boolean

If true, the modal will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enter-animation



Animation to use when the modal is presented.


#### leave-animation



Animation to use when the modal is dismissed.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### overlay-id

number


#### show-backdrop

boolean

If true, a backdrop will be displayed behind the modal. Defaults to `true`.


#### will-animate

boolean

If true, the modal will animate. Defaults to `true`.


## Events

#### ionModalDidDismiss

Emitted after the modal has dismissed.


#### ionModalDidLoad

Emitted after the modal has loaded.


#### ionModalDidPresent

Emitted after the modal has presented.


#### ionModalDidUnload

Emitted after the modal has unloaded.


#### ionModalWillDismiss

Emitted before the modal has dismissed.


#### ionModalWillPresent

Emitted before the modal has presented.


## Methods

#### dismiss()

Dismiss the modal overlay after it has been presented.


#### getUserComponentContainer()


#### present()

Present the modal overlay after it has been created.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
