import { IonApp, setupIonicReact, IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

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
import './theme/variables.css';
import Main from './pages/Main';

import { IonReactRouter } from '@ionic/react-router';

import DynamicIonpageClassnames from './pages/dynamic-ionpage-classnames/DynamicIonpageClassnames';
import DynamicRoutes from './pages/dynamic-routes/DynamicRoutes';
import DynamicTabs from './pages/dynamic-tabs/DynamicTabs';
import MultipleTabs from './pages/muiltiple-tabs/MultipleTabs';
import NestedOutlet from './pages/nested-outlet/NestedOutlet';
import NestedOutlet2 from './pages/nested-outlet/NestedOutlet2';
import NestedParams from './pages/nested-params/NestedParams';
import RelativePaths from './pages/relative-paths/RelativePaths';
import { OutletRef } from './pages/outlet-ref/OutletRef';
import Params from './pages/params/Params';
import Refs from './pages/refs/Refs';
import { Page1, Page2, Page3 } from './pages/replace-action/Replace';
import Routing from './pages/routing/Routing';
import { SwipeToGoBack } from './pages/swipe-to-go-back/SwipToGoBack';
import TabsContext from './pages/tab-context/TabContext';
import Tabs from './pages/tabs/Tabs';
import TabsSecondary from './pages/tabs/TabsSecondary';
import TabHistoryIsolation from './pages/tab-history-isolation/TabHistoryIsolation';
import Overlays from './pages/overlays/Overlays';
import NestedTabsRelativeLinks from './pages/nested-tabs-relative-links/NestedTabsRelativeLinks';
import RootSplatTabs from './pages/root-splat-tabs/RootSplatTabs';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" element={<Main />} />
          <Route path="/routing/*" element={<Routing />} />
          <Route path="/dynamic-routes/*" element={<DynamicRoutes />} />
          <Route path="/multiple-tabs" element={<MultipleTabs />} />
          <Route path="/dynamic-tabs/*" element={<DynamicTabs />} />
          <Route path="/nested-outlet/*" element={<NestedOutlet />} />
          <Route path="/nested-outlet2/*" element={<NestedOutlet2 />} />
          <Route path="/replace-action/page1" element={<Page1 />} />
          <Route path="/replace-action/page2" element={<Page2 />} />
          <Route path="/replace-action/page3" element={<Page3 />} />
          <Route path="/replace-action" element={<Navigate to="/replace-action/page1" replace />} />
          <Route path="/tab-context/*" element={<TabsContext />} />
          <Route path="/outlet-ref" element={<OutletRef />} />
          <Route path="/swipe-to-go-back" element={<SwipeToGoBack />} />
          <Route path="/dynamic-ionpage-classnames" element={<DynamicIonpageClassnames />} />
          <Route path="/tabs/*" element={<Tabs />} />
          <Route path="/tabs-secondary/*" element={<TabsSecondary />} />
          <Route path="/tab-history-isolation/*" element={<TabHistoryIsolation />} />
          <Route path="/refs/*" element={<Refs />} />
          <Route path="/overlays" element={<Overlays />} />
          <Route path="/params/:id" element={<Params />} />
          <Route path="/nested-params/*" element={<NestedParams />} />
          {/* Test root-level relative path - no leading slash */}
          <Route path="relative-paths/*" element={<RelativePaths />} />
          <Route path="/nested-tabs-relative-links/*" element={<NestedTabsRelativeLinks />} />
          <Route path="/root-splat-tabs/*" element={<RootSplatTabs />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
