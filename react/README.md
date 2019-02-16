## @ionic/react (alpha)

These are React specific building blocks on top of  [@ionic/core](https://www.npmjs.com/package/@ionic/core) components/services.

To get started simply install `@ionic/react` and `@ionic/core` with npm into your project. We recommend you use `create-react-app` to get started
and to use TypeScript for the best experience.

We are currently working on providing more detailed documentation on usage but please refer to our example application for now.
If you would like to see an example app of the implementation please go to our [react conference app](https://github.com/ionic-team/ionic-react-conference-app)

  
```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { registerIonic } from '@ionic/react';
import App from './App';

registerIonic();

ReactDOM.render(<App />, document.getElementById('root'));
```


# Current Status of Components

Below is a list of components and their current status.  Please know that these will not be final implementations but this list can be used to understand current progress.

| Component | Development Status | Tests |
| ------------------ |:------------------:|:-------------:|
| `IonActionSheet` | :white_check_mark:  | :black_square_button: |
| `IonAlert` | :white_check_mark: | :black_square_button: |
| `IonAnchor` | :white_check_mark: | :black_square_button: |
| `IonApp` | :white_check_mark: | :black_square_button: |
| `IonAvatar` | :white_check_mark: | :black_square_button: |
| `IonBackButton` | :white_check_mark: | :black_square_button: |
| `IonBackdrop` | :white_check_mark: | :black_square_button: |
| `IonBadge` | :white_check_mark: | :black_square_button: |
| `IonButton` | :white_check_mark: | :black_square_button: |
| `IonButtons` | :white_check_mark: | :black_square_button: |
| `IonCard` | :white_check_mark: | :black_square_button: |
| `IonCardContent` | :white_check_mark: | :black_square_button: |
| `IonCardHeader` | :white_check_mark: | :black_square_button: |
| `IonCardSubtitle` | :white_check_mark: | :black_square_button: |
| `IonCardTitle` | :white_check_mark: | :black_square_button: |
| `IonCheckbox` | :white_check_mark: | :black_square_button: |
| `IonChip` | :white_check_mark: | :black_square_button: |
| `IonCol` | :white_check_mark: | :black_square_button: |
| `IonContent` | :white_check_mark: | :black_square_button: |
| `IonDatetime` | :white_check_mark: | :black_square_button: |
| `IonFab` | :white_check_mark: | :black_square_button: |
| `IonFabButton` | :white_check_mark: | :black_square_button: |
| `IonFabList` | :white_check_mark: | :black_square_button: |
| `IonFooter` | :white_check_mark: | :black_square_button: |
| `IonGrid` | :white_check_mark: | :black_square_button: |
| `IonHeader` | :white_check_mark: | :black_square_button: |
| `IonIcon` | :white_check_mark: | :black_square_button: |
| `IonImg` | :white_check_mark: | :black_square_button: |
| `IonInfiniteScroll` | :white_check_mark: | :black_square_button: |
| `IonInput` | :white_check_mark: | :black_square_button: |
| `IonItem` | :white_check_mark: | :black_square_button: |
| `IonItemDivider` | :white_check_mark: | :black_square_button: |
| `IonItemGroup` | :white_check_mark: | :black_square_button: |
| `IonItemOption` | :white_check_mark: | :black_square_button: |
| `IonItemOptions` | :white_check_mark: | :black_square_button: |
| `IonItemSliding` | :white_check_mark: | :black_square_button: |
| `IonLabel` | :white_check_mark: | :black_square_button: |
| `IonList` | :white_check_mark: | :black_square_button: |
| `IonListHeader` | :white_check_mark: | :black_square_button: |
| `IonLoading` | :white_check_mark: | :black_square_button: |
| `IonMenu` | :white_check_mark: | :black_square_button: |
| `IonMenuButton` | :white_check_mark: | :black_square_button: |
| `IonMenuToggle` | :white_check_mark: | :black_square_button: |
| `IonModal` | :white_check_mark: | :black_square_button: |
| `IonNote` | :white_check_mark: | :black_square_button: |
| `IonPicker` | :white_check_mark: | :black_square_button: |
| `IonPickerColumn` | :white_check_mark: | :black_square_button: |
| `IonPopover` | :white_check_mark: | :black_square_button: |
| `IonProgressBar` | :white_check_mark: | :black_square_button: |
| `IonRadio` | :white_check_mark: | :black_square_button: |
| `IonRadioGroup` | :white_check_mark: | :black_square_button: |
| `IonRange` | :white_check_mark: | :black_square_button: |
| `IonRefresher` | :white_check_mark: | :black_square_button: |
| `IonRefresherContent` | :white_check_mark: | :black_square_button: |
| `IonReorder` | :white_check_mark: | :black_square_button: |
| `IonReorderGroup` | :white_check_mark: | :black_square_button: |
| `IonRippleEffect` | :white_check_mark: | :black_square_button: |
| `IonRouterOutlet` | :white_check_mark: | :black_square_button: |
| `IonRow` | :white_check_mark: | :black_square_button: |
| `IonSearchbar` | :white_check_mark: | :black_square_button: |
| `IonSegment` | :white_check_mark: | :black_square_button: |
| `IonSegmentButton` | :white_check_mark: | :black_square_button: |
| `IonSelect` | :white_check_mark: | :black_square_button: |
| `IonSelectOption` | :white_check_mark: | :black_square_button: |
| `IonSelectPopover` | :white_check_mark: | :black_square_button: |
| `IonSkeletonText` | :white_check_mark: | :black_square_button: |
| `IonSlide` | :white_check_mark: | :black_square_button: |
| `IonSlides` | :white_check_mark: | :black_square_button: |
| `IonSpinner` | :white_check_mark: | :black_square_button: |
| `IonSplitPane` | :white_check_mark: | :black_square_button: |
| `IonTab` | :white_check_mark: | :black_square_button: |
| `IonTabBar` | :white_check_mark: | :black_square_button: |
| `IonTabButton` | :white_check_mark: | :black_square_button: |
| `IonTabs` | :white_check_mark: | :black_square_button: |
| `IonText` | :white_check_mark: | :black_square_button: |
| `IonTextarea` | :white_check_mark: | :black_square_button: |
| `IonThumbnail` | :white_check_mark: | :black_square_button: |
| `IonTitle` | :white_check_mark: | :black_square_button: |
| `IonToast` | :white_check_mark: | :black_square_button: |
| `IonToggle` | :white_check_mark: | :black_square_button: |
| `IonToolbar` | :white_check_mark: | :black_square_button: |
| `IonVirtualScroll` | :white_check_mark: | :black_square_button: |

## Publishing a Native Application

You can now make use of all of the ionic components in your React application.
If you want to publish your app to the App Store or Google Play you will need to use the ionic cli to execute Capacitor commands to do so.

More information on this can be found here. https://beta.ionicframework.com/docs/cli
If you want to learn more about Capacitor our dedicated site can be found here. https://capacitor.ionicframework.com/

The commands that you will need to execute are below.
```sh
ionic capacitor add
ionic capacitor copy
ionic capacitor run
```

## Related

* [Ionic Core Components](https://www.npmjs.com/package/@ionic/core)
* [Ionic Documentation](https://beta.ionicframework.com/docs/)
* [Ionic Worldwide Slack](http://ionicworldwide.herokuapp.com/)
* [Ionic Forum](https://forum.ionicframework.com/)
* [Ionicons](http://ionicons.com/)
* [Capacitor](https://capacitor.ionicframework.com/)


## License

* [MIT](https://raw.githubusercontent.com/ionic-team/ionic/master/LICENSE)
