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
  
/*
  describe('Before and After Animation Methods', () => {
    let animation;
    beforeEach(() => {
      animation = createAnimation();
    });
    
    it.only('should register all "before" styles', () => {
      animation.beforeStyles({ 'background': 'red', 'opacity': 1 });
      
      console.log(animation)
      
      expect(Object.keys(animation.beforeStylesValue).length).toEqual(2);
    });
    
    it('should register all "before" classes given arrays', () => {
      const classesToAdd = ['my-class', 'hello-world'];
      const classesToRemove = ['ionic-framework'];
      
      animation = animation.beforeAddClass(classesToAdd);
      animation = animation.beforeRemoveClass(classesToRemove);
      
      expect(animation.beforeAddClasses.length).toEqual(classesToAdd.length);
      expect(animation.beforeRemoveClasses.length).toEqual(classesToRemove.length);
    });
    
    it('should register all "before" classes given strings', () => {
      const classesToAdd = 'my-class';
      const classesToRemove = 'ionic-framework';
      
      animation = animation.beforeAddClass(classesToAdd);
      animation = animation.beforeRemoveClass(classesToRemove);
      
      expect(animation.beforeAddClasses.length).toEqual(1);
      expect(animation.beforeRemoveClasses.length).toEqual(1);
    });
    
    it('should not register "before" classes given undefined', () => {
      animation = animation.beforeAddClass(undefined);
      animation = animation.beforeRemoveClass(undefined);
      
      expect(animation.beforeAddClasses.length).toEqual(0);
      expect(animation.beforeRemoveClasses.length).toEqual(0);
    });
    
    it('should apply all "before" styles', () => {
      const el = document.createElement('div');
      el.classList.add('hello', 'world');
      el.style.setProperty('opacity', "0.5");
      
      animation
        .addElement(el)
        .beforeAddClass(['ionic', 'framework'])
        .beforeStyles({ 'background': 'blue' })
        .beforeClearStyles(['opacity'])
        .beforeRemoveClass('hello');
        
      expect(el.style.getPropertyValue('opacity')).toEqual("0.5");
      expect(el.classList.contains('hello')).toEqual(true);
      expect(el.classList.contains('world')).toEqual(true);
      
      animation.play();
      
      expect(el.style.getPropertyValue('opacity')).toEqual("");
      expect(el.style.getPropertyValue('background')).toEqual('blue');
      expect(el.classList.contains('hello')).toEqual(false);
      expect(el.classList.contains('world')).toEqual(true);
      expect(el.classList.contains('ionic')).toEqual(true);
      expect(el.classList.contains('framework')).toEqual(true);
    });
    
    it('should register all "after" styles', () => {
      animation = animation.afterStyles({ 'background': 'red', 'opacity': 1 });
      expect(Object.keys(animation.afterStylesValue).length).toEqual(2);
    });
    
    it('should register all "after" classes given arrays', () => {
      const classesToAdd = ['my-class', 'hello-world'];
      const classesToRemove = ['ionic-framework'];
      
      animation = animation.afterAddClass(classesToAdd);
      animation = animation.afterRemoveClass(classesToRemove);
      
      expect(animation.afterAddClasses.length).toEqual(classesToAdd.length);
      expect(animation.afterRemoveClasses.length).toEqual(classesToRemove.length);
    });
    
    it('should register all "after" classes given strings', () => {
      const classesToAdd = 'my-class';
      const classesToRemove = 'ionic-framework';
      
      animation = animation.afterAddClass(classesToAdd);
      animation = animation.afterRemoveClass(classesToRemove);
      
      expect(animation.afterAddClasses.length).toEqual(1);
      expect(animation.afterRemoveClasses.length).toEqual(1);
    });
    
    it('should not register "after" classes given undefined', () => {
      animation = animation.afterAddClass(undefined);
      animation = animation.afterRemoveClass(undefined);
      
      expect(animation.afterAddClasses.length).toEqual(0);
      expect(animation.afterRemoveClasses.length).toEqual(0);
    });    
    
    it('should apply all "after" styles', async () => {
      const el = document.createElement('div');
      el.classList.add('hello', 'world');
      el.style.setProperty('opacity', "0.5");
      
      animation
        .name('my-animation')
        .addElement(el)
        .duration(500)
        .keyframes([
          { transform: 'scale(1) rotate(0deg)', opacity: 1, offset: 0 },
          { transform: 'scale(0.5) rotate(-45deg)', opacity: 0.5, offset: 0.5 },
          { transform: 'scale(1) rotate(0deg)', opacity: 1, offset: 1 }
        ])
        .afterAddClass(['ionic', 'framework'])
        .afterStyles({ 'background': 'blue' })
        .afterClearStyles(['opacity'])
        .afterRemoveClass('hello');
        
      expect(el.style.getPropertyValue('opacity')).toEqual("0.5");
      expect(el.classList.contains('hello')).toEqual(true);
      expect(el.classList.contains('world')).toEqual(true);
      
      animation.play();
      
      /**
       * Animations don't run in spec tests
       * so we have to fake the end of the animation
       */
     /* const ev = new CustomEvent('animationend');
      el.dispatchEvent(ev);
      
      expect(el.style.getPropertyValue('opacity')).toEqual("");
      expect(el.style.getPropertyValue('background')).toEqual('blue');
      expect(el.classList.contains('hello')).toEqual(false);
      expect(el.classList.contains('world')).toEqual(true);
      expect(el.classList.contains('ionic')).toEqual(true);
      expect(el.classList.contains('framework')).toEqual(true);

    });
  });
*/
  
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