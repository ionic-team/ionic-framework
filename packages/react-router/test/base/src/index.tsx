import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import RootSplatSiblingApp from './root-splat-sibling/RootSplatSiblingApp';
import { ROOT_SPLAT_SIBLING_BASENAME } from './root-splat-sibling/basename';

/**
 * A root-level splat route swallows every pathname in its outlet, so it can't share App's
 * route tree. It gets its own root, picked here by pathname before anything renders.
 */
const { pathname } = window.location;
const isRootSplatSibling =
  pathname === ROOT_SPLAT_SIBLING_BASENAME || pathname.startsWith(`${ROOT_SPLAT_SIBLING_BASENAME}/`);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<React.StrictMode>{isRootSplatSibling ? <RootSplatSiblingApp /> : <App />}</React.StrictMode>);
