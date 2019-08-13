import Vue, { CreateElement, RenderContext } from 'vue';

interface EventHandler {
  [key: string]: (e: Event) => void;
}

// Events to register handlers for
const events: string[] = ['ionChange', 'ionInput', 'ionBlur', 'ionFocus', 'ionCancel', 'ionSelect'];

// Arguments to be passed to the factory function
const inputComponentsToBeCreated = [
  ['IonCheckboxVue', 'ion-checkbox', 'ionChange', 'checked'],
  ['IonDatetimeVue', 'ion-datetime'],
  ['IonInputVue', 'ion-input', 'ionInput'],
  ['IonRadioVue', 'ion-radio', 'ionSelect'],
  ['IonRangeVue', 'ion-range'],
  ['IonSearchbarVue', 'ion-searchbar', 'ionInput'],
  ['IonSelectVue', 'ion-select'],
  ['IonTextareaVue', 'ion-textarea'],
  ['IonToggleVue', 'ion-toggle', 'ionChange', 'checked'],
];

// Factory function for creation of input components
export function createInputComponents() {
  inputComponentsToBeCreated.map(args => (createInputComponent as any)(...args));
}

/**
 * Create a wrapped input component that captures typical ionic input events
 * and emits core ones so v-model works.
 * @param name the vue name of the component
 * @param coreTag the actual tag to render (such as ion-datetime)
 * @param modelEvent to be used for v-model
 * @param valueProperty to be used for v-model
 */
function createInputComponent(name: string, coreTag: string, modelEvent = 'ionChange', valueProperty = 'value') {
  Vue.component(name, {
    name,
    functional: true,
    model: {
      event: modelEvent,
      prop: valueProperty,
    },
    render(h: CreateElement, { data, listeners, slots }: RenderContext) {
      return h(coreTag, {
        ...data,
        on: buildEventHandlers(listeners, modelEvent, valueProperty),
      }, slots().default);
    },
  });
}

function buildEventHandlers(listeners: RenderContext['listeners'], modelEvent: string, valueProperty: string) {
  const handlers: EventHandler = {};

  // Loop through all the events
  events.map((eventName: string) => {
    if (!listeners[eventName]) {
      return;
    }

    // Normalize listeners coming from context as Function | Function[]
    const callbacks: Function[] = Array.isArray(listeners[eventName])
      ? listeners[eventName] as Function[]
      : [listeners[eventName] as Function];

    // Assign handlers
    handlers[eventName] = (e: Event) => {
      callbacks.map((f: Function) => {
        if (e) {
          f(modelEvent === eventName
            ? (e.target as any)[valueProperty]
            : e
          );
        }
      });
    };
  });

  return handlers;
}
