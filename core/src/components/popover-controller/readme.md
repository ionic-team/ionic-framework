# ion-popover-controller

Popover controllers programmatically control the popover component. Popovers can be created and dismissed from the popover controller. View the [Popover](../popover) documentation for a full list of options to pass upon creation.


<!-- Auto Generated Below -->


## Usage

### Javascript

```javascript
async function presentPopover() {
  const popoverController = document.querySelector('ion-popover-controller');
  await popoverController.componentOnReady();

  const popoverElement = await popoverController.create({
    component: 'profile-page',
    event: event
  });
  return await popoverElement.present();
}
```



## Methods

### `create<T extends ComponentRef>(options: PopoverOptions<T>) => Promise<HTMLIonPopoverElement>`

Create a popover overlay with popover options.

#### Returns

Type: `Promise<HTMLIonPopoverElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open popover overlay.

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonPopoverElement | undefined>`

Get the most recently opened popover overlay.

#### Returns

Type: `Promise<HTMLIonPopoverElement | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
