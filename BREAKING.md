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
  - [Legacy Picker](#version-9x-legacy-picker)
  - [Router Outlet](#version-9x-router-outlet)
- [Framework Specific](#version-9x-framework-specific)
  - [React](#version-9x-react)
  - [Vue](#version-9x-vue)

<h2 id="version-9x-browser-platform-support">Browser and Platform Support</h2>

This section details the desktop browser, JavaScript framework, and mobile platform versions that are supported by Ionic 9.

**Minimum JavaScript Framework Versions**
| Framework | Supported Version     |
| --------- | --------------------- |
| React     | 18+                   |

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

<h2 id="version-9x-framework-specific">Framework Specific</h2>

<h4 id="version-9x-react">React</h4>

The `@ionic/react-router` package now requires React Router v6. React Router v5 is no longer supported.

**Minimum Version Requirements**
| Package | Supported Version |
| ---------------- | ----------------- |
| react-router     | 6.0.0+            |
| react-router-dom | 6.0.0+            |

React Router v6 introduces several API changes that will require updates to your application's routing configuration:

**Route Definition Changes**

The `component` prop has been replaced with the `element` prop, which accepts JSX:

```diff
- <Route path="/home" component={Home} exact />
+ <Route path="/home" element={<Home />} />
```

**Redirect Changes**

The `<Redirect>` component has been replaced with `<Navigate>`:

```diff
- import { Redirect } from 'react-router-dom';
+ import { Navigate } from 'react-router-dom';

- <Redirect to="/home" />
+ <Navigate to="/home" replace />
```

**Nested Route Paths**

Routes that contain nested routes or child `IonRouterOutlet` components need a `/*` suffix to match sub-paths:

```diff
- <Route path="/tabs" element={<Tabs />} />
+ <Route path="/tabs/*" element={<Tabs />} />
```

**Accessing Route Parameters**

Route parameters are now accessed via the `useParams` hook instead of props:

```diff
- import { RouteComponentProps } from 'react-router-dom';
+ import { useParams } from 'react-router-dom';

- const MyComponent: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
-   const id = match.params.id;
+ const MyComponent: React.FC = () => {
+   const { id } = useParams<{ id: string }>();
```

**RouteComponentProps Removed**

The `RouteComponentProps` type and its `history`, `location`, and `match` props are no longer available in React Router v6. Use the equivalent hooks instead:

- `history` -> `useNavigate` (see below) or `useIonRouter`
- `match.params` -> `useParams` (covered above)
- `location` -> `useLocation`

```diff
- import { RouteComponentProps } from 'react-router-dom';
+ import { useNavigate, useLocation } from 'react-router-dom';
+ import { useIonRouter } from '@ionic/react';

- const MyComponent: React.FC<RouteComponentProps> = ({ history, location }) => {
-   history.push('/path');
-   history.replace('/path');
-   history.goBack();
-   console.log(location.pathname);
+ const MyComponent: React.FC = () => {
+   const navigate = useNavigate();
+   const router = useIonRouter();
+   const location = useLocation();
+   // In an event handler or useEffect:
+   navigate('/path');
+   navigate('/path', { replace: true });
+   router.goBack();
+   console.log(location.pathname);
```

**Exact Prop Removed**

The `exact` prop is no longer needed. React Router v6 routes match exactly by default. To match sub-paths, use a `/*` suffix on the path:

```diff
- <Route path="/home" exact />
+ <Route path="/home" />
```

**Render Prop Removed**

The `render` prop has been replaced with the `element` prop:

```diff
- <Route path="/foo" render={(props) => <Foo {...props} />} />
+ <Route path="/foo" element={<Foo />} />
```

**Programmatic Navigation**

The `useHistory` hook has been replaced with `useNavigate`:

```diff
- import { useHistory } from 'react-router-dom';
+ import { useNavigate } from 'react-router-dom';
+ import { useIonRouter } from '@ionic/react';

- const history = useHistory();
+ const navigate = useNavigate();
+ const router = useIonRouter();

- history.push('/path');
+ navigate('/path');

- history.replace('/path');
+ navigate('/path', { replace: true });

- history.goBack();
+ router.goBack();
```

**Custom History Prop Removed**

The `history` prop has been removed from `IonReactRouter`, `IonReactHashRouter`, and `IonReactMemoryRouter`. React Router v6's `BrowserRouter`, `HashRouter`, and `MemoryRouter` no longer accept custom `history` objects.

```diff
- import { createBrowserHistory } from 'history';
- const history = createBrowserHistory();
- <IonReactRouter history={history}>
+ <IonReactRouter>
```

For `IonReactMemoryRouter` (commonly used in tests), use `initialEntries` instead:

```diff
- import { createMemoryHistory } from 'history';
- const history = createMemoryHistory({ initialEntries: ['/start'] });
- <IonReactMemoryRouter history={history}>
+ <IonReactMemoryRouter initialEntries={['/start']}>
```

**IonRedirect Removed**

The `IonRedirect` component has been removed. Use React Router's `<Navigate>` component instead:

```diff
- import { IonRedirect } from '@ionic/react';
- <IonRedirect path="/old" to="/new" exact />
+ import { Navigate } from 'react-router-dom';
+ <Route path="/old" element={<Navigate to="/new" replace />} />
```

**Path Regex Constraints Removed**

React Router v6 no longer supports regex constraints in path parameters (e.g., `/:tab(sessions)`). Use literal paths instead:

```diff
- <Route path="/:tab(sessions)" component={SessionsPage} />
- <Route path="/:tab(sessions)/:id" component={SessionDetail} />
+ <Route path="/sessions" element={<SessionsPage />} />
+ <Route path="/sessions/:id" element={<SessionDetail />} />
```

**IonRoute API Changes**

The `IonRoute` component follows the same API changes as React Router's `<Route>`. The `render` prop has been replaced with `element`, and the `exact` prop has been removed:

```diff
- <IonRoute path="/foo" exact render={(props) => <Foo {...props} />} />
+ <IonRoute path="/foo" element={<Foo />} />
```

For more information on migrating from React Router v5 to v6, refer to the [React Router v6 Upgrade Guide](https://reactrouter.com/6.28.0/upgrading/v5).

<h4 id="version-9x-vue">Vue</h4>

The `@ionic/vue-router` package now requires Vue Router v5. Vue Router v4 is no longer supported. Vue Router v5 also raises its peer requirement on Vue itself, so the minimum supported Vue version moves to `3.5.0`.

**Minimum Version Requirements**
| Package    | Supported Version |
| ---------- | ----------------- |
| vue-router | 5.0.0+            |
| vue        | 3.5.0+            |

**Migration**

Vue Router 5 is a transition release that ships no runtime breaking changes for Vue Router 4 consumers, so no application code changes are required for routes, navigation guards, or the `IonRouterOutlet`. Bump the dep ranges in your app's `package.json`:

```diff
  "dependencies": {
-   "vue": "^3.4.0",
-   "vue-router": "^4.0.0"
+   "vue": "^3.5.0",
+   "vue-router": "^5.0.0"
  }
```

**Deprecation Warning for `next()` in Navigation Guards**

Vue Router 5 prints a deprecation warning when `next()` is called inside `beforeRouteLeave`, `beforeRouteEnter`, `beforeRouteUpdate`, or `router.beforeEach`. The callback form still works, but Vue Router 6 will remove it. Migrate to the return-value pattern:

```diff
  // Composition API
  onBeforeRouteLeave((to, from) => {
-   if (!confirm('Leave?')) return next(false);
-   next();
+   if (!confirm('Leave?')) return false;
+   return true;
  });
```

```diff
  // Options API
  beforeRouteLeave(to, from, next) {
-   if (!confirm('Leave?')) return next(false);
-   next();
+ beforeRouteLeave(to, from) {
+   if (!confirm('Leave?')) return false;
+   return true;
  }
```

For more information on Vue Router 5, refer to the [Vue Router v4-to-v5 migration guide](https://router.vuejs.org/guide/migration/v4-to-v5.html).
