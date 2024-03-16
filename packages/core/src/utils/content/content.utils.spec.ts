import {
  scrollToTop,
  scrollByPoint,
  printIonContentErrorMsg,
  findClosestIonContent,
  findIonContent,
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
      const querySelectorMock = jest.fn();

      findIonContent({
        querySelector: querySelectorMock,
      } as any);

      expect(querySelectorMock).toHaveBeenCalledWith('ion-content, .ion-content-scroll-host');
    });
  });

  describe('findClosestIonContent', () => {
    it('should query the closest ion-content', () => {
      const closestMock = jest.fn();

      findClosestIonContent({
        closest: closestMock,
      } as any);

      expect(closestMock).toHaveBeenCalledWith('ion-content, .ion-content-scroll-host');
    });
  });

  describe('scrollToTop', () => {
    describe('scroll duration is 0', () => {
      it('should call scrollToTop when the tag name is ion-content', () => {
        const scrollToTopMock = jest.fn();

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
        const scrollToMock = jest.fn();

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
        const scrollToTopMock = jest.fn();

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
        const scrollToMock = jest.fn();

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
        const scrollByPointMock = jest.fn();

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
        const scrollByMock = jest.fn();

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
        const scrollByPointMock = jest.fn();

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
        const scrollByMock = jest.fn();

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
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    printIonContentErrorMsg({
      tagName: 'MY-EL',
    } as any);

    expect(consoleErrorMock).toHaveBeenCalledWith('<my-el> must be used inside ion-content.');

    consoleErrorMock.mockRestore();
  });
});
