import React from 'react';

interface NavContextInterface {
  goBack: (defaultHref?: string) => void
}

export const NavContext = React.createContext<NavContextInterface>({
  goBack: () => {}
});
