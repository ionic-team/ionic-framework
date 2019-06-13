# ion-router

The router is a component for handling routing inside vanilla and Stencil JavaScript projects.

> Note: this component should only be used with vanilla and Stencil JavaScript projects. For Angular projects, use [`ion-router-outlet`](../router-outlet) and the Angular router.

Apps should have a single `ion-router` component in the codebase.
This component controls all interactions with the browser history and it aggregates updates through an event system.

`ion-router` is just a URL coordinator for the navigation outlets of ionic: `ion-nav` and `ion-tabs`.

That means the `ion-router` never touches the DOM, it does NOT show the components or emit any kind of lifecycle events, it just tells `ion-nav` and `ion-tabs` what and when to "show" based on the browser's URL.

In order to configure this relationship between components (to load/select) and URLs, `ion-router` uses a declarative syntax using JSX/HTML to define a tree of routes.


<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<ion-router>
  <ion-route component="page-tabs">
    <ion-route url="/schedule" component="tab-schedule">
      <ion-route component="page-schedule"></ion-route>
      <ion-route url="/session/:sessionId" component="page-session"></ion-route>
    </ion-route>

    <ion-route url="/speakers" component="tab-speaker">
      <ion-route component="page-speaker-list"></ion-route>
      <ion-route url="/session/:sessionId" component="page-session"></ion-route>
      <ion-route url="/:speakerId" component="page-speaker-detail"></ion-route>
    </ion-route>

    <ion-route url="/map" component="page-map"></ion-route>
    <ion-route url="/about" component="page-about"></ion-route>
  </ion-route>

  <ion-route url="/tutorial" component="page-tutorial"></ion-route>
  <ion-route url="/login" component="page-login"></ion-route>
  <ion-route url="/account" component="page-account"></ion-route>
  <ion-route url="/signup" component="page-signup"></ion-route>
  <ion-route url="/support" component="page-support"></ion-route>
</ion-router>

```



## Properties

| Property  | Attribute  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Type      | Default |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `root`    | `root`     | By default `ion-router` will match the routes at the root path ("/"). That can be changed when                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `string`  | `'/'`   |
| `useHash` | `use-hash` | The router can work in two "modes": - With hash: `/index.html#/path/to/page` - Without hash: `/path/to/page`  Using one or another might depend in the requirements of your app and/or where it's deployed.  Usually "hash-less" navigation works better for SEO and it's more user friendly too, but it might requires additional server-side configuration in order to properly work.  On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.  By default, this property is `true`, change to `false` to allow hash-less URLs. | `boolean` | `true`  |


## Events

| Event                | Description                                     | Type                             |
| -------------------- | ----------------------------------------------- | -------------------------------- |
| `ionRouteDidChange`  | Emitted when the route had changed              | `CustomEvent<RouterEventDetail>` |
| `ionRouteWillChange` | Event emitted when the route is about to change | `CustomEvent<RouterEventDetail>` |


## Methods

### `back() => Promise<void>`

Go back to previous page in the window.history.

#### Returns

Type: `Promise<void>`



### `push(url: string, direction?: RouterDirection) => Promise<boolean>`

Navigate to the specified URL.

#### Returns

Type: `Promise<boolean>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
