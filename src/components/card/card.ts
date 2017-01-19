import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';


/**
 * @name Card
 * @description
 * Cards are a common user interface element for mobile apps, and act as a formatted container
 * for displaying content. Cards are commonly used to display lists of items, similar to `ion-item`.
 *
 * ### Card Headers
 * Just like a normal page, cards can be customized to include headers. To add a header 
 * to a card, add the `ion-card-header` component, then include the card's body content
 * inside the `ion-card-content` component:
 * 
 * ```html
 * <ion-card>
 *   <ion-card-header>
 *     Header
 *   </ion-card-header>
 *   <ion-card-content>
 *     The British use the term "header", but the American term "head-shot."
 *   </ion-card-content>
 * </ion-card>
 * ```
 * 
 * ### Card Titles
 *
 * Card titles are similar to card headers, but are styled with less top and bottom margin so 
 * that they have less emphasis. Generally, a title is used to label the contents of `ion-card-content`, 
 * while a header is used to label the entire Card. To add a title, add the `ion-card-title` component:
 * 
 * ```html
 * <ion-card>
 *   <ion-card-content>
 *     <ion-card-title>Header or Headshot?</ion-card-title>
 *     The British use the term "header", but the American term "head-shot."
 *   </ion-card-content>
 * </ion-card>
 * ```
 *
 * ### Using Components in Cards
 * 
 * Many different components can be nested inside a Card. For example, a card can contain a list of items:
 * 
 * ```html
 * <ion-card>
 *   <ion-card-header>
 *     Explore Nearby
 *   </ion-card-header>
 * 
 *   <ion-list>
 *     <button ion-item>
 *       <ion-icon name="cart" item-left></ion-icon>
 *       Shopping
 *     </button>
 * 
 *     <button ion-item>
 *       <ion-icon name="medical" item-left></ion-icon>
 *       Hospital
 *     </button>
 *   </ion-list>
 * </ion-card>
 * ```
 * 
 * ## Common Usage Patterns
 * 
 * ### Header Image
 * 
 * Images in cards will automatically be scaled to display full-width. A common layout is to
 * use an image along with the `ion-card-content` component to create the look of a card with 
 * a header image:
 * 
 * ```html
 * <ion-card>
 *   <img src="img/nin-live.png"/>
 *   <ion-card-content>
 *     <ion-card-title>
 *       Nine Inch Nails Live
 *     </ion-card-title>
 *     <p>
 *       The most popular industrial group ever, and largely
 *       responsible for bringing the music to a mass audience.
 *     </p>
 *   </ion-card-content>
 * </ion-card>
 * ```
 * 
 * ### Background Image
 * 
 * Cards can be used to achieve a multitude of designs. We provide many of the elements to achieve 
 * common designs, but sometimes it will be necessary to add custom styles. Adding background 
 * images to cards is a perfect example of how adding custom styles can achieve a completely different look.
 * 
 * ```html
 *   <ion-card>
 *     <img src="img/card-saopaolo.png"/>
 *     <div class="card-title">São Paulo</div>
 *     <div class="card-subtitle">41 Listings</div>
 *   </ion-card>
 * ```
 * 
 * Then, in the Sass file for the page:
 * 
 * ```scss
 * ion-card {
 *   position: relative;
 *   text-align: center;
 * }
 *
 * .card-title {
 *   position: absolute;
 *   top: 36%;
 *   font-size: 2.0em;
 *   width: 100%;
 *   font-weight: bold;
 *   color: #fff;
 * }
 *
 * .card-subtitle {
 *   font-size: 1.0em;
 *   position: absolute;
 *   top: 52%;
 *   width: 100%;
 *   color: #fff;
 * }
 * ```
 *
 * ### Social Cards
 * 
 * It's often necessary to create social cards within an application. Using a combination of different 
 * items in a card you can achieve this.
 * 
 * ```html
 * <ion-card>
 * 
 *   <ion-item>
 *     <ion-avatar item-left>
 *       <img src="img/marty-avatar.png">
 *     </ion-avatar>
 *     <h2>Marty McFly</h2>
 *     <p>November 5, 1955</p>
 *   </ion-item>
 * 
 *   <img src="img/advance-card-bttf.png">
 * 
 *   <ion-card-content>
 *     <p>Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine...</p>
 *   </ion-card-content>
 * 
 *   <ion-row>
 *     <ion-col>
 *       <button ion-button icon-left clear small>
 *         <ion-icon name="thumbs-up"></ion-icon>
 *         <div>12 Likes</div>
 *       </button>
 *     </ion-col>
 *     <ion-col>
 *       <button ion-button icon-left clear small>
 *         <ion-icon name="text"></ion-icon>
 *         <div>4 Comments</div>
 *       </button>
 *     </ion-col>
 *     <ion-col center text-center>
 *       <ion-note>
 *         11h ago
 *       </ion-note>
 *     </ion-col>
 *   </ion-row>
 * 
 * </ion-card>
 * ```
 * 
 * ### Map Cards
 * 
 * A combination of Ionic components can be used to create a card that appears as a map.
 * 
 * ```html
 * <ion-card>
 * 
 *   <img src="img/advance-card-map-madison.png">
 *   <ion-fab right top>
 *     <button ion-fab>
 *       <ion-icon name="pin"></ion-icon>
 *     </button>
 *   </ion-fab>
 * 
 *   <ion-item>
 *     <ion-icon name="football" item-left large></ion-icon>
 *     <h2>Museum of Football</h2>
 *     <p>11 N. Way St, Madison, WI 53703</p>
 *   </ion-item>
 * 
 *   <ion-item>
 *     <ion-icon name="wine" item-left large ></ion-icon>
 *     <h2>Institute of Fine Cocktails</h2>
 *     <p>14 S. Hop Avenue, Madison, WI 53703</p>
 *   </ion-item>
 * 
 *   <ion-item>
 *     <span item-left>18 min</span>
 *     <span item-left>(2.6 mi)</span>
 *     <button ion-button icon-left clear item-right>
 *       <ion-icon name="navigate"></ion-icon>
 *       Start
 *     </button>
 *   </ion-item>
 * 
 * </ion-card>
 * ```
 * 
 * 
 * <!-- <h3 class="section-nav" id="card-advanced-weather">Weather Cards</h3>
 * <a target="_blank" class="component-doc-demo" href="https://github.com/driftyco/ionic-preview-app/tree/master/app/pages/cards/advanced-weather">
 *   Demo Source
 * </a>
 * 
 * Coming soon.* --> 
 *
 * @demo /docs/v2/demos/src/card/basic 
 * @additionalDemo using-components-in-cards: /docs/v2/demos/src/card/list/
 * @additionalDemo card-headers: /docs/v2/demos/src/card/header/
 * @additionalDemo header-image: /docs/v2/demos/src/card/image/
 * @additionalDemo background-image: /docs/v2/demos/src/card/background/
 * @additionalDemo social-cards: /docs/v2/demos/src/card/advanced-social/
 * @additionalDemo map-cards: /docs/v2/demos/src/card/advanced-map/
 * @see {@link /docs/v2/components/#cards Card Component Docs}
 */
@Directive({
  selector: 'ion-card'
})
export class Card extends Ion {

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }

  /**
   * @input {string} The mode to apply to this component. Mode can be `ios`, `wp`, or `md`.
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'card');
  }

}


/**
 * @private
 */
@Directive({
  selector: 'ion-card-content'
})
export class CardContent extends Ion {

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'card-content');
  }

}


/**
 * @private
 */
@Directive({
  selector: 'ion-card-header'
})
export class CardHeader extends Ion {

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'card-header');
  }

}

/**
 * @private
 */
@Directive({
  selector: 'ion-card-title'
})
export class CardTitle extends Ion {

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'card-title');
  }

}
