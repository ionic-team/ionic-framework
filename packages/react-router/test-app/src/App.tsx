import {
  IonApp,
  IonContent,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonRoute
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */

import Menu from './components/Menu';
import Favorites from './pages/Favorites';
import OtherPage from './pages/OtherPage';
import PropsTest from './pages/PropsTest';
import Tabs from './pages/Tabs';
import './theme/variables.css';
import { IonReactRouter } from './ReactRouter/IonReactRouter';
import TopPage from './pages/TopPage';
import DynamicRoutes from './pages/dynamic-routes/DynamicRoutes';
// import { IonReactRouter } from '@ionic/react-router';
debugger;
const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/tabs" render={() => <Tabs />} />
            {/* <Route path="/tabs" component={Tabs} /> */}
            <Route path="/" render={() => <Redirect to="/tabs" />} exact />
            <Route path="/favorites" component={Favorites} />
            {/* <Route path="/favorites" render={() => {
              return (
                <IonRouterOutlet id="favorites">
                  <Route path="/favorites" component={Favorites} />
                </IonRouterOutlet>
              );
            }} /> */}
            {/* <Route path="/otherpage" render={() => {
              return (
                <IonRouterOutlet id="otherpage">
                  <Route path="/otherpage" component={OtherPage} />
                </IonRouterOutlet>
              );
            }} /> */}
            <Route path="/otherpage" component={OtherPage} />            
            <Route path="/propstest" component={PropsTest} />
            <Route path="/toppage" component={TopPage} />
            <Route render={() => <IonPage data-pageid="not-found"><IonContent><div>Not found</div></IonContent></IonPage>} />
            {/* <Route render={() => <Redirect to="/tabs" />} /> */}
            <Route path="/dynamic-routes" component={DynamicRoutes} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
