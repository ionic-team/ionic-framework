import {Slides} from './slides';


/**
 * @name Slides
 * @description
 * _For basic Slides usage, see the [Slides section](../../../../components/#slides)
 * of the Component docs._
 *
 */
export class SlidesController {
  private _slides: Array<Slides> = [];

  /**
   * Progamatically run transition to next slide
   */
  next(slidesId?: string){
    let slides = this.get(slidesId);
    if (slides){
      slides.next();
    }
  }

  /**
   * Progamatically run transition to prev slide
   */
  prev(slidesId?: string){
    let slides = this.get(slidesId);
    if (slides){
      slides.prev();
    }
  }

  /**
   * @return {Array<Slides>}  Returns an array of all slides instances.
   */
  getMenus(): Array<Slides> {
    return this._slides;
  }

  /**
   * @private
   */
  get(slidesId?: string): Slides {
    var slides: Slides;

   if (slidesId) {
      // so try to get the slides by its "id"
      return this._slides.find(s => s.id === slidesId) || null;
    }

    // get the first slides in the array, if one exists
    return (this._slides.length ? this._slides[0] : null);
  }

  /**
   * @private
   */
  register(slides: Slides) {
    this._slides.push(slides);
  }

  /**
   * @private
   */
  unregister(slides: Slides) {
    let index = this._slides.indexOf(slides);
    if (index > -1) {
      this._slides.splice(index, 1);
    }
  }
}
