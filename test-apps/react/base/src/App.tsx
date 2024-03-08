import React from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import Main from './pages/Main';
import OverlayHooks from './pages/overlay-hooks/OverlayHooks';
import OverlayComponents from './pages/overlay-components/OverlayComponents';
import KeepContentsMounted from './pages/overlay-components/KeepContentsMounted';
import Tabs from './pages/Tabs';
import Icons from './pages/Icons';
import NavComponent from './pages/navigation/NavComponent';
import IonModalConditionalSibling from './pages/overlay-components/IonModalConditionalSibling';
import IonModalConditional from './pages/overlay-components/IonModalConditional';
import IonModalDatetimeButton from './pages/overlay-components/IonModalDatetimeButton';
import IonPopoverNested from './pages/overlay-components/IonPopoverNested';
import IonModalMultipleChildren from './pages/overlay-components/IonModalMultipleChildren';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" component={Main} />
        <Route path="/overlay-hooks" component={OverlayHooks} />
        <Route path="/overlay-components" component={OverlayComponents} />
        <Route path="/overlay-components/nested-popover" component={IonPopoverNested} />
        <Route
          path="/overlay-components/modal-conditional-sibling"
          component={IonModalConditionalSibling}
        />
        <Route path="/overlay-components/modal-conditional" component={IonModalConditional} />
        <Route
          path="/overlay-components/modal-datetime-button"
          component={IonModalDatetimeButton}
        />
        <Route
          path="/overlay-components/modal-multiple-children"
          component={IonModalMultipleChildren}
        />
        <Route path="/keep-contents-mounted" component={KeepContentsMounted} />
        <Route path="/navigation" component={NavComponent} />
        <Route path="/tabs" component={Tabs} />
        <Route path="/icons" component={Icons} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
