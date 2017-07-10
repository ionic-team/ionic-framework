/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'ion-item.ion-item-divider.ion-label.ion-list.ion-l',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
function createThemedClasses(mode, color, classList) {
    var allClassObj = {};
    return classList.split(' ')
        .reduce(function (classObj, classString) {
        classObj[classString] = true;
        if (mode) {
            classObj[classString + "-" + mode] = true;
            if (color) {
                classObj[classString + "-" + color] = true;
                classObj[classString + "-" + mode + "-" + color] = true;
            }
        }
        return classObj;
    }, allClassObj);
}

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Item = (function () {
    function Item() {
        this.childStyles = Object.create(null);
        // _ids: number = -1;
        // _inputs: Array<string> = [];
        // _label: Label;
        // _viewLabel: boolean = true;
        // _name: string = 'item';
        // _hasReorder: boolean;
        // /**
        //  * @hidden
        //  */
        // id: string;
        // /**
        //  * @hidden
        //  */
        // labelId: string = null;
        // constructor(
        //   form: Form,
        //   config: Config,
        //   elementRef: ElementRef,
        //   renderer: Renderer,
        //   @Optional() reorder: ItemReorder
        // ) {
        //   super(config, elementRef, renderer, 'item');
        //   this._setName(elementRef);
        //   this._hasReorder = !!reorder;
        //   this.id = form.nextId().toString();
        //   // auto add "tappable" attribute to ion-item components that have a click listener
        //   if (!(<any>renderer).orgListen) {
        //     (<any>renderer).orgListen = renderer.listen;
        //     renderer.listen = function(renderElement: HTMLElement, name: string, callback: Function): Function {
        //       if (name === 'click' && renderElement.setAttribute) {
        //         renderElement.setAttribute('tappable', '');
        //       }
        //       return (<any>renderer).orgListen(renderElement, name, callback);
        //     };
        //   }
        // }
        // /**
        //  * @hidden
        //  */
        // registerInput(type: string) {
        //   this._inputs.push(type);
        //   return this.id + '-' + (++this._ids);
        // }
        // /**
        //  * @hidden
        //  */
        // ngAfterContentInit() {
        //   if (this._viewLabel && this._inputs.length) {
        //     let labelText = this.getLabelText().trim();
        //     this._viewLabel = (labelText.length > 0);
        //   }
        //   if (this._inputs.length > 1) {
        //     this.setElementClass('item-multiple-inputs', true);
        //   }
        // }
        // /**
        //  * @hidden
        //  */
        // _updateColor(newColor: string, componentName?: string) {
        //   componentName = componentName || 'item'; // item-radio
        //   this._setColor(newColor, componentName);
        // }
        // /**
        //  * @hidden
        //  */
        // _setName(elementRef: ElementRef) {
        //   let nodeName = elementRef.nativeElement.nodeName.replace('ION-', '');
        //   if (nodeName === 'LIST-HEADER' || nodeName === 'ITEM-DIVIDER') {
        //     this._name = nodeName;
        //   }
        // }
        // /**
        //  * @hidden
        //  */
        // getLabelText(): string {
        //   return this._label ? this._label.text : '';
        // }
        // /**
        //  * @hidden
        //  */
        // @ContentChild(Label)
        // set contentLabel(label: Label) {
        //   if (label) {
        //     this._label = label;
        //     this.labelId = label.id = ('lbl-' + this.id);
        //     if (label.type) {
        //       this.setElementClass('item-label-' + label.type, true);
        //     }
        //     this._viewLabel = false;
        //   }
        // }
        // /**
        //  * @hidden
        //  */
        // @ViewChild(Label)
        // set viewLabel(label: Label) {
        //   if (!this._label) {
        //     this._label = label;
        //   }
        // }
        // /**
        //  * @hidden
        //  */
        // @ContentChildren(Button)
        // set _buttons(buttons: QueryList<Button>) {
        //   buttons.forEach(button => {
        //     if (!button._size) {
        //       button.setElementClass('item-button', true);
        //     }
        //   });
        // }
        // /**
        //  * @hidden
        //  */
        // @ContentChildren(Icon)
        // set _icons(icons: QueryList<Icon>) {
        //   icons.forEach(icon => {
        //     icon.setElementClass('item-icon', true);
        //   });
        // }
    }
    Item.prototype.itemStyle = function (ev) {
        ev.stopPropagation();
        var hasChildStyleChange = false;
        var updatedStyles = ev.detail;
        for (var key in updatedStyles) {
            if (updatedStyles[key] !== this.childStyles['item-' + key]) {
                this.childStyles['item-' + key] = updatedStyles[key];
                hasChildStyleChange = true;
            }
        }
        // returning true tells the renderer to queue an update
        return hasChildStyleChange;
    };
    Item.prototype["componentDidLoad"] = function () {
        // Add item-button classes to each ion-button in the item
        var buttons = this.$el.querySelectorAll('ion-button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].itemButton = true;
        }
    };
    Item.prototype.render = function () {
        var themedClasses = __assign({}, this.childStyles, createThemedClasses(this.mode, this.color, 'item'), { 'item-block': true });
        return (h("div", { "c": themedClasses },
            h(0, { "a": { "name": 'start' } }),
            h("div", { "c": { "item-inner": true } },
                h("div", { "c": { "input-wrapper": true } },
                    h(0, 0)),
                h(0, { "a": { "name": 'end' } }))));
        // template:
        //   '<ng-content select="[slot="start"],ion-checkbox:not([slot="end"])"></ng-content>' +
        //   '<div class="item-inner">' +
        //     '<div class="input-wrapper">' +
        //       '<ng-content select="ion-label"></ng-content>' +
        //       '<ion-label *ngIf="_viewLabel">' +
        //         '<ng-content></ng-content>' +
        //       '</ion-label>' +
        //       '<ng-content select="ion-select,ion-input,ion-textarea,ion-datetime,ion-range,[item-content]"></ng-content>' +
        //     '</div>' +
        //     '<ng-content select="[slot="end"],ion-radio,ion-toggle"></ng-content>' +
        //     '<ion-reorder *ngIf="_hasReorder"></ion-reorder>' +
        //   '</div>' +
        //   '<div class="button-effect"></div>',
    };
    return Item;
}());

var ItemDivider = (function () {
    function ItemDivider() {
    }
    ItemDivider.prototype.render = function () {
        return [
            h(0, { "a": { "name": 'start' } }),
            h("div", { "c": { "item-inner": true } },
                h("div", { "c": { "input-wrapper": true } },
                    h(0, 0)),
                h(0, { "a": { "name": 'end' } }))
        ];
    };
    return ItemDivider;
}());

var Label = (function () {
    function Label() {
    }
    Label.prototype.render = function () {
        return h(0, 0);
    };
    return Label;
}());

var List = (function () {
    function List() {
    }
    List.prototype.render = function () {
        return h(0, 0);
    };
    return List;
}());

var ListHeader = (function () {
    function ListHeader() {
    }
    ListHeader.prototype.render = function () {
        return h(0, 0);
    };
    return ListHeader;
}());

var SkeletonText = (function () {
    function SkeletonText() {
        this.width = '100%';
    }
    SkeletonText.prototype.render = function () {
        return h("span", { "s": { "width": this.width } }, t("\u00A0"));
    };
    return SkeletonText;
}());

exports['ION-ITEM'] = Item;
exports['ION-ITEM-DIVIDER'] = ItemDivider;
exports['ION-LABEL'] = Label;
exports['ION-LIST'] = List;
exports['ION-LIST-HEADER'] = ListHeader;
exports['ION-SKELETON-TEXT'] = SkeletonText;
},


/***************** ion-item *****************/
[
/** ion-item: [0] tag **/
'ION-ITEM',

/** ion-item: [1] host **/
{},

/** ion-item: [2] listeners **/
[
  [
    /***** ion-item listener[0]  ionStyle -> ionStyle() *****/
    /* [0] eventMethod ***/ 'itemStyle',
    /* [1] eventName *****/ 'ionStyle',
    /* [2] eventCapture **/ 0 /* false */,
    /* [3] eventPassive **/ 0 /* false */,
    /* [4] eventEnabled **/ 1 /* true **/
  ]
]

],

/***************** ion-item-divider *****************/
[
/** ion-item-divider: [0] tag **/
'ION-ITEM-DIVIDER',

/** ion-item-divider: [1] host **/
{"theme":"item item-divider"}

],

/***************** ion-label *****************/
[
/** ion-label: [0] tag **/
'ION-LABEL',

/** ion-label: [1] host **/
{"theme":"label"}

],

/***************** ion-list *****************/
[
/** ion-list: [0] tag **/
'ION-LIST',

/** ion-list: [1] host **/
{"theme":"list"}

],

/***************** ion-list-header *****************/
[
/** ion-list-header: [0] tag **/
'ION-LIST-HEADER',

/** ion-list-header: [1] host **/
{"theme":"list-header"}

],

/***************** ion-skeleton-text *****************/
[
/** ion-skeleton-text: [0] tag **/
'ION-SKELETON-TEXT',

/** ion-skeleton-text: [1] host **/
{}

]
)