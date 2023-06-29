import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Icons from './pages/Icons';
import Main from './pages/Main';
import Tabs from './pages/Tabs';
import NavComponent from './pages/navigation/NavComponent';
import IonModalConditional from './pages/overlay-components/IonModalConditional';
import IonModalConditionalSibling from './pages/overlay-components/IonModalConditionalSibling';
import IonModalDatetimeButton from './pages/overlay-components/IonModalDatetimeButton';
import IonModalMultipleChildren from './pages/overlay-components/IonModalMultipleChildren';
import IonPopoverNested from './pages/overlay-components/IonPopoverNested';
import KeepContentsMounted from './pages/overlay-components/KeepContentsMounted';
import OverlayComponents from './pages/overlay-components/OverlayComponents';
import OverlayHooks from './pages/overlay-hooks/OverlayHooks';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/overlay-hooks" element={<OverlayHooks />} />
          <Route path="/overlay-components" element={<OverlayComponents />} />
          <Route path="/overlay-components/nested-popover" element={<IonPopoverNested />} />
          <Route path="/overlay-components/modal-conditional-sibling" element={<IonModalConditionalSibling />} />
          <Route path="/overlay-components/modal-conditional" element={<IonModalConditional />} />
          <Route path="/overlay-components/modal-datetime-button" element={<IonModalDatetimeButton />} />
          <Route path="/overlay-components/modal-multiple-children" element={<IonModalMultipleChildren />} />
          <Route path="/keep-contents-mounted" element={<KeepContentsMounted />} />
          <Route path="/navigation" element={<NavComponent />} />
          <Route path="/tabs" element={<Tabs />} />
          <Route path="/icons" element={<Icons />} />
        </Routes>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
