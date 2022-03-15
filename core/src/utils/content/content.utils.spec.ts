import { scrollToTop, scrollByPoint, printIonContentErrorMsg, findClosestIonContent, findIonContent, getScrollElement } from './index';

describe('Content Utils', () => {

  describe('getScrollElement', () => {

    it('should return the scroll element for ion-content', async () => {
      const res = await getScrollElement(<any>{
        tagName: 'ION-CONTENT',
        getScrollElement: () => Promise.resolve({
          tagName: 'my-scroll-element'
        })
      });

      expect(res).toStrictEqual({
        tagName: 'my-scroll-element'
      });
    });

  });

  describe('findIonContent', () => {

    it('should query the ion-content element', () => {
      const querySelectorMock = jest.fn();

      findIonContent(<any>{
        querySelector: querySelectorMock
      });

      expect(querySelectorMock).toHaveBeenCalledWith('ion-content, .ion-content-scroll-host');
    });

  });

  describe('findClosestIonContent', () => {

    it('should query the closest ion-content', () => {
      const closestMock = jest.fn();

      findClosestIonContent(<any>{
        closest: closestMock
      });

      expect(closestMock).toHaveBeenCalledWith('ion-content, .ion-content-scroll-host');
    });
  });

  describe('scrollToTop', () => {

    describe('scroll duration is 0', () => {

      it('should call scrollToTop when the tag name is ion-content', () => {
        const scrollToTopMock = jest.fn();

        scrollToTop(<any>{
          tagName: 'ION-CONTENT',
          scrollToTop: scrollToTopMock
        }, 0);

        expect(scrollToTopMock).toHaveBeenCalledWith(0);
      });

      it('should call the element scrollTo when the tag name is not ion-content', async () => {
        const scrollToMock = jest.fn();

        await scrollToTop(<any>{
          tagName: 'DIV',
          scrollTo: scrollToMock
        }, 0);

        expect(scrollToMock).toHaveBeenCalledWith({
          top: 0,
          left: 0,
          behavior: 'auto'
        });
      });

    });

    describe('scroll duration is greater than 0', () => {

      it('should smooth scroll ion-content', () => {
        const scrollToTopMock = jest.fn();

        scrollToTop(<any>{
          tagName: 'ION-CONTENT',
          scrollToTop: scrollToTopMock
        }, 300);

        expect(scrollToTopMock).toHaveBeenCalledWith(300);
      });

      it('should smooth scroll the element', async () => {
        const scrollToMock = jest.fn();

        await scrollToTop(<any>{
          tagName: 'DIV',
          scrollTo: scrollToMock
        }, 300);

        expect(scrollToMock).toHaveBeenCalledWith({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      });

    });

  });

  describe('scrollByPoint', () => {

    describe('scroll duration is 0', () => {

      it('should call scrollByPoint when the tag name is ion-content', async () => {
        const scrollByPointMock = jest.fn();

        await scrollByPoint(<any>{
          tagName: 'ION-CONTENT',
          scrollByPoint: scrollByPointMock
        }, 10, 15, 0);

        expect(scrollByPointMock).toHaveBeenCalledWith(10, 15, 0);
      });

      it('should call the element scrollBy when the tag name is not ion-content', async () => {
        const scrollByMock = jest.fn();

        await scrollByPoint(<any>{
          tagName: 'DIV',
          scrollBy: scrollByMock
        }, 10, 15, 0);

        expect(scrollByMock).toHaveBeenCalledWith({
          top: 15,
          left: 10,
          behavior: 'auto'
        });
      });

    });

    describe('scroll duration is greater than 0', () => {

      it('should smooth scroll ion-content', async () => {
        const scrollByPointMock = jest.fn();

        await scrollByPoint(<any>{
          tagName: 'ION-CONTENT',
          scrollByPoint: scrollByPointMock
        }, 10, 15, 300);

        expect(scrollByPointMock).toHaveBeenCalledWith(10, 15, 300);
      });

      it('should smooth scroll the element', async () => {
        const scrollByMock = jest.fn();

        await scrollByPoint(<any>{
          tagName: 'DIV',
          scrollBy: scrollByMock
        }, 10, 15, 300);

        expect(scrollByMock).toHaveBeenCalledWith({
          top: 15,
          left: 10,
          behavior: 'smooth'
        });
      });

    });

  });

  it('printIonContentErrorMsg should display "<my-el> must be used inside ion-content."', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    printIonContentErrorMsg(<any>{
      tagName: 'MY-EL'
    });

    expect(consoleErrorMock).toHaveBeenCalledWith('<my-el> must be used inside ion-content.');

    consoleErrorMock.mockRestore();
  });

});
