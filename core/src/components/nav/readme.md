# ion-nav

Nav is a standalone component for loading arbitrary components and pushing to new components on to the stack.
Unlike RouterOutlet, Nav is not tied to a particular router. Meaning that if we load a Nav component, and push other components to the stack, they will not affect the apps overall router. This fits use cases where you could have a modal, which needs it's own sub-navigation, but not make it tied to the apps URL.


<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                                                                    | Type                                                                       | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| `animated`     | `animated`      | If `true`, the nav should animate the transition of components. Default to `true`.                                                                                                             | `boolean`                                                                  | `true`      |
| `animation`    | --              | By default `ion-nav` animates transition between pages based in the mode (ios or material design). However, this property allows to create custom transition using `AnimateBuilder` functions. | `AnimationBuilder \| undefined`                                            | `undefined` |
| `delegate`     | --              |                                                                                                                                                                                                | `FrameworkDelegate \| undefined`                                           | `undefined` |
| `rootParams`   | --              | Any parameters for the root component                                                                                                                                                          | `undefined \| { [key: string]: any; }`                                     | `undefined` |
| `root`         | `root`          | Root NavComponent to load                                                                                                                                                                      | `Function \| HTMLElement \| ViewController \| null \| string \| undefined` | `undefined` |
| `swipeGesture` | `swipe-gesture` | If the nav component should allow for swipe-to-go-back.                                                                                                                                        | `boolean \| undefined`                                                     | `undefined` |


## Events

| Event              | Detail | Description                                     |
| ------------------ | ------ | ----------------------------------------------- |
| `ionNavDidChange`  |        | Event fired when the nav has changed components |
| `ionNavWillChange` |        | Event fired when the nav will components        |
| `ionNavWillLoad`   |        | Event fired when Nav will load a component      |


## Methods

### `canGoBack(view?: ViewController | undefined) => Promise<boolean>`

Returns `true` or false if the current view can go back

#### Parameters

| Name   | Type                          | Description |
| ------ | ----------------------------- | ----------- |
| `view` | `ViewController \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `getActive() => Promise<ViewController | undefined>`

Gets the active view

#### Returns

Type: `Promise<ViewController | undefined>`



### `getByIndex(index: number) => Promise<ViewController | undefined>`

Returns the view at the index

#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `index` | `number` |             |

#### Returns

Type: `Promise<ViewController | undefined>`



### `getPrevious(view?: ViewController | undefined) => Promise<ViewController | undefined>`

Gets the previous view

#### Parameters

| Name   | Type                          | Description |
| ------ | ----------------------------- | ----------- |
| `view` | `ViewController \| undefined` |             |

#### Returns

Type: `Promise<ViewController | undefined>`



### `getRouteId() => Promise<RouteID | undefined>`



#### Returns

Type: `Promise<RouteID | undefined>`



### `insert<T extends NavComponent>(insertIndex: number, component: T, componentProps?: ComponentProps<T> | ...`

Inserts a component into the nav stack at the specified index. This is useful if you need to add a component at any point in your navigation stack.

#### Parameters

| Name             | Type                                     | Description |
| ---------------- | ---------------------------------------- | ----------- |
| `insertIndex`    | `number`                                 |             |
| `component`      | `T`                                      |             |
| `componentProps` | `ComponentProps<T> \| null \| undefined` |             |
| `opts`           | `NavOptions \| null \| undefined`        |             |
| `done`           | `TransitionDoneFn \| undefined`          |             |

#### Returns

Type: `Promise<boolean>`



### `insertPages(insertIndex: number, insertComponents: NavComponent[], opts?: NavOptions | null | undefined, don...`

Inserts an array of components into the nav stack at the specified index. The last component in the array will become instantiated as a view, and animate in to become the active view.

#### Parameters

| Name               | Type                              | Description |
| ------------------ | --------------------------------- | ----------- |
| `insertIndex`      | `number`                          |             |
| `insertComponents` | `NavComponent[]`                  |             |
| `opts`             | `NavOptions \| null \| undefined` |             |
| `done`             | `TransitionDoneFn \| undefined`   |             |

#### Returns

Type: `Promise<boolean>`



### `pop(opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Call to navigate back from a current component. Similar to push(), you can also pass navigation options.

#### Parameters

| Name   | Type                              | Description |
| ------ | --------------------------------- | ----------- |
| `opts` | `NavOptions \| null \| undefined` |             |
| `done` | `TransitionDoneFn \| undefined`   |             |

#### Returns

Type: `Promise<boolean>`



### `popTo(indexOrViewCtrl: number | ViewController, opts?: NavOptions | null | undefined, done?: Transitio...`

Pop to a specific index in the navigation stack

#### Parameters

| Name              | Type                              | Description |
| ----------------- | --------------------------------- | ----------- |
| `indexOrViewCtrl` | `ViewController \| number`        |             |
| `opts`            | `NavOptions \| null \| undefined` |             |
| `done`            | `TransitionDoneFn \| undefined`   |             |

#### Returns

Type: `Promise<boolean>`



### `popToRoot(opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Navigate back to the root of the stack, no matter how far back that is.

#### Parameters

| Name   | Type                              | Description |
| ------ | --------------------------------- | ----------- |
| `opts` | `NavOptions \| null \| undefined` |             |
| `done` | `TransitionDoneFn \| undefined`   |             |

#### Returns

Type: `Promise<boolean>`



### `push<T extends NavComponent>(component: T, componentProps?: ComponentProps<T> | null | undefined, opt...`

Push a new component onto the current navigation stack. Pass any additional information along as an object. This additional information is accessible through NavParams

#### Parameters

| Name             | Type                                     | Description |
| ---------------- | ---------------------------------------- | ----------- |
| `component`      | `T`                                      |             |
| `componentProps` | `ComponentProps<T> \| null \| undefined` |             |
| `opts`           | `NavOptions \| null \| undefined`        |             |
| `done`           | `TransitionDoneFn \| undefined`          |             |

#### Returns

Type: `Promise<boolean>`



### `removeIndex(startIndex: number, removeCount?: number, opts?: NavOptions | null | undefined, done?: Transitio...`

Removes a page from the nav stack at the specified index.

#### Parameters

| Name          | Type                              | Description |
| ------------- | --------------------------------- | ----------- |
| `startIndex`  | `number`                          |             |
| `removeCount` | `number`                          |             |
| `opts`        | `NavOptions \| null \| undefined` |             |
| `done`        | `TransitionDoneFn \| undefined`   |             |

#### Returns

Type: `Promise<boolean>`



### `setPages(views: any[], opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Prom...`

Set the views of the current navigation stack and navigate to the last view. By default animations are disabled, but they can be enabled by passing options to the navigation controller.You can also pass any navigation params to the individual pages in the array.

#### Parameters

| Name    | Type                              | Description |
| ------- | --------------------------------- | ----------- |
| `views` | `any[]`                           |             |
| `opts`  | `NavOptions \| null \| undefined` |             |
| `done`  | `TransitionDoneFn \| undefined`   |             |

#### Returns

Type: `Promise<boolean>`



### `setRoot<T extends NavComponent>(component: T, componentProps?: ComponentProps<T> | null | undefined, opt...`

Set the root for the current navigation stack.

#### Parameters

| Name             | Type                                     | Description |
| ---------------- | ---------------------------------------- | ----------- |
| `component`      | `T`                                      |             |
| `componentProps` | `ComponentProps<T> \| null \| undefined` |             |
| `opts`           | `NavOptions \| null \| undefined`        |             |
| `done`           | `TransitionDoneFn \| undefined`          |             |

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
