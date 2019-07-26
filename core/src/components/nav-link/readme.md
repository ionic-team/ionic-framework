# ion-nav-push

`NavPush` is a component used to navigate to the specified component.
It is the element form of `NavController.push()`


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                 | Type                                                                       | Default     |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| `component`       | `component`        | Component to navigate to. Only used if the `routerDirection` is `forward` or `root`.                        | `Function \| HTMLElement \| ViewController \| null \| string \| undefined` | `undefined` |
| `componentProps`  | --                 | Data you want to pass to the component as props. Only used if the `routerDirection` is `forward` or `root`. | `undefined \| { [key: string]: any; }`                                     | `undefined` |
| `routerDirection` | `router-direction` | It specifies the transition direction when navigating to another page.                                      | `"back" \| "forward" \| "root"`                                            | `'forward'` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
