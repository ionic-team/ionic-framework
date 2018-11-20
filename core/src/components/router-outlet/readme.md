# ion-router-outlet

RouterOutlet is a component used in routing within an Angular app. RouterOutlet behaves the same way as Angular's built-in RouterOutlet component, but contains the logic needed for animating views in and out.


> Note: this is only meant for Angular projects. For vanilla JavaScript, use `ion-router` and `ion-route` instead.

While RouterOutlet has methods for navigating around, it's recommended to use the navigation methods in Angular's router.


<!-- Auto Generated Below -->


## Properties

| Property    | Attribute  | Description                                                                                                                                                                                    | Type                            | Default     |
| ----------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------- |
| `animated`  | `animated` | If `true`, the router-outlet should animate the transition of components.                                                                                                                      | `boolean`                       | `true`      |
| `animation` | --         | By default `ion-nav` animates transition between pages based in the mode (ios or material design). However, this property allows to create custom transition using `AnimateBuilder` functions. | `AnimationBuilder \| undefined` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
