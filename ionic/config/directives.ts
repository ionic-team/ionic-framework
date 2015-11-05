import {CORE_DIRECTIVES, FORM_DIRECTIVES, forwardRef} from 'angular2/angular2'

import {OverlayAnchor} from '../components/overlay/overlay';
import {Menu} from '../components/menu/menu';
import {MenuToggle} from '../components/menu/menu-toggle';
import {MenuClose} from '../components/menu/menu-close';
import {Button} from '../components/button/button';
import {Blur} from '../components/blur/blur';
import {Content} from '../components/content/content';
import {Scroll} from '../components/scroll/scroll';
import {Refresher} from '../components/scroll/pull-to-refresh';
import {Slides, Slide, SlideLazy} from '../components/slides/slides';
import {Tabs} from '../components/tabs/tabs';
import {Tab} from '../components/tabs/tab';
import {List, ListHeader} from '../components/list/list';
import {Item} from '../components/item/item';
import {ItemGroup, ItemGroupTitle} from '../components/item/item-group';
import {ItemSliding} from '../components/item/item-sliding';
import {Toolbar, ToolbarTitle, ToolbarItem} from '../components/toolbar/toolbar';
import {Icon} from '../components/icon/icon';
import {Checkbox} from '../components/checkbox/checkbox';
import {Switch} from '../components/switch/switch';
import {TextInput, TextInputElement} from '../components/text-input/text-input';
import {Label} from '../components/text-input/label';
import {Segment, SegmentButton} from '../components/segment/segment';
import {RadioGroup, RadioButton} from '../components/radio/radio';
import {SearchBar} from '../components/searchbar/searchbar';
import {Nav} from '../components/nav/nav';
import {NavPush, NavPop} from '../components/nav/nav-push';
import {NavRouter} from '../components/nav/nav-router';
import {NavbarTemplate, Navbar} from '../components/navbar/navbar';
import {IdRef} from '../components/app/id';
import {ShowWhen, HideWhen} from '../components/show-hide-when/show-hide-when';

/**
 * The core Ionic directives as well as Angular's CORE_DIRECTIVES and
 * FORM_DIRECTIVES.  Automatically available in every [@Page](../Page/) template.
 */
export const IONIC_DIRECTIVES = [
  // Angular
  CORE_DIRECTIVES,
  FORM_DIRECTIVES,

  // Content
  OverlayAnchor,
  Menu,
  MenuToggle,
  MenuClose,

  Button,
  Blur,
  Content,
  Scroll,
  Refresher,

  // Lists
  List,
  ListHeader,
  Item,
  ItemGroup,
  ItemGroupTitle,
  ItemSliding,

  // Slides
  Slides,
  Slide,
  SlideLazy,

  // Tabs
  Tabs,
  Tab,

  // Toolbar
  Toolbar,
  ToolbarTitle,
  ToolbarItem,

  // Media
  Icon,

  // Forms
  SearchBar,
  Segment,
  SegmentButton,
  Checkbox,
  RadioGroup,
  RadioButton,
  Switch,
  TextInput,
  TextInputElement,
  Label,

  // Nav
  Nav,
  NavbarTemplate,
  Navbar,

  NavPush,
  NavPop,
  NavRouter,
  IdRef,

  ShowWhen,
  HideWhen
];
