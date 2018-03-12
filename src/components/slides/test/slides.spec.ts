
import {Slides} from '../slides';
import {
  MockElement, MockElementRef, mockConfig, mockPlatform, mockRenderer, mockView, mockZone
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

  describe('Pager', () => {
    it('should include bullets equal to the number of slides', () => {
      const container = createSlideContainer();
      // As the grid for pagination uses clientWidth for calculation we need the container to be rendered
      document.body.appendChild(container);
      const slides = mockSlides(container);
      expect(slides._paginationContainer.children.length).toBe(2);
    });
    it('should add the bullets to the correct pagination-container in case of nested slides', () => {
      const container = createSlideContainer();
      const nestedContainer = createSlideContainer();
      container.children[0].children[0].appendChild(nestedContainer);
      // As the grid for pagination uses clientWidth for calculation we need the container to be rendered
      document.body.appendChild(container);
      const slides = mockSlides(container);
      expect(slides._paginationContainer.children.length).toBe(2);
      expect(slides._paginationContainer).not.toBe(nestedContainer.children[1]);
      expect(slides._paginationContainer).toBe(container.children[1]);
    });
  });
});

export function mockSlides(firstChild: HTMLElement): Slides {
  const platform = mockPlatform();
  const config = mockConfig(null, '/', platform);
  const zone = mockZone();
  const mockSlides = new MockElement();
  const elementRef = new MockElementRef(mockSlides);
  const renderer = mockRenderer();
  const view = mockView();
  elementRef.nativeElement.children = [firstChild];
  mockSlides.nodeName = 'ion-slides';

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
  container.className = 'swiper-container';
  pagination.className = 'swiper-pagination';
  wrapper.className = CLS.wrapper;
  slide1.className = CLS.slide;
  slide2.className = CLS.slide;
  wrapper.appendChild(slide1);
  wrapper.appendChild(slide2);
  container.appendChild(wrapper);
  container.appendChild(pagination);
  return container;
}
