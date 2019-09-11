
# [4.8.0-rc2]

## Features

Dependencies upgraded to work with Ionic Core 4.9

## Bug Fixes

IonPage should be root page for Ionic Pages - fixes [#19146](https://github.com/ionic-team/ionic/issues/19146)

## Breaking Changes

### IonPage should be the parent component of Ionic Pages

`IonPage` is a specialized component that is meant to be the parent container for an Ionic Page, which typically consists of `IonHeader` and `IonContent` components. Previous to RC3, the `@ionic/react-router` library would add this component itself, but this caused some confusion around how `IonPage` should be used and why it was even available. Devs would sometimes include `IonPage` themselves as the parent of their pages, but this could cause issues with page transitions.

To clear up this confusion, we decided to stop adding the `IonPage` component in the framework and offer guidance that devs should use `IonPage` as the base component in their Ionic Pages.

Apps migrating from a previous version to RC2 will need to make sure `IonPage` is used as the root component for every Ionic page. Ionic Pages typically have `IonHeader` and `IonContent` tags and are the components rendered by the routes. The starters used a React Fragment before, and this fragment needs to be changed to `IonPage`. Any other uses of `IonPage` should probably be removed.

Example:

An Ionic Page before RC2 most likely has a React fragment as its root:

``` jsx
<>
  <IonHeader>/* header stuff */</IonHeader>
  <IonContent>/* content stuff */</IonContent>
</>
```

In RC2 and greater, the fragment should be updated to an IonPage component:

``` jsx
<IonPage>
  <IonHeader>/* header stuff */</IonHeader>
  <IonContent>/* content stuff */</IonContent>
</IonPage>
```

### ViewManager

The `<ViewManager />` component is no longer needed and can be removed. The views inside of an `<IonRouterOutlet>` are now managed by an internal stack manager and don't need the explicit ViewManager anymore.

`ViewManager` is now a noop component and shows a warning message while in development. `ViewManager` will be removed in the final release of @ionic/react.

## Other Changes

### Tab Route Setup

Prior to RC2, tabs had to specify a tab name in their routes which helped with the page transitions. This was set up in the form of a regex named parameter like so:

`<Route path="/:tab(tab1)" component={Tab1} exact={true} />`

This is no longer a requirement. Routes setup this way will continue to work, but the complexity in the path can be removed and updated to:

`<Route path="/tab1" component={Tab1} exact={true} />`

# [4.8.0-rc1]

## Features

Dependencies upgraded to work with Ionic Core 4.8

## Bug Fixes

Attributes applied to Ionic Components now show up in the DOM and are visible in devtools

`IonBackButton` now preserves the query string parameters from the referring page: https://github.com/ionic-team/ionic/pull/19150/commits/2e2068ee5ea467636b4454e1106df1d8f05230d2

Supporting class attributes as well as className attributes for Ionic React components: https://github.com/ionic-team/ionic/pull/19150/commits/bef7bc8b1b190bf704fd6960711672bfd7aedfa6, closes [#19107](https://github.com/ionic-team/ionic/issues/19107)

Exporting the previously missing isPlatform method from core: https://github.com/ionic-team/ionic/pull/19150/commits/fc817471582785a00db77ee922a73ccfda42b870, closes [#19122] https://github.com/ionic-team/ionic/issues/19122

# [4.8.0-rc0]

Welcome to React RC! 

### Breaking Changes

There is a new `ViewManager` component exported from @ionic/react-router. If you have an `IonRouterOutlet` component outside of a tabs component, you will need to wrap the `IonRouterOutlet` with the `ViewManager` to preserve the transitions and state management that the IonRouterOutlet provide on its own in the betas.