import React, { useEffect } from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import Tab1 from './Tab1';
import Details from './Details';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import { triangle, ellipse, square } from 'ionicons/icons';
import Stuff from './Stuff';
import SettingsDetails from './SettingsDetails';

interface TabsProps {
}

const Tabs: React.FC<TabsProps> = () => {
  
  return (
    <IonTabs>
      <IonRouterOutlet id="tabs">
        <Route path="/tabs/home" component={Tab1} exact />
        <Route path="/tabs/home/details/:id" component={Details} exact={true} />
        {/* <Route path="/tabs/home/details/:id" render={(props) => {
          return <Details />
        }} exact={true} /> */}
        <Route path="/tabs/settings" component={Tab2} exact={true} />
        <Route path="/tabs/settings/details/:id" component={SettingsDetails} exact={true} />
        <Route path="/tabs/tab3" component={Tab3} />
        <Route path="/tabs" render={() => <Redirect to="/tabs/home" />} exact={true} />
        {/* <Route path="/tabs" render={() => <Route render={() => <Redirect to="/tabs/home" />} />} /> */}
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={triangle} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon icon={ellipse} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/tab3">
          <IonIcon icon={square} />
          <IonLabel>Tab 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;