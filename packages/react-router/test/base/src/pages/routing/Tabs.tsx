import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonPage, IonContent } from '@ionic/react';
import { triangle, ellipse, square } from 'ionicons/icons';
import React from 'react';
import { Route, Navigate } from 'react-router';

import Details from './Details';
import SettingsDetails from './SettingsDetails';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';



const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet id="tabs">
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Tab1 />} />
        <Route path="home/details/:id" element={<Details />} />
        <Route path="settings" element={<Tab2 />} />
        <Route path="settings/details/:id" element={<SettingsDetails />} />
        <Route path="tab3" element={<Tab3 />} />
        <Route path="redirect" element={<Navigate to="settings" replace />} />
        <Route
          path="*"
          element={
            <IonPage data-pageid="not-found-tabs">
              <IonContent>
                <div>Not found in tabs.tsx</div>
              </IonContent>
            </IonPage>
          }
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/routing/tabs/home">
          <IonIcon icon={triangle} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/routing/tabs/settings">
          <IonIcon icon={ellipse} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/routing/tabs/tab3">
          <IonIcon icon={square} />
          <IonLabel>Tab 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
