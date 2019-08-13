import { createAnimation } from '../animation';

describe('Animation Class', () => {
  
  describe('addElement()', () => {
    let animation;
    beforeEach(() => {
      animation = createAnimation();
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
    
  describe('addAnimation()', () => {
    let animation;
    beforeEach(() => {
      animation = createAnimation();
    });
    
    it('should add 1 animation', () => {
      const newAnimation = createAnimation();
      animation.addAnimation(newAnimation);

      expect(animation.childAnimations.length).toEqual(1);
    });
    
    it('should add multiple animations', () => {
      animation.addAnimation([createAnimation(), createAnimation(), createAnimation()]);

      expect(animation.childAnimations.length).toEqual(3);
    });
    
    it('should not error when trying to add null or undefined', () => {
      animation.addAnimation(null);
      animation.addAnimation(undefined);
      
      expect(animation.childAnimations.length).toEqual(0);
    })
  });
  
  describe('Animation Keyframes', () => {
    let animation;
    beforeEach(() => {
      animation = createAnimation('my-animation');
    });
    
    it('should generate a keyframe', () => {
      animation.keyframes([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0.5)', opacity: 0.5, offset: 0.5 },
        { transform: 'scale(0)', opacity: 0, offset: 1 }
      ]);
      
      expect(animation.getKeyframes().length).toEqual(3);
    });
  });
  
  describe('Animation Config Methods', () => {
    let animation;
    beforeEach(() => {
      animation = createAnimation();
    });
    
    it('should get undefined when easing not set', () => {
      expect(animation.getEasing()).toEqual(undefined);
    });
    
    it('should get parent easing when child easing is not set', () => {
      const childAnimation = createAnimation();
      animation
        .addAnimation(childAnimation)
        .easing('linear');
      
      expect(childAnimation.getEasing()).toEqual('linear');
    });
    
    it('should get prefer child easing over parent easing', () => {
      const childAnimation = createAnimation();
      childAnimation.easing('linear');
      
      animation
        .addAnimation(childAnimation)
        .easing('ease-in-out');
      
      expect(childAnimation.getEasing()).toEqual('linear');
    });
    
    it('should get linear easing when forceLinear is set', () => {      
      animation.easing('ease-in-out');
      
      animation.progressStart(true);
      expect(animation.getEasing()).toEqual('linear');
      
      animation.progressEnd();
      expect(animation.getEasing()).toEqual('ease-in-out');
    });
    
    it('should get undefined when duration not set', () => {
      expect(animation.getDuration()).toEqual(undefined);
    });
    
    it('should get parent duration when child duration is not set', () => {
      const childAnimation = createAnimation();
      animation
        .addAnimation(childAnimation)
        .duration(500);
      
      expect(childAnimation.getDuration()).toEqual(500);
    });
    
    it('should get prefer child duration over parent duration', () => {
      const childAnimation = createAnimation();
      childAnimation.duration(500);
      
      animation
        .addAnimation(childAnimation)
        .duration(1000);
      
      expect(childAnimation.getDuration()).toEqual(500);
    });
    
    it('should get undefined when delay not set', () => {
      expect(animation.getDelay()).toEqual(undefined);
    });
    
    it('should get parent delay when child delay is not set', () => {
      const childAnimation = createAnimation();
      animation
        .addAnimation(childAnimation)
        .delay(500);
      
      expect(childAnimation.getDelay()).toEqual(500);
    });
    
    it('should get prefer child delay over parent delay', () => {
      const childAnimation = createAnimation();
      childAnimation.delay(500);
      
      animation
        .addAnimation(childAnimation)
        .delay(1000);
      
      expect(childAnimation.getDelay()).toEqual(500);
    });
    
    it('should get undefined when iterations not set', () => {
      expect(animation.getIterations()).toEqual(undefined);
    });
    
    it('should get parent iterations when child iterations is not set', () => {
      const childAnimation = createAnimation();
      animation
        .addAnimation(childAnimation)
        .iterations(2);
      
      expect(childAnimation.getIterations()).toEqual(2);
    });
    
    it('should get prefer child iterations over parent iterations', () => {
      const childAnimation = createAnimation();
      childAnimation.iterations(2);
      
      animation
        .addAnimation(childAnimation)
        .iterations(1);
      
      expect(childAnimation.getIterations()).toEqual(2);
    });    
    
    it('should get undefined when fill not set', () => {
      expect(animation.getFill()).toEqual(undefined);
    });
    
    it('should get parent fill when child fill is not set', () => {
      const childAnimation = createAnimation();
      animation
        .addAnimation(childAnimation)
        .fill('both');
      
      expect(childAnimation.getFill()).toEqual('both');
    });
    
    it('should get prefer child fill over parent fill', () => {
      const childAnimation = createAnimation();
      childAnimation.fill('none');
      
      animation
        .addAnimation(childAnimation)
        .fill('forwards');
      
      expect(childAnimation.getFill()).toEqual('none');
    });
    
    it('should get undefined when direction not set', () => {
      expect(animation.getDirection()).toEqual(undefined);
    });
    
    it('should get parent direction when child direction is not set', () => {
      const childAnimation = createAnimation();
      animation
        .addAnimation(childAnimation)
        .direction('alternate');
      
      expect(childAnimation.getDirection()).toEqual('alternate');
    });
    
    it('should get prefer child direction over parent direction', () => {
      const childAnimation = createAnimation();
      childAnimation.direction('alternate-reverse');
      
      animation
        .addAnimation(childAnimation)
        .direction('normal');
      
      expect(childAnimation.getDirection()).toEqual('alternate-reverse');
    });

  })
});