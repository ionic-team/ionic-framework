import React, { useContext, useState } from 'react';
import { IonLabel, IonTabBar, IonTabButton, IonTabs, IonTab, IonPage, IonTabsContext } from '@ionic/react';

interface TabsProps {}

const TabSwitcher: React.FC = () => {
  const tabsContext = useContext(IonTabsContext);
  const [selectResult, setSelectResult] = useState('');
  const [activeTab, setActiveTab] = useState('');

  return (
    <div>
      <button id="select-tab2" onClick={() => setSelectResult(String(tabsContext.selectTab('tab2')))}>
        Select Tab 2
      </button>
      <button id="select-missing-tab" onClick={() => setSelectResult(String(tabsContext.selectTab('missing')))}>
        Select Missing Tab
      </button>
      <button id="read-active-tab" onClick={() => setActiveTab(String(tabsContext.activeTab))}>
        Read Active Tab
      </button>
      <p>
        selectTab result: <span id="select-result">{selectResult}</span>
      </p>
      <p>
        activeTab: <span id="active-tab">{activeTab}</span>
      </p>
    </div>
  );
};

const TabsBasic: React.FC<TabsProps> = () => {
  const onTabWillChange = (event: CustomEvent) => {
    console.log('onIonTabsWillChange', event.detail.tab);
  };

  const onTabDidChange = (event: CustomEvent) => {
    console.log('onIonTabsDidChange:', event.detail.tab);
  };

  return (
    <IonPage>
      <IonTabs onIonTabsWillChange={onTabWillChange} onIonTabsDidChange={onTabDidChange}>
        <div slot="top">
          <TabSwitcher />
        </div>
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
    </IonPage>
  );
};

export default TabsBasic;
