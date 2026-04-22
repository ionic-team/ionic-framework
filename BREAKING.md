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

- [Components](#version-9x-components)
  - [Legacy Picker](#version-9x-legacy-picker)
  - [Router Outlet](#version-9x-router-outlet)

<h2 id="version-9x-components">Components</h2>

<h4 id="version-9x-legacy-picker">Legacy Picker</h4>

- `ion-picker-legacy` and `ion-picker-legacy-column` have been removed. The legacy picker component has been replaced with an inline picker component.
   - Usages such as `ion-picker-legacy` or `IonPickerLegacy` should be changed to `ion-picker` and `IonPicker`, respectively.
- Remove any usages of `pickerController`. If using React, remove any usages of the `useIonPicker` hook. These controller-based APIs have been removed. Use the inline picker component instead.
- Remove any usages of the `PickerOptions`, `PickerButton`, `PickerColumn`, and `PickerColumnOption` type exports. These types were associated with the legacy picker and have been removed.

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
