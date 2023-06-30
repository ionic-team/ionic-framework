import { createContext } from 'react';

export interface IonTabsContextState {
  activeTab: string | undefined;
  selectTab: (tab: string) => boolean;
}

export const IonTabsContext = createContext<IonTabsContextState>({
  activeTab: undefined,
  selectTab: () => false,
});
