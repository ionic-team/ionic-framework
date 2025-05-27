import React from 'react';

export interface IonTabsContextState {
  activeTab: string | undefined;
  selectTab: (tab: string) => boolean;
  hasRouterOutlet: boolean;
  tabBarProps: TabBarProps;
}

/**
 * Tab bar can be used as a standalone component,
 * so the props can not be passed directly to the
 * tab bar component. Instead, props will be
 * passed through the context.
 */
type TabBarProps = {
  ref: React.RefObject<any>;
  onIonTabsWillChange?: (e: CustomEvent) => void;
  onIonTabsDidChange?: (e: CustomEvent) => void;
};

export const IonTabsContext = React.createContext<IonTabsContextState>({
  activeTab: undefined,
  selectTab: () => false,
  hasRouterOutlet: false,
  tabBarProps: { ref: React.createRef() },
});
