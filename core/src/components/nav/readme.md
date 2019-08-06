# ion-nav

Nav is a standalone component for loading arbitrary components and pushing to new components on to the stack.
Unlike RouterOutlet, Nav is not tied to a particular router. Meaning that if we load a Nav component, and push other components to the stack, they will not affect the apps overall router. This fits use cases where you could have a modal, which needs it's own sub-navigation, but not make it tied to the apps URL.


<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                                                                    | Type                                                                                   | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------- |
| `animated`     | `animated`      | If `true`, the nav should animate the transition of components.                                                                                                                                | `boolean`                                                                              | `true`      |
| `animation`    | --              | By default `ion-nav` animates transition between pages based in the mode (ios or material design). However, this property allows to create custom transition using `AnimateBuilder` functions. | `((Animation: Animation, baseEl: any, opts?: any) => Promise<Animation>) \| undefined` | `undefined` |
| `root`         | `root`          | Root NavComponent to load                                                                                                                                                                      | `Function \| HTMLElement \| ViewController \| null \| string \| undefined`             | `undefined` |
| `rootParams`   | --              | Any parameters for the root component                                                                                                                                                          | `undefined \| { [key: string]: any; }`                                                 | `undefined` |
| `swipeGesture` | `swipe-gesture` | If the nav component should allow for swipe-to-go-back.                                                                                                                                        | `boolean \| undefined`                                                                 | `undefined` |


## Events

| Event              | Description                                     | Type                |
| ------------------ | ----------------------------------------------- | ------------------- |
| `ionNavDidChange`  | Event fired when the nav has changed components | `CustomEvent<void>` |
| `ionNavWillChange` | Event fired when the nav will change components | `CustomEvent<void>` |


## Methods

### `canGoBack(view?: ViewController | undefined) => Promise<boolean>`

Returns `true` if the current view can go back.

#### Returns

Type: `Promise<boolean>`



### `getActive() => Promise<ViewController | undefined>`

Get the active view.

#### Returns

Type: `Promise<ViewController | undefined>`



### `getByIndex(index: number) => Promise<ViewController | undefined>`

Get the view at the specified index.

#### Returns

Type: `Promise<ViewController | undefined>`



### `getPrevious(view?: ViewController | undefined) => Promise<ViewController | undefined>`

Get the previous view.

#### Returns

Type: `Promise<ViewController | undefined>`



### `insert<T extends NavComponent>(insertIndex: number, component: T, componentProps?: ComponentProps<T> | null | undefined, opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Inserts a component into the navigation stack at the specified index.
This is useful to add a component at any point in the navigation stack.

#### Returns

Type: `Promise<boolean>`



### `insertPages(insertIndex: number, insertComponents: NavComponent[], opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Inserts an array of components into the navigation stack at the specified index.
The last component in the array will become instantiated as a view, and animate
in to become the active view.

#### Returns

Type: `Promise<boolean>`



### `pop(opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Pop a component off of the navigation stack. Navigates back from the current
component.

#### Returns

Type: `Promise<boolean>`



### `popTo(indexOrViewCtrl: number | ViewController, opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Pop to a specific index in the navigation stack.

#### Returns

Type: `Promise<boolean>`



### `popToRoot(opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Navigate back to the root of the stack, no matter how far back that is.

#### Returns

Type: `Promise<boolean>`



### `push<T extends NavComponent>(component: T, componentProps?: ComponentProps<T> | null | undefined, opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Push a new component onto the current navigation stack. Pass any additional
information along as an object. This additional information is accessible
through NavParams.

#### Returns

Type: `Promise<boolean>`



### `removeIndex(startIndex: number, removeCount?: number, opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Removes a component from the navigation stack at the specified index.

#### Returns

Type: `Promise<boolean>`



### `setPages(views: any[], opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Set the views of the current navigation stack and navigate to the last view.
By default animations are disabled, but they can be enabled by passing options
to the navigation controller. Navigation parameters can also be passed to the
individual pages in the array.

#### Returns

Type: `Promise<boolean>`



### `setRoot<T extends NavComponent>(component: T, componentProps?: ComponentProps<T> | null | undefined, opts?: NavOptions | null | undefined, done?: TransitionDoneFn | undefined) => Promise<boolean>`

Set the root for the current navigation stack to a component.

#### Returns

Type: `Promise<boolean>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
