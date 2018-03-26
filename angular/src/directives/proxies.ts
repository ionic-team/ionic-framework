/* angular directive proxies */
import { Directive as NgDirective, ElementRef, EventEmitter as NgEventEmitter, Input as NgInput, Output as NgOutput } from '@angular/core';

export function outputs(instance: any, events: string[]) {
  events.forEach(eventName => {
    instance[eventName] = new NgEventEmitter();
  });
}

export function inputs(instance: any, el: ElementRef, props: string[]) {
  props.forEach(propName => {
    Object.defineProperty(instance, propName, {
      get: () => el.nativeElement[propName], set: (val: any) => el.nativeElement[propName] = val
    });
  });
}

const accept = 'accept', activated = 'activated', allowEmptySelection = 'allowEmptySelection', animated = 'animated', autoBlockAll = 'autoBlockAll', autoHide = 'autoHide', autocapitalize = 'autocapitalize', autocomplete = 'autocomplete', autocorrect = 'autocorrect', autofocus = 'autofocus', base = 'base', buttonType = 'buttonType', cancelButtonText = 'cancelButtonText', cancelText = 'cancelText', checked = 'checked', clearInput = 'clearInput', clearOnEdit = 'clearOnEdit', closeDuration = 'closeDuration', color = 'color', cols = 'cols', component = 'component', contentId = 'contentId', data = 'data', debounce = 'debounce', defaultHref = 'defaultHref', detail = 'detail', direction = 'direction', disableScroll = 'disableScroll', disabled = 'disabled', displayFormat = 'displayFormat', doneText = 'doneText', dualKnobs = 'dualKnobs', duration = 'duration', edge = 'edge', expandable = 'expandable', fill = 'fill', fixed = 'fixed', floating = 'floating', forceOverscroll = 'forceOverscroll', from = 'from', fullscreen = 'fullscreen', gestureName = 'gestureName', gesturePriority = 'gesturePriority', highlight = 'highlight', href = 'href', icon = 'icon', inputmode = 'inputmode', interfaceOptions = 'interfaceOptions', ionBackdropTap = 'ionBackdropTap', ionBlur = 'ionBlur', ionCancel = 'ionCancel', ionChange = 'ionChange', ionClear = 'ionClear', ionClick = 'ionClick', ionClose = 'ionClose', ionDecrease = 'ionDecrease', ionDrag = 'ionDrag', ionFocus = 'ionFocus', ionGestureCaptured = 'ionGestureCaptured', ionGestureEnd = 'ionGestureEnd', ionGestureMove = 'ionGestureMove', ionGestureNotCaptured = 'ionGestureNotCaptured', ionGestureStart = 'ionGestureStart', ionIncrease = 'ionIncrease', ionInfinite = 'ionInfinite', ionInput = 'ionInput', ionInputDidLoad = 'ionInputDidLoad', ionInputDidUnload = 'ionInputDidUnload', ionMenuChange = 'ionMenuChange', ionOpen = 'ionOpen', ionPress = 'ionPress', ionPull = 'ionPull', ionRadioDidLoad = 'ionRadioDidLoad', ionRadioDidUnload = 'ionRadioDidUnload', ionRefresh = 'ionRefresh', ionRouteChanged = 'ionRouteChanged', ionRouteDataChanged = 'ionRouteDataChanged', ionRouteRedirectChanged = 'ionRouteRedirectChanged', ionScroll = 'ionScroll', ionScrollEnd = 'ionScrollEnd', ionScrollStart = 'ionScrollStart', ionSelect = 'ionSelect', ionSelectOptionDidLoad = 'ionSelectOptionDidLoad', ionSelectOptionDidUnload = 'ionSelectOptionDidUnload', ionSlideDidChange = 'ionSlideDidChange', ionSlideDrag = 'ionSlideDrag', ionSlideNextEnd = 'ionSlideNextEnd', ionSlideNextStart = 'ionSlideNextStart', ionSlidePrevEnd = 'ionSlidePrevEnd', ionSlidePrevStart = 'ionSlidePrevStart', ionSlideReachEnd = 'ionSlideReachEnd', ionSlideReachStart = 'ionSlideReachStart', ionSlideTouchEnd = 'ionSlideTouchEnd', ionSlideTouchStart = 'ionSlideTouchStart', ionSlideTransitionEnd = 'ionSlideTransitionEnd', ionSlideTransitionStart = 'ionSlideTransitionStart', ionSlideWillChange = 'ionSlideWillChange', ionSplitPaneVisible = 'ionSplitPaneVisible', ionStart = 'ionStart', ionStyle = 'ionStyle', ionSwipe = 'ionSwipe', ionTabButtonDidLoad = 'ionTabButtonDidLoad', ionTabButtonDidUnload = 'ionTabButtonDidUnload', ionTabbarClick = 'ionTabbarClick', knob = 'knob', labelId = 'labelId', layout = 'layout', loadingSpinner = 'loadingSpinner', loadingText = 'loadingText', max = 'max', maxAngle = 'maxAngle', maxEdgeStart = 'maxEdgeStart', maxlength = 'maxlength', mediaQuery = 'mediaQuery', menu = 'menu', menuId = 'menuId', message = 'message', min = 'min', minlength = 'minlength', mode = 'mode', multiple = 'multiple', name = 'name', okText = 'okText', options = 'options', or = 'or', orientation = 'orientation', pager = 'pager', passive = 'passive', pattern = 'pattern', paused = 'paused', persistent = 'persistent', pickerFormat = 'pickerFormat', pin = 'pin', placeholder = 'placeholder', placement = 'placement', platform = 'platform', position = 'position', pressed = 'pressed', pullMax = 'pullMax', pullMin = 'pullMin', pullingIcon = 'pullingIcon', pullingText = 'pullingText', ratio = 'ratio', readonly = 'readonly', refreshingSpinner = 'refreshingSpinner', refreshingText = 'refreshingText', required = 'required', results = 'results', round = 'round', rows = 'rows', scrollEnabled = 'scrollEnabled', scrollEvents = 'scrollEvents', scrollable = 'scrollable', selected = 'selected', selectedText = 'selectedText', show = 'show', showCancelButton = 'showCancelButton', size = 'size', snapbackDuration = 'snapbackDuration', snaps = 'snaps', spellcheck = 'spellcheck', stacked = 'stacked', step = 'step', stopPropagation = 'stopPropagation', strong = 'strong', subTitle = 'subTitle', swipeEnabled = 'swipeEnabled', tappable = 'tappable', threshold = 'threshold', title = 'title', translucent = 'translucent', type = 'type', url = 'url', useHash = 'useHash', useTapClick = 'useTapClick', val = 'val', value = 'value', visible = 'visible', width = 'width', wrap = 'wrap';

@NgDirective({ selector: 'ion-anchor' })
export class Anchor {
  @NgInput() href: string;
  constructor(el: ElementRef) {
    inputs(this, el, [href]);
  }
}

@NgDirective({ selector: 'ion-app' })
export class App {
}

@NgDirective({ selector: 'ion-avatar' })
export class Avatar {
}

@NgDirective({ selector: 'ion-back-button' })
export class BackButton {
  @NgInput() icon: string;
  @NgInput() defaultHref: string;
  constructor(el: ElementRef) {
    inputs(this, el, [icon, defaultHref]);
  }
}

@NgDirective({ selector: 'ion-backdrop' })
export class Backdrop {
  @NgInput() visible: boolean;
  @NgInput() tappable: boolean;
  @NgInput() stopPropagation: boolean;
  @NgOutput() ionBackdropTap: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [visible, tappable, stopPropagation]);
    outputs(this, [ionBackdropTap]);
  }
}

@NgDirective({ selector: 'ion-badge' })
export class Badge {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-button' })
export class Button {
  /**
   * The type of the button. Possible values are: `"submit"`, `"reset"` and `"button"`. Default value is: `"button"`
   */
  @NgInput() type: string;
  /**
   * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
   */
  @NgInput() href: string;
  /**
   * The type of button. Possible values are: `"button"`, `"bar-button"`.
   */
  @NgInput() buttonType: string;
  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * If true, activates a button with rounded corners.
   */
  @NgInput() round: boolean;
  /**
   * If true, activates a button with a heavier font weight.
   */
  @NgInput() strong: boolean;
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  @NgOutput() ionFocus: NgEventEmitter<any>;
  @NgOutput() ionBlur: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [type, href, buttonType, disabled, round, strong, color]);
    outputs(this, [ionFocus, ionBlur]);
  }
}

@NgDirective({ selector: 'ion-buttons' })
export class Buttons {
}

@NgDirective({ selector: 'ion-card' })
export class Card {
  /**
   * The color to use for the background. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-card-content' })
export class CardContent {
  /**
   * The color to use for the text. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-card-header' })
export class CardHeader {
  /**
   * The color to use for the background. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  /**
   * If true, the card header will be translucent. Defaults to `false`.
   */
  @NgInput() translucent: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [color, translucent]);
  }
}

@NgDirective({ selector: 'ion-card-subtitle' })
export class CardSubtitle {
  /**
   * The color to use for the text color. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-card-title' })
export class CardTitle {
  /**
   * The color to use for the text color. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-checkbox' })
export class Checkbox {
  /**
   * The color to use. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  /**
   * The name of the control, which is submitted with the form data.
   */
  @NgInput() name: string;
  /**
   * If true, the checkbox is selected. Defaults to `false`.
   */
  @NgInput() checked: boolean;
  /**
   * If true, the user cannot interact with the checkbox. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * the value of the checkbox.
   */
  @NgInput() value: string;
  @NgOutput() ionChange: NgEventEmitter<any>;
  @NgOutput() ionFocus: NgEventEmitter<any>;
  @NgOutput() ionBlur: NgEventEmitter<any>;
  @NgOutput() ionStyle: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [color, name, checked, disabled, value]);
    outputs(this, [ionChange, ionFocus, ionBlur, ionStyle]);
  }
}

@NgDirective({ selector: 'ion-chip' })
export class Chip {
  /**
   * The color to use. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-chip-button' })
export class ChipButton {
  /**
   * The color to use. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  /**
   * If true, the user cannot interact with the chip button. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * Set to `"clear"` for a transparent button style.
   */
  @NgInput() fill: string;
  /**
   * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
   */
  @NgInput() href: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color, disabled, fill, href]);
  }
}

@NgDirective({ selector: 'ion-col' })
export class Col {
}

@NgDirective({ selector: 'ion-content' })
export class Content {
  /**
   * If true, the content will scroll behind the headers and footers. This effect can easily be seen by setting the toolbar to transparent.
   */
  @NgInput() fullscreen: boolean;
  /**
   * If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce. If the content exceeds the bounds of ionContent, nothing will change. Note, the does not disable the system bounce on iOS. That is an OS level setting.
   */
  @NgInput() forceOverscroll: boolean;
  @NgInput() scrollEnabled: boolean;
  @NgInput() scrollEvents: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [fullscreen, forceOverscroll, scrollEnabled, scrollEvents]);
  }
}

@NgDirective({ selector: 'ion-cordova-platform' })
export class CordovaPlatform {
}

@NgDirective({ selector: 'ion-datetime' })
export class Datetime {
  /**
   * If true, the user cannot interact with the datetime. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * The minimum datetime allowed. Value must be a date string following the [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime), such as `1996-12-19`. The format does not have to be specific to an exact datetime. For example, the minimum could just be the year, such as `1994`. Defaults to the beginning of the year, 100 years ago from today.
   */
  @NgInput() min: string;
  /**
   * The maximum datetime allowed. Value must be a date string following the [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime), `1996-12-19`. The format does not have to be specific to an exact datetime. For example, the maximum could just be the year, such as `1994`. Defaults to the end of this year.
   */
  @NgInput() max: string;
  /**
   * The display format of the date and time as text that shows within the item. When the `pickerFormat` input is not used, then the `displayFormat` is used for both display the formatted text, and determining the datetime picker's columns. See the `pickerFormat` input description for more info. Defaults to `MMM D, YYYY`.
   */
  @NgInput() displayFormat: string;
  /**
   * The format of the date and time picker columns the user selects. A datetime input can have one or many datetime parts, each getting their own column which allow individual selection of that particular datetime part. For example, year and month columns are two individually selectable columns which help choose an exact date from the datetime picker. Each column follows the string parse format. Defaults to use `displayFormat`.
   */
  @NgInput() pickerFormat: string;
  /**
   * The text to display on the picker's cancel button. Default: `Cancel`.
   */
  @NgInput() cancelText: string;
  /**
   * The text to display on the picker's "Done" button. Default: `Done`.
   */
  @NgInput() doneText: string;
  /**
   * The text to display when there's no date selected yet. Using lowercase to match the input attribute
   */
  @NgInput() placeholder: string;
  /**
   * the value of the datetime.
   */
  @NgInput() value: string;
  @NgOutput() ionCancel: NgEventEmitter<any>;
  @NgOutput() ionStyle: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [disabled, min, max, displayFormat, pickerFormat, cancelText, doneText, placeholder, value]);
    outputs(this, [ionCancel, ionStyle]);
  }
}

@NgDirective({ selector: 'ion-fab' })
export class Fab {
  /**
   * If true, the fab will display on the edge of the header if `vertical` is `"top"`, and on the edge of the footer if it is `"bottom"`. Should be used with a `fixed` slot.
   */
  @NgInput() edge: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [edge]);
  }
}

@NgDirective({ selector: 'ion-fab-button' })
export class FabButton {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * If true, the fab button will be show a close icon. Defaults to `false`.
   */
  @NgInput() activated: boolean;
  /**
   * If true, the user cannot interact with the fab button. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
   */
  @NgInput() href: string;
  /**
   * If true, the fab button will be translucent. Defaults to `false`.
   */
  @NgInput() translucent: boolean;
  @NgInput() show: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [color, activated, disabled, href, translucent, show]);
  }
}

@NgDirective({ selector: 'ion-fab-list' })
export class FabList {
  /**
   * If true, the fab list will be show all fab buttons in the list. Defaults to `false`.
   */
  @NgInput() activated: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [activated]);
  }
}

@NgDirective({ selector: 'ion-footer' })
export class Footer {
  /**
   * If true, the footer will be translucent. Note: In order to scroll content behind the footer, the `fullscreen` attribute needs to be set on the content. Defaults to `false`.
   */
  @NgInput() translucent: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [translucent]);
  }
}

@NgDirective({ selector: 'ion-gesture' })
export class Gesture {
  @NgInput() disabled: boolean;
  @NgInput() autoBlockAll: boolean;
  @NgInput() disableScroll: boolean;
  @NgInput() direction: string;
  @NgInput() gestureName: string;
  @NgInput() gesturePriority: number;
  @NgInput() passive: boolean;
  @NgInput() maxAngle: number;
  @NgInput() threshold: number;
  @NgInput() type: string;
  @NgOutput() ionGestureMove: NgEventEmitter<any>;
  @NgOutput() ionGestureStart: NgEventEmitter<any>;
  @NgOutput() ionGestureEnd: NgEventEmitter<any>;
  @NgOutput() ionGestureNotCaptured: NgEventEmitter<any>;
  @NgOutput() ionPress: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [disabled, autoBlockAll, disableScroll, direction, gestureName, gesturePriority, passive, maxAngle, threshold, type]);
    outputs(this, [ionGestureMove, ionGestureStart, ionGestureEnd, ionGestureNotCaptured, ionPress]);
  }
}

@NgDirective({ selector: 'ion-gesture-controller' })
export class GestureController {
  @NgOutput() ionGestureCaptured: NgEventEmitter<any>;
  constructor() {
    outputs(this, [ionGestureCaptured]);
  }
}

@NgDirective({ selector: 'ion-grid' })
export class Grid {
}

@NgDirective({ selector: 'ion-header' })
export class Header {
  /**
   * If true, the header will be translucent. Note: In order to scroll content behind the header, the `fullscreen` attribute needs to be set on the content. Defaults to `false`.
   */
  @NgInput() translucent: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [translucent]);
  }
}

@NgDirective({ selector: 'ion-hide-when' })
export class HideWhen {
  @NgInput() orientation: string;
  @NgInput() mediaQuery: string;
  @NgInput() size: string;
  @NgInput() mode: string;
  @NgInput() platform: string;
  @NgInput() or: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [orientation, mediaQuery, size, mode, platform, or]);
  }
}

@NgDirective({ selector: 'ion-infinite-scroll' })
export class InfiniteScroll {
  /**
   * The threshold distance from the bottom of the content to call the `infinite` output event when scrolled. The threshold value can be either a percent, or in pixels. For example, use the value of `10%` for the `infinite` output event to get called when the user has scrolled 10% from the bottom of the page. Use the value `100px` when the scroll is within 100 pixels from the bottom of the page. Defaults to `15%`.
   */
  @NgInput() threshold: string;
  /**
   * If true, the infinite scroll will be hidden and scroll event listeners will be removed.  Call `enable(false)` to disable the infinite scroll from actively trying to receive new data while scrolling. This method is useful when it is known that there is no more data that can be added, and the infinite scroll is no longer needed.
   */
  @NgInput() disabled: boolean;
  /**
   * The position of the infinite scroll element. The value can be either `top` or `bottom`. Defaults to `bottom`.
   */
  @NgInput() position: string;
  @NgOutput() ionInfinite: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [threshold, disabled, position]);
    outputs(this, [ionInfinite]);
  }
}

@NgDirective({ selector: 'ion-infinite-scroll-content' })
export class InfiniteScrollContent {
  /**
   * An animated SVG spinner that shows while loading.
   */
  @NgInput() loadingSpinner: string;
  /**
   * Optional text to display while loading.
   */
  @NgInput() loadingText: string;
  constructor(el: ElementRef) {
    inputs(this, el, [loadingSpinner, loadingText]);
  }
}

@NgDirective({ selector: 'ion-input' })
export class Input {
  /**
   * If the value of the type attribute is `"file"`, then this attribute will indicate the types of files that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content type specifiers.
   */
  @NgInput() accept: string;
  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.
   */
  @NgInput() autocapitalize: string;
  /**
   * Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.
   */
  @NgInput() autocomplete: string;
  /**
   * Whether autocorrection should be enabled when the user is entering/editing the text value. Defaults to `"off"`.
   */
  @NgInput() autocorrect: string;
  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.
   */
  @NgInput() autofocus: boolean;
  /**
   * If true and the type is `checkbox` or `radio`, the control is selected by default. Defaults to `false`.
   */
  @NgInput() checked: boolean;
  /**
   * If true, a clear icon will appear in the input when there is a value. Clicking it clears the input. Defaults to `false`.
   */
  @NgInput() clearInput: boolean;
  /**
   * If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @NgInput() clearOnEdit: boolean;
  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `0`.
   */
  @NgInput() debounce: number;
  /**
   * If true, the user cannot interact with the input. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * A hint to the browser for which keyboard to display. This attribute applies when the value of the type attribute is `"text"`, `"password"`, `"email"`, or `"url"`. Possible values are: `"verbatim"`, `"latin"`, `"latin-name"`, `"latin-prose"`, `"full-width-latin"`, `"kana"`, `"katakana"`, `"numeric"`, `"tel"`, `"email"`, `"url"`.
   */
  @NgInput() inputmode: string;
  /**
   * The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @NgInput() max: string;
  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @NgInput() maxlength: number;
  /**
   * The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @NgInput() min: string;
  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @NgInput() minlength: number;
  /**
   * If true, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.
   */
  @NgInput() multiple: boolean;
  /**
   * The name of the control, which is submitted with the form data.
   */
  @NgInput() name: string;
  /**
   * A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.
   */
  @NgInput() pattern: string;
  /**
   * Instructional text that shows before the input has a value.
   */
  @NgInput() placeholder: string;
  /**
   * If true, the user cannot modify the value. Defaults to `false`.
   */
  @NgInput() readonly: boolean;
  /**
   * If true, the user must fill in a value before submitting a form.
   */
  @NgInput() required: boolean;
  /**
   * This is a nonstandard attribute supported by Safari that only applies when the type is `"search"`. Its value should be a nonnegative decimal integer.
   */
  @NgInput() results: number;
  /**
   * If true, the element will have its spelling and grammar checked. Defaults to `false`.
   */
  @NgInput() spellcheck: boolean;
  /**
   * Works with the min and max attributes to limit the increments at which a value can be set. Possible values are: `"any"` or a positive floating point number.
   */
  @NgInput() step: string;
  /**
   * The initial size of the control. This value is in pixels unless the value of the type attribute is `"text"` or `"password"`, in which case it is an integer number of characters. This attribute applies only when the `type` attribute is set to `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.
   */
  @NgInput() size: number;
  /**
   * The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
   */
  @NgInput() type: string;
  /**
   * The value of the input.
   */
  @NgInput() value: string;
  @NgOutput() ionInput: NgEventEmitter<any>;
  @NgOutput() ionStyle: NgEventEmitter<any>;
  @NgOutput() ionBlur: NgEventEmitter<any>;
  @NgOutput() ionFocus: NgEventEmitter<any>;
  @NgOutput() ionInputDidLoad: NgEventEmitter<any>;
  @NgOutput() ionInputDidUnload: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [accept, autocapitalize, autocomplete, autocorrect, autofocus, checked, clearInput, clearOnEdit, debounce, disabled, inputmode, max, maxlength, min, minlength, multiple, name, pattern, placeholder, readonly, required, results, spellcheck, step, size, type, value]);
    outputs(this, [ionInput, ionStyle, ionBlur, ionFocus, ionInputDidLoad, ionInputDidUnload]);
  }
}

@NgDirective({ selector: 'ion-item' })
export class Item {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * If true, a detail arrow will appear on the item. Defaults to `false` unless the `mode` is `ios` and an `href`, `onclick` or `tappable` property is present.
   */
  @NgInput() detail: boolean;
  /**
   * If true, the user cannot interact with the item. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
   */
  @NgInput() href: string;
  /**
   * Whether or not this item should be tappable. If true, a button tag will be rendered. Defaults to `false`.
   */
  @NgInput() tappable: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [color, detail, disabled, href, tappable]);
  }
}

@NgDirective({ selector: 'ion-item-divider' })
export class ItemDivider {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-item-group' })
export class ItemGroup {
}

@NgDirective({ selector: 'ion-item-option' })
export class ItemOption {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * If true, the user cannot interact with the item option. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * If true, the option will expand to take up the available width and cover any other options. Defaults to `false`.
   */
  @NgInput() expandable: boolean;
  /**
   * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
   */
  @NgInput() href: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color, disabled, expandable, href]);
  }
}

@NgDirective({ selector: 'ion-item-options' })
export class ItemOptions {
  @NgOutput() ionSwipe: NgEventEmitter<any>;
  constructor() {
    outputs(this, [ionSwipe]);
  }
}

@NgDirective({ selector: 'ion-item-sliding' })
export class ItemSliding {
  @NgOutput() ionDrag: NgEventEmitter<any>;
  constructor() {
    outputs(this, [ionDrag]);
  }
}

@NgDirective({ selector: 'ion-label' })
export class Label {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * If true, the label will sit alongside an input. Defaults to `false`.
   */
  @NgInput() fixed: boolean;
  /**
   * If true, the label will float above an input when the value is empty or the input is focused. Defaults to `false`.
   */
  @NgInput() floating: boolean;
  /**
   * If true, the label will be stacked above an input. Defaults to `false`.
   */
  @NgInput() stacked: boolean;
  @NgOutput() ionStyle: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [color, fixed, floating, stacked]);
    outputs(this, [ionStyle]);
  }
}

@NgDirective({ selector: 'ion-list' })
export class List {
}

@NgDirective({ selector: 'ion-list-header' })
export class ListHeader {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-menu' })
export class Menu {
  /**
   * The content's id the menu should use.
   */
  @NgInput() contentId: string;
  /**
   * An id for the menu.
   */
  @NgInput() menuId: string;
  /**
   * The display type of the menu. Default varies based on the mode, see the `menuType` in the [config](../../config/Config). Available options: `"overlay"`, `"reveal"`, `"push"`.
   */
  @NgInput() type: string;
  /**
   * If true, the menu is disabled. Default `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * If true, swiping the menu is enabled. Default `true`.
   */
  @NgInput() swipeEnabled: boolean;
  /**
   * If true, the menu will persist on child pages.
   */
  @NgInput() persistent: boolean;
  @NgInput() maxEdgeStart: number;
  @NgOutput() ionOpen: NgEventEmitter<any>;
  @NgOutput() ionClose: NgEventEmitter<any>;
  @NgOutput() ionMenuChange: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [contentId, menuId, type, disabled, swipeEnabled, persistent, maxEdgeStart]);
    outputs(this, [ionOpen, ionClose, ionMenuChange]);
  }
}

@NgDirective({ selector: 'ion-menu-button' })
export class MenuButton {
  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `left` or `right` for the menu side. This is used to find the correct menu to toggle
   */
  @NgInput() menu: string;
  /**
   * Automatically hides the content when the corresponding menu is not active
   */
  @NgInput() autoHide: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [menu, autoHide]);
  }
}

@NgDirective({ selector: 'ion-menu-toggle' })
export class MenuToggle {
  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `left` or `right` for the menu side. This is used to find the correct menu to toggle
   */
  @NgInput() menu: string;
  /**
   * Automatically hides the content when the corresponding menu is not active
   */
  @NgInput() autoHide: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [menu, autoHide]);
  }
}

@NgDirective({ selector: 'ion-nav-pop' })
export class NavPop {
}

@NgDirective({ selector: 'ion-nav-push' })
export class NavPush {
  @NgInput() component: any;
  @NgInput() url: string;
  @NgInput() data: any;
  constructor(el: ElementRef) {
    inputs(this, el, [component, url, data]);
  }
}

@NgDirective({ selector: 'ion-nav-set-root' })
export class NavSetRoot {
  @NgInput() component: any;
  @NgInput() url: string;
  @NgInput() data: any;
  constructor(el: ElementRef) {
    inputs(this, el, [component, url, data]);
  }
}

@NgDirective({ selector: 'ion-note' })
export class Note {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-radio' })
export class Radio {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * The name of the control, which is submitted with the form data.
   */
  @NgInput() name: string;
  /**
   * Indicates that the user cannot interact with the control.
   */
  @NgInput() disabled: boolean;
  /**
   * If true, the radio is selected. Defaults to `false`.
   */
  @NgInput() checked: boolean;
  /**
   * the value of the radio.
   */
  @NgInput() value: string;
  @NgOutput() ionRadioDidLoad: NgEventEmitter<any>;
  @NgOutput() ionRadioDidUnload: NgEventEmitter<any>;
  @NgOutput() ionStyle: NgEventEmitter<any>;
  @NgOutput() ionSelect: NgEventEmitter<any>;
  @NgOutput() ionFocus: NgEventEmitter<any>;
  @NgOutput() ionBlur: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [color, name, disabled, checked, value]);
    outputs(this, [ionRadioDidLoad, ionRadioDidUnload, ionStyle, ionSelect, ionFocus, ionBlur]);
  }
}

@NgDirective({ selector: 'ion-radio-group' })
export class RadioGroup {
  @NgInput() allowEmptySelection: boolean;
  /**
   * Indicates that the user cannot interact with the control.
   */
  @NgInput() disabled: boolean;
  /**
   * The name of the control, which is submitted with the form data.
   */
  @NgInput() name: string;
  /**
   * the value of the radio group.
   */
  @NgInput() value: string;
  @NgOutput() ionChange: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [allowEmptySelection, disabled, name, value]);
    outputs(this, [ionChange]);
  }
}

@NgDirective({ selector: 'ion-range' })
export class Range {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * How long, in milliseconds, to wait to trigger the `ionChange` event after each change in the range value. Default `0`.
   */
  @NgInput() debounce: number;
  @NgInput() disabled: boolean;
  /**
   * Show two knobs. Defaults to `false`.
   */
  @NgInput() dualKnobs: boolean;
  /**
   * Maximum integer value of the range. Defaults to `100`.
   */
  @NgInput() max: number;
  /**
   * Minimum integer value of the range. Defaults to `0`.
   */
  @NgInput() min: number;
  /**
   * If true, a pin with integer value is shown when the knob is pressed. Defaults to `false`.
   */
  @NgInput() pin: boolean;
  /**
   * If true, the knob snaps to tick marks evenly spaced based on the step property value. Defaults to `false`.
   */
  @NgInput() snaps: boolean;
  /**
   * Specifies the value granularity. Defaults to `1`.
   */
  @NgInput() step: number;
  /**
   * the value of the range.
   */
  @NgInput() value: any;
  @NgOutput() ionChange: NgEventEmitter<any>;
  @NgOutput() ionStyle: NgEventEmitter<any>;
  @NgOutput() ionFocus: NgEventEmitter<any>;
  @NgOutput() ionBlur: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [color, debounce, disabled, dualKnobs, max, min, pin, snaps, step, value]);
    outputs(this, [ionChange, ionStyle, ionFocus, ionBlur]);
  }
}

@NgDirective({ selector: 'ion-range-knob' })
export class RangeKnob {
  @NgInput() pressed: boolean;
  @NgInput() pin: boolean;
  @NgInput() min: number;
  @NgInput() max: number;
  @NgInput() val: number;
  @NgInput() disabled: boolean;
  @NgInput() labelId: string;
  @NgInput() knob: string;
  @NgInput() ratio: number;
  @NgOutput() ionIncrease: NgEventEmitter<any>;
  @NgOutput() ionDecrease: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [pressed, pin, min, max, val, disabled, labelId, knob, ratio]);
    outputs(this, [ionIncrease, ionDecrease]);
  }
}

@NgDirective({ selector: 'ion-refresher' })
export class Refresher {
  /**
   * The minimum distance the user must pull down until the refresher will go into the `refreshing` state. Defaults to `60`.
   */
  @NgInput() pullMin: number;
  /**
   * The maximum distance of the pull until the refresher will automatically go into the `refreshing` state. Defaults to the result of `pullMin + 60`.
   */
  @NgInput() pullMax: any;
  /**
   * Time it takes to close the refresher. Defaults to `280ms`.
   */
  @NgInput() closeDuration: string;
  /**
   * Time it takes the refresher to to snap back to the `refreshing` state. Defaults to `280ms`.
   */
  @NgInput() snapbackDuration: string;
  /**
   * If true, the refresher will be hidden. Defaults to `true`.
   */
  @NgInput() disabled: boolean;
  @NgOutput() ionRefresh: NgEventEmitter<any>;
  @NgOutput() ionPull: NgEventEmitter<any>;
  @NgOutput() ionStart: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [pullMin, pullMax, closeDuration, snapbackDuration, disabled]);
    outputs(this, [ionRefresh, ionPull, ionStart]);
  }
}

@NgDirective({ selector: 'ion-refresher-content' })
export class RefresherContent {
  /**
   * A static icon to display when you begin to pull down
   */
  @NgInput() pullingIcon: string;
  /**
   * The text you want to display when you begin to pull down
   */
  @NgInput() pullingText: string;
  /**
   * An animated SVG spinner that shows when refreshing begins
   */
  @NgInput() refreshingSpinner: string;
  /**
   * The text you want to display when performing a refresh
   */
  @NgInput() refreshingText: string;
  constructor(el: ElementRef) {
    inputs(this, el, [pullingIcon, pullingText, refreshingSpinner, refreshingText]);
  }
}

@NgDirective({ selector: 'ion-reorder' })
export class Reorder {
}

@NgDirective({ selector: 'ion-reorder-group' })
export class ReorderGroup {
  /**
   * If true, the reorder will be hidden. Defaults to `true`.
   */
  @NgInput() disabled: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [disabled]);
  }
}

@NgDirective({ selector: 'ion-ripple-effect' })
export class RippleEffect {
  @NgInput() useTapClick: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [useTapClick]);
  }
}

@NgDirective({ selector: 'ion-route' })
export class Route {
  /**
   * Relative path that needs to match in order for this route to apply.
   */
  @NgInput() url: string;
  /**
   * Name of the component to load/select in the navigation outlet (`ion-tabs`, `ion-nav`) when the route matches.  The value of this property is not always the tagname of the component to load, in ion-tabs it actually refers to the name of the `ion-tab` to select.
   */
  @NgInput() component: string;
  @NgOutput() ionRouteDataChanged: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [url, component]);
    outputs(this, [ionRouteDataChanged]);
  }
}

@NgDirective({ selector: 'ion-route-redirect' })
export class RouteRedirect {
  /**
   * A redirect route, redirects "from" a URL "to" another URL. This property is that "from" URL. It needs to be an exact match of the navigated URL in order to apply.  The path specified in this value is always an absolute path, even if the initial `/` slash is not specified.
   */
  @NgInput() from: string;
  @NgOutput() ionRouteRedirectChanged: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [from]);
    outputs(this, [ionRouteRedirectChanged]);
  }
}

@NgDirective({ selector: 'ion-router' })
export class Router {
  @NgInput() base: string;
  @NgInput() useHash: boolean;
  @NgOutput() ionRouteChanged: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [base, useHash]);
    outputs(this, [ionRouteChanged]);
  }
}

@NgDirective({ selector: 'ion-router-outlet' })
export class RouterOutlet {
  @NgInput() animated: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [animated]);
  }
}

@NgDirective({ selector: 'ion-row' })
export class Row {
}

@NgDirective({ selector: 'ion-scroll' })
export class Scroll {
  @NgInput() mode: string;
  /**
   * If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce. If the content exceeds the bounds of ionScroll, nothing will change. Note, the does not disable the system bounce on iOS. That is an OS level setting.
   */
  @NgInput() forceOverscroll: boolean;
  @NgInput() scrollEvents: boolean;
  @NgOutput() ionScrollStart: NgEventEmitter<any>;
  @NgOutput() ionScroll: NgEventEmitter<any>;
  @NgOutput() ionScrollEnd: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [mode, forceOverscroll, scrollEvents]);
    outputs(this, [ionScrollStart, ionScroll, ionScrollEnd]);
  }
}

@NgDirective({ selector: 'ion-searchbar' })
export class Searchbar {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * If true, enable searchbar animation. Default `false`.
   */
  @NgInput() animated: boolean;
  /**
   * Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @NgInput() autocomplete: string;
  /**
   * Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @NgInput() autocorrect: string;
  /**
   * Set the the cancel button text. Default: `"Cancel"`.
   */
  @NgInput() cancelButtonText: string;
  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
   */
  @NgInput() debounce: number;
  /**
   * Set the input's placeholder. Default `"Search"`.
   */
  @NgInput() placeholder: string;
  /**
   * If true, show the cancel button. Default `false`.
   */
  @NgInput() showCancelButton: boolean;
  /**
   * If true, enable spellcheck on the input. Default `false`.
   */
  @NgInput() spellcheck: boolean;
  /**
   * Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
   */
  @NgInput() type: string;
  /**
   * the value of the searchbar.
   */
  @NgInput() value: string;
  @NgOutput() ionInput: NgEventEmitter<any>;
  @NgOutput() ionCancel: NgEventEmitter<any>;
  @NgOutput() ionClear: NgEventEmitter<any>;
  @NgOutput() ionBlur: NgEventEmitter<any>;
  @NgOutput() ionFocus: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [color, animated, autocomplete, autocorrect, cancelButtonText, debounce, placeholder, showCancelButton, spellcheck, type, value]);
    outputs(this, [ionInput, ionCancel, ionClear, ionBlur, ionFocus]);
  }
}

@NgDirective({ selector: 'ion-segment' })
export class Segment {
  /**
   * The color to use for the text color. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  @NgInput() disabled: boolean;
  /**
   * the value of the segment.
   */
  @NgInput() value: string;
  @NgOutput() ionChange: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [color, disabled, value]);
    outputs(this, [ionChange]);
  }
}

@NgDirective({ selector: 'ion-segment-button' })
export class SegmentButton {
  @NgInput() activated: boolean;
  /**
   * The color to use for the text color. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @NgInput() color: string;
  /**
   * If true, the segment button is selected. Defaults to `false`.
   */
  @NgInput() checked: boolean;
  @NgInput() disabled: boolean;
  /**
   * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
   */
  @NgInput() href: string;
  /**
   * The value of the segment button.
   */
  @NgInput() value: string;
  @NgOutput() ionClick: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [activated, color, checked, disabled, href, value]);
    outputs(this, [ionClick]);
  }
}

@NgDirective({ selector: 'ion-select' })
export class Select {
  /**
   * If true, the user cannot interact with the select. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * The text to display on the cancel button. Default: `Cancel`.
   */
  @NgInput() cancelText: string;
  /**
   * The text to display on the ok button. Default: `OK`.
   */
  @NgInput() okText: string;
  /**
   * The text to display when the select is empty.
   */
  @NgInput() placeholder: string;
  /**
   * The name of the control, which is submitted with the form data.
   */
  @NgInput() name: string;
  /**
   * The text to display instead of the selected option's value.
   */
  @NgInput() selectedText: string;
  /**
   * If true, the select can accept multiple values.
   */
  @NgInput() multiple: boolean;
  /**
   * The interface the select should use: `action-sheet`, `popover` or `alert`. Default: `alert`.
   */
  @NgInput() interface: string;
  /**
   * Any additional options that the `alert`, `action-sheet` or `popover` interface can take. See the [AlertController API docs](../../alert/AlertController/#create), the [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the [PopoverController API docs](../../popover/PopoverController/#create) for the create options for each interface.
   */
  @NgInput() interfaceOptions: any;
  @NgOutput() ionChange: NgEventEmitter<any>;
  @NgOutput() ionCancel: NgEventEmitter<any>;
  @NgOutput() ionFocus: NgEventEmitter<any>;
  @NgOutput() ionBlur: NgEventEmitter<any>;
  @NgOutput() ionStyle: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [disabled, cancelText, okText, placeholder, name, selectedText, multiple, 'interface', interfaceOptions]);
    outputs(this, [ionChange, ionCancel, ionFocus, ionBlur, ionStyle]);
  }
}

@NgDirective({ selector: 'ion-select-option' })
export class SelectOption {
  /**
   * If true, the user cannot interact with the select option. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * If true, the element is selected.
   */
  @NgInput() selected: boolean;
  @NgOutput() ionSelectOptionDidLoad: NgEventEmitter<any>;
  @NgOutput() ionSelectOptionDidUnload: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [disabled, selected]);
    outputs(this, [ionSelectOptionDidLoad, ionSelectOptionDidUnload]);
  }
}

@NgDirective({ selector: 'ion-select-popover' })
export class SelectPopover {
  @NgInput() title: string;
  @NgInput() subTitle: string;
  @NgInput() message: string;
  constructor(el: ElementRef) {
    inputs(this, el, [title, subTitle, message]);
  }
}

@NgDirective({ selector: 'ion-show-when' })
export class ShowWhen {
  @NgInput() orientation: string;
  @NgInput() mediaQuery: string;
  @NgInput() size: string;
  @NgInput() mode: string;
  @NgInput() platform: string;
  @NgInput() or: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [orientation, mediaQuery, size, mode, platform, or]);
  }
}

@NgDirective({ selector: 'ion-skeleton-text' })
export class SkeletonText {
  @NgInput() width: string;
  constructor(el: ElementRef) {
    inputs(this, el, [width]);
  }
}

@NgDirective({ selector: 'ion-slide' })
export class Slide {
}

@NgDirective({ selector: 'ion-slides' })
export class Slides {
  /**
   * Options to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options
   */
  @NgInput() options: any;
  /**
   * Show or hide the pager
   */
  @NgInput() pager: boolean;
  @NgOutput() ionSlideWillChange: NgEventEmitter<any>;
  @NgOutput() ionSlideDidChange: NgEventEmitter<any>;
  @NgOutput() ionSlideNextStart: NgEventEmitter<any>;
  @NgOutput() ionSlidePrevStart: NgEventEmitter<any>;
  @NgOutput() ionSlideNextEnd: NgEventEmitter<any>;
  @NgOutput() ionSlidePrevEnd: NgEventEmitter<any>;
  @NgOutput() ionSlideTransitionStart: NgEventEmitter<any>;
  @NgOutput() ionSlideTransitionEnd: NgEventEmitter<any>;
  @NgOutput() ionSlideDrag: NgEventEmitter<any>;
  @NgOutput() ionSlideReachStart: NgEventEmitter<any>;
  @NgOutput() ionSlideReachEnd: NgEventEmitter<any>;
  @NgOutput() ionSlideTouchStart: NgEventEmitter<any>;
  @NgOutput() ionSlideTouchEnd: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [options, pager]);
    outputs(this, [ionSlideWillChange, ionSlideDidChange, ionSlideNextStart, ionSlidePrevStart, ionSlideNextEnd, ionSlidePrevEnd, ionSlideTransitionStart, ionSlideTransitionEnd, ionSlideDrag, ionSlideReachStart, ionSlideReachEnd, ionSlideTouchStart, ionSlideTouchEnd]);
  }
}

@NgDirective({ selector: 'ion-spinner' })
export class Spinner {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * Duration of the spinner animation in milliseconds. The default varies based on the spinner.
   */
  @NgInput() duration: number;
  /**
   * The name of the SVG spinner to use. If a name is not provided, the platform's default spinner will be used. Possible values are: `"lines"`, `"lines-small"`, `"dots"`, `"bubbles"`, `"circles"`, `"crescent"`.
   */
  @NgInput() name: string;
  /**
   * If true, the spinner's animation will be paused. Defaults to `false`.
   */
  @NgInput() paused: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [color, duration, name, paused]);
  }
}

@NgDirective({ selector: 'ion-split-pane' })
export class SplitPane {
  /**
   * If true, the split pane will be hidden. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  @NgOutput() ionChange: NgEventEmitter<any>;
  @NgOutput() ionSplitPaneVisible: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [disabled]);
    outputs(this, [ionChange, ionSplitPaneVisible]);
  }
}

@NgDirective({ selector: 'ion-status-tap' })
export class StatusTap {
  @NgInput() duration: number;
  constructor(el: ElementRef) {
    inputs(this, el, [duration]);
  }
}

@NgDirective({ selector: 'ion-tab-button' })
export class TabButton {
  @NgInput() selected: boolean;
  @NgOutput() ionTabbarClick: NgEventEmitter<any>;
  @NgOutput() ionTabButtonDidLoad: NgEventEmitter<any>;
  @NgOutput() ionTabButtonDidUnload: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [selected]);
    outputs(this, [ionTabbarClick, ionTabButtonDidLoad, ionTabButtonDidUnload]);
  }
}

@NgDirective({ selector: 'ion-tabbar' })
export class Tabbar {
  @NgInput() placement: string;
  @NgInput() scrollable: boolean;
  @NgInput() layout: string;
  @NgInput() highlight: boolean;
  /**
   * If true, the tabbar will be translucent. Defaults to `false`.
   */
  @NgInput() translucent: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [placement, scrollable, layout, highlight, translucent]);
  }
}

@NgDirective({ selector: 'ion-tap-click' })
export class TapClick {
}

@NgDirective({ selector: 'ion-text' })
export class Text {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  constructor(el: ElementRef) {
    inputs(this, el, [color]);
  }
}

@NgDirective({ selector: 'ion-textarea' })
export class Textarea {
  /**
   * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.
   */
  @NgInput() autocapitalize: string;
  /**
   * Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.
   */
  @NgInput() autocomplete: string;
  /**
   * This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.
   */
  @NgInput() autofocus: boolean;
  /**
   * If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @NgInput() clearOnEdit: boolean;
  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `0`.
   */
  @NgInput() debounce: number;
  /**
   * If true, the user cannot interact with the textarea. Defaults to `false`.
   */
  @NgInput() disabled: boolean;
  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.
   */
  @NgInput() maxlength: number;
  /**
   * If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.
   */
  @NgInput() minlength: number;
  /**
   * The name of the control, which is submitted with the form data.
   */
  @NgInput() name: string;
  /**
   * Instructional text that shows before the input has a value.
   */
  @NgInput() placeholder: string;
  /**
   * If true, the user cannot modify the value. Defaults to `false`.
   */
  @NgInput() readonly: boolean;
  /**
   * If true, the user must fill in a value before submitting a form.
   */
  @NgInput() required: boolean;
  /**
   * If true, the element will have its spelling and grammar checked. Defaults to `false`.
   */
  @NgInput() spellcheck: boolean;
  /**
   * The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.
   */
  @NgInput() cols: number;
  /**
   * The number of visible text lines for the control.
   */
  @NgInput() rows: number;
  /**
   * Indicates how the control wraps text. Possible values are: `"hard"`, `"soft"`, `"off"`.
   */
  @NgInput() wrap: string;
  /**
   * The value of the textarea.
   */
  @NgInput() value: string;
  @NgOutput() ionInput: NgEventEmitter<any>;
  @NgOutput() ionStyle: NgEventEmitter<any>;
  @NgOutput() ionBlur: NgEventEmitter<any>;
  @NgOutput() ionFocus: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [autocapitalize, autocomplete, autofocus, clearOnEdit, debounce, disabled, maxlength, minlength, name, placeholder, readonly, required, spellcheck, cols, rows, wrap, value]);
    outputs(this, [ionInput, ionStyle, ionBlur, ionFocus]);
  }
}

@NgDirective({ selector: 'ion-thumbnail' })
export class Thumbnail {
}

@NgDirective({ selector: 'ion-toggle' })
export class Toggle {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * The name of the control, which is submitted with the form data.
   */
  @NgInput() name: string;
  /**
   * If true, the toggle is selected. Defaults to `false`.
   */
  @NgInput() checked: boolean;
  /**
   * Indicates that the user cannot interact with the control.
   */
  @NgInput() disabled: boolean;
  /**
   * the value of the toggle.
   */
  @NgInput() value: string;
  @NgOutput() ionChange: NgEventEmitter<any>;
  @NgOutput() ionFocus: NgEventEmitter<any>;
  @NgOutput() ionBlur: NgEventEmitter<any>;
  @NgOutput() ionStyle: NgEventEmitter<any>;
  constructor(el: ElementRef) {
    inputs(this, el, [color, name, checked, disabled, value]);
    outputs(this, [ionChange, ionFocus, ionBlur, ionStyle]);
  }
}

@NgDirective({ selector: 'ion-toolbar' })
export class Toolbar {
  /**
   * The color to use from your Sass `$colors` map. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @NgInput() color: string;
  /**
   * If true, the toolbar will be translucent. Note: In order to scroll content behind the toolbar, the `fullscreen` attribute needs to be set on the content. Defaults to `false`.
   */
  @NgInput() translucent: boolean;
  constructor(el: ElementRef) {
    inputs(this, el, [color, translucent]);
  }
}

@NgDirective({ selector: 'ion-title' })
export class ToolbarTitle {
}
