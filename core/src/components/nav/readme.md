# ion-nav

Nav is a standalone component for loading arbitrary components and pushing to new components on to the stack.
Unlike RouterOutlet, Nav is not tied to a particular router. Meaning that if we load a Nav component, and push other components to the stack, they will not affect the apps overall router. This fits use cases where you could have a modal, which needs it's own sub-navigation, but not make it tied to the apps URL.


<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                            | Type                |
| -------------- | --------------- | ------------------------------------------------------ | ------------------- |
| `animated`     | `animated`      | If the nav should animate the components or not        | `boolean`           |
| `delegate`     | --              |                                                        | `FrameworkDelegate` |
| `rootParams`   | --              | Any parameters for the root component                  | `ComponentProps`    |
| `root`         | `root`          | Root NavComponent to load                              | `NavComponent`      |
| `swipeGesture` | `swipe-gesture` | If the nav component should allow for swipe-to-go-back | `boolean`           |


## Events

| Event              | Description                                     |
| ------------------ | ----------------------------------------------- |
| `ionNavDidChange`  | Event fired when the nav has changed components |
| `ionNavWillChange` | Event fired when the nav will components        |
| `ionNavWillLoad`   | Event fired when Nav will load a component      |


## Methods

| Method        | Description                                                                                                                                                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canGoBack`   | Returns true or false if the current view can go back                                                                                                                                                                                                                  |
| `getActive`   | Gets the active view                                                                                                                                                                                                                                                   |
| `getByIndex`  | Returns the view at the index                                                                                                                                                                                                                                          |
| `getPrevious` | Gets the previous view                                                                                                                                                                                                                                                 |
| `getRouteId`  |                                                                                                                                                                                                                                                                        |
| `insert`      | Inserts a component into the nav stack at the specified index. This is useful if you need to add a component at any point in your navigation stack.                                                                                                                    |
| `insertPages` | Inserts an array of components into the nav stack at the specified index. The last component in the array will become instantiated as a view, and animate in to become the active view.                                                                                |
| `pop`         | Call to navigate back from a current component. Similar to push(), you can also pass navigation options.                                                                                                                                                               |
| `popTo`       | Pop to a specific index in the navigation stack                                                                                                                                                                                                                        |
| `popToRoot`   | Navigate back to the root of the stack, no matter how far back that is.                                                                                                                                                                                                |
| `push`        | Push a new component onto the current navigation stack. Pass any additional information along as an object. This additional information is accessible through NavParams                                                                                                |
| `removeIndex` | Removes a page from the nav stack at the specified index.                                                                                                                                                                                                              |
| `setPages`    | Set the views of the current navigation stack and navigate to the last view. By default animations are disabled, but they can be enabled by passing options to the navigation controller.You can also pass any navigation params to the individual pages in the array. |
| `setRoot`     | Set the root for the current navigation stack.                                                                                                                                                                                                                         |
| `setRouteId`  |                                                                                                                                                                                                                                                                        |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
