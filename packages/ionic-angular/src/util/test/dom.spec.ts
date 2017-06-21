import * as dom from '../dom';


describe('dom', () => {

  describe('isTextInput', () => {

    it('should return false if input[type=button]', () => {
      const ele = document.createElement('input');
      ele.type = 'button';
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return false if input[type=checkbox]', () => {
      const ele = document.createElement('input');
      ele.type = 'checkbox';
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return false if input[type=color]', () => {
      const ele = document.createElement('input');
      ele.type = 'color';
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return false if input[type=file]', () => {
      const ele = document.createElement('input');
      ele.type = 'file';
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return false if input[type=image]', () => {
      const ele = document.createElement('input');
      ele.type = 'image';
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return false if input[type=radio]', () => {
      const ele = document.createElement('input');
      ele.type = 'radio';
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return false if input[type=range]', () => {
      const ele = document.createElement('input');
      ele.type = 'range';
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return false if input[type=reset]', () => {
      const ele = document.createElement('input');
      ele.type = 'reset';
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return false if input[type=submit]', () => {
      const ele = document.createElement('input');
      ele.type = 'submit';
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return true if input date', () => {
      const ele = document.createElement('input');
      ele.type = 'date';
      expect(dom.isTextInput(ele)).toBe(true);

      ele.type = 'datetime';
      expect(dom.isTextInput(ele)).toBe(true);

      ele.type = 'datetime-local';
      expect(dom.isTextInput(ele)).toBe(true);

      ele.type = 'month';
      expect(dom.isTextInput(ele)).toBe(true);

      ele.type = 'time';
      expect(dom.isTextInput(ele)).toBe(true);

      ele.type = 'week';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if input[type=email]', () => {
      const ele = document.createElement('input');
      ele.type = 'email';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if input[type=number]', () => {
      const ele = document.createElement('input');
      ele.type = 'number';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if input[type=number]', () => {
      const ele = document.createElement('input');
      ele.type = 'number';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if input[type=password]', () => {
      const ele = document.createElement('input');
      ele.type = 'password';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if input[type=search]', () => {
      const ele = document.createElement('input');
      ele.type = 'search';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if input[type=tel]', () => {
      const ele = document.createElement('input');
      ele.type = 'tel';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if input[type=url]', () => {
      const ele = document.createElement('input');
      ele.type = 'url';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if input[type=text]', () => {
      const ele = document.createElement('input');
      ele.type = 'text';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if input and unknown type', () => {
      const ele = document.createElement('input');
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if contentEditable', () => {
      const ele = document.createElement('div');
      ele.contentEditable = 'true';
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return true if textarea', () => {
      const ele = document.createElement('textarea');
      expect(dom.isTextInput(ele)).toBe(true);
    });

    it('should return false if a div', () => {
      const ele = document.createElement('div');
      expect(dom.isTextInput(ele)).toBe(false);
    });

    it('should return false if blank', () => {
      expect(dom.isTextInput(null)).toBe(false);
      expect(dom.isTextInput(undefined)).toBe(false);
      expect(dom.isTextInput(false)).toBe(false);
    });

  });

});
