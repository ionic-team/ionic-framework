import React from 'react';

interface NavContextInterface {
  goBack: (defaultHref?: string) => void
}

export const NavContext = /*@__PURE__*/React.createContext<NavContextInterface>({
  goBack: () => {}
});
