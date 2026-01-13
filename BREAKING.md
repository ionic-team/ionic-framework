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

- [Framework Specific](#version-9x-framework-specific)
  - [React](#version-9x-react)

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
- const MyComponent: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
-   const id = match.params.id;
+ const MyComponent: React.FC = () => {
+   const { id } = useParams<{ id: string }>();
```

**Programmatic Navigation**

The `useHistory` hook has been replaced with `useNavigate`:

```diff
- import { useHistory } from 'react-router-dom';
+ import { useNavigate } from 'react-router-dom';

- const history = useHistory();
+ const navigate = useNavigate();

- history.goBack();
+ navigate(-1);

- history.replace('/path');
+ navigate('/path', { replace: true });

- history.push('/path');
+ navigate('/path');
```

For more information on migrating from React Router v5 to v6, refer to the [React Router v6 Upgrade Guide](https://reactrouter.com/en/main/upgrading/v5).
