import { ElementRef, Renderer } from '@angular/core';
import { Content } from '../../content/content';
import { Img } from '../img';
import { ImgLoader } from '../img-loader';
import { mockContent, MockDomController, mockElementRef, mockPlatform, mockRenderer, mockZone } from '../../../util/mock-providers';
import { Platform } from '../../../platform/platform';


describe('Img', () => {

  describe('reset', () => {

    it('should clear rendering src', () => {
      spyOn(img, '_isLoaded');
      img._renderedSrc = '_renderedSrc.jpg';
      img.reset();
      expect(img._isLoaded).toHaveBeenCalledWith(false);
      expect(img._renderedSrc).toEqual(null);
    });

    it('should abort requesting src', () => {
      spyOn(ldr, 'abort');
      img._requestingSrc = '_requestingSrc.jpg';
      img.reset();
      expect(ldr.abort).toHaveBeenCalledWith('_requestingSrc.jpg');
      expect(img._requestingSrc).toEqual(null);
    });

  });

  describe('src setter', () => {

    it('should abort request if already requesting', () => {
      spyOn(img, 'reset');
      img._requestingSrc = 'requesting.jpg';
      img._tmpDataUri = 'tmpDatauri.jpg';

      img.src = 'image.jpg';

      expect(img.reset).toHaveBeenCalled();
      expect(img.src).toEqual('image.jpg');
      expect(img._tmpDataUri).toEqual(null);
    });

    it('should set datauri src', () => {
      spyOn(img, 'update');
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==';
      expect(img.src).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==');
      expect(img._tmpDataUri).toEqual(`data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==`);
      expect(img.update).toHaveBeenCalled();
    });

    it('should set src', () => {
      spyOn(img, 'update');
      img.src = 'image.jpg';
      expect(img.src).toEqual('image.jpg');
      expect(img.update).toHaveBeenCalled();
    });

  });

  describe('src getter', () => {

    it('should get src if set', () => {
      img._src = 'loaded.jpg';
      expect(img.src).toEqual('loaded.jpg');
    });

  });


  let img: Img;
  let ldr: ImgLoader;
  let elementRef: ElementRef;
  let renderer: Renderer;
  let platform: Platform;
  let content: Content;
  let dom: MockDomController;

  beforeEach(() => {
    content = mockContent();
    ldr = new ImgLoader();
    elementRef = mockElementRef();
    renderer = mockRenderer();
    platform = mockPlatform();
    dom = new MockDomController();
    img = new Img(ldr, elementRef, renderer, platform, mockZone(), content, dom);
  });

});
