# ion-router-outlet

RouterOutlet is a component used in routing within an Angular app. RouterOutlet behaves the same way as Angular's built-in RouterOutlet component, but contains the logic needed for animating views in and out.


> Note: this is only meant for Angular projects. For vanilla JavaScript, use `ion-router` and `ion-route` instead.

While RouterOutlet has methods for navigating around, it's recommended to use the navigation methods in Angular's router.


<!-- Auto Generated Below -->


## Properties

| Property    | Attribute  | Description                                                                                                                                                                                    | Type                             |
| ----------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `animated`  | `animated` | If `true`, the router-outlet should animate the transition of components.                                                                                                                      | `boolean`                        |
| `animation` | --         | By default `ion-nav` animates transition between pages based in the mode (ios or material design). However, this property allows to create custom transition using `AnimateBuilder` functions. | `AnimationBuilder \| undefined`  |
| `delegate`  | --         |                                                                                                                                                                                                | `FrameworkDelegate \| undefined` |


## Methods

### `commit(enteringEl: HTMLElement, leavingEl: HTMLElement | undefined, opts?: RouterOutletOptions | undefi...`



#### Parameters

| Name         | Type                               | Description |
| ------------ | ---------------------------------- | ----------- |
| `enteringEl` | `HTMLElement`                      |             |
| `leavingEl`  | `HTMLElement \| undefined`         |             |
| `opts`       | `RouterOutletOptions \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `getRouteId() => Promise<RouteID | undefined>`



#### Returns

Type: `Promise<RouteID | undefined>`



### `setRoot(component: ComponentRef, params?: { [key: string]: any; } | undefined, opts?: RouterOutletOption...`

Set the root component for the given navigation stack

#### Parameters

| Name        | Type                                        | Description |
| ----------- | ------------------------------------------- | ----------- |
| `component` | `Function \| HTMLElement \| null \| string` |             |
| `params`    | `undefined \| { [key: string]: any; }`      |             |
| `opts`      | `RouterOutletOptions \| undefined`          |             |

#### Returns

Type: `Promise<boolean>`



### `setRouteId(id: string, params: { [key: string]: any; } | undefined, direction: number) => Promise<RouteWrite>`



#### Parameters

| Name        | Type                                   | Description |
| ----------- | -------------------------------------- | ----------- |
| `id`        | `string`                               |             |
| `params`    | `undefined \| { [key: string]: any; }` |             |
| `direction` | `number`                               |             |

#### Returns

Type: `Promise<RouteWrite>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
