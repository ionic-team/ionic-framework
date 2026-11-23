import type { JSX } from "@ionic/core";
import type { StencilVueComponent } from "@stencil/vue-output-target/runtime";

import { IonInput as IonInputProxy } from "../proxies";
import { withLazyModel } from "../utils/lazy-model";

/**
 * `ion-input` with `v-model.lazy` support.
 *
 * The generated proxy always updates the `v-model` binding on `ionInput`,
 * so `.lazy` is ignored. This wrapper commits the value on `ionChange`
 * instead when `modelModifiers.lazy` is set, and otherwise behaves exactly
 * like the generated proxy. See `../utils/lazy-model.ts`.
 */
export const IonInput = withLazyModel(
  IonInputProxy
) as unknown as StencilVueComponent<JSX.IonInput, JSX.IonInput["value"]>;
