# ion-loading-controller

An overlay that can be used to indicate activity while blocking user
interaction. The loading indicator appears on top of the app's content,
and can be dismissed by the app to resume user interaction with
the app. It includes an optional backdrop, which can be disabled
by setting `showBackdrop: false` upon creation.

### Creating
You can pass all of the loading options in the first argument of
the create method: `create(opts)`. The spinner name should be
passed in the `spinner` property, and any optional HTML can be passed
in the `content` property. If you do not pass a value to `spinner`
the loading indicator will use the spinner specified by the mode. To
set the spinner name across the app, set the value of `loadingSpinner`
in your app's config. To hide the spinner, set `loadingSpinner: 'hide'`
in the app's config or pass `spinner: 'hide'` in the loading
options. See the [create](#create) method below for all available options.

### Dismissing
The loading indicator can be dismissed automatically after a specific
amount of time by passing the number of milliseconds to display it in
the `duration` of the loading options. By default the loading indicator
will show even during page changes, but this can be disabled by setting
`dismissOnPageChange` to `true`. To dismiss the loading indicator after
creation, call the `dismiss()` method on the Loading instance. The
`onDidDismiss` function can be called to perform an action after the loading
indicator is dismissed.

>Note that after the component is dismissed, it will not be usable anymore
and another one must be created. This can be avoided by wrapping the
creation and presentation of the component in a reusable function as shown
in the `usage` section below.


<!-- Auto Generated Below -->


## Methods

#### create()

Create a loading overlay and pass options to it



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
