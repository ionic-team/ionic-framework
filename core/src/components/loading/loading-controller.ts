import { createController } from "../../utils/overlays";
import type { LoadingOptions } from "./loading-interface";

import { Loading } from "./loading";

export const loadingController = /*@__PURE__*/createController<LoadingOptions, HTMLIonLoadingElement>('ion-loading', Loading);
