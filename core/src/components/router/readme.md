# ion-router

You should have one single `ion-router` component in your project. This component controls all interactions with the browser history and it aggregates updates through an event system.

`ion-router` is just a URL coordinator for the navigation outlets of ionic: `ion-nav` and `ion-tabs`.

That means the ion-router never touches the DOM, it does NOT show the components or emit any kind of lifecycle events, it just tell `ion-nav` and `ion-tabs` what and when to "show" based in the browser's URL.

In order to configure this relationship between components (to load/select) and URLs, ion-router uses a declarative syntax using JSX/HTML to define a tree of routes.

If you're using Angular, please see [ion-router-outlet](../router-outlet) instead.

## Ecosystem of components

### Configuration

- <ion-router>
- <ion-route>
- <ion-router-redirect>

### Outlets

- <ion-nav>
- <ion-router-outlet>
- <ion-tab>


## Tree of routes

The way to structure navigation in an ionic app is by nesting `ion-nav`s and `ion-tabs`, for example, you have an `ion-nav` at the root, where you "push" an page that has an `ion-tabs`, then inside each tab (`ion-tab`) you might have another `ion-nav` since you might want independent navigation for each tab.

Obviously this structure is app-dependent, but in any case, nesting router-outlets (ion-nav or ion-tabs) is a common pattern. This is why the routes defined in `ion-router` are not a list of routes, but an tree.

Any route can have a list of nested routes:

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

This hierarchy of routes matches the hierarchy of how `ion-tab`s and `ion-nav`s are nested together.

## Router configuration

## Router guards and redirections

## Navigating Statically

## Navigating Dynamically

## URL params and data passing

## JSX reactiviness


<!-- Auto Generated Below -->


## Properties

#### root

string

By default `ion-router` will match the routes at the root path ("/").
That can be changed when

T


#### useHash

boolean

The router can work in two "modes":
- With hash: `/index.html#/path/to/page`
- Without hash: `/path/to/page`

Using one or another might depend in the requirements of your app and/or where it's deployed.

Usually "hash-less" navigation works better for SEO and it's more user friendly too, but it might
requires aditional server-side configuration in order to properly work.

On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.

By default, this property is `true`, change to `false` to allow hash-less URLs.


## Attributes

#### root

string

By default `ion-router` will match the routes at the root path ("/").
That can be changed when

T


#### use-hash

boolean

The router can work in two "modes":
- With hash: `/index.html#/path/to/page`
- Without hash: `/path/to/page`

Using one or another might depend in the requirements of your app and/or where it's deployed.

Usually "hash-less" navigation works better for SEO and it's more user friendly too, but it might
requires aditional server-side configuration in order to properly work.

On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.

By default, this property is `true`, change to `false` to allow hash-less URLs.


## Events

#### ionRouteDidChange


#### ionRouteWillChange


## Methods

#### navChanged()


#### printDebug()


#### push()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
