# Local @ionic/angular test/testapp development

1. `npm install` at the root of `angular`
2. `npm run build.dev` to build local `@ionic/angular` and `@ionic/core`
3. `cd test/testapp` to the test app
4. `npm install` in the test app directory
5. `npm run serve` copies packages and serve the app (see package.json for more options)
6. [http://localhost:4200/](http://localhost:4200/)


# npm link local development

`npm link` doesn't work as expected due to the `devDependency` on `@angular/core`. This is the work around...

    npm run build.link ../ionic-conference-app

When the command above is ran from the `angular` directory, it will build `@ionic/angular` and copy the `dist` directory to the correct location of another local project. In the example above, the end result is that it copies the `dist` directory to `../ionic-conference-app/node_modules/@ionic/angular/dist`. The path given should be relative to the root of this mono repo.

## package.json note

The `package.json` file in this directory references __Ionic 3__ and is in here to get GitHub to properly show the Used By counts on the repo. __Do not remove it!__
