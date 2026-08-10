# Ionic React Router

The [@ionic/react-router](https://www.npmjs.com/package/@ionic/react-router) package is the routing integration for [@ionic/react](https://www.npmjs.com/package/@ionic/react). It uses the [React Router](https://github.com/remix-run/react-router) library beneath the surface.

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

See [the testing docs](./testing.md#debug-logging-in-e2e-runs) for how to read them in a failing e2e run.
