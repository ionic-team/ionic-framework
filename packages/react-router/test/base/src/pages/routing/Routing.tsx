import React from 'react';
import {
  IonContent,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/react';
import Menu from './Menu';
import { Route, Redirect } from 'react-router';
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
        {/* <Route path="/routing/tabs" component={Tabs} /> */}
        <Route path="/routing/" render={() => <Redirect to="/routing/tabs" />} exact />
        <Route path="/routing/favorites" component={Favorites} />
        {/* <Route path="/routing/favorites" render={() => {
        return (
          <IonRouterOutlet id="favorites">
            <Route path="/routing/favorites" component={Favorites} />
          </IonRouterOutlet>
        );
      }} /> */}
        {/* <Route path="/routing/otherpage" render={() => {
        return (
          <IonRouterOutlet id="otherpage">
            <Route path="/routing/otherpage" component={OtherPage} />
          </IonRouterOutlet>
        );
      }} /> */}
        <Route path="/routing/otherpage" component={OtherPage} />
        <Route path="/routing/propstest" component={PropsTest} />
        <Route path="/routing/redirect" render={() => <Redirect to="/routing/tabs" />} />
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
        {/* <Route render={() => <Redirect to="/tabs" />} /> */}
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

export default Routing;
