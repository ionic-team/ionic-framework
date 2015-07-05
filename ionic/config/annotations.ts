import {coreDirectives, Component, Directive, View} from 'angular2/angular2'

import * as util from 'ionic/util';
import {IonicConfig} from './config';
import {IonicRouter} from '../routing/router';
import {ionicBootstrap} from '../components/app/app';
import {
  Aside, Content, Scroll, Refresher,
  Slides, Slide, SlidePager,
  Tabs, Tab,
  List, Item, ItemGroup, ItemGroupTitle,
  Toolbar,
  Icon,
  Checkbox, Switch, Label, Input,
  Segment, SegmentButton, SegmentControlValueAccessor,
  RadioGroup, RadioButton, SearchBar,
  Nav, NavbarTemplate, Navbar, NavPush, NavPop
} from 'ionic/ionic';


export function IonicView(config) {
  return function(ComponentType) {

    const ionicDirectives = [
      // Angular
      coreDirectives,

      // Content
      Aside, Content, Scroll, Refresher,
      List, Item, ItemGroup, ItemGroupTitle,
      Slides, Slide, SlidePager,
      Tabs, Tab,
      Toolbar,

      // Media
      Icon,

      // Form elements
      Segment, SegmentButton, SegmentControlValueAccessor,
      //Checkbox, Switch, Label, Input
      //RadioGroup, RadioButton, SearchBar,

      // Nav
      Nav, NavbarTemplate, Navbar, NavPush, NavPop
    ];
    config.directives = (config.directives || []).concat(ionicDirectives);

    var annotations = Reflect.getMetadata('annotations', ComponentType) || [];
    annotations.push(new View(config));
    Reflect.defineMetadata('annotations', annotations, ComponentType);
    return ComponentType;
  }
}

export function IonicDirective(config) {
  return function(ComponentType) {
    var annotations = Reflect.getMetadata('annotations', ComponentType) || [];
    annotations.push(new Directive(appendModeConfig(ComponentType, config)));
    Reflect.defineMetadata('annotations', annotations, ComponentType);
    return ComponentType;
  }
}

export function IonicComponent(config) {
  return function(ComponentType) {
    var annotations = Reflect.getMetadata('annotations', ComponentType) || [];
    annotations.push(new Component(appendModeConfig(ComponentType, config)));
    Reflect.defineMetadata('annotations', annotations, ComponentType);
    return ComponentType;
  }
}

function appendModeConfig(ComponentType, config) {
  config.host = config.host || {};

  const defaultProperties = config.defaultProperties;

  config.properties = config.properties || [];

  for (let prop in defaultProperties) {
    // add the property to the component "properties"
    config.properties.push(prop);

    // set the component "hostProperties", so the instance's
    // property value will be used to set the element's attribute
    config.host['[attr.' + util.pascalCaseToDashCase(prop) + ']'] = prop;
  }

  // called by the component's onInit when an instance has been created and properties bound
  ComponentType.applyConfig = (instance) => {
    for (let prop in defaultProperties) {
      // Priority:
      // ---------
      // 1) Value set from within constructor
      // 2) Value set from the host element's attribute
      // 3) Value set by the users global config
      // 4) Value set by the default mode/platform config
      // 5) Value set from the component's default

      if (instance[prop]) {
        // this property has already been set on the instance
        // could be from the user setting the element's attribute
        // or from the user setting it within the constructor
        continue;
      }

      // get the property values from a global user/platform config
      let configVal = IonicConfig.global.setting(prop);
      if (configVal) {
        instance[prop] = configVal;
        continue;
      }

      // wasn't set yet, so go with property's default value
      instance[prop] = defaultProperties[prop];
    }
  };

  if (config.delegates) {
    ComponentType.getDelegate = (instance, delegateName) => {
      let cases = config.delegates[delegateName] || [];
      for (let i = 0; i < cases.length; i++) {
        let delegateCase = cases[i];
        if (util.isArray(delegateCase)) {
          let [ check, DelegateConstructor ] = delegateCase;
          if (check(instance)) {
            return new DelegateConstructor(instance);
          }
        } else {
          return new delegateCase(instance);
        }
      }
    };
  }

  let componentId = config.classId || (config.selector && config.selector.replace('ion-', ''));
  config.host['class'] = (componentId);

  // should be able to set map of classes to add soon:
  // https://github.com/angular/angular/issues/2364
  config.host['[class.' + componentId + '-ios]'] = 'cssClass';

  return config;
}

export function App(settings) {
  return function(ComponentClass) {
    // get current annotations
    let annotations = Reflect.getMetadata('annotations', ComponentClass) || [];

    // create @Component
    let selector = settings.selector || 'ion-app';
    annotations.push(new Component({
      selector
    }));

    // create @View
    let templateUrl = settings.templateUrl;
    let template = settings.template;

    // if no template was provided, default so it has a root ion-nav
    if (!templateUrl && !template) {
      template = '<ion-nav></ion-nav>';
    }
    annotations.push(new IonicView({
      templateUrl,
      template
    }));

    // redefine with added annotations
    Reflect.defineMetadata('annotations', annotations, ComponentClass);


    // create IonicConfig
    let config = null;
    if (typeof settings.config === IonicConfig) {
      config = settings.config

    } else if (settings.config) {
      config = new IonicConfig(settings.config);
    }

    // create IonicRouter
    let router = null;
    if (typeof settings.router === IonicRouter) {
      router = settings.router

    } else if (settings.router) {
      router = new IonicRouter(settings.router);
    }

    setTimeout(() => {
      ionicBootstrap(ComponentClass, config, router);
    }, 500);

    return ComponentClass;
  }
}
