import { isCoveredByReact } from '../react-component-lib/utils';

/**
 * The @stencil/react-output-target will bind event listeners for any
 * attached props that use the `on` prefix. This function will remove
 * those event listeners when the component is unmounted.
 *
 * This prevents memory leaks and React state updates on unmounted components.
 */
export const detachProps = (node: HTMLElement, props: any) => {
  if (node instanceof Element) {
    Object.keys(props).forEach((name) => {
      if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
        const eventName = name.substring(2);
        const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);
        if (!isCoveredByReact(eventNameLc)) {
          /**
           * Detach custom event bindings (not built-in React events)
           * that were added by the @stencil/react-output-target attachProps function.
           */
          detachEvent(node, eventNameLc);
        }
      }
    });
  }
};

const detachEvent = (
  node: Element & { __events?: { [key: string]: ((e: Event) => any) | undefined } },
  eventName: string
) => {
  const eventStore = node.__events || (node.__events = {});
  /**
   * If the event listener was added by attachProps, it will
   * be stored in the __events object.
   */
  const eventHandler = eventStore[eventName];
  if (eventHandler) {
    node.removeEventListener(eventName, eventHandler);
    eventStore[eventName] = undefined;
  }
};
