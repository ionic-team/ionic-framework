# [4.8.0-rc1]

## Features

Dependencies upgraded to work with Ionic Core 4.8

## Bug Fixes

`IonBackButton` now preserves the query string parameters from the referring page: https://github.com/ionic-team/ionic/pull/19150/commits/2e2068ee5ea467636b4454e1106df1d8f05230d2

Supporting class attributes as well as className attributes for Ionic React components: https://github.com/ionic-team/ionic/pull/19150/commits/bef7bc8b1b190bf704fd6960711672bfd7aedfa6, closes [#19107](https://github.com/ionic-team/ionic/issues/19107)

Exporting the previously missing isPlatform method from core: https://github.com/ionic-team/ionic/pull/19150/commits/fc817471582785a00db77ee922a73ccfda42b870, closes [#19122] https://github.com/ionic-team/ionic/issues/19122

# [4.8.0-rc0]

Welcome to React RC! 

### Breaking Changes

There is a new `ViewManager` component exported from @ionic/react-router. If you have an `IonRouterOutlet` component outside of a tabs component, you will need to wrap the `IonRouterOutlet` with the `ViewManager` to preserve the transitions and state management that the IonRouterOutlet provide on its own in the betas.