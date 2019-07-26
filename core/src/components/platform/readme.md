# platform

The Platform service can be used to get information about your current device. You can get all of the platforms associated with the device using the platforms method, including whether the app is being viewed from a tablet, if it's on a mobile device or browser, and the exact platform (iOS, Android, etc). You can also get the orientation of the device, if it uses right-to-left language direction, and much much more. With this information you can completely customize your app to fit any device.


<!-- Auto Generated Below -->

## Methods

| Method        | Description                                                                                                                                                   |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `is`          | Returns `true`/false based on platform. Available options are android, cordova, core, ios, ipad, iphone, mobile, mobileweb, phablet, tablet, desktop, electron. |
| `platforms`   | Returns an array of platforms that the current device matches.                                                                                                |
| `versions`    | Returns an object that contains the major, minor, and patcher version of the current device.                                                                  |
| `ready`       | Returns a promise that resolves when the native bridge is ready in Cordova, or when the DOM is fully loaded in the browser.                                   |
| `isLandscape` | Returns `true` of false if the device is in landscape.                                                                                                          |
| `isPortrait`  | Returns `true` of false if the device is in portrait.                                                                                                           |





----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
