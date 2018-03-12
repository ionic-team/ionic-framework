# End-To-End Testing Scripts

This document describes the process of installing the dependencies for, running, and writing end-to-end tests for ionic core. Your working directory is assumed to be `core`.

---

## Dependencies

Before you proceed, make sure you're running [**Node 7.6.0+**](https://nodejs.org/en/download/):

```sh
node -v # Should be >= 7.6.0
```

And that you've installed all packages:

```sh
npm install
```

## Running The Tests

To run the end-to-end tests:

```
npm run e2e
```

## Writing an End-To-End Test

To create an end-to-end test, you'll need to create a directory containing your test page and the tests themselves. Create a directory in your component's `test` directory. That directory should contain an `index.html` and an `e2e.js` file. So, if I were writing a test called `basic` for the `button` component:

```
button
└── test/
    └── basic/
        ├── e2e.js
        └── index.html
```

In your `e2e.js` file, you can group tests together using [Mocha](https://mochajs.org/)'s `describe` function:

```js
describe('button: basic', () => {
  // Write tests here.
});
```

To register a test, use the `register` method from `scripts/e2e`. The `register` function takes two arguments, a description and a callback. The callback is passed the test [driver](https://www.npmjs.com/package/selenium-webdriver) as its only argument. For async actions, simply return a Promise from your callback.

```js
const { register } = require('../../../../../scripts/e2e');

describe('button: basic', () => {
  register('my test', driver => {
    // Use the driver here.
  });
});
```

The most basic, and most common, test simply navigates to your page to ensure it renders properly. For more complicated cases, you may need to extend the `Page` class provided by the e2e module.

### Simple Navigation Tests

To write a simple navigation test, you can use the `navigate` function from the e2e module:

```js
const { register, navigate } = require('../../../../../scripts/e2e');

describe('button: basic', () => {
  register('navigates', navigate('http://localhost:3333/src/components/button/test/basic'));
});
```

### Extending The `Page` Class

For more complicated tests, you may need to extend the `Page` class:

```js
const { register, Page } = require('../../../../scripts/e2e');;

class ButtonTestPage extends Page {
  constructor(driver) {
    super(driver, 'http://localhost:3333/src/components/button/test/basic');
  }

  someMethod() {
    // ...
  }
}

describe('button: basic', () => {
  register('some test', driver => {
    const page = new ButtonTestPage(driver);
    return page.someMethod();
  });
});
```

## Snapshot

You can also take snapshots of each end-to-end test to check for visual regressions. You'll need to export the `IONIC_SNAPSHOT_KEY` environment variable to upload to the snapshot app. Ask someone from Ionic for the key.

**Snapshot compares a base snapshot made on MacOS with a retina screen. (2560x1600) It does not work for Windows, Linux, or non-retina Macs.**

To take snapshots:

```bash
npm run snapshot
```

To take snapshots of a specific folder:

```bash
npm run snapshot -- -f=toast
```

## TODO

- [ ] Move this script up a directory and use for all packages?
- [ ] Turn off animations and then adjust the wait time accordingly
- [ ] Adjustments will likely be needed when the Snapshot tool has better reporting, for example the tool will likely have `start` and `finish` methods (or some such thing)
