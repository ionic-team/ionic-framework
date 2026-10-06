/**
 * Defaults React Router 7's `useTransitions` to `false`, since a transition can defer the
 * commit past Ionic's page-visible signal. React Router 6 ignores the prop.
 *
 * Uses `??` instead of spreading a default first, because an explicit
 * `useTransitions={undefined}` would override it and React Router reads that as on.
 */
export const withTransitionDefaults = <P extends object>(
  props: P
): Omit<P, 'useTransitions'> & { useTransitions: boolean } => {
  const { useTransitions } = props as { useTransitions?: boolean };

  return { ...props, useTransitions: useTransitions ?? false };
};
