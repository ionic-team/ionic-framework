# ion-router-outlet

RouterOutlet is a component used in routing within an Angular app. RouterOutlet behaves the same way as Angular's built-in RouterOutlet component, but contains the logic needed for animating views in and out.


> Note: this is only meant for Angular projects. For vanilla JavaScript, use `ion-router` and `ion-route` instead.

While RouterOutlet has methods for navigating around, it's recommended to use the navigation methods in Angular's router.


<!-- Auto Generated Below -->


## Properties

| Property           | Attribute  | Description | Type                |
| ------------------ | ---------- | ----------- | ------------------- |
| `animated`         | `animated` |             | `boolean`           |
| `animationBuilder` | --         |             | `AnimationBuilder`  |
| `delegate`         | --         |             | `FrameworkDelegate` |


## Events

| Event              | Description |
| ------------------ | ----------- |
| `ionNavDidChange`  |             |
| `ionNavWillChange` |             |
| `ionNavWillLoad`   |             |


## Methods

| Method       | Description                                           |
| ------------ | ----------------------------------------------------- |
| `commit`     |                                                       |
| `getRouteId` | Returns the ID for the current route                  |
| `setRoot`    | Set the root component for the given navigation stack |
| `setRouteId` |                                                       |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
