# End-to-end Testing Scripts

The end-to-end testing scripts consist of the following modules:

1. `e2e` - the test controller and test utilities
1. `run-e2e` - the script that npm uses to kick this stuff off
1. `E2ETestPage` - a base class for end-to-end tests
1. `Snapshot` - the snapshot tool, copied from the `index.js` file in the [Snapshot Repo](https://github.com/ionic-team/snapshot) (private)

## Writing End-to-end Tests

Each end-to-end test file is NodeJS ES2015 script that contains at least one `describe` and registers at least one case.

In general, writing an end-to-end tests consists of the following steps:

1. create a `e2e.js` file
1. extend the `Page` class to perform the extra actions a page needs to do (if any)
1. register each test you would like to run using the `register` method from the `e2e` module, the `register` method takes two parameters: a test description and a callback function that contains the test, the callback is passed the selenium driver that is in use for the test

The most basic end-to-end test just navigates to the page in order to verify that it draws properly. In this case, it is not necessary to extend the E2ETestPage class. The base class contains a navigate method that goes to the page and waits for it to load. The test just needs to instantiate the page with the proper URL and call the navigate. Such a test looks like this:

```ts
const { register, navigate } = require('../../../../scripts/e2e');

describe('button: basic', () => {
  register('navigates', navigate('http://localhost:3333/src/components/button/test/basic'));
});
```

For more complicated tests, it may be necessary to extend the base E2ETestPage class to add perform more actions that can then be used in the tests. Such a test may look like this:

```ts
const { By, until } = require('selenium-webdriver');
const { register, Page } = require('../../../../scripts/e2e');;

class ActionSheetE2ETestPage extends Page {
  constructor(driver) {
    super(driver, 'http://localhost:3333/src/components/action-sheet/test/basic');
  }

  present(buttonId) {
    this.navigate();
    this.driver.findElement(By.id(buttonId)).click();
    this.driver.wait(until.elementLocated(By.css('.action-sheet-container')));
    return this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.action-sheet-container'))));
  }
}

describe('action-sheet: basic', () => {
  register('navigates', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.navigate();
  });

  describe('present', () => {
    register('shows basic', driver => {
      const page = new ActionSheetE2ETestPage(driver);
      return page.present('basic');
    });

    register('shows noBackdropDismiss',  (driver)  => {
      const page = new ActionSheetE2ETestPage(driver);
      return page.present('noBackdropDismiss');
    });
  });
});
```

Note that you generally do not have to `await` any of the async actions in your tests. Selenium has a call-chain that handles all of that so long as the final promise is waiting upon, and the `register` function takes care of that for you.

## Running the Tests

To run the tests, just use npm from the `packages/core` directory under the `ionic` project.

* `npm run e2e`
* `npm run snapshot`

## TODO Items

1. this script could probably be used for other packages and should be moved back a directory, perhaps the same for the base class as well, that needs to be figured out as we go
1. turn off animations and then adjust the wait time accordingly
1. adjustments will likely be needed when the Snapshot tool has better reporting, for example the tool will likely have `start` and `finish` methods (or some such thing)
1. cycle through the various platforms (or at least iOS and Android) like the current `ionic-angular` does (I think that is currently handled via `gulp`, needs to be looked into)
1. the current Snapshots seem to have some funky boardering issues when uploaded, may need to look into that
