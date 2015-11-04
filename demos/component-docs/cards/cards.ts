import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../helpers';

export * from './cards-background/pages';

@Page({
  templateUrl: 'cards/cards-basic.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class BasicPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-header.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class HeaderPage {
    constructor() {

    }
}


@Page({
  templateUrl: 'cards/cards-list.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class ListPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-image.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class ImagePage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-advanced-social.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class AdvancedSocialPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-advanced-map.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class AdvancedMapPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-advanced-weather.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class AdvancedWeatherPage {
    constructor() {

    }
}
