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

import ModeSwitcher from './components/ModeSwitcher';

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
import { SwipeToGoBack } from './pages/swipe-to-go-back/SwipeToGoBack';
import TabsContext from './pages/tab-context/TabContext';
import Tabs from './pages/tabs/Tabs';
import TabsSecondary from './pages/tabs/TabsSecondary';
import TabHistoryIsolation from './pages/tab-history-isolation/TabHistoryIsolation';
import Overlays from './pages/overlays/Overlays';
import NestedTabsRelativeLinks from './pages/nested-tabs-relative-links/NestedTabsRelativeLinks';
import RootSplatTabs from './pages/root-splat-tabs/RootSplatTabs';
import ContentChangeNavigation from './pages/content-change-navigation/ContentChangeNavigation';
import SearchParams from './pages/search-params/SearchParams';
import IonRoutePropsTest from './pages/ion-route-props/IonRouteProps';
import PrefixMatchWildcard from './pages/prefix-match-wildcard/PrefixMatchWildcard';
import StaleViewCleanup from './pages/stale-view-cleanup/StaleViewCleanup';
import IndexParamPriority from './pages/index-param-priority/IndexParamPriority';
import IndexRouteReuse from './pages/index-route-reuse/IndexRouteReuse';
import TailSliceAmbiguity from './pages/tail-slice-ambiguity/TailSliceAmbiguity';
import WildcardNoHeuristic from './pages/wildcard-no-heuristic/WildcardNoHeuristic';
import RouteContextShape from './pages/route-context-shape/RouteContextShape';
import ModalAriaHidden from './pages/modal-aria-hidden/ModalAriaHidden';
import RedirectParams from './pages/redirect-params/RedirectParams';
import MultiStepBack from './pages/multi-step-back/MultiStepBack';
import DirectionNoneBack from './pages/direction-none-back/DirectionNoneBack';
import TabSearchParams from './pages/tab-search-params/TabSearchParams';
import { Step1, Step2, Step3, Step4 } from './pages/replace-params/ReplaceParams';
import { ParamSwipeBack, ParamSwipeBackB } from './pages/param-swipe-back/ParamSwipeBack';
import TabLifecycle from './pages/tab-lifecycle/TabLifecycle';
import TabLifecycleOutside from './pages/tab-lifecycle/TabLifecycleOutside';
import { RouterLinkModifierClick, RouterLinkModifierClickTarget } from './pages/router-link-modifier-click/RouterLinkModifierClick';
import { NavigateRootPageA, NavigateRootPageB, NavigateRootPageC } from './pages/navigate-root/NavigateRoot';
import SuspenseOutlet from './pages/suspense-outlet/SuspenseOutlet';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <ModeSwitcher />
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" element={<Main />} />
          <Route path="/routing/*" element={<Routing />} />
          <Route path="/dynamic-routes/*" element={<DynamicRoutes />} />
          <Route path="/multiple-tabs/*" element={<MultipleTabs />} />
          <Route path="/dynamic-tabs/*" element={<DynamicTabs />} />
          <Route path="/nested-outlet/*" element={<NestedOutlet />} />
          <Route path="/nested-outlet2/*" element={<NestedOutlet2 />} />
          <Route path="/replace-action/page1" element={<Page1 />} />
          <Route path="/replace-action/page2" element={<Page2 />} />
          <Route path="/replace-action/page3" element={<Page3 />} />
          <Route path="/replace-action" element={<Navigate to="/replace-action/page1" replace />} />
          <Route path="/tab-context/*" element={<TabsContext />} />
          <Route path="/outlet-ref" element={<OutletRef />} />
          <Route path="/swipe-to-go-back/*" element={<SwipeToGoBack />} />
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
          <Route path="/content-change-navigation/*" element={<ContentChangeNavigation />} />
          <Route path="/search-params" element={<SearchParams />} />
          <Route path="/ion-route-props/*" element={<IonRoutePropsTest />} />
          <Route path="/prefix-match-wildcard/*" element={<PrefixMatchWildcard />} />
          <Route path="/stale-view-cleanup/*" element={<StaleViewCleanup />} />
          <Route path="/index-param-priority/*" element={<IndexParamPriority />} />
          <Route path="/index-route-reuse/*" element={<IndexRouteReuse />} />
          <Route path="/tail-slice-ambiguity/*" element={<TailSliceAmbiguity />} />
          <Route path="/wildcard-no-heuristic/*" element={<WildcardNoHeuristic />} />
          <Route path="/route-context-shape/*" element={<RouteContextShape />} />
          <Route path="/modal-aria-hidden/*" element={<ModalAriaHidden />} />
          <Route path="/redirect-params/*" element={<RedirectParams />} />
          <Route path="/multi-step-back/*" element={<MultiStepBack />} />
          <Route path="/direction-none-back/*" element={<DirectionNoneBack />} />
          <Route path="/tab-search-params/*" element={<TabSearchParams />} />
          <Route path="/param-swipe-back/*" element={<ParamSwipeBack />} />
          <Route path="/param-swipe-back-b/*" element={<ParamSwipeBackB />} />
          <Route path="/replace-params/step1" element={<Step1 />} />
          <Route path="/replace-params/step2/:id" element={<Step2 />} />
          <Route path="/replace-params/step3/:id" element={<Step3 />} />
          <Route path="/replace-params/step4/:id" element={<Step4 />} />
          <Route path="/replace-params" element={<Navigate to="/replace-params/step1" replace />} />
          <Route path="/tab-lifecycle/*" element={<TabLifecycle />} />
          <Route path="/tab-lifecycle-outside" element={<TabLifecycleOutside />} />
          <Route path="/router-link-modifier-click" element={<RouterLinkModifierClick />} />
          <Route path="/router-link-modifier-click/target" element={<RouterLinkModifierClickTarget />} />
          <Route path="/navigate-root/page-a" element={<NavigateRootPageA />} />
          <Route path="/navigate-root/page-b" element={<NavigateRootPageB />} />
          <Route path="/navigate-root/page-c" element={<NavigateRootPageC />} />
          <Route path="/suspense-outlet/*" element={<SuspenseOutlet />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
