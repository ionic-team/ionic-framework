import React from 'react';
import { IonLabel, IonTabBar, IonTabButton, IonTabs, IonTab } from '@ionic/react';

interface TabsProps {}

const TabsBasic: React.FC<TabsProps> = () => {
  const onTabWillChange = (event: CustomEvent) => {
    console.log('onIonTabsWillChange', event.detail.tab);
  };

  const onTabDidChange = (event: CustomEvent) => {
    console.log('onIonTabsDidChange:', event.detail.tab);
  };

  return (
    <IonTabs onIonTabsWillChange={onTabWillChange} onIonTabsDidChange={onTabDidChange}>
      <IonTab tab="tab1">
        <IonLabel>Tab 1 Content</IonLabel>
      </IonTab>
      <IonTab tab="tab2">
        <IonLabel>Tab 2 Content</IonLabel>
      </IonTab>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1">
          <IonLabel>Tab 1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2">
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsBasic;
