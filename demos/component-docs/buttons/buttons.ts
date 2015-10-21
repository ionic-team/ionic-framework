import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../helpers';

@Page({
  templateUrl: 'buttons/buttons.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class ButtonsPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'buttons/block.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class BlockButtonsPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'buttons/clear.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class ClearButtonsPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'buttons/full.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class FullButtonsPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'buttons/outline.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class OutlineButtonsPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'buttons/round.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class RoundButtonsPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'buttons/fab.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class FabPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'buttons/sizes.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class ButtonSizesPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'buttons/icons.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class IconButtonsPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'buttons/components.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class ButtonsInComponentsPage {
    constructor() {

    }
}
