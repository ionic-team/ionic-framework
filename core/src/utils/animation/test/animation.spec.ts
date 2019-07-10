import { Animation } from '../animation';

describe('Animation Class', () => {
  
  describe('addElement()', () => {
    let animation;
    beforeEach(() => {
      animation = new Animation();
    });
    
    it('should add 1 element', () => {
      const el = document.createElement('p');
      animation.addElement(el);

      expect(animation.elements.length).toEqual(1);
    });
    
    it('should add multiple elements', () => {
      const els = [
        document.createElement('p'),
        document.createElement('p'),
        document.createElement('p')
      ];
      
      animation.addElement(els);

      expect(animation.elements.length).toEqual(els.length);
    });
    
    it('should not error when trying to add null or undefined', () => {
      const el = document.createElement('p');
      animation.addElement(el);

      animation.addElement(null);
      animation.addElement(undefined);
      
      expect(animation.elements.length).toEqual(1);
    });
  });
  
  describe('addTarget()', () => {
    let animation;
    beforeEach(() => {
      animation = new Animation();
      document.body.innerHTML = '';
    });
    
    it('should add a target', () => {
      document.body.appendChild(document.createElement('p'));
      
      animation.addTarget('p');
      expect(animation.elements.length).toEqual(1);
    });
    
    it('should add multiple targets of the same type', () => {
      document.body.appendChild(document.createElement('p'));
      document.body.appendChild(document.createElement('p'));
      
      animation.addTarget('p');
      expect(animation.elements.length).toEqual(2);
    });
    
    it('should add multiple targets of different types', () => {
      document.body.appendChild(document.createElement('p'));
      document.body.appendChild(document.createElement('p'));
      document.body.appendChild(document.createElement('span'));
      
      animation.addTarget('p, span');
      expect(animation.elements.length).toEqual(3);
    });
    
    it('should not error when trying to add null or undefined', () => {      
      animation.addTarget('p');
      expect(animation.elements.length).toEqual(0);
    });
  });
  
  describe('addAnimation()', () => {
    let animation;
    beforeEach(() => {
      animation = new Animation();
    });
    
    it('should add 1 animation', () => {
      const newAnimation = new Animation();
      animation.addAnimation(newAnimation);

      expect(animation.childAnimations.length).toEqual(1);
      expect(animation.childAnimations[0].parentAnimation).toEqual(animation);
    });
    
    it('should add multiple animations', () => {
      animation.addAnimation([new Animation(), new Animation(), new Animation()]);

      expect(animation.childAnimations.length).toEqual(3);
      expect(animation.childAnimations[0].parentAnimation).toEqual(animation);
      expect(animation.childAnimations[1].parentAnimation).toEqual(animation);
      expect(animation.childAnimations[2].parentAnimation).toEqual(animation);
    });
    
    it('should not error when trying to add null or undefined', () => {
      animation.addAnimation(null);
      animation.addAnimation(undefined);
      
      expect(animation.childAnimations.length).toEqual(0);
    })
  });
  
  describe('keyframes()', () => {
    let animation;
    beforeEach(() => {
      animation = new Animation('my-animation');
    });
    
    it('should generate a keyframe', () => {
      animation.keyframes([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0.5)', opacity: 0.5, offset: 0.5 },
        { transform: 'scale(0)', opacity: 0, offset: 1 }
      ]);
      
      expect(animation._keyframes.length).toEqual(3);
    });
  });
  
  describe('Animation Config Methods', () => {
    let animation;
    beforeEach(() => {
      animation = new Animation();
    });
    
    it('should get undefined when easing not set', () => {
      expect(animation.getEasing()).toEqual(undefined);
    });
    
    it('should get parent easing when child easing is not set', () => {
      const childAnimation = new Animation();
      animation.addAnimation(childAnimation);
      childAnimation.easing('linear');
      
      expect(childAnimation.getEasing()).toEqual('linear');
    });
    
    it('should get prefer child easing over parent easing', () => {
      const childAnimation = new Animation();
      childAnimation.easing('linear');
      
      animation.addAnimation(childAnimation);
      animation.easing('ease-in-out');
      
      expect(childAnimation.getEasing()).toEqual('linear');
    });
    
    it('should get undefined when duration not set', () => {
      expect(animation.getDuration()).toEqual(undefined);
    });
    
    it('should get parent duration when child duration is not set', () => {
      const childAnimation = new Animation();
      animation.addAnimation(childAnimation);
      childAnimation.duration(500);
      
      expect(childAnimation.getDuration()).toEqual(500);
    });
    
    it('should get prefer child duration over parent duration', () => {
      const childAnimation = new Animation();
      childAnimation.duration(500);
      
      animation.addAnimation(childAnimation);
      animation.duration(1000);
      
      expect(childAnimation.getDuration()).toEqual(500);
    });
    
    it('should get undefined when delay not set', () => {
      expect(animation.getDelay()).toEqual(undefined);
    });
    
    it('should get parent delay when child delay is not set', () => {
      const childAnimation = new Animation();
      animation.addAnimation(childAnimation);
      childAnimation.delay(500);
      
      expect(childAnimation.getDelay()).toEqual(500);
    });
    
    it('should get prefer child delay over parent delay', () => {
      const childAnimation = new Animation();
      childAnimation.delay(500);
      
      animation.addAnimation(childAnimation);
      animation.delay(1000);
      
      expect(childAnimation.getDelay()).toEqual(500);
    });
    
    it('should get undefined when iterations not set', () => {
      expect(animation.getIterations()).toEqual(undefined);
    });
    
    it('should get parent iterations when child iterations is not set', () => {
      const childAnimation = new Animation();
      animation.addAnimation(childAnimation);
      childAnimation.iterations(2);
      
      expect(childAnimation.getIterations()).toEqual(2);
    });
    
    it('should get prefer child iterations over parent iterations', () => {
      const childAnimation = new Animation();
      childAnimation.iterations(2);
      
      animation.addAnimation(childAnimation);
      animation.iterations(1);
      
      expect(childAnimation.getIterations()).toEqual(2);
    });

  })
});