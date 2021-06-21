import React from 'react';

export interface IonTabsContextState {
  activeTab: string | undefined;
  selectTab: (tab: string) => boolean;
}

export const IonTabsContext = React.createContext<IonTabsContextState>({
  activeTab: undefined,
  selectTab: () => false,
});
