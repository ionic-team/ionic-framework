# @ionic/vue (beta)

Ionic Vue.js specific building blocks on top of [@ionic/core](https://www.npmjs.com/package/@ionic/core) components.

To get started simply install `@ionic/vue` and `@ionic/core` with npm into your project and then register `@ionic/vue` as a plugin to your vue application.

```ts
import Vue from 'vue';
import Ionic from '@ionic/vue';

Vue.use(Ionic);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
```

## Publishing a Native Application

You can now make use of all of the ionic components in your vue application.
If you want to publish your app to the App Store or Google Play you will need to use the ionic cli to execute Capacitor commands to do so.

More information on this can be found here. https://ionicframework.com/docs/cli
If you want to learn more about Capacitor our dedicated site can be found here. https://capacitor.ionicframework.com/

The commands that you will need to execute are below.

```sh
ionic capacitor add
ionic capacitor copy
ionic capacitor run
```

## Current known limitations

This is an beta release of @ionic/vue so please understand that there are some missing pieces but know that many of the components will work.

- The shorthand `v-model` binding is currently not supported
- Stack navigation for deep transitions is under heavy development at this time.

## Related

- [Ionic Core Components](https://www.npmjs.com/package/@ionic/core)
- [Ionic Documentation](https://ionicframework.com/docs/)
- [Ionic Worldwide Slack](http://ionicworldwide.herokuapp.com/)
- [Ionic Forum](https://forum.ionicframework.com/)
- [Ionicons](http://ionicons.com/)
- [Capacitor](https://capacitor.ionicframework.com/)

## License

- [MIT](https://raw.githubusercontent.com/ionic-team/ionic/master/LICENSE)
