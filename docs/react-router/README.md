# Ionic React Router

The [@ionic/react-router](https://www.npmjs.com/package/@ionic/react-router) package is the routing integration for [@ionic/react](https://www.npmjs.com/package/@ionic/react). It uses the [React Router](https://github.com/remix-run/react-router) library beneath the surface.

## React Router 7 Transitions

React Router 7 wraps router state updates in `React.startTransition` by default. React Router 6 only does so behind `future={{ v7_startTransition: true }}`.

Under a transition React can defer the commit, so Ionic's page-visible signal can fire before the incoming page's DOM exists, which shows up as intermittent navigation failures. Ionic's `IonReactRouter`, `IonReactHashRouter` and `IonReactMemoryRouter` default `useTransitions` to `false`, so v7 navigation behaves the way v6 always has.

Passing `useTransitions` opts back in. That's React Router's explicit `useTransitions={true}` mode, which also wraps `<Link>` and `<Form>` navigations, so it does more than plain React Router 7's default:

```tsx
<IonReactRouter useTransitions>{/* ... */}</IonReactRouter>
```

The prop only exists under this name from 7.15.0. Earlier 7.x releases either have no opt-out (7.0 through 7.9) or call it `unstable_useTransitions` (7.10 through 7.14), so the supported range starts at 7.15.

A React Router 6 app that sets `future={{ v7_startTransition: true }}` opts into the same wrapping through a different key, which Ionic doesn't override.

## Relative Paths Under Splat Routes

React Router 7 resolves a relative `to` inside a splat route (`path="files/*"`) against the full matched URL, tail included. React Router 6 only does that under `future={{ v7_relativeSplatPath: true }}`.

Ionic always resolves against the splat's base, even with that flag set, so `<Link to="edit">` at `/files/docs/readme` goes to `/files/edit`. Including the tail would make an index `<Navigate to="home" />` under a splat redirect in a loop, because Ionic keeps the redirecting view mounted briefly after it leaves.

## Contributing

See our [Contributing Guide](/docs/CONTRIBUTING.md).

## Testing

Refer to the [React Router Testing documentation](./testing.md) for testing the React Router package.

## Debug Logging

The `StackManager` logs the decisions behind the swipe-to-go-back gesture: whether it can start, which views are entering and leaving, and whether the entering page ends up visible. These logs are off in every build, dev included. Ionic's `logLevel` config turns them on, either through the URL:

```
http://localhost:3000/routing?ionic:logLevel=DEBUG
```

or before the app renders:

```tsx
import { LogLevel, setupIonicReact } from '@ionic/react';

setupIonicReact({ logLevel: LogLevel.DEBUG });
```

Refer to [the testing docs](./testing.md#debug-logging-in-e2e-runs) for how to read them in a failing e2e run.
