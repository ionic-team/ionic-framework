# ion-platform



<!-- Auto Generated Below -->


## Methods

#### getQueryParam()


#### is()

Depending on the platform the user is on, `is(platformName)` will
return `true` or `false`. Note that the same app can return `true`
for more than one platform name. For example, an app running from
an iPad would return `true` for the platform names: `mobile`,
`ios`, `ipad`, and `tablet`. Additionally, if the app was running
from Cordova then `cordova` would be true, and if it was running
from a web browser on the iPad then `mobileweb` would be `true`.

*
```
import { Platform } from 'ionic-angular';


#### isLandscape()

Returns whether the device is in landscape orientation


#### isPortrait()

Returns whether the device is in portration orientation


#### platforms()


#### ready()


#### versions()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
