# @ionic/angular

Ionic Angular specific building blocks on top of [@ionic/core](https://www.npmjs.com/package/@ionic/core) components.


## Related

* [Ionic Core Components](https://www.npmjs.com/package/@ionic/core)
* [Ionic Documentation](https://ionicframework.com/docs/)
* [Ionic Worldwide Slack](http://ionicworldwide.herokuapp.com/)
* [Ionic Forum](https://forum.ionicframework.com/)
* [Ionicons](http://ionicons.com/)
* [Stencil](https://stenciljs.com/)
* [Stencil Worldwide Slack](https://stencil-worldwide.herokuapp.com/)
* [Capacitor](https://capacitor.ionicframework.com/)


## License

* [MIT](https://raw.githubusercontent.com/ionic-team/ionic/master/LICENSE)

## Testing ng-add in ionic

1. Pull the latest from master
2. Build ionic/angular: `npm run build`
3. Run `npm link` from ionic/angular directory
4. Create a blank angular project

```
ng new add-test
// Say yes to including the router, we need it
cd add-test
```

5. To run schematics locally, we need the schematics-cli (once published, this will not be needed)

```
npm install @angular-devkit/schematics-cli
```

6. Link `@ionic/angular`

```
npm link @ionic/angular
```


7. Run the local copy of the ng-add schematic

```
$ npx schematics @ionic/angular:ng-add
```


You'll now be able to add ionic components to a vanilla Angular app setup.
