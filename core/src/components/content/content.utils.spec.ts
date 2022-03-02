import { scrollToTop, scrollByPoint, printIonContentErrorMsg, findClosestIonContent, findIonContent, ION_CONTENT_SELECTOR, getScrollElement } from './content.utils';

describe('Content Utils', () => {

  it('ION_CONTENT_SELECTOR', () => {
    expect(ION_CONTENT_SELECTOR).toBe('ion-content, .ion-content-scroll-host');
  });

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

      expect(scrollToMock).toHaveBeenCalledWith(0, 0);
    });

  });

  describe('scrollByPoint', () => {

    it('should call scrollByPoint when the tag name is ion-content', async () => {
      const scrollByPointMock = jest.fn();

      await scrollByPoint(<any>{
        tagName: 'ION-CONTENT',
        scrollByPoint: scrollByPointMock
      }, 10, 15, 0);

      expect(scrollByPointMock).toHaveBeenCalledWith(10, 15, 0);
    });

    it('should call the element scrollTo when the tag name is not ion-content', async () => {
      const scrollToMock = jest.fn();

      await scrollByPoint(<any>{
        tagName: 'DIV',
        scrollTo: scrollToMock
      }, 10, 15, 0);

      expect(scrollToMock).toHaveBeenCalledWith({
        top: 15,
        left: 10
      });
    });

  });

  it('printIonContentErrorMsg should display "<my-el> must be used inside an <ion-content> or .ion-content-scroll-host"', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    printIonContentErrorMsg(<any>{
      tagName: 'MY-EL'
    });

    expect(consoleErrorMock).toHaveBeenCalledWith('<my-el> must be used inside an <ion-content> or .ion-content-scroll-host');

    consoleErrorMock.mockRestore();
  });

});
