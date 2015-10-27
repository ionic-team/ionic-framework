import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../helpers';

@Page({
  templateUrl: 'cards/cards-basic.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CardsBasicPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-header.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CardsHeaderPage {
    constructor() {

    }
}


@Page({
  templateUrl: 'cards/cards-list.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CardsListPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-image.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CardsImagePage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-background.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CardsBackgroundPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-advanced-social.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CardsAdvancedSocialPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-advanced-map.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CardsAdvancedMapPage {
    constructor() {

    }
}

@Page({
  templateUrl: 'cards/cards-advanced-weather.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CardsAdvancedWeatherPage {
    constructor() {

    }
}
