// @vitest-environment stencil

import {
  scrollToTop,
  scrollByPoint,
  printIonContentErrorMsg,
  findClosestIonContent,
  findIonContent,
  findRefresherInContent,
  getScrollElement,
} from './index';

describe('Content Utils', () => {
  describe('getScrollElement', () => {
    it('should return the scroll element for ion-content', async () => {
      const res = await getScrollElement({
        tagName: 'ION-CONTENT',
        getScrollElement: () =>
          Promise.resolve({
            tagName: 'my-scroll-element',
          }),
      } as any);

      expect(res).toStrictEqual({
        tagName: 'my-scroll-element',
      });
    });
  });

  describe('findIonContent', () => {
    it('should query the ion-content element', () => {
      const querySelectorMock = vi.fn();

      findIonContent({
        querySelector: querySelectorMock,
      } as any);

      expect(querySelectorMock).toHaveBeenCalledWith('ion-content, .ion-content-scroll-host');
    });
  });

  describe('findClosestIonContent', () => {
    it('should query the closest ion-content', () => {
      const closestMock = vi.fn();

      findClosestIonContent({
        closest: closestMock,
      } as any);

      expect(closestMock).toHaveBeenCalledWith('ion-content, .ion-content-scroll-host');
    });
  });

  describe('findRefresherInContent', () => {
    const createContent = ({ hasRefresher = true, scrollHostCount = 0 } = {}) => {
      const content = document.createElement('ion-content');

      if (hasRefresher) {
        const refresher = document.createElement('ion-refresher');
        refresher.setAttribute('slot', 'fixed');
        content.appendChild(refresher);
      }

      for (let i = 0; i < scrollHostCount; i++) {
        const scrollHost = document.createElement('div');
        scrollHost.classList.add('ion-content-scroll-host');
        content.appendChild(scrollHost);
      }

      return content;
    };

    it('should find the refresher within ion-content', () => {
      const content = createContent();

      expect(findRefresherInContent(content)).toBe(content.querySelector('ion-refresher'));
    });

    it('should return null when ion-content has no refresher', () => {
      const content = createContent({ hasRefresher: false });

      expect(findRefresherInContent(content)).toBe(null);
    });

    it('should find the refresher from a custom scroll host that is a sibling of it', () => {
      const content = createContent({ scrollHostCount: 1 });
      const scrollHost = content.querySelector('.ion-content-scroll-host')!;

      expect(findRefresherInContent(scrollHost)).toBe(content.querySelector('ion-refresher'));
    });

    it('should find the refresher from an element nested within the custom scroll host', () => {
      const content = createContent({ scrollHostCount: 1 });
      const nested = document.createElement('div');
      content.querySelector('.ion-content-scroll-host')!.appendChild(nested);

      expect(findRefresherInContent(nested)).toBe(content.querySelector('ion-refresher'));
    });

    it('should return null for a custom scroll host the refresher does not scroll with', () => {
      const content = createContent({ scrollHostCount: 2 });
      const secondScrollHost = content.querySelectorAll('.ion-content-scroll-host')[1];

      expect(findRefresherInContent(secondScrollHost)).toBe(null);
    });

    it('should return null for a custom scroll host that is not within an ion-content', () => {
      const scrollHost = document.createElement('div');
      scrollHost.classList.add('ion-content-scroll-host');
      scrollHost.appendChild(document.createElement('ion-refresher'));

      expect(findRefresherInContent(scrollHost)).toBe(null);
    });
  });

  describe('scrollToTop', () => {
    describe('scroll duration is 0', () => {
      it('should call scrollToTop when the tag name is ion-content', () => {
        const scrollToTopMock = vi.fn();

        scrollToTop(
          {
            tagName: 'ION-CONTENT',
            scrollToTop: scrollToTopMock,
          } as any,
          0
        );

        expect(scrollToTopMock).toHaveBeenCalledWith(0);
      });

      it('should call the element scrollTo when the tag name is not ion-content', async () => {
        const scrollToMock = vi.fn();

        await scrollToTop(
          {
            tagName: 'DIV',
            scrollTo: scrollToMock,
          } as any,
          0
        );

        expect(scrollToMock).toHaveBeenCalledWith({
          top: 0,
          left: 0,
          behavior: 'auto',
        });
      });
    });

    describe('scroll duration is greater than 0', () => {
      it('should smooth scroll ion-content', () => {
        const scrollToTopMock = vi.fn();

        scrollToTop(
          {
            tagName: 'ION-CONTENT',
            scrollToTop: scrollToTopMock,
          } as any,
          300
        );

        expect(scrollToTopMock).toHaveBeenCalledWith(300);
      });

      it('should smooth scroll the element', async () => {
        const scrollToMock = vi.fn();

        await scrollToTop(
          {
            tagName: 'DIV',
            scrollTo: scrollToMock,
          } as any,
          300
        );

        expect(scrollToMock).toHaveBeenCalledWith({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
    });
  });

  describe('scrollByPoint', () => {
    describe('scroll duration is 0', () => {
      it('should call scrollByPoint when the tag name is ion-content', async () => {
        const scrollByPointMock = vi.fn();

        await scrollByPoint(
          {
            tagName: 'ION-CONTENT',
            scrollByPoint: scrollByPointMock,
          } as any,
          10,
          15,
          0
        );

        expect(scrollByPointMock).toHaveBeenCalledWith(10, 15, 0);
      });

      it('should call the element scrollBy when the tag name is not ion-content', async () => {
        const scrollByMock = vi.fn();

        await scrollByPoint(
          {
            tagName: 'DIV',
            scrollBy: scrollByMock,
          } as any,
          10,
          15,
          0
        );

        expect(scrollByMock).toHaveBeenCalledWith({
          top: 15,
          left: 10,
          behavior: 'auto',
        });
      });
    });

    describe('scroll duration is greater than 0', () => {
      it('should smooth scroll ion-content', async () => {
        const scrollByPointMock = vi.fn();

        await scrollByPoint(
          {
            tagName: 'ION-CONTENT',
            scrollByPoint: scrollByPointMock,
          } as any,
          10,
          15,
          300
        );

        expect(scrollByPointMock).toHaveBeenCalledWith(10, 15, 300);
      });

      it('should smooth scroll the element', async () => {
        const scrollByMock = vi.fn();

        await scrollByPoint(
          {
            tagName: 'DIV',
            scrollBy: scrollByMock,
          } as any,
          10,
          15,
          300
        );

        expect(scrollByMock).toHaveBeenCalledWith({
          top: 15,
          left: 10,
          behavior: 'smooth',
        });
      });
    });
  });

  it('printIonContentErrorMsg should display "<my-el> must be used inside ion-content."', () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    printIonContentErrorMsg({
      tagName: 'MY-EL',
    } as any);

    expect(consoleErrorMock).toHaveBeenCalledWith('<my-el> must be used inside ion-content.');

    consoleErrorMock.mockRestore();
  });
});
