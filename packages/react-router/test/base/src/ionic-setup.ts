/**
 * Ionic CSS and runtime config. Both App and RootSplatSiblingApp import this because
 * App.test.tsx renders App with no index.tsx in the graph.
 *
 * Debug logging is on so a failing spec includes the navigation diagnostics.
 */
import { setupIonicReact, LogLevel } from '@ionic/react';

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

setupIonicReact({ logLevel: LogLevel.DEBUG });
