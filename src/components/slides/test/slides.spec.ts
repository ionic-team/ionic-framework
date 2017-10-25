
import {Slides} from '../slides';
import {
  MockElementRef, mockConfig, mockPlatform, mockRenderer, mockView, mockZone
} from '../../../util/mock-providers';
import {CLS} from '../swiper/swiper-utils';

describe('Slides', () => {
  it('should find all child ion-slide elements', () => {
    const container = createSlideContainer();
    const slides = mockSlides(container);
    expect(slides.length()).toBe(2);
  });
  it('should ignore child ion-slide of nested slides', () => {
    const container = createSlideContainer();
    const nestedContainer = createSlideContainer();
    container.children[0].children[0].appendChild(nestedContainer);
    const slides = mockSlides(container);
    expect(slides.length()).toBe(2);
  });
});

export function mockSlides(firstChild: HTMLElement): Slides {
  const platform = mockPlatform();
  const config = mockConfig(null, '/', platform);
  const zone = mockZone();
  const elementRef = new MockElementRef(document.createElement('ion-slides'));
  const renderer = mockRenderer();
  const view = mockView();
  elementRef.nativeElement.appendChild(firstChild);

  const slides = new Slides(config, platform, zone, view, elementRef, renderer);
  view.readReady.emit();
  return slides;
}

export function createSlideContainer(): HTMLElement {
  const container = document.createElement('div');
  const wrapper = document.createElement('div');
  const slide1 = document.createElement('ion-slide');
  const slide2 = document.createElement('ion-slide');
  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';
  wrapper.className = CLS.wrapper;
  slide1.className = CLS.slide;
  slide2.className = CLS.slide;
  container.appendChild(wrapper);
  wrapper.appendChild(slide1);
  wrapper.appendChild(slide2);
  container.appendChild(pagination);
  return container;
}
