import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import {
  IonicVue,
  IonInput,
  IonInputOtp,
  IonRange,
  IonSearchbar,
  IonTextarea,
} from "@ionic/vue";

/**
 * Regression tests for ionic-team/ionic-framework#31761:
 * `v-model.lazy` is ignored by ion-input, ion-textarea, ion-searchbar,
 * ion-input-otp and ion-range — the model updates on every `ionInput`
 * instead of committing on `ionChange`.
 *
 * The components are mounted directly (rather than through a parent
 * template) so the `modelModifiers` prop and the emitted
 * `update:modelValue` events are observed without template compilation
 * in the way.
 */

type Component = Parameters<typeof mount>[0];

const fireValue = (el: HTMLElement, value: unknown, event: string) => {
  (el as unknown as { value: unknown }).value = value;
  el.dispatchEvent(new CustomEvent(event, { bubbles: true, composed: true }));
};

describe("v-model.lazy", () => {
  const cases: Array<{
    name: string;
    component: Component;
    typedValue: unknown;
  }> = [
    { name: "ion-input", component: IonInput, typedValue: "typed" },
    { name: "ion-textarea", component: IonTextarea, typedValue: "typed" },
    { name: "ion-searchbar", component: IonSearchbar, typedValue: "typed" },
    { name: "ion-input-otp", component: IonInputOtp, typedValue: "typed" },
    { name: "ion-range", component: IonRange, typedValue: 42 },
  ];

  it.each(cases)(
    "$name: does not update on ionInput, commits on ionChange",
    async ({ component, typedValue }) => {
      const onUpdate = vi.fn();
      const wrapper = mount(component as never, {
        props: {
          modelValue: "initial",
          modelModifiers: { lazy: true },
          "onUpdate:modelValue": onUpdate,
        },
        global: { plugins: [IonicVue] },
      });
      await nextTick();
      const el = wrapper.element as HTMLElement;

      fireValue(el, typedValue, "ionInput");
      await nextTick();
      expect(onUpdate).not.toHaveBeenCalled();

      fireValue(el, typedValue, "ionChange");
      await nextTick();
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith(typedValue);
    }
  );

  it("ion-input: updates on ionInput without .lazy", async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(IonInput as never, {
      props: {
        modelValue: "initial",
        "onUpdate:modelValue": onUpdate,
      },
      global: { plugins: [IonicVue] },
    });
    await nextTick();
    const el = wrapper.element as HTMLElement;

    fireValue(el, "typed", "ionInput");
    await nextTick();
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith("typed");
  });

  it("ion-input: still calls the user ionChange listener with .lazy", async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const wrapper = mount(IonInput as never, {
      props: {
        modelValue: "initial",
        modelModifiers: { lazy: true },
        "onUpdate:modelValue": onUpdate,
        onIonChange: onChange,
      },
      global: { plugins: [IonicVue] },
    });
    await nextTick();
    const el = wrapper.element as HTMLElement;

    fireValue(el, "typed", "ionChange");
    await nextTick();
    expect(onChange).toHaveBeenCalled();
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith("typed");
  });

  it("ion-input: :value without v-model still renders the value", async () => {
    const wrapper = mount(IonInput as never, {
      props: { value: "initial" },
      global: { plugins: [IonicVue] },
    });
    await nextTick();
    expect((wrapper.element as unknown as { value: unknown }).value).toBe(
      "initial"
    );
  });
});
