# ion-route

The route component takes a component and renders it when the Browser URl matches the url property.

> Note: this component should only be used with vanilla and Stencil JavaScript projects. For Angular projects, use [`ion-router-outlet`](../router-outlet) and the Angular router.

<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute   | Description                                                                                                                                                                                                                                                            | Type                                   | Default     |
| ------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `component` _(required)_ | `component` | Name of the component to load/select in the navigation outlet (`ion-tabs`, `ion-nav`) when the route matches.  The value of this property is not always the tagname of the component to load, in `ion-tabs` it actually refers to the name of the `ion-tab` to select. | `string`                               | `undefined` |
| `componentProps`         | --          | A key value `{ 'red': true, 'blue': 'white'}` containing props that should be passed to the defined component when rendered.                                                                                                                                           | `undefined \| { [key: string]: any; }` | `undefined` |
| `url`                    | `url`       | Relative path that needs to match in order for this route to apply.  Accepts paths similar to expressjs so that you can define parameters in the url /foo/:bar where bar would be available in incoming props.                                                         | `string`                               | `''`        |


## Events

| Event                 | Description                                                         | Type               |
| --------------------- | ------------------------------------------------------------------- | ------------------ |
| `ionRouteDataChanged` | Used internally by `ion-router` to know when this route did change. | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
