import {coreDirectives, Component, Directive, View, forwardRef} from 'angular2/angular2'

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
  Nav, NavbarTemplate, Navbar, NavPush, NavPop,
  Register
} from '../ionic';


// TODO: Why is forwardRef() required when they're already imported above????
export const IonicDirectives = [
  // Angular
  coreDirectives,

  // Content
  forwardRef(() => Aside),
  forwardRef(() => Content),
  forwardRef(() => Scroll),
  forwardRef(() => Refresher),

  // Lists
  forwardRef(() => List),
  forwardRef(() => Item),
  forwardRef(() => ItemGroup),
  forwardRef(() => ItemGroupTitle),

  // Slides
  forwardRef(() => Slides),
  forwardRef(() => Slide),
  forwardRef(() => SlidePager),

  // Tabs
  forwardRef(() => Tabs),
  forwardRef(() => Tab),
  forwardRef(() => Toolbar),

  // Media
  forwardRef(() => Icon),

  // Form elements
  forwardRef(() => Segment),
  forwardRef(() => SegmentButton),
  forwardRef(() => SegmentControlValueAccessor),
  //Checkbox, Switch, Label, Input
  //RadioGroup, RadioButton, SearchBar,

  // Nav
  forwardRef(() => Nav),
  forwardRef(() => NavbarTemplate),
  forwardRef(() => Navbar),
  forwardRef(() => NavPush),
  forwardRef(() => NavPop),
  forwardRef(() => Register)
];

class IonicViewImpl extends View {
  constructor(args = {}) {
    args.directives = (args.directives || []).concat(IonicDirectives);
    super(args);
  }
}

export function IonicView(args) {
  return function(cls) {
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new IonicViewImpl(args));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}

export function IonicDirective(config) {
  return function(cls) {
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Directive(appendConfig(cls, config)));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}

export function IonicComponent(config) {
  return function(cls) {
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Component(appendConfig(cls, config)));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}

function appendConfig(cls, config) {
  config.host = config.host || {};

  cls.defaultProperties = config.defaultProperties || {};

  config.properties = config.properties || [];

  for (let prop in cls.defaultProperties) {
    // add the property to the component "properties"
    config.properties.push(prop);

    // set the component "hostProperties", so the instance's
    // property value will be used to set the element's attribute
    config.host['[attr.' + util.pascalCaseToDashCase(prop) + ']'] = prop;
  }

  cls.delegates = config.delegates;

  let componentId = config.classId || (config.selector && config.selector.replace('ion-', ''));
  config.host['class'] = componentId;

  // the mode will get figured out when the component is constructed
  config.host['[attr.mode]'] = 'clsMode';

  return config;
}

export function App(args={}) {
  return function(cls) {
    // get current annotations
    let annotations = Reflect.getMetadata('annotations', cls) || [];

    // create @Component
    args.selector = args.selector || 'ion-app';
    annotations.push(new Component(args));

    // create @View
    // if no template was provided, default so it has a root ion-nav
    if (!args.templateUrl && !args.template) {
      args.template = '<ion-nav></ion-nav>';
    }

    annotations.push(new IonicViewImpl(args));

    // redefine with added annotations
    Reflect.defineMetadata('annotations', annotations, cls);

    ionicBootstrap(cls, args.config, args.router);

    return cls;
  }
}
