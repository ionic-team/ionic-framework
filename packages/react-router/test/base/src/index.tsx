import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import RootSingleViewApp from './root-single-view/RootSingleViewApp';
import { ROOT_SINGLE_VIEW_BASENAME } from './root-single-view/basename';
import RootSplatSiblingApp from './root-splat-sibling/RootSplatSiblingApp';
import { ROOT_SPLAT_SIBLING_BASENAME } from './root-splat-sibling/basename';

/**
 * A root-level splat route swallows every pathname in its outlet, so it can't share App's
 * route tree. Each such app gets its own root, picked here by pathname before anything renders.
 */
const { pathname } = window.location;
const isUnder = (basename: string) => pathname === basename || pathname.startsWith(`${basename}/`);

const renderApp = () => {
  if (isUnder(ROOT_SPLAT_SIBLING_BASENAME)) {
    return <RootSplatSiblingApp />;
  }
  if (isUnder(ROOT_SINGLE_VIEW_BASENAME)) {
    return <RootSingleViewApp />;
  }
  return <App />;
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<React.StrictMode>{renderApp()}</React.StrictMode>);
