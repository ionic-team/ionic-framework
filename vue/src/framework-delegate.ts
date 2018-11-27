import { VueConstructor } from 'vue';
import { EsModule, FrameworkDelegate, HTMLVueElement, WebpackFunction } from './interfaces';

export default class Delegate implements FrameworkDelegate {
  constructor(public vue: VueConstructor) {}

  // Attach the passed Vue component to DOM
  attachViewToDom(parentElement: HTMLElement, component: HTMLElement | WebpackFunction | object | VueConstructor, opts?: object, classes?: string[]): Promise<HTMLElement> {
    // Handle HTML elements
    if (isElement(component)) {
      // Add any classes to the element
      addClasses(component as HTMLElement, classes);

      // Append the element to DOM
      parentElement.appendChild(component as HTMLElement);
      return Promise.resolve(component as HTMLElement);
    }

    // Get the Vue controller
    return this.vueController(component).then((controller: VueConstructor) => {
      const vueComponent = this.vueComponent(controller, opts);

      // Add any classes to the Vue component's root element
      addClasses(vueComponent.$el, classes);

      // Append the Vue component to DOM
      parentElement.appendChild(vueComponent.$el);
      return vueComponent.$el;
    });
  }

  // Remove the earlier created Vue component from DOM
  removeViewFromDom(_parentElement: HTMLElement, childElement: HTMLVueElement): Promise<void> {
    // Destroy the Vue component instance
    if (childElement.__vue__) {
      childElement.__vue__.$destroy();
    }

    return Promise.resolve();
  }

  // Handle creation of sync and async components
  vueController(component: WebpackFunction | object | VueConstructor): Promise<VueConstructor> {
    return Promise.resolve(
      typeof component === 'function' && (component as WebpackFunction).cid === undefined
        ? (component as WebpackFunction)().then((cmp: any) => this.vue.extend(isESModule(cmp) ? cmp.default : cmp))
        : this.vue.extend(component)
    );
  }

  // Create a new instance of the Vue component
  vueComponent(controller: VueConstructor, opts?: object) {
    return new controller(opts).$mount();
  }
}

// Check Symbol support
const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

// Check if object is an ES module
function isESModule(obj: EsModule) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module');
}

// Check if value is an Element
function isElement(el: any) {
  return typeof Element !== 'undefined' && el instanceof Element;
}

// Add an array of classes to an element
function addClasses(element: HTMLElement, classes: string[] = []) {
  for (const cls of classes) {
    element.classList.add(cls);
  }
}
