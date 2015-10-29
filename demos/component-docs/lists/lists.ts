import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../helpers';


@Page({
    templateUrl: 'lists/basic-lists.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class BasicListsPage {
    constructor() {

    }
}

@Page({
    templateUrl: 'lists/dividers.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class BasicDividersPage {
    constructor() {

    }
}

@Page({
    templateUrl: 'lists/inset-lists.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class BasicInsetListsPage {
    constructor() {

    }
}

@Page({
    templateUrl: 'lists/list-headers.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class ListHeadersPage {
    constructor() {

    }
}

@Page({
    templateUrl: 'lists/icon-lists.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class IconListsPage {
    constructor() {

    }
}

@Page({
    templateUrl: 'lists/avatar-lists.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class AvatarListsPage {
    constructor() {

    }
}

@Page({
    templateUrl: 'lists/three-lists.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class ThreeLineListsPage {
    constructor() {

    }
}

@Page({
    templateUrl: 'lists/thumbnail-lists.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class ThumbnailListsPage {
    constructor() {

    }
}
