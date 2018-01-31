# Demo

The purpose of this application is to provide an Angular CLI application where Ionic Core components can be tested in a simple manner. This application allows the developer to experiment with interactions between Angular and Ionic in an easy and safe manner.

## Getting started

**Note:** This application now uses the last published `@ionic/core` package. To test against changes that you have made locally to core use `npm link` (see below). 

To use _this_ application perform the following commands from this directory:

- `npm i`
- `npm start` - to serve the application
- `npm test` - to run the unit tests
- `npm run e2e` - to run the end to end tests

See the `package.json` file for a complete list of scripts. The above are just the most common.

## Running the Angular CLI

This application installs the Angular CLI locally so you do not need to have it installed globally. You can use `npm` to run any of the `ng` commands. For example:

- `npm run ng build -- --prod` - run a production build
- `npm run ng g component my-cool-thing`

## Testing Local Changes

In order to test local changes they need to be copied into `node_modules` after the initial `npm i`

1. In `packages/core`, run `npm run build`
1. In `packages/demos/angular`, run `rm -rf node_modules/\@ionic/core/dist`
1. In `packages/demos/angular`, run `cp -R ../../core/dist node_modules/\@ionic/core/dist`

Use a similar procedure if you want to test local changes to `@ionic/angular`

**Note:** A couple of short scripts have been created to handle the copy bits. Just run `./cpang.sh` or `./cpcore.sh` from 
`packages/demos/angular` after you have built `@ionic/angular` or `@ionic/core`.
