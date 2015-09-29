import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgStyle, Component, Directive, View, forwardRef} from 'angular2/angular2'

import * as util from 'ionic/util';
import {IonicConfig} from './config';
import {ionicBootstrap} from '../components/app/app';
import {
  Menu, MenuToggle, MenuClose,
  Button, Content, Scroll, Refresher,
  Slides, Slide, SlideLazy,
  Tabs, Tab,
  Card, List, ListHeader, Item, ItemGroup, ItemGroupTitle,
  Toolbar, ToolbarTitle, ToolbarItem,
  Icon,
  Checkbox, Switch,
  TextInput, TextInputElement, Label,
  Segment, SegmentButton, SegmentControlValueAccessor,
  RadioGroup, RadioButton, SearchBar,
  Nav, NavbarTemplate, Navbar,
  NavPush, NavPop, NavRouter,
  IdRef,
  ShowWhen, HideWhen
} from '../ionic';

/**
 * The core Ionic directives.  Automatically available in every IonicView
 * template.
 */
export const IONIC_DIRECTIVES = [
// TODO: Why is forwardRef() required when they're already imported above????
  // Angular
  CORE_DIRECTIVES,
  FORM_DIRECTIVES,

  NgStyle,

  // Content
  forwardRef(() => Menu),
  forwardRef(() => MenuToggle),
  forwardRef(() => MenuClose),

  forwardRef(() => Button),
  forwardRef(() => Content),
  forwardRef(() => Scroll),
  forwardRef(() => Refresher),

  // Lists
  forwardRef(() => Card),
  forwardRef(() => List),
  forwardRef(() => ListHeader),
  forwardRef(() => Item),
  forwardRef(() => ItemGroup),
  forwardRef(() => ItemGroupTitle),

  // Slides
  forwardRef(() => Slides),
  forwardRef(() => Slide),
  forwardRef(() => SlideLazy),

  // Tabs
  forwardRef(() => Tabs),
  forwardRef(() => Tab),

  // Toolbar
  forwardRef(() => Toolbar),
  forwardRef(() => ToolbarTitle),
  forwardRef(() => ToolbarItem),

  // Media
  forwardRef(() => Icon),

  // Forms
  forwardRef(() => Segment),
  forwardRef(() => SegmentButton),
  forwardRef(() => SegmentControlValueAccessor),
  forwardRef(() => Checkbox),
  forwardRef(() => RadioGroup),
  forwardRef(() => RadioButton),
  forwardRef(() => Switch),
  forwardRef(() => TextInput),
  forwardRef(() => TextInputElement),
  forwardRef(() => Label),

  // Nav
  forwardRef(() => Nav),
  forwardRef(() => NavbarTemplate),
  forwardRef(() => Navbar),

  forwardRef(() => NavPush),
  forwardRef(() => NavPop),
  forwardRef(() => NavRouter),
  forwardRef(() => IdRef),

  forwardRef(() => ShowWhen),
  forwardRef(() => HideWhen)
];

class IonicViewImpl extends View {
  constructor(args = {}) {
    args.directives = (args.directives || []).concat(IONIC_DIRECTIVES);
    super(args);
  }
}

/**
 * TODO
 */
export function IonicView(args) {
  return function(cls) {
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new IonicViewImpl(args));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}

/**
 * TODO
 */
export function IonicDirective(config) {
  return function(cls) {
    var annotations = Reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Directive(appendConfig(cls, config)));
    Reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}

/**
 * TODO
 */
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
  config.host['class'] = ((config.host['class'] || '') + ' ' + componentId).trim();

  return config;
}

/**
 * TODO
 */
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

    ionicBootstrap(cls, args.views, args.config);

    return cls;
  }
}
