# ion-nav-link

A navigation link is used to navigate to a specified component. The component can be navigated to by going `forward`, `back` or as a `root` component.

It is the element form of calling the `push()`, `pop()`, and `setRoot()` methods on the navigation controller.


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                       | Type                                                                       | Default     |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| `component`       | `component`        | Component to navigate to. Only used if the `routerDirection` is `"forward"` or `"root"`.                          | `Function \| HTMLElement \| ViewController \| null \| string \| undefined` | `undefined` |
| `componentProps`  | --                 | Data you want to pass to the component as props. Only used if the `"routerDirection"` is `"forward"` or `"root"`. | `undefined \| { [key: string]: any; }`                                     | `undefined` |
| `routerAnimation` | --                 | The transition animation when navigating to another page.                                                         | `((baseEl: any, opts?: any) => Animation) \| undefined`                    | `undefined` |
| `routerDirection` | `router-direction` | The transition direction when navigating to another page.                                                         | `"back" \| "forward" \| "root"`                                            | `'forward'` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
