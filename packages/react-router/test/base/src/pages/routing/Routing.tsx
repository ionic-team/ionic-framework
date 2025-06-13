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
        <Route path="/routing/tabs" render={() => <Tabs />} />
        {/* <Route path="/routing/tabs" element={<Tabs />} /> */}
        <Route path="/routing/" render={() => <Navigate to="/routing/tabs" />} replace />
        <Route path="/routing/favorites" element={<Favorites />} />
        {/* <Route path="/routing/favorites" render={() => {
        return (
          <IonRouterOutlet id="favorites">
            <Route path="/routing/favorites" element={<Favorites />} />
          </IonRouterOutlet>
        );
      }} /> */}
        {/* <Route path="/routing/otherpage" render={() => {
        return (
          <IonRouterOutlet id="otherpage">
            <Route path="/routing/otherpage" element={<OtherPage />} />
          </IonRouterOutlet>
        );
      }} /> */}
        <Route path="/routing/otherpage" element={<OtherPage />} />
        <Route path="/routing/propstest" element={<PropsTest />} />
        <Route path="/routing/redirect" render={() => <Navigate to="/routing/tabs" replace />} />
        <Route path="/routing/redirect-routing" render={() => <RedirectRouting />} />
        <Route
          render={() => (
            <IonPage data-pageid="not-found">
              <IonContent>
                <div>Not found</div>
              </IonContent>
            </IonPage>
          )}
        />
        {/* <Route render={() => <Navigate to="/tabs" replace />} /> */}
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

export default Routing;
