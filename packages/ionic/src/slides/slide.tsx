import { Component, h } from '../index';
import { VNodeData } from '../../util/interfaces';

 /**
  * @name Slide
  * @description
  * The Slide component is a child component of [Slides](../Slides). The template
  * should be written as `ion-slide`. Any slide content should be written
  * in this component and it should be used in conjunction with [Slides](../Slides).
  *
  * See the [Slides API Docs](../Slides) for more usage information.
  *
  * @demo /docs/demos/src/slides/
  * @see {@link /docs/api/components/slides/Slides/ Slides API Docs}
  */
@Component({
  tag: 'ion-slide',
  styleUrls: 'slide.scss'
})
export class Slide {
  hostData(): VNodeData {
    return {
      class: {
        'slide-zoom': true,
        'swiper-slide': true
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
