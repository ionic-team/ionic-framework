import { IonRouterContext } from '@ionic/react';
import type React from 'react';
import { useEffect, useContext } from 'react';

const RedirectRouting: React.FC = () => {
  const ionRouterContext = useContext(IonRouterContext);
  useEffect(() => {
    ionRouterContext.push('/routing/tabs', 'none');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default RedirectRouting;
