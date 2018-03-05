# ion-popover-controller

Popover controllers programmatically control the popover component. Popovers can be created and dismissed from the popover controller. View the [Popover](../../popover/Popover) documentation for a full list of options to pass upon creation.

```javascript
async function presentPopover() {
  const popoverController = document.querySelector('ion-popover-controller');
  await popoverController.componentOnReady();

  const popoverElement = await popoverController.create({
    component: 'profile-page',
    ev: event
  });
  return await popoverElement.present();
}
```

<!-- Auto Generated Below -->


## Methods

#### create()


#### dismiss()


#### getTop()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
