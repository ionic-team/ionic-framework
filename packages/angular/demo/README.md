# Demo

The purpose of this application is to provide an Angular CLI application where Ionic Core components can be tested in a simple manner. This application allows the developer to experiment with interactions between Angular and Ionic in an easy and safe manner.

## Getting started

**Note:** This application uses the locally built Ionic Core. It does not grab the latest uploaded version or anything. That allows the developer to use this application as they make changes in core. That also means that you **must** build core before building this application. So if you haven't done that yet, go do that first.

To use _this_ application perform the following commands from this directory:

- `npm i`
- `npm start` - to serve the application
- `npm test` - to run the unit tests
- `npm run e2e` - to run the end to end tests

See the `package.json` file for a complete list of script. The above are just the most common.

## Running the Angular CLI

This application installs the Angular CLI locally so you do not need to have it installed globally. You can use `npm` to run any of the `ng` commands. For example:

- `npm run ng build -- --prod` - run a production build
- `npm run ng g component my-cool-thing`
