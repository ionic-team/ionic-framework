/*! Built with http://stenciljs.com */
(function(Context,appNamespace,hydratedCssClass,publicPath){"use strict";
var s=document.querySelector("script[data-namespace='app']");if(s){publicPath=s.getAttribute('data-path');}
(function(window, document, Context, appNamespace, publicPath) {
  'use strict';
  function assignHostContentSlots(domApi, elm, childNodes, childNode) {
    // so let's loop through each of the childNodes to the host element
    // and pick out the ones that have a slot attribute
    // if it doesn't have a slot attribute, than it's a default slot
    elm.$defaultHolder || 
    // create a comment to represent where the original
    // content was first placed, which is useful later on
    domApi.$insertBefore(elm, elm.$defaultHolder = domApi.$createComment(''), childNodes[0]);
    let slotName;
    let defaultSlot;
    let namedSlots;
    let i = 0;
    for (;i < childNodes.length; i++) {
      childNode = childNodes[i];
      if (1 /* ElementNode */ === domApi.$nodeType(childNode) && null != (slotName = domApi.$getAttribute(childNode, 'slot'))) {
        // is element node
        // this element has a slot name attribute
        // so this element will end up getting relocated into
        // the component's named slot once it renders
        namedSlots = namedSlots || {};
        namedSlots[slotName] ? namedSlots[slotName].push(childNode) : namedSlots[slotName] = [ childNode ];
      } else {
        // this is a text node
        // or it's an element node that doesn't have a slot attribute
        // let's add this node to our collection for the default slot
        defaultSlot ? defaultSlot.push(childNode) : defaultSlot = [ childNode ];
      }
    }
    // keep a reference to all of the initial nodes
    // found as immediate childNodes to the host element
        elm._hostContentNodes = {
      defaultSlot: defaultSlot,
      namedSlots: namedSlots
    };
  }
  /**
     * SSR Attribute Names
     */  const SSR_VNODE_ID = 'data-ssrv';
  const SSR_CHILD_ID = 'data-ssrc';
  /**
     * Default style mode id
     */  const DEFAULT_STYLE_MODE = '$';
  /**
     * Reusable empty obj/array
     * Don't add values to these!!
     */  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  /**
     * Key Name to Key Code Map
     */  const KEY_CODE_MAP = {
    'enter': 13,
    'escape': 27,
    'space': 32,
    'tab': 9,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40
  };
  /**
     * Namespaces
     */
  /**
     * File names and value
     */  function initStyleTemplate(domApi, cmpMeta, cmpConstructor) {
    const style = cmpConstructor.style;
    if (style) {
      // we got a style mode for this component, let's create an id for this style
      const styleModeId = cmpConstructor.is + (cmpConstructor.styleMode || DEFAULT_STYLE_MODE);
      if (!cmpMeta[styleModeId]) {
        false;
        {
          // use <template> elements to clone styles
          // create the template element which will hold the styles
          // adding it to the dom via <template> so that we can
          // clone this for each potential shadow root that will need these styles
          // otherwise it'll be cloned and added to document.body.head
          // but that's for the renderer to figure out later
          const templateElm = domApi.$createElement('template');
          // keep a reference to this template element within the
          // Constructor using the style mode id as the key
                    cmpMeta[styleModeId] = templateElm;
          // add the style text to the template element's innerHTML
                    templateElm.innerHTML = `<style>${style}</style>`;
          // add our new template element to the head
          // so it can be cloned later
                    domApi.$appendChild(domApi.$head, templateElm);
        }
      }
    }
  }
  function attachStyles(domApi, cmpMeta, modeName, elm, customStyle, styleElm) {
    // first see if we've got a style for a specific mode
    let styleModeId = cmpMeta.tagNameMeta + (modeName || DEFAULT_STYLE_MODE);
    let styleTemplate = cmpMeta[styleModeId];
    if (!styleTemplate) {
      // didn't find a style for this mode
      // now let's check if there's a default style for this component
      styleModeId = cmpMeta.tagNameMeta + DEFAULT_STYLE_MODE;
      styleTemplate = cmpMeta[styleModeId];
    }
    if (styleTemplate) {
      // cool, we found a style template element for this component
      let styleContainerNode = domApi.$head;
      // if this browser supports shadow dom, then let's climb up
      // the dom and see if we're within a shadow dom
            if (domApi.$supportsShadowDom) {
        if (1 /* ShadowDom */ === cmpMeta.encapsulation) {
          // we already know we're in a shadow dom
          // so shadow root is the container for these styles
          styleContainerNode = elm.shadowRoot;
        } else {
          // climb up the dom and see if we're in a shadow dom
          while (elm = domApi.$parentNode(elm)) {
            if (elm.host && elm.host.shadowRoot) {
              // looks like we are in shadow dom, let's use
              // this shadow root as the container for these styles
              styleContainerNode = elm.host.shadowRoot;
              break;
            }
          }
        }
      }
      // if this container element already has these styles
      // then there's no need to apply them again
      // create an object to keep track if we'ready applied this component style
            const appliedStyles = styleContainerNode._appliedStyles = styleContainerNode._appliedStyles || {};
      if (!appliedStyles[styleModeId]) {
        false;
        // clone the template element to create a new <style> element
        styleElm = styleTemplate.content.cloneNode(true);
        // let's make sure we put the styles below the <style data-styles> element
        // so any visibility css overrides the default
        const dataStyles = styleContainerNode.querySelectorAll('[data-styles]');
        domApi.$insertBefore(styleContainerNode, styleElm, dataStyles.length && dataStyles[dataStyles.length - 1].nextSibling || styleContainerNode.firstChild);
        // remember we don't need to do this again for this element
                appliedStyles[styleModeId] = true;
      }
    }
  }
  const isDef = v => void 0 !== v && null !== v;
  const isUndef = v => void 0 === v || null === v;
  const toLowerCase = str => str.toLowerCase();
  const dashToPascalCase = str => toLowerCase(str).split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');
  const noop = () => {};
  function createDomApi(win, doc) {
    // using the $ prefix so that closure is
    // cool with property renaming each of these
    const unregisterListenerFns = new WeakMap();
    const domApi = {
      $documentElement: doc.documentElement,
      $head: doc.head,
      $body: doc.body,
      $supportsEventOptions: false,
      $nodeType: node => node.nodeType,
      $createElement: tagName => doc.createElement(tagName),
      $createElementNS: (namespace, tagName) => doc.createElementNS(namespace, tagName),
      $createTextNode: text => doc.createTextNode(text),
      $createComment: data => doc.createComment(data),
      $insertBefore: (parentNode, childNode, referenceNode) => parentNode.insertBefore(childNode, referenceNode),
      // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
      // and it's polyfilled in es5 builds
      $remove: node => node.remove(),
      $appendChild: (parentNode, childNode) => parentNode.appendChild(childNode),
      $childNodes: node => node.childNodes,
      $parentNode: node => node.parentNode,
      $nextSibling: node => node.nextSibling,
      $tagName: elm => toLowerCase(elm.tagName),
      $getTextContent: node => node.textContent,
      $setTextContent: (node, text) => node.textContent = text,
      $getAttribute: (elm, key) => elm.getAttribute(key),
      $setAttribute: (elm, key, val) => elm.setAttribute(key, val),
      $setAttributeNS: (elm, namespaceURI, qualifiedName, val) => elm.setAttributeNS(namespaceURI, qualifiedName, val),
      $removeAttribute: (elm, key) => elm.removeAttribute(key),
      $elementRef: (elm, referenceName) => {
        if ('child' === referenceName) {
          return elm.firstElementChild;
        }
        if ('parent' === referenceName) {
          return domApi.$parentElement(elm);
        }
        if ('body' === referenceName) {
          return domApi.$body;
        }
        if ('document' === referenceName) {
          return doc;
        }
        if ('window' === referenceName) {
          return win;
        }
        return elm;
      },
      $addEventListener: (assignerElm, eventName, listenerCallback, useCapture, usePassive, attachTo, eventListenerOpts, splt) => {
        // remember the original name before we possibly change it
        const assignersEventName = eventName;
        let attachToElm = assignerElm;
        // get the existing unregister listeners for
        // this element from the unregister listeners weakmap
                let assignersUnregListeners = unregisterListenerFns.get(assignerElm);
        assignersUnregListeners && assignersUnregListeners[assignersEventName] && 
        // removed any existing listeners for this event for the assigner element
        // this element already has this listener, so let's unregister it now
        assignersUnregListeners[assignersEventName]();
        if ('string' === typeof attachTo) {
          // attachTo is a string, and is probably something like
          // "parent", "window", or "document"
          // and the eventName would be like "mouseover" or "mousemove"
          attachToElm = domApi.$elementRef(assignerElm, attachTo);
        } else if ('object' === typeof attachTo) {
          // we were passed in an actual element to attach to
          attachToElm = attachTo;
        } else {
          // depending on the event name, we could actually be attaching
          // this element to something like the document or window
          splt = eventName.split(':');
          if (splt.length > 1) {
            // document:mousemove
            // parent:touchend
            // body:keyup.enter
            attachToElm = domApi.$elementRef(assignerElm, splt[0]);
            eventName = splt[1];
          }
        }
        if (!attachToElm) {
          // somehow we're referencing an element that doesn't exist
          // let's not continue
          return;
        }
        let eventListener = listenerCallback;
        // test to see if we're looking for an exact keycode
                splt = eventName.split('.');
        if (splt.length > 1) {
          // looks like this listener is also looking for a keycode
          // keyup.enter
          eventName = splt[0];
          eventListener = (ev => {
            // wrap the user's event listener with our own check to test
            // if this keyboard event has the keycode they're looking for
            ev.keyCode === KEY_CODE_MAP[splt[1]] && listenerCallback(ev);
          });
        }
        // create the actual event listener options to use
        // this browser may not support event options
                eventListenerOpts = domApi.$supportsEventOptions ? {
          capture: !!useCapture,
          passive: !!usePassive
        } : !!useCapture;
        // ok, good to go, let's add the actual listener to the dom element
                attachToElm.addEventListener(eventName, eventListener, eventListenerOpts);
        assignersUnregListeners || 
        // we don't already have a collection, let's create it
        unregisterListenerFns.set(assignerElm, assignersUnregListeners = {});
        // add the unregister listener to this element's collection
                assignersUnregListeners[assignersEventName] = (() => {
          // looks like it's time to say goodbye
          attachToElm && attachToElm.removeEventListener(eventName, eventListener, eventListenerOpts);
          assignersUnregListeners[assignersEventName] = null;
        });
      },
      $removeEventListener: (elm, eventName) => {
        // get the unregister listener functions for this element
        const assignersUnregListeners = unregisterListenerFns.get(elm);
        if (assignersUnregListeners) {
          // this element has unregister listeners
          if (eventName) {
            // passed in one specific event name to remove
            assignersUnregListeners[eventName] && assignersUnregListeners[eventName]();
          } else {
            // remove all event listeners
            Object.keys(assignersUnregListeners).forEach(assignersEventName => {
              assignersUnregListeners[assignersEventName] && assignersUnregListeners[assignersEventName]();
            });
            // sure it's weakmap, but we're here, so let's just delete it now
                        unregisterListenerFns.delete(elm);
          }
        }
      }
    };
    false;
    true;
    false;
    domApi.$dispatchEvent = ((elm, eventName, data) => elm && elm.dispatchEvent(new win.CustomEvent(eventName, data)));
    true;
    // test if this browser supports event options or not
    try {
      win.addEventListener('e', null, Object.defineProperty({}, 'passive', {
        get: () => domApi.$supportsEventOptions = true
      }));
    } catch (e) {}
    domApi.$parentElement = ((elm, parentNode) => {
      // if the parent node is a document fragment (shadow root)
      // then use the "host" property on it
      // otherwise use the parent node
      parentNode = domApi.$parentNode(elm);
      return parentNode && 11 /* DocumentFragment */ === domApi.$nodeType(parentNode) ? parentNode.host : parentNode;
    });
    return domApi;
  }
  function parseComponentLoader(cmpRegistryData, cmpRegistry, i, d) {
    // tag name will always be lower case
    const cmpMeta = {
      tagNameMeta: cmpRegistryData[0],
      membersMeta: {
        // every component defaults to always have
        // the mode and color properties
        // but only color should observe any attribute changes
        'color': {
          attribName: 'color'
        }
      }
    };
    // map of the bundle ids
    // can contain modes, and array of esm and es5 bundle ids
        cmpMeta.bundleIds = cmpRegistryData[1];
    // parse member meta
    // this data only includes props that are attributes that need to be observed
    // it does not include all of the props yet
        const memberData = cmpRegistryData[3];
    if (memberData) {
      for (i = 0; i < memberData.length; i++) {
        d = memberData[i];
        cmpMeta.membersMeta[d[0]] = {
          memberType: d[1],
          attribName: 'string' === typeof d[2] ? d[2] : d[2] ? d[0] : 0,
          propType: d[3]
        };
      }
    }
    // encapsulation
        cmpMeta.encapsulation = cmpRegistryData[4];
    cmpRegistryData[5] && (
    // parse listener meta
    cmpMeta.listenersMeta = cmpRegistryData[5].map(parseListenerData));
    return cmpRegistry[cmpMeta.tagNameMeta] = cmpMeta;
  }
  function parseListenerData(listenerData) {
    return {
      eventName: listenerData[0],
      eventMethodName: listenerData[1],
      eventDisabled: !!listenerData[2],
      eventPassive: !!listenerData[3],
      eventCapture: !!listenerData[4]
    };
  }
  function parsePropertyValue(propType, propValue) {
    // ensure this value is of the correct prop type
    // we're testing both formats of the "propType" value because
    // we could have either gotten the data from the attribute changed callback,
    // which wouldn't have Constructor data yet, and because this method is reused
    // within proxy where we don't have meta data, but only constructor data
    if (isDef(propValue)) {
      if (propType === Boolean || 3 /* Boolean */ === propType) {
        // per the HTML spec, any string value means it is a boolean true value
        // but we'll cheat here and say that the string "false" is the boolean false
        return 'false' !== propValue && ('' === propValue || !!propValue);
      }
      if (propType === Number || 4 /* Number */ === propType) {
        // force it to be a number
        return parseFloat(propValue);
      }
    }
    // not sure exactly what type we want
    // so no need to change to a different type
        return propValue;
  }
  function initEventEmitters(plt, cmpEvents, instance) {
    cmpEvents && cmpEvents.forEach(eventMeta => {
      instance[eventMeta.method] = {
        emit: data => {
          plt.emitEvent(instance.__el, eventMeta.name, {
            bubbles: eventMeta.bubbles,
            composed: eventMeta.composed,
            cancelable: eventMeta.cancelable,
            detail: data
          });
        }
      };
    });
  }
  function initElementListeners(plt, elm) {
    // so the element was just connected, which means it's in the DOM
    // however, the component instance hasn't been created yet
    // but what if an event it should be listening to get emitted right now??
    // let's add our listeners right now to our element, and if it happens
    // to receive events between now and the instance being created let's
    // queue up all of the event data and fire it off on the instance when it's ready
    const cmpMeta = plt.getComponentMeta(elm);
    cmpMeta.listenersMeta && 
    // we've got listens
    cmpMeta.listenersMeta.forEach(listenMeta => {
      // go through each listener
      listenMeta.eventDisabled || 
      // only add ones that are not already disabled
      plt.domApi.$addEventListener(elm, listenMeta.eventName, createListenerCallback(elm, listenMeta.eventMethodName), listenMeta.eventCapture, listenMeta.eventPassive);
    });
  }
  function createListenerCallback(elm, eventMethodName) {
    // create the function that gets called when the element receives
    // an event which it should be listening for
    return ev => {
      elm._instance ? 
      // instance is ready, let's call it's member method for this event
      elm._instance[eventMethodName](ev) : 
      // instance is not ready!!
      // let's queue up this event data and replay it later
      // when the instance is ready
      (elm._queuedEvents = elm._queuedEvents || []).push(eventMethodName, ev);
    };
  }
  function enableEventListener(plt, instance, eventName, shouldEnable, attachTo, passive) {
    if (instance) {
      // cool, we've got an instance, it's get the element it's on
      const elm = instance.__el;
      const cmpMeta = plt.getComponentMeta(elm);
      if (cmpMeta && cmpMeta.listenersMeta) {
        // alrighty, so this cmp has listener meta
        if (shouldEnable) {
          // we want to enable this event
          // find which listen meta we're talking about
          const listenMeta = cmpMeta.listenersMeta.find(l => l.eventName === eventName);
          listenMeta && 
          // found the listen meta, so let's add the listener
          plt.domApi.$addEventListener(elm, eventName, ev => instance[listenMeta.eventMethodName](ev), listenMeta.eventCapture, void 0 === passive ? listenMeta.eventPassive : !!passive, attachTo);
        } else {
          // we're disabling the event listener
          // so let's just remove it entirely
          plt.domApi.$removeEventListener(elm, eventName);
        }
      }
    }
  }
  function replayQueuedEventsOnInstance(elm, i) {
    // the element has an instance now and
    // we already added the event listeners to the element
    const queuedEvents = elm._queuedEvents;
    if (queuedEvents) {
      // events may have already fired before the instance was even ready
      // now that the instance is ready, let's replay all of the events that
      // we queued up earlier that were originally meant for the instance
      for (i = 0; i < queuedEvents.length; i += 2) {
        // data was added in sets of two
        // first item the eventMethodName
        // second item is the event data
        // take a look at initElementListener()
        elm._instance[queuedEvents[i]](queuedEvents[i + 1]);
      }
      // no longer need this data, be gone with you
            elm._queuedEvents = null;
    }
  }
  function proxyComponentInstance(plt, cmpConstructor, elm, instance, properties, memberName) {
    // at this point we've got a specific node of a host element, and created a component class instance
    // and we've already created getters/setters on both the host element and component class prototypes
    // let's upgrade any data that might have been set on the host element already
    // and let's have the getters/setters kick in and do their jobs
    // let's automatically add a reference to the host element on the instance
    instance.__el = elm;
    // create the _values object if it doesn't already exist
    // this will hold all of the internal getter/setter values
        elm._values = elm._values || {};
    // get the properties from the constructor
    // and add default "mode" and "color" properties
        properties = Object.assign({
      color: {
        type: String
      }
    }, cmpConstructor.properties);
    // always set mode
        properties.mode = {
      type: String
    };
    // define each of the members and initialize what their role is
        for (memberName in properties) {
      defineMember(plt, properties[memberName], elm, instance, memberName);
    }
  }
  function initComponentInstance(plt, elm, componentConstructor) {
    try {
      // using the user's component class, let's create a new instance
      componentConstructor = plt.getComponentMeta(elm).componentConstructor;
      elm._instance = new componentConstructor();
      // ok cool, we've got an host element now, and a actual instance
      // and there were no errors creating the instance
      // let's upgrade the data on the host element
      // and let the getters/setters do their jobs
            proxyComponentInstance(plt, componentConstructor, elm, elm._instance);
      true;
      // add each of the event emitters which wire up instance methods
      // to fire off dom events from the host element
      initEventEmitters(plt, componentConstructor.events, elm._instance);
      true;
      try {
        // replay any event listeners on the instance that
        // were queued up between the time the element was
        // connected and before the instance was ready
        replayQueuedEventsOnInstance(elm);
      } catch (e) {
        plt.onError(e, 2 /* QueueEventsError */ , elm);
      }
    } catch (e) {
      // something done went wrong trying to create a component instance
      // create a dumby instance so other stuff can load
      // but chances are the app isn't fully working cuz this component has issues
      elm._instance = {};
      plt.onError(e, 7 /* InitInstanceError */ , elm, true);
    }
  }
  function initComponentLoaded(plt, elm, hydratedCssClass) {
    // all is good, this component has been told it's time to finish loading
    // it's possible that we've already decided to destroy this element
    // check if this element has any actively loading child elements
    if (!elm._hasLoaded && elm._instance && !elm._hasDestroyed && (!elm.$activeLoading || !elm.$activeLoading.length)) {
      // cool, so at this point this element isn't already being destroyed
      // and it does not have any child elements that are still loading
      // ensure we remove any child references cuz it doesn't matter at this point
      elm.$activeLoading = null;
      // sweet, this particular element is good to go
      // all of this element's children have loaded (if any)
            elm._hasLoaded = true;
      try {
        // fire off the ref if it exists
        callNodeRefs(elm._vnode);
        // fire off the user's elm.componentOnReady() callbacks that were
        // put directly on the element (well before anything was ready)
                if (elm._onReadyCallbacks) {
          elm._onReadyCallbacks.forEach(cb => cb(elm));
          elm._onReadyCallbacks = null;
        }
        true;
        // fire off the user's componentDidLoad method (if one was provided)
        // componentDidLoad only runs ONCE, after the instance's element has been
        // assigned as the host element, and AFTER render() has been called
        // we'll also fire this method off on the element, just to
        elm._instance.componentDidLoad && elm._instance.componentDidLoad();
      } catch (e) {
        plt.onError(e, 4 /* DidLoadError */ , elm);
      }
      // add the css class that this element has officially hydrated
            elm.classList.add(hydratedCssClass);
      // ( •_•)
      // ( •_•)>⌐■-■
      // (⌐■_■)
      // load events fire from bottom to top
      // the deepest elements load first then bubbles up
            propagateComponentLoaded(elm);
    }
  }
  function propagateComponentLoaded(elm, index, ancestorsActivelyLoadingChildren) {
    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    if (elm._ancestorHostElement) {
      // ok so this element already has a known ancestor host element
      // let's make sure we remove this element from its ancestor's
      // known list of child elements which are actively loading
      ancestorsActivelyLoadingChildren = elm._ancestorHostElement.$activeLoading;
      if (ancestorsActivelyLoadingChildren) {
        index = ancestorsActivelyLoadingChildren.indexOf(elm);
        index > -1 && 
        // yup, this element is in the list of child elements to wait on
        // remove it so we can work to get the length down to 0
        ancestorsActivelyLoadingChildren.splice(index, 1);
        // the ancestor's initLoad method will do the actual checks
        // to see if the ancestor is actually loaded or not
        // then let's call the ancestor's initLoad method if there's no length
        // (which actually ends up as this method again but for the ancestor)
                !ancestorsActivelyLoadingChildren.length && elm._ancestorHostElement.$initLoad();
      }
      // fuhgeddaboudit, no need to keep a reference after this element loaded
            elm._ancestorHostElement = null;
    }
  }
  function createThemedClasses(mode, color, classList) {
    const allClasses = {};
    return classList.split(' ').reduce((classObj, classString) => {
      classObj[classString] = true;
      if (mode) {
        classObj[`${classString}-${mode}`] = true;
        if (color) {
          classObj[`${classString}-${color}`] = true;
          classObj[`${classString}-${mode}-${color}`] = true;
        }
      }
      return classObj;
    }, allClasses);
  }
  class VNode {}
  /**
     * Production h() function based on Preact by
     * Jason Miller (@developit)
     * Licensed under the MIT License
     * https://github.com/developit/preact/blob/master/LICENSE
     *
     * Modified for Stencil's compiler and vdom
     */  const stack = [];
  function h(nodeName, vnodeData, child) {
    let children;
    let lastSimple = false;
    let simple = false;
    for (var i = arguments.length; i-- > 2; ) {
      stack.push(arguments[i]);
    }
    while (stack.length) {
      if ((child = stack.pop()) && void 0 !== child.pop) {
        for (i = child.length; i--; ) {
          stack.push(child[i]);
        }
      } else {
        'boolean' === typeof child && (child = null);
        (simple = 'function' !== typeof nodeName) && (null == child ? child = '' : 'number' === typeof child ? child = String(child) : 'string' !== typeof child && (simple = false));
        simple && lastSimple ? children[children.length - 1].vtext += child : void 0 === children ? children = [ simple ? t(child) : child ] : children.push(simple ? t(child) : child);
        lastSimple = simple;
      }
    }
    const vnode = new VNode();
    vnode.vtag = nodeName;
    vnode.vchildren = children;
    if (vnodeData) {
      vnode.vattrs = vnodeData;
      vnode.vkey = vnodeData.key;
      vnode.vref = vnodeData.ref;
      // normalize class / classname attributes
            vnodeData.className && (vnodeData.class = vnodeData.className);
      if ('object' === typeof vnodeData.class) {
        for (i in vnodeData.class) {
          vnodeData.class[i] && stack.push(i);
        }
        vnodeData.class = stack.join(' ');
        stack.length = 0;
      }
    }
    return vnode;
  }
  function t(textValue) {
    const vnode = new VNode();
    vnode.vtext = textValue;
    return vnode;
  }
  function render(plt, elm, cmpMeta, isUpdateRender) {
    try {
      const instance = elm._instance;
      // if this component has a render function, let's fire
      // it off and generate the child vnodes for this host element
      // note that we do not create the host element cuz it already exists
            const hostMeta = cmpMeta.componentConstructor.host;
      if (instance.render || instance.hostData || hostMeta) {
        // tell the platform we're actively rendering
        // if a value is changed within a render() then
        // this tells the platform not to queue the change
        plt.activeRender = true;
        const vnodeChildren = instance.render && instance.render();
        let vnodeHostData;
        true;
        // user component provided a "hostData()" method
        // the returned data/attributes are used on the host element
        vnodeHostData = instance.hostData && instance.hostData();
        // tell the platform we're done rendering
        // now any changes will again queue
        plt.activeRender = false;
        (true, hostMeta) && (
        // component meta data has a "theme"
        // use this to automatically generate a good css class
        // from the mode and color to add to the host element
        vnodeHostData = Object.keys(hostMeta).reduce((hostData, key) => {
          switch (key) {
           case 'theme':
            hostData.class = hostData.class || {};
            hostData.class = Object.assign(hostData.class, createThemedClasses(instance.mode, instance.color, hostMeta.theme));
          }
          return hostData;
        }, vnodeHostData || {}));
        // looks like we've got child nodes to render into this host element
        // or we need to update the css class/attrs on the host element
        // if we haven't already created a vnode, then we give the renderer the actual element
        // if this is a re-render, then give the renderer the last vnode we already created
                const oldVNode = elm._vnode || new VNode();
        oldVNode.elm = elm;
        // each patch always gets a new vnode
        // the host element itself isn't patched because it already exists
        // kick off the actual render and any DOM updates
                elm._vnode = plt.render(oldVNode, h(null, vnodeHostData, vnodeChildren), isUpdateRender, elm._hostContentNodes, cmpMeta.componentConstructor.encapsulation);
      }
      true;
      // attach the styles this component needs, if any
      // this fn figures out if the styles should go in a
      // shadow root or if they should be global
      plt.attachStyles(plt.domApi, cmpMeta, instance.mode, elm);
      // it's official, this element has rendered
      elm.$rendered = true;
      if (elm.$onRender) {
        // ok, so turns out there are some child host elements
        // waiting on this parent element to load
        // let's fire off all update callbacks waiting
        elm.$onRender.forEach(cb => cb());
        elm.$onRender = null;
      }
    } catch (e) {
      plt.activeRender = false;
      plt.onError(e, 8 /* RenderError */ , elm, true);
    }
  }
  function queueUpdate(plt, elm) {
    // only run patch if it isn't queued already
    if (!elm._isQueuedForUpdate) {
      elm._isQueuedForUpdate = true;
      // run the patch in the next tick
            plt.queue.add(() => {
        // no longer queued
        elm._isQueuedForUpdate = false;
        // vdom diff and patch the host element for differences
                update(plt, elm);
      });
    }
  }
  function update(plt, elm) {
    // everything is async, so somehow we could have already disconnected
    // this node, so be sure to do nothing if we've already disconnected
    if (!elm._hasDestroyed) {
      const isInitialLoad = !elm._instance;
      let userPromise;
      if (isInitialLoad) {
        const ancestorHostElement = elm._ancestorHostElement;
        if (ancestorHostElement && !ancestorHostElement.$rendered) {
          // this is the intial load
          // this element has an ancestor host element
          // but the ancestor host element has NOT rendered yet
          // so let's just cool our jets and wait for the ancestor to render
          (ancestorHostElement.$onRender = ancestorHostElement.$onRender || []).push(() => {
            // this will get fired off when the ancestor host element
            // finally gets around to rendering its lazy self
            update(plt, elm);
          });
          return;
        }
        // haven't created a component instance for this host element yet!
        // create the instance from the user's component class
        // https://www.youtube.com/watch?v=olLxrojmvMg
                initComponentInstance(plt, elm);
        true;
        // fire off the user's componentWillLoad method (if one was provided)
        // componentWillLoad only runs ONCE, after instance's element has been
        // assigned as the host element, but BEFORE render() has been called
        try {
          elm._instance.componentWillLoad && (userPromise = elm._instance.componentWillLoad());
        } catch (e) {
          plt.onError(e, 3 /* WillLoadError */ , elm);
        }
      } else {
        false;
      }
      userPromise && userPromise.then ? 
      // looks like the user return a promise!
      // let's not actually kick off the render
      // until the user has resolved their promise
      userPromise.then(() => renderUpdate(plt, elm, isInitialLoad)) : 
      // user never returned a promise so there's
      // no need to wait on anything, let's do the render now my friend
      renderUpdate(plt, elm, isInitialLoad);
    }
  }
  function renderUpdate(plt, elm, isInitialLoad) {
    // if this component has a render function, let's fire
    // it off and generate a vnode for this
    render(plt, elm, plt.getComponentMeta(elm), !isInitialLoad);
    // _hasRendered was just set
    // _onRenderCallbacks were all just fired off
        try {
      if (isInitialLoad) {
        // so this was the initial load i guess
        elm.$initLoad();
        // componentDidLoad just fired off
            } else {
        true;
        // fire off the user's componentDidUpdate method (if one was provided)
        // componentDidUpdate runs AFTER render() has been called
        // but only AFTER an UPDATE and not after the intial render
        elm._instance.componentDidUpdate && elm._instance.componentDidUpdate();
      }
    } catch (e) {
      // derp
      plt.onError(e, 6 /* DidUpdateError */ , elm, true);
    }
  }
  function defineMember(plt, property, elm, instance, memberName) {
    function getComponentProp(elm) {
      // component instance prop/state getter
      // get the property value directly from our internal values
      elm = this.__el;
      return elm && elm._values && elm._values[memberName];
    }
    function setComponentProp(newValue, elm) {
      // component instance prop/state setter (cannot be arrow fn)
      elm = this.__el;
      elm && !(!property.state && !property.mutable) && setValue(plt, elm, memberName, newValue);
    }
    if (property.type || property.state) {
      if (!property.state) {
        if (property.attr && (void 0 === elm._values[memberName] || '' === elm._values[memberName])) {
          // check the prop value from the host element attribute
          const hostAttrValue = plt.domApi.$getAttribute(elm, property.attr);
          null != hostAttrValue && (
          // looks like we've got an attribute value
          // let's set it to our internal values
          elm._values[memberName] = parsePropertyValue(property.type, hostAttrValue));
        }
        true;
        // client-side
        // within the browser, the element's prototype
        // already has its getter/setter set, but on the
        // server the prototype is shared causing issues
        // so instead the server's elm has the getter/setter
        // directly on the actual element instance, not its prototype
        // so on the browser we can use "hasOwnProperty"
        if (elm.hasOwnProperty(memberName)) {
          // @Prop or @Prop({mutable:true})
          // property values on the host element should override
          // any default values on the component instance
          void 0 === elm._values[memberName] && (elm._values[memberName] = elm[memberName]);
          // for the client only, let's delete its "own" property
          // this way our already assigned getter/setter on the prototype kicks in
                    delete elm[memberName];
        }
      }
      instance.hasOwnProperty(memberName) && void 0 === elm._values[memberName] && (
      // @Prop() or @Prop({mutable:true}) or @State()
      // we haven't yet got a value from the above checks so let's
      // read any "own" property instance values already set
      // to our internal value as the source of getter data
      // we're about to define a property and it'll overwrite this "own" property
      elm._values[memberName] = instance[memberName]);
      property.watchCallbacks && (elm._values[WATCH_CB_PREFIX + memberName] = property.watchCallbacks.slice());
      // add getter/setter to the component instance
      // these will be pointed to the internal data set from the above checks
            definePropertyGetterSetter(instance, memberName, getComponentProp, setComponentProp);
    } else if (true, property.elementRef) {
      // @Element()
      // add a getter to the element reference using
      // the member name the component meta provided
      definePropertyValue(instance, memberName, elm);
    } else if (true, property.method) {
      // @Method()
      // add a property "value" on the host element
      // which we'll bind to the instance's method
      definePropertyValue(elm, memberName, instance[memberName].bind(instance));
    } else if (true, property.context) {
      // @Prop({ context: 'config' })
      const contextObj = plt.getContextItem(property.context);
      void 0 !== contextObj && definePropertyValue(instance, memberName, contextObj.getContext && contextObj.getContext(elm) || contextObj);
    } else {
      (true, property.connect) && 
      // @Prop({ connect: 'ion-loading-ctrl' })
      definePropertyValue(instance, memberName, plt.propConnect(property.connect));
    }
  }
  function setValue(plt, elm, memberName, newVal, internalValues, instance, watchMethods) {
    // get the internal values object, which should always come from the host element instance
    // create the _values object if it doesn't already exist
    internalValues = elm._values = elm._values || {};
    const oldVal = internalValues[memberName];
    // check our new property value against our internal value
        if (newVal !== oldVal) {
      // gadzooks! the property's value has changed!!
      // set our new value!
      // https://youtu.be/dFtLONl4cNc?t=22
      internalValues[memberName] = newVal;
      instance = elm._instance;
      if (instance) {
        // get an array of method names of watch functions to call
        watchMethods = internalValues[WATCH_CB_PREFIX + memberName];
        if (true, watchMethods) {
          // this instance is watching for when this property changed
          for (let i = 0; i < watchMethods.length; i++) {
            try {
              // fire off each of the watch methods that are watching this property
              instance[watchMethods[i]].call(instance, newVal, oldVal, memberName);
            } catch (e) {
              console.error(e);
            }
          }
        }
        !plt.activeRender && elm.$rendered && 
        // looks like this value actually changed, so we've got work to do!
        // but only if we've already created an instance, otherwise just chill out
        // queue that we need to do an update, but don't worry about queuing
        // up millions cuz this function ensures it only runs once
        queueUpdate(plt, elm);
      }
    }
  }
  function definePropertyValue(obj, propertyKey, value) {
    // minification shortcut
    Object.defineProperty(obj, propertyKey, {
      'configurable': true,
      'value': value
    });
  }
  function definePropertyGetterSetter(obj, propertyKey, get, set) {
    // minification shortcut
    Object.defineProperty(obj, propertyKey, {
      'configurable': true,
      'get': get,
      'set': set
    });
  }
  const WATCH_CB_PREFIX = 'wc-';
  function updateElement(plt, oldVnode, newVnode, isSvgMode, memberName) {
    // if the element passed in is a shadow root, which is a document fragment
    // then we want to be adding attrs/props to the shadow root's "host" element
    // if it's not a shadow root, then we add attrs/props to the same element
    const elm = 11 /* DocumentFragment */ === newVnode.elm.nodeType && newVnode.elm.host ? newVnode.elm.host : newVnode.elm;
    const oldVnodeAttrs = oldVnode && oldVnode.vattrs || EMPTY_OBJ;
    const newVnodeAttrs = newVnode.vattrs || EMPTY_OBJ;
    // remove attributes no longer present on the vnode by setting them to undefined
        for (memberName in oldVnodeAttrs) {
      newVnodeAttrs && null != newVnodeAttrs[memberName] || null == oldVnodeAttrs[memberName] || setAccessor(plt, elm, memberName, oldVnodeAttrs[memberName], void 0, isSvgMode);
    }
    // add new & update changed attributes
        for (memberName in newVnodeAttrs) {
      memberName in oldVnodeAttrs && newVnodeAttrs[memberName] === ('value' === memberName || 'checked' === memberName ? elm[memberName] : oldVnodeAttrs[memberName]) || setAccessor(plt, elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode);
    }
  }
  function setAccessor(plt, elm, memberName, oldValue, newValue, isSvg, i, ilen) {
    if ('class' !== memberName || isSvg) {
      if ('style' === memberName) {
        // Style
        oldValue = oldValue || EMPTY_OBJ;
        newValue = newValue || EMPTY_OBJ;
        for (i in oldValue) {
          newValue[i] || (elm.style[i] = '');
        }
        for (i in newValue) {
          newValue[i] !== oldValue[i] && (elm.style[i] = newValue[i]);
        }
      } else if ('o' !== memberName[0] || 'n' !== memberName[1] || memberName in elm) {
        if ('list' !== memberName && 'type' !== memberName && !isSvg && (memberName in elm || -1 !== [ 'object', 'function' ].indexOf(typeof newValue) && null !== newValue) || false) {
          // Properties
          // - list and type are attributes that get applied as values on the element
          // - all svgs get values as attributes not props
          // - check if elm contains name or if the value is array, object, or function
          const cmpMeta = plt.getComponentMeta(elm);
          if (cmpMeta && cmpMeta.membersMeta && cmpMeta.membersMeta[memberName]) {
            // we know for a fact that this element is a known component
            // and this component has this member name as a property,
            // let's set the known @Prop on this element
            setProperty(elm, memberName, newValue);
          } else if ('ref' !== memberName) {
            // this member name is a property on this element, but it's not a component
            // this is a native property like "value" or something
            // also we can ignore the "ref" member name at this point
            setProperty(elm, memberName, null == newValue ? '' : newValue);
            null != newValue && false !== newValue || elm.removeAttribute(memberName);
          }
        } else if (null != newValue) {
          // Element Attributes
          i = memberName !== (memberName = memberName.replace(/^xlink\:?/, ''));
          1 !== BOOLEAN_ATTRS[memberName] || newValue && 'false' !== newValue ? 'function' !== typeof newValue && (i ? elm.setAttributeNS(XLINK_NS$1, toLowerCase(memberName), newValue) : elm.setAttribute(memberName, newValue)) : i ? elm.removeAttributeNS(XLINK_NS$1, toLowerCase(memberName)) : elm.removeAttribute(memberName);
        }
      } else {
        // Event Handlers
        // adding an standard event listener, like <button onClick=...> or something
        memberName = toLowerCase(memberName.substring(2));
        newValue ? newValue !== oldValue && 
        // add listener
        plt.domApi.$addEventListener(elm, memberName, newValue) : 
        // remove listener
        plt.domApi.$removeEventListener(elm, memberName);
      }
    } else 
    // Class
    if (oldValue !== newValue) {
      const oldList = null == oldValue || '' === oldValue ? EMPTY_ARR : oldValue.trim().split(/\s+/);
      const newList = null == newValue || '' === newValue ? EMPTY_ARR : newValue.trim().split(/\s+/);
      let classList = null == elm.className || '' === elm.className ? EMPTY_ARR : elm.className.trim().split(/\s+/);
      for (i = 0, ilen = oldList.length; i < ilen; i++) {
        -1 === newList.indexOf(oldList[i]) && (classList = classList.filter(c => c !== oldList[i]));
      }
      for (i = 0, ilen = newList.length; i < ilen; i++) {
        -1 === oldList.indexOf(newList[i]) && (classList = [ ...classList, newList[i] ]);
      }
      elm.className = classList.join(' ');
    }
  }
  /**
     * Attempt to set a DOM property to the given value.
     * IE & FF throw for certain property-value combinations.
     */  function setProperty(elm, name, value) {
    try {
      elm[name] = value;
    } catch (e) {}
  }
  const BOOLEAN_ATTRS = {
    'allowfullscreen': 1,
    'async': 1,
    'autofocus': 1,
    'autoplay': 1,
    'checked': 1,
    'controls': 1,
    'disabled': 1,
    'enabled': 1,
    'formnovalidate': 1,
    'hidden': 1,
    'multiple': 1,
    'noresize': 1,
    'readonly': 1,
    'required': 1,
    'selected': 1,
    'spellcheck': 1
  };
  const XLINK_NS$1 = 'http://www.w3.org/1999/xlink';
  /**
     * Virtual DOM patching algorithm based on Snabbdom by
     * Simon Friis Vindum (@paldepind)
     * Licensed under the MIT License
     * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
     *
     * Modified for Stencil's renderer and slot projection
     */  let isSvgMode = false;
  function createRendererPatch(plt, domApi) {
    // createRenderer() is only created once per app
    // the patch() function which createRenderer() returned is the function
    // which gets called numerous times by each component
    function createElm(vnode, parentElm, childIndex) {
      let i = 0;
      'function' === typeof vnode.vtag && (vnode = vnode.vtag(Object.assign({}, vnode.vattrs, {
        children: vnode.vchildren
      })));
      if (!useNativeShadowDom && 'slot' === vnode.vtag) {
        if (hostContentNodes) {
          scopeId && domApi.$setAttribute(parentElm, scopeId + '-slot', '');
          // special case for manually relocating host content nodes
          // to their new home in either a named slot or the default slot
                    const namedSlot = vnode.vattrs && vnode.vattrs.name;
          let slotNodes;
          // this vnode is a named slot
          slotNodes = isDef(namedSlot) ? hostContentNodes.namedSlots && hostContentNodes.namedSlots[namedSlot] : hostContentNodes.defaultSlot;
          if (isDef(slotNodes)) {
            // the host element has some nodes that need to be moved around
            // we have a slot for the user's vnode to go into
            // while we're moving nodes around, temporarily disable
            // the disconnectCallback from working
            plt.tmpDisconnected = true;
            for (;i < slotNodes.length; i++) {
              // remove the host content node from it's original parent node
              // then relocate the host content node to its new slotted home
              domApi.$remove(slotNodes[i]);
              domApi.$appendChild(parentElm, slotNodes[i]);
            }
            // done moving nodes around
            // allow the disconnect callback to work again
                        plt.tmpDisconnected = false;
          }
        }
        // this was a slot node, we do not create slot elements, our work here is done
        // no need to return any element to be added to the dom
                return null;
      }
      if (isDef(vnode.vtext)) {
        // create text node
        vnode.elm = domApi.$createTextNode(vnode.vtext);
      } else {
        // create element
        const elm = vnode.elm = (true, isSvgMode || 'svg' === vnode.vtag ? domApi.$createElementNS('http://www.w3.org/2000/svg', vnode.vtag) : domApi.$createElement(vnode.vtag));
        true;
        isSvgMode = 'svg' === vnode.vtag || 'foreignObject' !== vnode.vtag && isSvgMode;
        // add css classes, attrs, props, listeners, etc.
        updateElement(plt, null, vnode, isSvgMode);
        null !== scopeId && elm._scopeId !== scopeId && 
        // if there is a scopeId and this is the initial render
        // then let's add the scopeId as an attribute
        domApi.$setAttribute(elm, elm._scopeId = scopeId, '');
        const children = vnode.vchildren;
        false;
        if (children) {
          let childNode;
          for (;i < children.length; ++i) {
            // create the node
            childNode = createElm(children[i], elm, i);
            // return node could have been null
                        if (childNode) {
              false;
              // append our new node
              domApi.$appendChild(elm, childNode);
              false;
            }
          }
        }
        // Only reset the SVG context when we're exiting SVG element
                'svg' === vnode.vtag && (isSvgMode = false);
      }
      return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, childNode, vnodeChild) {
      const containerElm = parentElm.$defaultHolder && domApi.$parentNode(parentElm.$defaultHolder) || parentElm;
      for (;startIdx <= endIdx; ++startIdx) {
        vnodeChild = vnodes[startIdx];
        if (isDef(vnodeChild)) {
          childNode = isDef(vnodeChild.vtext) ? domApi.$createTextNode(vnodeChild.vtext) : createElm(vnodeChild, parentElm, startIdx);
          if (isDef(childNode)) {
            vnodeChild.elm = childNode;
            domApi.$insertBefore(containerElm, childNode, before);
          }
        }
      }
    }
    function removeVnodes(vnodes, startIdx, endIdx) {
      for (;startIdx <= endIdx; ++startIdx) {
        isDef(vnodes[startIdx]) && domApi.$remove(vnodes[startIdx].elm);
      }
    }
    function updateChildren(parentElm, oldCh, newCh) {
      let oldStartIdx = 0, newStartIdx = 0;
      let oldEndIdx = oldCh.length - 1;
      let oldStartVnode = oldCh[0];
      let oldEndVnode = oldCh[oldEndIdx];
      let newEndIdx = newCh.length - 1;
      let newStartVnode = newCh[0];
      let newEndVnode = newCh[newEndIdx];
      let oldKeyToIdx;
      let idxInOld;
      let elmToMove;
      let node;
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (null == oldStartVnode) {
          oldStartVnode = oldCh[++oldStartIdx];
 // Vnode might have been moved left
                } else if (null == oldEndVnode) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (null == newStartVnode) {
          newStartVnode = newCh[++newStartIdx];
        } else if (null == newEndVnode) {
          newEndVnode = newCh[--newEndIdx];
        } else if (isSameVnode(oldStartVnode, newStartVnode)) {
          patchVNode(oldStartVnode, newStartVnode);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
          patchVNode(oldEndVnode, newEndVnode);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
          patchVNode(oldStartVnode, newEndVnode);
          domApi.$insertBefore(parentElm, oldStartVnode.elm, domApi.$nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
          patchVNode(oldEndVnode, newStartVnode);
          domApi.$insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          isUndef(oldKeyToIdx) && (oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx));
          idxInOld = oldKeyToIdx[newStartVnode.vkey];
          if (isUndef(idxInOld)) {
            // new element
            node = createElm(newStartVnode, parentElm, newStartIdx);
            newStartVnode = newCh[++newStartIdx];
          } else {
            elmToMove = oldCh[idxInOld];
            if (elmToMove.vtag !== newStartVnode.vtag) {
              node = createElm(newStartVnode, parentElm, idxInOld);
            } else {
              patchVNode(elmToMove, newStartVnode);
              oldCh[idxInOld] = void 0;
              node = elmToMove.elm;
            }
            newStartVnode = newCh[++newStartIdx];
          }
          node && domApi.$insertBefore(oldStartVnode.elm && oldStartVnode.elm.parentNode || parentElm, node, oldStartVnode.elm);
        }
      }
      oldStartIdx > oldEndIdx ? addVnodes(parentElm, null == newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].elm, newCh, newStartIdx, newEndIdx) : newStartIdx > newEndIdx && removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
    function isSameVnode(vnode1, vnode2) {
      // compare if two vnode to see if they're "technically" the same
      // need to have the same element tag, and same key to be the same
      return vnode1.vtag === vnode2.vtag && vnode1.vkey === vnode2.vkey;
    }
    function createKeyToOldIdx(children, beginIdx, endIdx) {
      const map = {};
      let i, key, ch;
      for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (null != ch) {
          key = ch.vkey;
          void 0 !== key && (map.k = i);
        }
      }
      return map;
    }
    function patchVNode(oldVNode, newVNode) {
      const elm = newVNode.elm = oldVNode.elm;
      const oldChildren = oldVNode.vchildren;
      const newChildren = newVNode.vchildren;
      true;
      isSvgMode = newVNode.elm && null != newVNode.elm.parentElement && void 0 !== newVNode.elm.ownerSVGElement;
      isSvgMode = 'svg' === newVNode.vtag || 'foreignObject' !== newVNode.vtag && isSvgMode;
      if (isUndef(newVNode.vtext)) {
        // element node
        'slot' !== newVNode.vtag && 
        // either this is the first render of an element OR it's an update
        // AND we already know it's possible it could have changed
        // this updates the element's css classes, attrs, props, listeners, etc.
        updateElement(plt, oldVNode, newVNode, isSvgMode);
        if (isDef(oldChildren) && isDef(newChildren)) {
          // looks like there's child vnodes for both the old and new vnodes
          updateChildren(elm, oldChildren, newChildren);
        } else if (isDef(newChildren)) {
          // no old child vnodes, but there are new child vnodes to add
          isDef(oldVNode.vtext) && 
          // the old vnode was text, so be sure to clear it out
          domApi.$setTextContent(elm, '');
          // add the new vnode children
                    addVnodes(elm, null, newChildren, 0, newChildren.length - 1);
        } else {
          isDef(oldChildren) && 
          // no new child vnodes, but there are old child vnodes to remove
          removeVnodes(oldChildren, 0, oldChildren.length - 1);
        }
      } else if (elm._hostContentNodes && elm._hostContentNodes.defaultSlot) {
        // this element has slotted content
        const parentElement = elm._hostContentNodes.defaultSlot[0].parentElement;
        domApi.$setTextContent(parentElement, newVNode.vtext);
        elm._hostContentNodes.defaultSlot = [ parentElement.childNodes[0] ];
      } else {
        oldVNode.vtext !== newVNode.vtext && 
        // update the text content for the text only vnode
        // and also only if the text is different than before
        domApi.$setTextContent(elm, newVNode.vtext);
        // reset svgMode when svg node is fully patched
            }
      'svg' === newVNode.vtag && isSvgMode && (isSvgMode = false);
    }
    // internal variables to be reused per patch() call
        let isUpdate, hostContentNodes, useNativeShadowDom, scopeId;
    return function patch(oldVNode, newVNode, isUpdatePatch, hostElementContentNodes, encapsulation, ssrPatchId) {
      // patchVNode() is synchronous
      // so it is safe to set these variables and internally
      // the same patch() call will reference the same data
      isUpdate = isUpdatePatch;
      hostContentNodes = hostElementContentNodes;
      false;
      scopeId = 'scoped' === encapsulation || 'shadow' === encapsulation && !domApi.$supportsShadowDom ? 'data-' + domApi.$tagName(oldVNode.elm) : null;
      false;
      if (!isUpdate) {
        false;
        scopeId && 
        // this host element should use scoped css
        // add the scope attribute to the host
        domApi.$setAttribute(oldVNode.elm, scopeId + '-host', '');
      }
      // synchronous patch
            patchVNode(oldVNode, newVNode);
      false;
      // return our new vnode
      return newVNode;
    };
  }
  function callNodeRefs(vNode, isDestroy) {
    if (vNode) {
      vNode.vref && vNode.vref(isDestroy ? null : vNode.elm);
      vNode.vchildren && vNode.vchildren.forEach(vChild => {
        callNodeRefs(vChild, isDestroy);
      });
    }
  }
  function createVNodesFromSsr(domApi, rootElm) {
    const allSsrElms = rootElm.querySelectorAll(`[${SSR_VNODE_ID}]`);
    const ilen = allSsrElms.length;
    let elm, ssrVNodeId, ssrVNode, i, j, jlen;
    if (rootElm._hasLoaded = ilen > 0) {
      for (i = 0; i < ilen; i++) {
        elm = allSsrElms[i];
        ssrVNodeId = domApi.$getAttribute(elm, SSR_VNODE_ID);
        ssrVNode = elm._vnode = new VNode();
        ssrVNode.vtag = domApi.$tagName(ssrVNode.elm = elm);
        for (j = 0, jlen = elm.childNodes.length; j < jlen; j++) {
          addChildSsrVNodes(domApi, elm.childNodes[j], ssrVNode, ssrVNodeId, true);
        }
      }
    }
  }
  function addChildSsrVNodes(domApi, node, parentVNode, ssrVNodeId, checkNestedElements) {
    const nodeType = domApi.$nodeType(node);
    let previousComment;
    let childVNodeId, childVNodeSplt, childVNode;
    if (checkNestedElements && 1 /* ElementNode */ === nodeType) {
      childVNodeId = domApi.$getAttribute(node, SSR_CHILD_ID);
      if (childVNodeId) {
        // split the start comment's data with a period
        childVNodeSplt = childVNodeId.split('.');
        // ensure this this element is a child element of the ssr vnode
                if (childVNodeSplt[0] === ssrVNodeId) {
          // cool, this element is a child to the parent vnode
          childVNode = new VNode();
          childVNode.vtag = domApi.$tagName(childVNode.elm = node);
          // this is a new child vnode
          // so ensure its parent vnode has the vchildren array
                    parentVNode.vchildren || (parentVNode.vchildren = []);
          // add our child vnode to a specific index of the vnode's children
                    parentVNode.vchildren[childVNodeSplt[1]] = childVNode;
          // this is now the new parent vnode for all the next child checks
                    parentVNode = childVNode;
          // if there's a trailing period, then it means there aren't any
          // more nested elements, but maybe nested text nodes
          // either way, don't keep walking down the tree after this next call
                    checkNestedElements = '' !== childVNodeSplt[2];
        }
      }
      // keep drilling down through the elements
            for (let i = 0; i < node.childNodes.length; i++) {
        addChildSsrVNodes(domApi, node.childNodes[i], parentVNode, ssrVNodeId, checkNestedElements);
      }
    } else if (3 /* TextNode */ === nodeType && (previousComment = node.previousSibling) && 8 /* CommentNode */ === domApi.$nodeType(previousComment)) {
      // split the start comment's data with a period
      childVNodeSplt = domApi.$getTextContent(previousComment).split('.');
      // ensure this is an ssr text node start comment
      // which should start with an "s" and delimited by periods
            if ('s' === childVNodeSplt[0] && childVNodeSplt[1] === ssrVNodeId) {
        // cool, this is a text node and it's got a start comment
        childVNode = t(domApi.$getTextContent(node));
        childVNode.elm = node;
        // this is a new child vnode
        // so ensure its parent vnode has the vchildren array
                parentVNode.vchildren || (parentVNode.vchildren = []);
        // add our child vnode to a specific index of the vnode's children
                parentVNode.vchildren[childVNodeSplt[2]] = childVNode;
      }
    }
  }
  function createQueueClient(win, resolvePending, rafPending) {
    const now = () => win.performance.now();
    const raf = cb => window.requestAnimationFrame(cb);
    const highPromise = Promise.resolve();
    const highPriority = [];
    const lowPriority = [];
    function doHighPriority() {
      // holy geez we need to get this stuff done and fast
      // all high priority callbacks should be fired off immediately
      while (highPriority.length > 0) {
        highPriority.shift()();
      }
      resolvePending = false;
    }
    function doWork(start) {
      start = now();
      // always run all of the high priority work if there is any
            doHighPriority();
      while (lowPriority.length > 0 && now() - start < 40) {
        lowPriority.shift()();
      }
      // check to see if we still have work to do
            (rafPending = lowPriority.length > 0) && 
      // everyone just settle down now
      // we already don't have time to do anything in this callback
      // let's throw the next one in a requestAnimationFrame
      // so we can just simmer down for a bit
      raf(flush);
    }
    function flush(start) {
      // always run all of the high priority work if there is any
      doHighPriority();
      // always force a bunch of medium callbacks to run, but still have
      // a throttle on how many can run in a certain time
            start = 4 + now();
      while (lowPriority.length > 0 && now() < start) {
        lowPriority.shift()();
      }
      (rafPending = lowPriority.length > 0) && 
      // still more to do yet, but we've run out of time
      // let's let this thing cool off and try again in the next ric
      raf(doWork);
    }
    return {
      add: (cb, priority) => {
        if (3 /* High */ === priority) {
          // uses Promise.resolve() for next tick
          highPriority.push(cb);
          if (!resolvePending) {
            // not already pending work to do, so let's tee it up
            resolvePending = true;
            highPromise.then(doHighPriority);
          }
        } else {
          // defaults to low priority
          // uses requestAnimationFrame
          lowPriority.push(cb);
          if (!rafPending) {
            // not already pending work to do, so let's tee it up
            rafPending = true;
            raf(doWork);
          }
        }
      }
    };
  }
  function attributeChangedCallback(membersMeta, elm, attribName, oldVal, newVal, propName) {
    // only react if the attribute values actually changed
    if (oldVal !== newVal && membersMeta) {
      // normalize the attribute name w/ lower case
      attribName = toLowerCase(attribName);
      // using the known component meta data
      // look up to see if we have a property wired up to this attribute name
            for (propName in membersMeta) {
        if (membersMeta[propName].attribName === attribName) {
          // cool we've got a prop using this attribute name the value will
          // be a string, so let's convert it to the correct type the app wants
          // below code is ugly yes, but great minification ;)
          elm[propName] = parsePropertyValue(membersMeta[propName].propType, newVal);
          break;
        }
      }
    }
  }
  function connectedCallback(plt, cmpMeta, elm) {
    // do not reconnect if we've already created an instance for this element
    if (!elm.$connected) {
      // first time we've connected
      elm.$connected = true;
      // if somehow this node was reused, ensure we've removed this property
            elm._hasDestroyed = null;
      true;
      // initialize our event listeners on the host element
      // we do this now so that we can listening to events that may
      // have fired even before the instance is ready
      initElementListeners(plt, elm);
      // register this component as an actively
      // loading child to its parent component
      registerWithParentComponent(plt, elm);
      // add to the queue to load the bundle
      // it's important to have an async tick in here so we can
      // ensure the "mode" attribute has been added to the element
      // place in high priority since it's not much work and we need
      // to know as fast as possible, but still an async tick in between
            plt.queue.add(() => {
        // only collects slot references if this component even has slots
        plt.connectHostElement(cmpMeta, elm);
        // start loading this component mode's bundle
        // if it's already loaded then the callback will be synchronous
                plt.loadBundle(cmpMeta, elm.mode, () => 
        // we've fully loaded the component mode data
        // let's queue it up to be rendered next
        queueUpdate(plt, elm));
      }, 3 /* High */);
    }
  }
  function registerWithParentComponent(plt, elm, ancestorHostElement) {
    // find the first ancestor host element (if there is one) and register
    // this element as one of the actively loading child elements for its ancestor
    ancestorHostElement = elm;
    while (ancestorHostElement = plt.domApi.$parentElement(ancestorHostElement)) {
      // climb up the ancestors looking for the first registered component
      if (plt.isDefinedComponent(ancestorHostElement)) {
        // we found this elements the first ancestor host element
        // if the ancestor already loaded then do nothing, it's too late
        if (!ancestorHostElement._hasLoaded) {
          // keep a reference to this element's ancestor host element
          elm._ancestorHostElement = ancestorHostElement;
          // ensure there is an array to contain a reference to each of the child elements
          // and set this element as one of the ancestor's child elements it should wait on
                    // ensure there is an array to contain a reference to each of the child elements
          // and set this element as one of the ancestor's child elements it should wait on
          (ancestorHostElement.$activeLoading = ancestorHostElement.$activeLoading || []).push(elm);
        }
        break;
      }
    }
  }
  function disconnectedCallback(plt, elm) {
    // only disconnect if we're not temporarily disconnected
    // tmpDisconnected will happen when slot nodes are being relocated
    if (!plt.tmpDisconnected && isDisconnected(plt.domApi, elm)) {
      // ok, let's officially destroy this thing
      // set this to true so that any of our pending async stuff
      // doesn't continue since we already decided to destroy this node
      elm._hasDestroyed = true;
      // double check that we've informed the ancestor host elements
      // that they're good to go and loaded (cuz this one is on its way out)
            propagateComponentLoaded(elm);
      // since we're disconnecting, call all of the JSX ref's with null
            callNodeRefs(elm._vnode, true);
      // detatch any event listeners that may have been added
      // because we're not passing an exact event name it'll
      // remove all of this element's event, which is good
            plt.domApi.$removeEventListener(elm);
      elm._hostContentNodes && (
      // overreacting here just to reduce any memory leak issues
      elm._hostContentNodes = elm._hostContentNodes.defaultSlot = elm._hostContentNodes.namedSlots = null);
      // call instance Did Unload and destroy instance stuff
      // if we've created an instance for this
            if (elm._instance) {
        true;
        // call the user's componentDidUnload if there is one
        elm._instance.componentDidUnload && elm._instance.componentDidUnload();
        elm._instance = elm._instance.__el = null;
      }
      // fuhgeddaboudit
      // set it all to null to ensure we forget references
      // and reset values incase this node gets reused somehow
      // (possible that it got disconnected, but the node was reused)
            elm.$activeLoading = elm.$connected = elm.$defaultHolder = elm._root = elm._values = elm._vnode = elm._ancestorHostElement = elm._hasLoaded = elm._isQueuedForUpdate = elm._observer = null;
    }
  }
  function isDisconnected(domApi, elm) {
    while (elm) {
      if (!domApi.$parentNode(elm)) {
        return 9 /* DocumentNode */ !== domApi.$nodeType(elm);
      }
      elm = domApi.$parentNode(elm);
    }
  }
  function proxyHostElementPrototype(plt, membersMeta, hostPrototype) {
    // create getters/setters on the host element prototype to represent the public API
    // the setters allows us to know when data has changed so we can re-render
    membersMeta && Object.keys(membersMeta).forEach(memberName => {
      // add getters/setters
      const memberType = membersMeta[memberName].memberType;
      1 /* Prop */ === memberType || 2 /* PropMutable */ === memberType ? 
      // @Prop() or @Prop({ mutable: true })
      definePropertyGetterSetter(hostPrototype, memberName, function getHostElementProp() {
        // host element getter (cannot be arrow fn)
        // yup, ugly, srynotsry
        // but its creating _values if it doesn't already exist
        return (this._values = this._values || {})[memberName];
      }, function setHostElementProp(newValue) {
        // host element setter (cannot be arrow fn)
        setValue(plt, this, memberName, newValue);
      }) : 6 /* Method */ === memberType && 
      // @Method()
      // add a placeholder noop value on the host element's prototype
      // incase this method gets called before setup
      definePropertyValue(hostPrototype, memberName, noop);
    });
  }
  function initHostElement(plt, cmpMeta, HostElementConstructor, hydratedCssClass) {
    // let's wire up our functions to the host element's prototype
    // we can also inject our platform into each one that needs that api
    // note: these cannot be arrow functions cuz "this" is important here hombre
    HostElementConstructor.connectedCallback = function() {
      // coolsville, our host element has just hit the DOM
      connectedCallback(plt, cmpMeta, this);
    };
    true;
    HostElementConstructor.attributeChangedCallback = function(attribName, oldVal, newVal) {
      // the browser has just informed us that an attribute
      // on the host element has changed
      attributeChangedCallback(cmpMeta.membersMeta, this, attribName, oldVal, newVal);
    };
    HostElementConstructor.disconnectedCallback = function() {
      // the element has left the builing
      disconnectedCallback(plt, this);
    };
    HostElementConstructor.componentOnReady = function(cb, promise) {
      cb || (promise = new Promise(resolve => cb = resolve));
      componentOnReady(this, cb);
      return promise;
    };
    HostElementConstructor.$initLoad = function() {
      initComponentLoaded(plt, this, hydratedCssClass);
    };
    HostElementConstructor.forceUpdate = function() {
      queueUpdate(plt, this);
    };
    // add getters/setters to the host element members
    // these would come from the @Prop and @Method decorators that
    // should create the public API to this component
        proxyHostElementPrototype(plt, cmpMeta.membersMeta, HostElementConstructor);
  }
  function componentOnReady(elm, cb) {
    elm._hasDestroyed || (elm._hasLoaded ? cb(elm) : (elm._onReadyCallbacks = elm._onReadyCallbacks || []).push(cb));
  }
  function proxyController(domApi, controllerComponents, ctrlTag) {
    return {
      'create': proxyProp(domApi, controllerComponents, ctrlTag, 'create'),
      'componentOnReady': proxyProp(domApi, controllerComponents, ctrlTag, 'componentOnReady')
    };
  }
  function proxyProp(domApi, controllerComponents, ctrlTag, proxyMethodName) {
    return function() {
      const args = arguments;
      return loadComponent(domApi, controllerComponents, ctrlTag).then(ctrlElm => ctrlElm[proxyMethodName].apply(ctrlElm, args));
    };
  }
  function loadComponent(domApi, controllerComponents, ctrlTag) {
    return new Promise(resolve => {
      let ctrlElm = controllerComponents[ctrlTag];
      ctrlElm || (ctrlElm = domApi.$body.querySelector(ctrlTag));
      if (!ctrlElm) {
        ctrlElm = controllerComponents[ctrlTag] = domApi.$createElement(ctrlTag);
        domApi.$appendChild(domApi.$body, ctrlElm);
      }
      ctrlElm.componentOnReady(resolve);
    });
  }
  function useShadowDom(supportsNativeShadowDom, cmpMeta) {
    return supportsNativeShadowDom && 1 /* ShadowDom */ === cmpMeta.encapsulation;
  }
  function useScopedCss(supportsNativeShadowDom, cmpMeta) {
    if (2 /* ScopedCss */ === cmpMeta.encapsulation) {
      return true;
    }
    if (1 /* ShadowDom */ === cmpMeta.encapsulation && !supportsNativeShadowDom) {
      return true;
    }
    return false;
  }
  function createPlatformClient(Context, App, win, doc, publicPath, hydratedCssClass) {
    const cmpRegistry = {
      'html': {}
    };
    const controllerComponents = {};
    const domApi = createDomApi(win, doc);
    // set App Context
        Context.isServer = Context.isPrerender = !(Context.isClient = true);
    Context.window = win;
    Context.location = win.location;
    Context.document = doc;
    Context.publicPath = publicPath;
    true;
    Context.enableListener = ((instance, eventName, enabled, attachTo, passive) => enableEventListener(plt, instance, eventName, enabled, attachTo, passive));
    true;
    Context.emit = ((elm, eventName, data) => domApi.$dispatchEvent(elm, Context.eventNameFn ? Context.eventNameFn(eventName) : eventName, data));
    // add the h() fn to the app's global namespace
    App.h = h;
    App.Context = Context;
    // keep a global set of tags we've already defined
        const globalDefined = win.$definedCmps = win.$definedCmps || {};
    // create the platform api which is used throughout common core code
        const plt = {
      connectHostElement: connectHostElement,
      domApi: domApi,
      defineComponent: defineComponent,
      emitEvent: Context.emit,
      getComponentMeta: elm => cmpRegistry[domApi.$tagName(elm)],
      getContextItem: contextKey => Context[contextKey],
      isClient: true,
      isDefinedComponent: elm => !!(globalDefined[domApi.$tagName(elm)] || plt.getComponentMeta(elm)),
      loadBundle: loadBundle,
      onError: (err, type, elm) => console.error(err, type, elm && elm.tagName),
      propConnect: ctrlTag => proxyController(domApi, controllerComponents, ctrlTag),
      queue: createQueueClient(win),
      registerComponents: components => (components || []).map(data => parseComponentLoader(data, cmpRegistry))
    };
    // create the renderer that will be used
        plt.render = createRendererPatch(plt, domApi);
    // setup the root element which is the mighty <html> tag
    // the <html> has the final say of when the app has loaded
        const rootElm = domApi.$documentElement;
    rootElm.$rendered = true;
    rootElm.$activeLoading = [];
    // this will fire when all components have finished loaded
        rootElm.$initLoad = (() => rootElm._hasLoaded = true);
    // if the HTML was generated from SSR
    // then let's walk the tree and generate vnodes out of the data
        createVNodesFromSsr(domApi, rootElm);
    function connectHostElement(cmpMeta, elm) {
      // set the "mode" property
      elm.mode || (
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode);
      // host element has been connected to the DOM
            domApi.$getAttribute(elm, SSR_VNODE_ID) || useShadowDom(domApi.$supportsShadowDom, cmpMeta) || 
      // only required when we're NOT using native shadow dom (slot)
      // this host element was NOT created with SSR
      // let's pick out the inner content for slot projection
      assignHostContentSlots(domApi, elm, elm.childNodes);
      domApi.$supportsShadowDom || 1 /* ShadowDom */ !== cmpMeta.encapsulation || (
      // this component should use shadow dom
      // but this browser doesn't support it
      // so let's polyfill a few things for the user
      elm.shadowRoot = elm);
    }
    function defineComponent(cmpMeta, HostElementConstructor) {
      if (!globalDefined[cmpMeta.tagNameMeta]) {
        // keep a map of all the defined components
        globalDefined[cmpMeta.tagNameMeta] = true;
        // initialize the members on the host element prototype
                initHostElement(plt, cmpMeta, HostElementConstructor.prototype, hydratedCssClass);
        true;
        {
          // add which attributes should be observed
          const observedAttributes = [];
          // at this point the membersMeta only includes attributes which should
          // be observed, it does not include all props yet, so it's safe to
          // loop through all of the props (attrs) and observed them
                    for (const propName in cmpMeta.membersMeta) {
            // initialize the actual attribute name used vs. the prop name
            // for example, "myProp" would be "my-prop" as an attribute
            // and these can be configured to be all lower case or dash case (default)
            cmpMeta.membersMeta[propName].attribName && observedAttributes.push(
            // dynamically generate the attribute name from the prop name
            // also add it to our array of attributes we need to observe
            cmpMeta.membersMeta[propName].attribName);
          }
          // set the array of all the attributes to keep an eye on
          // https://www.youtube.com/watch?v=RBs21CFBALI
                    HostElementConstructor.observedAttributes = observedAttributes;
        }
        // define the custom element
                win.customElements.define(cmpMeta.tagNameMeta, HostElementConstructor);
      }
    }
    function loadBundle(cmpMeta, modeName, cb) {
      if (cmpMeta.componentConstructor) {
        // we're already all loaded up :)
        cb();
      } else {
        const bundleId = 'string' === typeof cmpMeta.bundleIds ? cmpMeta.bundleIds : cmpMeta.bundleIds[modeName];
        const url = publicPath + bundleId + (useScopedCss(domApi.$supportsShadowDom, cmpMeta) ? '.sc' : '') + '.js';
        // dynamic es module import() => woot!
                import(url).then(importedModule => {
          // async loading of the module is done
          try {
            // get the component constructor from the module
            cmpMeta.componentConstructor = importedModule[dashToPascalCase(cmpMeta.tagNameMeta)];
            // initialize this component constructor's styles
            // it is possible for the same component to have difficult styles applied in the same app
                        initStyleTemplate(domApi, cmpMeta, cmpMeta.componentConstructor);
          } catch (e) {
            // oh man, something's up
            console.error(e);
            // provide a bogus component constructor
            // so the rest of the app acts as normal
                        cmpMeta.componentConstructor = class {};
          }
          // bundle all loaded up, let's continue
                    cb();
        }).catch(err => console.error(err));
      }
    }
    true;
    plt.attachStyles = attachStyles;
    return plt;
  }
  /*
    Extremely simple css parser. Intended to be not more than what we need
    and definitely not necessarily correct =).
    */
  /* tslint:disable */  const App = window[appNamespace] = window[appNamespace] || {};
  false;
  {
    const plt = createPlatformClient(Context, App, window, document, publicPath, hydratedCssClass);
    // es6 class extends HTMLElement
        plt.registerComponents(App.components).forEach(cmpMeta => plt.defineComponent(cmpMeta, class extends HTMLElement {}));
  }
})(window, document, Context, appNamespace, publicPath);
})({},"App","hydrated","/build/app/");