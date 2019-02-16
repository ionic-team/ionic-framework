# Build Scripts

## Release

The deploy scripts at the root, make a new release of all the packages in this monorepo.
All packages will be released with the same version.

In order to make a new release:

1. `npm run release.prepare`
2. Review/update changelog
3. Commit updates using the package name and version number as the commit message.
4. `npm run release`
5. :tada:


## Prerelease

It's also possible to make prereleases of individual packages (@ionic/core, @ionic/angular).
In order to do so, move to the package you want to make a new release and execute:
```
npm run prerelease
```

It will publish a new prerelease in NPM, but it will not create any new git tag
or update the CHANGELOG.
