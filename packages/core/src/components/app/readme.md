# ion-app



<!-- Auto Generated Below -->


## Events

#### exitApp


## Methods

#### getExternalNavOccuring()

Returns whether an external navigation event is occuring
This API is not meant for public usage and could
change at any time


#### getExternalNavPromise()

Returns the promise set by an external navigation system
This API is not meant for public usage and could
change at any time


#### getNavByIdOrName()


#### getRootNavs()

Returns an array of top level Navs


#### getTopNavs()


#### isEnabled()

Returns whether the application is enabled or not


#### isScrolling()

Boolean if the app is actively scrolling or not.


#### registerBackButtonAction()

The back button event is triggered when the user presses the native
platform's back button, also referred to as the "hardware" back button.
This event is only used within Cordova apps running on Android and
Windows platforms. This event is not fired on iOS since iOS doesn't come
with a hardware back button in the same sense an Android or Windows device
does.

Registering a hardware back button action and setting a priority allows
apps to control which action should be called when the hardware back
button is pressed. This method decides which of the registered back button
actions has the highest priority and should be called.


#### setExternalNavPromise()

Updates the Promise set by an external navigation system
This API is not meant for public usage and could
change at any time


#### setScrolling()


#### updateExternalNavOccuring()

Updates whether an external navigation event is occuring
This API is not meant for public usage and could
change at any time



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
