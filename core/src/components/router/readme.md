# ion-router

Router is a component for handling routing inside vanilla JavaScript projects. For Angular projects, use `ion-router-outlet` and the Angular router.

Apps should have a single `ion-router` component in the codebase.
This component controls all interactions with the browser history and it aggregates updates through an event system.

`ion-router` is just a URL coordinator for the navigation outlets of ionic: `ion-nav` and `ion-tabs`.

That means the `ion-router` never touches the DOM, it does NOT show the components or emit any kind of lifecycle events, it just tells `ion-nav` and `ion-tabs` what and when to "show" based on the browser's URL.

In order to configure this relationship between components (to load/select) and URLs, `ion-router` uses a declarative syntax using JSX/HTML to define a tree of routes.

If you're using Angular, please see [ion-router-outlet](../router-outlet) instead.



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Type      |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `root`    | `root`     | By default `ion-router` will match the routes at the root path ("/"). That can be changed when                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `string`  |
| `useHash` | `use-hash` | The router can work in two "modes": - With hash: `/index.html#/path/to/page` - Without hash: `/path/to/page`  Using one or another might depend in the requirements of your app and/or where it's deployed.  Usually "hash-less" navigation works better for SEO and it's more user friendly too, but it might requires additional server-side configuration in order to properly work.  On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.  By default, this property is `true`, change to `false` to allow hash-less URLs. | `boolean` |


## Events

| Event                | Description                                     |
| -------------------- | ----------------------------------------------- |
| `ionRouteDidChange`  | Emitted when the route had changed              |
| `ionRouteWillChange` | Event emitted when the route is about to change |


## Methods

| Method       | Description                   |
| ------------ | ----------------------------- |
| `goBack`     |                               |
| `navChanged` |                               |
| `printDebug` |                               |
| `push`       | Navigate to the specified URL |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
