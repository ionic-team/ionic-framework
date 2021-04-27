import React from 'react';
import {
  IonLabel,
  IonTabs,
  IonRouterOutlet,
  IonTabButton,
  IonTabBar,
} from '@ionic/react';
import { IonReactRouter } from '../../ReactRouter/IonReactRouter';
import { Redirect, Route } from 'react-router';

import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import Tab1Nested from "./pages/Tab1Nested";
import Tab1DoubleNested from "./pages/Tab1DoubleNested";

const Unmounted: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet animated={false}>
          <Route path="/tab1" component={Tab1} exact={true}/>
          <Route path="/tab1/nested" component={Tab1Nested} exact={true}/>
          <Route path="/tab1/nested/double" component={Tab1DoubleNested} exact={true}/>
          <Route path="/tab2" component={Tab2} exact={true}/>
          <Route path="/tab3" component={Tab3}/>
          <Route path="/" render={() => <Redirect to={"/tab1"}/>} exact={true}/>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonLabel>Tab 1!!!</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonLabel>Tab 2</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonLabel>Tab 3</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Unmounted;
