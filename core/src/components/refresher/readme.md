# ion-refresher

The refresher provides pull-to-refresh functionality on a content component.
The pull-to-refresh pattern lets a user pull down on a list of data using touch
in order to retrieve more data.

Data should be modified during the refresher's output events. Once the async
operation has completed and the refreshing should end, call `complete()` on the
refresher.



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default Refresher -->
<ion-content>
  <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
</ion-content>

<!-- Custom Refresher Content -->
<ion-content>
  <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
    <ion-refresher-content
      pullingIcon="arrow-dropdown"
      pullingText="Pull to refresh"
      refreshingSpinner="circles"
      refreshingText="Refreshing...">
    </ion-refresher-content>
  </ion-refresher>
</ion-content>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'refresher-example',
  templateUrl: 'refresher-example.html',
  styleUrls: ['./refresher-example.css'],
})
export class RefresherExample {
  constructor() {}

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
```


### Javascript

```html
<!-- Default Refresher -->
<ion-content>
  <ion-refresher slot="fixed">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
</ion-content>

<!-- Custom Refresher Content -->
<ion-content>
  <ion-refresher slot="fixed">
    <ion-refresher-content
      pulling-icon="arrow-dropdown"
      pulling-text="Pull to refresh"
      refreshing-spinner="circles"
      refreshing-text="Refreshing...">
    </ion-refresher-content>
  </ion-refresher>
</ion-content>
```



## Properties

| Property           | Attribute           | Description                                                                                                                                       | Type      | Default             |
| ------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------- |
| `closeDuration`    | `close-duration`    | Time it takes to close the refresher.                                                                                                             | `string`  | `'280ms'`           |
| `disabled`         | `disabled`          | If `true`, the refresher will be hidden.                                                                                                          | `boolean` | `false`             |
| `pullMax`          | `pull-max`          | The maximum distance of the pull until the refresher will automatically go into the `refreshing` state. Defaults to the result of `pullMin + 60`. | `number`  | `this.pullMin + 60` |
| `pullMin`          | `pull-min`          | The minimum distance the user must pull down until the refresher will go into the `refreshing` state.                                             | `number`  | `60`                |
| `snapbackDuration` | `snapback-duration` | Time it takes the refresher to to snap back to the `refreshing` state.                                                                            | `string`  | `'280ms'`           |


## Events

| Event        | Description                                                                                                                                                                                                                                                                  | Detail               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `ionPull`    | Emitted while the user is pulling down the content and exposing the refresher.                                                                                                                                                                                               | void                 |
| `ionRefresh` | Emitted when the user lets go of the content and has pulled down further than the `pullMin` or pulls the content down and exceeds the pullMax. Updates the refresher state to `refreshing`. The `complete()` method should be called when the async operation has completed. | RefresherEventDetail |
| `ionStart`   | Emitted when the user begins to start pulling down.                                                                                                                                                                                                                          | void                 |


## Methods

### `cancel() => void`

Changes the refresher's state from `refreshing` to `cancelling`.

#### Returns

Type: `void`



### `complete() => void`

Call `complete()` when your async operation has completed.
For example, the `refreshing` state is while the app is performing
an asynchronous operation, such as receiving more data from an
AJAX request. Once the data has been received, you then call this
method to signify that the refreshing has completed and to close
the refresher. This method also changes the refresher's state from
`refreshing` to `completing`.

#### Returns

Type: `void`



### `getProgress() => Promise<number>`

A number representing how far down the user has pulled.
The number `0` represents the user hasn't pulled down at all. The
number `1`, and anything greater than `1`, represents that the user
has pulled far enough down that when they let go then the refresh will
happen. If they let go and the number is less than `1`, then the
refresh will not happen, and the content will return to it's original
position.

#### Returns

Type: `Promise<number>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
