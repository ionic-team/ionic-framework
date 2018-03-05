# npm link local development

`npm link` doesn't work as expected due to the `devDependency` on `@angular/core`. This is the work around...

    npm run build.link ../ionic-conference-app

When the command above is ran from the `packages/angular` directory, it will build `@ionic/angular` and copy the `dist` directory to the correct location of another local project. In the example above, the end result is that it copies the `dist` directory to `../ionic-conference-app/node_modules/@ionic/angular/dist`. The path given should be relative to the root of this mono repo.


# Deploy

1. `npm run prepare.deploy`
2. Review/update changelog
3. Commit updates using the package name and version number as the commit message.
4. `npm run deploy`
5. :tada: