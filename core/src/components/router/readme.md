# ion-router

`ion-router` is just a URL coordinator for the navigation outlets of ionic: `ion-nav` and `ion-tabs`.

That means the ion-router never touches the DOM, it does NOT show the components or emit any kind of lifecycle event, it just tell `ion-nav` and `ion-tabs` what to "show" based in the browser's URL.

In order to configure this relationship between components (to load/select) and URLs, ion-router uses a declarative syntax using JSX/HTML to define a tree of routes.

## Tree of routes

The way to structure navigation in an ionic app is by nesting `ion-nav`s and `ion-tabs`, for example, you have an `ion-nav` at the root, where you "push" an page that has an `ion-tabs`, then inside each tab (`ion-tab`) you might have another `ion-nav` since you want navigation independent navigation for each tab.

Obviously this structure is app-dependent, but in any case, nesting router-outlets (ion-nav or ion-tabs) is a common pattern. This is way the routes defined in `ion-router` are not a list of routes, but an tree.

Any route can have a list of nested routes:

```
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




<!-- Auto Generated Below -->


## Properties

#### base

string


#### useHash

boolean


## Attributes

#### base

string


#### use-hash

boolean


## Events

#### ionRouteChanged


## Methods

#### navChanged()


#### push()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
