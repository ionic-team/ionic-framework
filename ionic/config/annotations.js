import {coreDirectives, Component, Directive} from 'angular2/angular2';
import {View} from 'angular2/src/core/annotations_impl/view';

import * as util from 'ionic/util';
import {IonicConfig} from './config';
import {
  Aside, Content, Refresher,
  Slides, Slide, SlidePager,
  Tabs, Tab,
  List, Item,
  Icon,
  Checkbox, Switch, Label, Input,
  Segment, SegmentButton, SegmentControlValueAccessor,
  RadioGroup, RadioButton, SearchBar,
  Nav, NavbarTemplate, Navbar, NavPush, NavPop
} from 'ionic/ionic';


export class IonicView extends View {
  constructor(config) {
    let directives = [

      // Angular
      coreDirectives,

      // Content
      Aside, Content, Refresher,
      List, Item,
      Slides, Slide, SlidePager,
      Tabs, Tab,

      // Media
      Icon,

      // Form elements
      Segment, SegmentButton, SegmentControlValueAccessor,
      //Checkbox, Switch, Label, Input
      //RadioGroup, RadioButton, SearchBar,

      // Nav
      Nav, NavbarTemplate, Navbar, NavPush, NavPop
    ];

    config.directives = (config.directives || []).concat(directives);
    super(config);
  }
}


export class IonicDirective extends Directive {
  constructor(ComponentType) {
    super( appendModeConfig(ComponentType) );
  }
}

export class IonicComponent extends Component {
  constructor(ComponentType) {
    super( appendModeConfig(ComponentType) );
  }
}

function appendModeConfig(ComponentType) {
  if (!ComponentType) {
    return {};
  }
  if (typeof ComponentType === 'object') {
    return ComponentType;
  }

  let config = ComponentType.config;
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

  if (!platformMode) {
    platformMode = IonicConfig.global.setting('mode');
  }

  let id = config.classId || (config.selector && config.selector.replace('ion-', ''));
  config.host['class'] = (id + ' ' + id + '-' + platformMode);

  return config;
}

let platformMode = null;
