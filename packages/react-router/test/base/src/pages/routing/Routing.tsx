import React from 'react';
import {
  IonContent,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/react';
import Menu from './Menu';
import { Route, Navigate } from 'react-router';
import Tabs from './Tabs';
import Favorites from './Favorites';
import OtherPage from './OtherPage';
import PropsTest from './PropsTest';
import RedirectRouting from './RedirectRouting';

interface RoutingProps {}

const Routing: React.FC<RoutingProps> = () => {
  return (
    <IonSplitPane contentId="main">
      <Menu />
      <IonRouterOutlet id="main">
        <Route index element={<Navigate to="/routing/tabs" />} />

        <Route path="tabs/*" element={<Tabs />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="otherpage" element={<OtherPage />} />
        <Route path="propstest" element={<PropsTest />} />
        <Route path="redirect" element={<Navigate to="/routing/tabs" replace />} />
        <Route path="redirect-routing" element={<RedirectRouting />} />

        <Route
          path="*"
          element={
            <IonPage data-pageid="not-found">
              <IonContent>
                <div>Not found in routing.tsx</div>
              </IonContent>
            </IonPage>
          }
        />
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

export default Routing;
