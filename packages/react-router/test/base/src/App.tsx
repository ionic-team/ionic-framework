import { IonApp, setupIonicReact, IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';

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
import DynamicRoutes from './pages/dynamic-routes/DynamicRoutes';
import Routing from './pages/routing/Routing';
import MultipleTabs from './pages/muiltiple-tabs/MultipleTabs';
import DynamicTabs from './pages/dynamic-tabs/DynamicTabs';
import NestedOutlet from './pages/nested-outlet/NestedOutlet';
import NestedOutlet2 from './pages/nested-outlet/NestedOutlet2';
import ReplaceAction from './pages/replace-action/Replace';
import TabsContext from './pages/tab-context/TabContext';
import { OutletRef } from './pages/outlet-ref/OutletRef';
import { SwipeToGoBack } from './pages/swipe-to-go-back/SwipToGoBack';
import Refs from './pages/refs/Refs';
import DynamicIonpageClassnames from './pages/dynamic-ionpage-classnames/DynamicIonpageClassnames';
import Tabs from './pages/tabs/Tabs';
import TabsSecondary from './pages/tabs/TabsSecondary';
import Params from './pages/params/Params';
import Overlays from './pages/overlays/Overlays';
import NestedParams from './pages/nested-params/NestedParams';

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
          <Route path="/dynamic-tabs" element={<DynamicTabs />} />
          <Route path="/nested-outlet" element={<NestedOutlet />} />
          <Route path="/nested-outlet2" element={<NestedOutlet2 />} />
          <Route path="/replace-action" element={<ReplaceAction />} />
          <Route path="/tab-context" element={<TabsContext />} />
          <Route path="/outlet-ref" element={<OutletRef />} />
          <Route path="/swipe-to-go-back" element={<SwipeToGoBack />} />
          <Route path="/dynamic-ionpage-classnames" element={<DynamicIonpageClassnames />} />
          <Route path="/tabs" element={<Tabs />} />
          <Route path="/tabs-secondary" element={<TabsSecondary />} />
          <Route path="/refs" element={<Refs />} />
          <Route path="/overlays" element={<Overlays />} />
          <Route path="/params/:id" element={<Params />} />
          <Route path="/nested-params/*" element={<NestedParams />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
