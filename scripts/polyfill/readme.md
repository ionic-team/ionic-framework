## polyfills.js

Contains all polyfills needed to work on the largest range of devices. This is the default polyfill.

### Targets:

- Android 4.4.2 and above
- iOS back to iOS 8

### Includes:

- All ES6 features
- zone.js
- ES7 reflection


## polyfills.modern.js

A limited of set of polyfills to work on more modern browsers. This file limits the number of ES6 polyfills which are already natively included in modern browsers.

### Targets:

- Android 5.0 and above
- iOS 9 and above

### Includes:

- zone.js
- ES7 reflection,
- ES6 polyfills, except for:

new regexp features,
math features,
symbols,
typed arrays,
weak maps / weak sets


## polyfills.ng.js

Only the required polyfill for Angular. This does not come with any ES6 polyfills. Note that all polyfill files listed here included the required polyfills for Angular to work correctly.

### Targets:

- Android 5.0 and above
- iOS 10 and above

### Includes:

- zone.js
- ES7 reflection


## ECMAScript 6 Compatibility

To easily judge which polyfill you may need you can check this [ES6 support table](https://kangax.github.io/compat-table/es6/).
