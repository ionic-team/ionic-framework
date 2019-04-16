## @ionic/react (beta)

These are React specific building blocks on top of  [@ionic/core](https://www.npmjs.com/package/@ionic/core) components/services.

To get started simply install `@ionic/react` and `@ionic/core` with npm into your project. We recommend you use `create-react-app` to get started
and to use TypeScript for the best experience.

We are currently working on providing more detailed documentation on usage but please refer to our example application for now.
If you would like to see an example app of the implementation please go to our [react conference app](https://github.com/ionic-team/ionic-react-conference-app)

  
# Current Status of Components

Below is a list of components yet to be implemented. More information about 

| Component |
| ------------------ |
| `IonInfiniteScroll` | 
| `IonVirtualScroll` | 

## Publishing a Native Application

You can now make use of all of the ionic components in your React application.
If you want to publish your app to the App Store or Google Play you will need to use the ionic cli to execute Capacitor commands to do so.

More information on this can be found here. https://ionicframework.com/docs/cli
If you want to learn more about Capacitor our dedicated site can be found here. https://capacitor.ionicframework.com/

The commands that you will need to execute are below in your project's root.
```sh
ionic init "My React App" --type=custom
ionic integrations enable capacitor
```

Open the './capacitor.config.json' file in your projects root.
Change `"webDir": "www"` to be `"webDir": "build"` (dependent on your config but create-react-app defaults with this as the build directory)

Then run the following command to get started with either `ios` or `android` platforms.
```
ionic capacitor add <android|ios>
```

After build you build your app you will need to copy your capacitor resources into the build dir so execute the following command.
```
ionic capacitor copy
```

To open your application to build/emulate in Android Studio or Xcode run the `open` command.
```
ionic capacitor open <android|ios>
```

## Related

* [Ionic Documentation](https://ionicframework.com/docs/)
* [Ionic Worldwide Slack](http://ionicworldwide.herokuapp.com/)
* [Ionic Forum](https://forum.ionicframework.com/)
* [Ionicons](http://ionicons.com/)
* [Capacitor](https://capacitor.ionicframework.com/)


## License

* [MIT](https://raw.githubusercontent.com/ionic-team/ionic/master/LICENSE)
