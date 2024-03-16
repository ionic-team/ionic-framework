import React, { useEffect, useContext } from 'react';
import { IonRouterContext } from '@ionic/react';

const RedirectRouting: React.FC = () => {
  const ionRouterContext = useContext(IonRouterContext);
  useEffect(() => {
    ionRouterContext.push('/routing/tabs', 'none');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default RedirectRouting;
