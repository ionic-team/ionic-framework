import type { JSX } from "@ionic/core";
import type { StencilVueComponent } from "@stencil/vue-output-target/runtime";

import { IonRange as IonRangeProxy } from "../proxies";
import { withLazyModel } from "../utils/lazy-model";

/**
 * `ion-range` with `v-model.lazy` support.
 *
 * The generated proxy always updates the `v-model` binding on `ionInput`,
 * so `.lazy` is ignored. This wrapper commits the value on `ionChange`
 * instead when `modelModifiers.lazy` is set, and otherwise behaves exactly
 * like the generated proxy. See `../utils/lazy-model.ts`.
 */
export const IonRange = withLazyModel(
  IonRangeProxy
) as unknown as StencilVueComponent<JSX.IonRange, JSX.IonRange["value"]>;
