import {CORE_DIRECTIVES, FORM_DIRECTIVES, forwardRef} from 'angular2/angular2'

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
 * The core Ionic directives.  Automatically available in every
 * IonicView template.
 */
export const IONIC_DIRECTIVES = [
  // Angular
  CORE_DIRECTIVES,
  FORM_DIRECTIVES,

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
