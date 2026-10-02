/**
 * Only checked by the React Router 7 typecheck, since React Router 6 has no `useTransitions`
 * prop. The indexed access fails if React Router renames or drops the prop, and the
 * assignment fails if `withTransitionDefaults` stops setting it.
 */
import type { BrowserRouterProps } from 'react-router-dom';

import { withTransitionDefaults } from '../src/ReactRouter/utils/transitionDefaults';

type UseTransitions = NonNullable<BrowserRouterProps['useTransitions']>;

const merged: { useTransitions: UseTransitions } = withTransitionDefaults({ basename: '/app' });

export type TransitionDefaultsGuard = typeof merged;
