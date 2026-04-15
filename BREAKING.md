# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of Ionic Framework.

## Versions

- [Version 9.x](#version-9x)
- [Version 8.x](./BREAKING_ARCHIVE/v8.md)
- [Version 7.x](./BREAKING_ARCHIVE/v7.md)
- [Version 6.x](./BREAKING_ARCHIVE/v6.md)
- [Version 5.x](./BREAKING_ARCHIVE/v5.md)
- [Version 4.x](./BREAKING_ARCHIVE/v4.md)
- [Legacy](https://github.com/ionic-team/ionic-v3/blob/master/CHANGELOG.md)

## Version 9.x

- [Browser and Platform Support](#version-9x-browser-platform-support)
- [Components](#version-9x-components)
  - [Router Outlet](#version-9x-router-outlet)

<h2 id="version-9x-browser-platform-support">Browser and Platform Support</h2>

This section details the desktop browser, JavaScript framework, and mobile platform versions that are supported by Ionic 9.

**Minimum JavaScript Framework Versions**
| Framework | Supported Version     |
| --------- | --------------------- |
| React     | 18+                   |

<h2 id="version-9x-components">Components</h2>

<h4 id="version-9x-router-outlet">Router Outlet</h4>

`ion-router-outlet` now exposes a `swipeGesture` property that controls the swipe-to-go-back gesture per outlet. This property defaults to `true` in `"ios"` mode and `false` in `"md"` mode.

**`swipeBackEnabled` Config Behavior Change**

In React and Vue, the `swipeBackEnabled` config option is now read once when the outlet mounts. Apps that dynamically toggle this config value at runtime should migrate to the `swipeGesture` property instead:

**React:**

```diff
- setupIonicReact({ swipeBackEnabled: someCondition });
+ <IonRouterOutlet swipeGesture={someCondition} />
```

**Vue:**

```diff
- createApp(App).use(IonicVue, { swipeBackEnabled: someCondition })
+ <ion-router-outlet :swipe-gesture="someCondition" />
```

**Disabling Swipe-to-Go-Back**

To disable the gesture on a specific outlet, set `swipeGesture` to `false`:

```tsx
<IonRouterOutlet swipeGesture={false} />
```

The `swipeBackEnabled` config option is still respected as the initial default and does not need to change for apps that set it once at startup.
