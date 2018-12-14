import React, { RefObject } from 'react';
import ReactDOM from 'react-dom';

const dashToPascalCase = (str: string) => str.toLowerCase().split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');


function syncEvent(node: Element, eventName: string, newEventHandler: (e: Event) => any) {
  const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);
  const eventStore = (node as any).__events || ((node as any).__events = {});
  const oldEventHandler = eventStore[eventNameLc];

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventNameLc, oldEventHandler);
  }

  // Bind new listener.
  if (newEventHandler) {
    node.addEventListener(eventNameLc, eventStore[eventNameLc] = function handler(e: Event) {
      newEventHandler.call(this, e);
    });
  }
}

export interface IonicReactBaseProps {
  ref?: RefObject<any>
}

export function createReactComponent<T>(tagName: string) {
  const displayName = dashToPascalCase(tagName);


  return class ReactComponent extends React.Component<T & IonicReactBaseProps> {
    constructor(props: T & IonicReactBaseProps) {
      super(props);
    }

    static get displayName() {
      return displayName;
    }

    componentDidMount() {
      this.componentWillReceiveProps(this.props);
    }
    componentWillReceiveProps(props: any) {
      const node = ReactDOM.findDOMNode(this) as Element | null

      if (node == null) {
        return;
      }

      Object.keys(props).forEach(name => {
        if (name === 'children' || name === 'style') {
          return;
        }

        if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
          syncEvent(node, name.substring(2), props[name]);
        } else {
          (node as any)[name] = props[name];
        }
      });
    }
    render() {
      const { children, className, ...cProps } = this.props as any;
      cProps.class = className || cProps.class;
      return React.createElement(tagName, cProps, children);
    }
  }
}
