```html
<!-- Default Refresher -->
<ion-content>
  <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
</ion-content>

<!-- Custom Refresher Properties -->
<ion-content>
  <ion-refresher slot="fixed" pullFactor="0.5" pullMin="100" pullMax="200">
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

### Native Refreshers

Both iOS and Android modes provide refreshers that take advantage of properties exposed by their respective devices that give pull to refresh a fluid, native-like feel. One of the limitations of this is that the refreshers only work on their respective platform devices. For example, the iOS native `ion-refresher` works on an iPhone in iOS mode, but does not work on an Android device in iOS mode.

#### iOS Usage

```html
<ion-content>
  <ion-refresher slot="fixed" contentId="my-content" (ionRefresh)="doRefresh($event)">
    <ion-refresher-content pullingIcon="lines" refreshingSpinner="lines"></ion-refresher-content>
  </ion-refresher>

  <div id="my-content">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">All Inboxes</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-list>
    ...
    </ion-list>
  </div>
</ion-content>
```

Using the iOS native `ion-refresher` requires setting the `pullingIcon` property on `ion-refresher-content` to the value of one of the available spinners. See the [ion-spinner Documentation](https://ionicframework.com/docs/api/spinner#properties) for accepted values. The spinner tick marks will be progressively shown as the user pulls down on the page. Additionally, a `contentId` value must be provided to `ion-refresher`. This corresponds to all elements inside `ion-content` except for `ion-refresher`. This allows for consistent theming while still taking full advantage of the native refresher.

#### Android Usage

Coming soon!