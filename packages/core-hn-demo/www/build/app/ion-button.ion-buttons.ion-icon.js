/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'ion-button.ion-buttons.ion-icon',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
var Button = (function () {
    function Button() {
        this.itemButton = false;
        /**
         * @Prop {string} The type of button.
         * Possible values are: `"button"`, `"bar-button"`.
         */
        this.buttonType = 'button';
        /**
         * @Prop {boolean} If true, activates the large button size.
         * Type: size
         */
        this.large = false;
        /**
         * @Prop {boolean} If true, activates the small button size.
         * Type: size
         */
        this.small = false;
        /**
         * @Prop {boolean} If true, activates the default button size. Normally the default, useful for buttons in an item.
         * Type: size
         */
        this.default = false;
        /**
         * @Prop {boolean} If true, sets the button into a disabled state.
         */
        this.disabled = false;
        /**
         * @Prop {boolean} If true, activates a transparent button style with a border.
         * Type: style
         */
        this.outline = false;
        /**
         * @Prop {boolean} If true, activates a transparent button style without a border.
         * Type: style
         */
        this.clear = false;
        /**
         * @Prop {boolean} If true, activates a solid button style. Normally the default, useful for buttons in a toolbar.
         * Type: style
         */
        this.solid = false;
        /**
         * @Prop {boolean} If true, activates a button with rounded corners.
         * Type: shape
         */
        this.round = false;
        /**
         * @Prop {boolean} If true, activates a button style that fills the available width.
         * Type: display
         */
        this.block = false;
        /**
         * @Prop {boolean} If true, activates a button style that fills the available width without
         * a left and right border.
         * Type: display
         */
        this.full = false;
        /**
         * @Prop {boolean} If true, activates a button with a heavier font weight.
         * Type: decorator
         */
        this.strong = false;
    }
    /**
     * @hidden
     * Get the classes based on the button type
     * e.g. alert-button, action-sheet-button
     */
    Button.prototype.getButtonClassList = function (buttonType, mode) {
        if (!buttonType) {
            return [];
        }
        return [
            buttonType,
            buttonType + "-" + mode
        ];
    };
    /**
     * @hidden
     * Get the classes based on the type
     * e.g. block, full, round, large
     */
    Button.prototype.getClassList = function (buttonType, type, mode) {
        if (!type) {
            return [];
        }
        type = type.toLocaleLowerCase();
        return [
            buttonType + "-" + type,
            buttonType + "-" + type + "-" + mode
        ];
    };
    /**
     * @hidden
     * Get the classes for the color
     */
    Button.prototype.getColorClassList = function (color, buttonType, style, mode) {
        style = (buttonType !== 'bar-button' && style === 'solid') ? 'default' : style;
        var className = buttonType +
            ((style && style !== 'default') ?
                '-' + style.toLowerCase() :
                '');
        // special case for a default bar button
        // if the bar button is default it should get the style
        // but if a color is passed the style shouldn't be added
        if (buttonType === 'bar-button' && style === 'default') {
            className = buttonType;
            if (!color) {
                className += '-' + style.toLowerCase();
            }
        }
        return [className + "-" + mode].concat(style !== 'default' ? "" + className : [], color ? className + "-" + mode + "-" + color : []);
    };
    /**
     * @hidden
     * Get the classes for the style
     * e.g. outline, clear, solid
     */
    Button.prototype.getStyleClassList = function (buttonType) {
        var classList = [].concat(this.outline ? this.getColorClassList(this.color, buttonType, 'outline', this.mode) : [], this.clear ? this.getColorClassList(this.color, buttonType, 'clear', this.mode) : [], this.solid ? this.getColorClassList(this.color, buttonType, 'solid', this.mode) : []);
        if (classList.length === 0) {
            classList = this.getColorClassList(this.color, buttonType, 'default', this.mode);
        }
        return classList;
    };
    /**
     * @hidden
     * Get the item classes for the button
     */
    Button.prototype.getItemClassList = function (size) {
        var classList = [].concat(this.itemButton && !size ? 'item-button' : []);
        return classList;
    };
    /**
     * @hidden
     * Get the element classes to add to the child element
     */
    Button.prototype.getElementClassList = function () {
        var classList = [].concat(this.$el.className.length ? this.$el.className.split(' ') : []);
        return classList;
    };
    Button.prototype.render = function () {
        var size = (this.large ? 'large' : null) ||
            (this.small ? 'small' : null) ||
            (this.default ? 'default' : null);
        var shape = (this.round ? 'round' : null);
        var display = (this.block ? 'block' : null) ||
            (this.full ? 'full' : null);
        var decorator = (this.strong ? 'strong' : null);
        var buttonClasses = []
            .concat(this.getButtonClassList(this.buttonType, this.mode), this.getClassList(this.buttonType, shape, this.mode), this.getClassList(this.buttonType, display, this.mode), this.getClassList(this.buttonType, size, this.mode), this.getClassList(this.buttonType, decorator, this.mode), this.getStyleClassList(this.buttonType), this.getItemClassList(size), this.getElementClassList())
            .reduce(function (prevValue, cssClass) {
            prevValue[cssClass] = true;
            return prevValue;
        }, {});
        var TagType = this.href ? 'a' : 'button';
        return (h(TagType, { "c": buttonClasses, "a": { "disabled": this.disabled } },
            h("span", { "c": { "button-inner": true } },
                h(0, { "a": { "name": 'icon-only' } }),
                h(0, { "a": { "name": 'start' } }),
                h(0, 0),
                h(0, { "a": { "name": 'end' } })),
            h("div", { "c": { "button-effect": true } })));
    };
    return Button;
}());

var Buttons = (function () {
    function Buttons() {
    }
    Buttons.prototype["componentDidLoad"] = function () {
        var buttons = this.$el.querySelectorAll('ion-button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('button-type', 'bar-button');
        }
    };
    Buttons.prototype.render = function () {
        return h(0, 0);
    };
    return Buttons;
}());

var Icon = (function () {
    function Icon() {
        /**
         * @input {string} Specifies the label to use for accessibility. Defaults to the icon name.
         */
        this.label = '';
        /**
         * @input {string} Specifies the mode to use for the icon.
         */
        this.iconMode = '';
        /**
         * @input {string} Specifies which icon to use. The appropriate icon will be used based on the mode.
         * For more information, see [Ionicons](/docs/ionicons/).
         */
        this.name = '';
        /**
         * @input {string} Specifies which icon to use on `ios` mode.
         */
        this.ios = '';
        /**
         * @input {string} Specifies which icon to use on `md` mode.
         */
        this.md = '';
        /**
         * @input {boolean} If true, the icon is styled with an "active" appearance.
         * An active icon is filled in, and an inactive icon is the outline of the icon.
         * The `isActive` property is largely used by the tabbar. Only affects `ios` icons.
         */
        this.isActive = null;
        /**
         * @input {boolean} If true, the icon is hidden.
         */
        this.hidden = false;
    }
    Icon.prototype.getElementClass = function () {
        var iconName;
        // If no name was passed set iconName to null
        if (!this.name) {
            iconName = null;
        }
        else if (!(/^md-|^ios-|^logo-/.test(this.name))) {
            // this does not have one of the defaults
            // so lets auto add in the mode prefix for them
            iconName = this.iconMode + '-' + this.name;
        }
        else if (this.name) {
            iconName = this.name;
        }
        // If an icon was passed in using the ios or md attributes
        // set the iconName to whatever was passed in
        if (this.ios && this.iconMode === 'ios') {
            iconName = this.ios;
        }
        else if (this.md && this.iconMode === 'md') {
            iconName = this.md;
        }
        if ((iconName === null) || (this.hidden === true)) {
            console.warn('Icon is hidden.');
            return 'hide';
        }
        var iconMode = iconName.split('-', 2)[0];
        if (iconMode === 'ios' &&
            this.isActive === false &&
            iconName.indexOf('logo-') < 0 &&
            iconName.indexOf('-outline') < 0) {
            iconName += '-outline';
        }
        var label = iconName
            .replace('ios-', '')
            .replace('md-', '')
            .replace('-', ' ');
        this.label = label;
        return "ion-" + iconName;
    };
    Icon.prototype.hostData = function () {
        // TODO set the right iconMode based on the config
        var iconMode = this.mode === 'md' ? 'md' : 'ios';
        this.iconMode = iconMode || Ionic.config.get('iconMode');
        var iconClasses = []
            .concat(this.getElementClass())
            .reduce(function (prevValue, cssClass) {
            prevValue[cssClass] = true;
            return prevValue;
        }, {});
        return {
            class: iconClasses,
            attrs: {
                'role': 'img'
            }
        };
    };
    Icon.prototype.render = function () {
        return h(0, 0);
    };
    return Icon;
}());

exports['ION-BUTTON'] = Button;
exports['ION-BUTTONS'] = Buttons;
exports['ION-ICON'] = Icon;
},


/***************** ion-button *****************/
[
/** ion-button: [0] tag **/
'ION-BUTTON',

/** ion-button: [1] host **/
{}

],

/***************** ion-buttons *****************/
[
/** ion-buttons: [0] tag **/
'ION-BUTTONS',

/** ion-buttons: [1] host **/
{"theme":"bar-buttons"}

],

/***************** ion-icon *****************/
[
/** ion-icon: [0] tag **/
'ION-ICON',

/** ion-icon: [1] host **/
{"theme":"icon"},

/** ion-icon: [2] listeners **/
0 /* no listeners */,

/** ion-icon: [3] states **/
['iconMode', 'label']

]
)