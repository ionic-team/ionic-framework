import { createAnimation } from '../animation';
import type { Animation } from '../animation-interface';
import { processKeyframes } from '../animation-utils';
import { getTimeGivenProgression } from '../cubic-bezier';

describe('Animation Class', () => {
  describe('progressEnd callbacks', () => {
    test('coerced state should be reset before onFinish runs', (done) => {
      const el = document.createElement('div');
      const animation = createAnimation()
        .addElement(el)
        .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
        .duration(50);

      animation
        .onFinish(() => {
          expect(animation.getDirection()).toBe('normal');
          expect(animation.getDuration()).toBe(50);
          done();
        })
        .progressEnd(0, 0.5, 10);
    });
  });
  describe('play()', () => {
    it('should resolve when the animation is cancelled', async () => {
      // Tell Jest to expect 1 assertion for async code
      expect.assertions(1);
      const el = document.createElement('div');
      const animation = createAnimation()
        .addElement(el)
        .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
        .duration(100000);

      const animationPromise = animation.play();

      animation.stop();

      // Expect that the promise resolves and returns undefined
      expect(animationPromise).resolves.toEqual(undefined);
    });
  });
  describe('isRunning()', () => {
    let animation: Animation;
    beforeEach(() => {
      animation = createAnimation();
    });

    it('should not be running initially', () => {
      expect(animation.isRunning()).toEqual(false);
    });

    it('should not be running due to not having keyframes', () => {
      animation.play();
      expect(animation.isRunning()).toEqual(false);
    });

    it('should be running', () => {
      const el = document.createElement('div');
      animation.addElement(el);
      animation.keyframes([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0)', opacity: 0, offset: 1 },
      ]);
      animation.duration(250);

      animation.play();
      expect(animation.isRunning()).toEqual(true);
    });

    it('should not be running after finishing the animation', async () => {
      const el = document.createElement('div');
      animation.addElement(el);
      animation.keyframes([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0)', opacity: 0, offset: 1 },
      ]);
      animation.duration(250);

      await animation.play();

      expect(animation.isRunning()).toEqual(false);
    });

    it('should not be running after calling pause', () => {
      const el = document.createElement('div');
      animation.addElement(el);
      animation.keyframes([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0)', opacity: 0, offset: 1 },
      ]);
      animation.duration(250);

      animation.play();
      expect(animation.isRunning()).toEqual(true);

      animation.pause();
      expect(animation.isRunning()).toEqual(false);
    });

    it('should not be running when doing progress steps', () => {
      const el = document.createElement('div');
      animation.addElement(el);
      animation.keyframes([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0)', opacity: 0, offset: 1 },
      ]);
      animation.duration(250);

      animation.play();

      animation.progressStart();

      expect(animation.isRunning()).toEqual(false);
    });

    it('should be running after calling progressEnd', () => {
      const el = document.createElement('div');
      animation.addElement(el);
      animation.keyframes([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0)', opacity: 0, offset: 1 },
      ]);
      animation.duration(250);

      animation.play();

      animation.progressStart();
      animation.progressEnd(1, 0);

      expect(animation.isRunning()).toEqual(true);
    });

    it('should not be running after playing to beginning', async () => {
      const el = document.createElement('div');
      animation.addElement(el);
      animation.keyframes([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0)', opacity: 0, offset: 1 },
      ]);
      animation.duration(250);

      await animation.play();

      animation.progressStart();
      animation.progressEnd(0, 0);

      await new Promise<void>((resolve) => {
        animation.onFinish(() => {
          expect(animation.isRunning()).toEqual(false);
          resolve();
        });
      });
    });
  });

  describe('addElement()', () => {
    let animation: Animation;
    beforeEach(() => {
      animation = createAnimation();
    });

    it('should add 1 element', () => {
      const el = document.createElement('p');
      animation.addElement(el);

      expect(animation.elements.length).toEqual(1);
    });

    it('should add multiple elements', () => {
      const els = [document.createElement('p'), document.createElement('p'), document.createElement('p')];

      animation.addElement(els);

      expect(animation.elements.length).toEqual(els.length);
    });

    it('should not error when trying to add null or undefined', () => {
      const el = document.createElement('p');
      animation.addElement(el);

      animation.addElement(null as any);
      animation.addElement(undefined as any);

      expect(animation.elements.length).toEqual(1);
    });
  });

  describe('addAnimation()', () => {
    let animation: Animation;
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
      animation.addAnimation(null as any);
      animation.addAnimation(undefined as any);

      expect(animation.childAnimations.length).toEqual(0);
    });
  });

  describe('Animation Keyframes', () => {
    let animation: Animation;
    beforeEach(() => {
      animation = createAnimation();
    });

    it('should generate a keyframe', () => {
      animation.keyframes([
        { transform: 'scale(1)', opacity: 1, offset: 0 },
        { transform: 'scale(0.5)', opacity: 0.5, offset: 0.5 },
        { transform: 'scale(0)', opacity: 0, offset: 1 },
      ]);

      expect(animation.getKeyframes().length).toEqual(3);
    });

    it('should convert properties for CSS Animations', () => {
      const processedKeyframes = processKeyframes([
        { borderRadius: '0px', easing: 'ease-in', offset: 0 },
        { borderRadius: '4px', easing: 'ease-out', offset: 1 },
      ]);

      expect(processedKeyframes).toEqual([
        { 'border-radius': '0px', 'animation-timing-function': 'ease-in', offset: 0 },
        { 'border-radius': '4px', 'animation-timing-function': 'ease-out', offset: 1 },
      ]);
    });

    it('should set the from keyframe properly', () => {
      animation.from('opacity', 0).from('background', 'red').from('color', 'purple');

      const keyframes = animation.getKeyframes();

      expect(keyframes.length).toEqual(1);
      expect(keyframes[0]).toEqual({
        opacity: 0,
        color: 'purple',
        background: 'red',
        offset: 0,
      });
    });

    it('should set the to keyframe properly', () => {
      animation.to('opacity', 0).to('background', 'red').to('color', 'purple');

      const keyframes = animation.getKeyframes();
      expect(keyframes.length).toEqual(1);
      expect(keyframes[0]).toEqual({
        opacity: 0,
        color: 'purple',
        background: 'red',
        offset: 1,
      });
    });

    it('should mix keyframes and fromTo properly', () => {
      animation
        .keyframes([
          { offset: 0, background: 'red' },
          { offset: 0.99, background: 'blue' },
          { offset: 1, background: 'green' },
        ])
        .fromTo('opacity', 0, 1);

      const keyframes = animation.getKeyframes();
      expect(keyframes.length).toEqual(3);
      expect(keyframes[0]).toEqual({
        opacity: 0,
        background: 'red',
        offset: 0,
      });

      expect(keyframes[1]).toEqual({
        background: 'blue',
        offset: 0.99,
      });

      expect(keyframes[2]).toEqual({
        opacity: 1,
        background: 'green',
        offset: 1,
      });
    });
  });

  describe('Animation Config Methods', () => {
    let animation: Animation;
    beforeEach(() => {
      animation = createAnimation();
    });

    it('should get "linear" when easing not set', () => {
      expect(animation.getEasing()).toEqual('linear');
    });

    it('should get parent easing when child easing is not set', () => {
      const childAnimation = createAnimation();
      animation.addAnimation(childAnimation).easing('ease-in-out');

      expect(childAnimation.getEasing()).toEqual('ease-in-out');
    });

    it('should get prefer child easing over parent easing', () => {
      const childAnimation = createAnimation();
      childAnimation.easing('linear');

      animation.addAnimation(childAnimation).easing('ease-in-out');

      expect(childAnimation.getEasing()).toEqual('linear');
    });

    it('should get linear easing when forceLinear is set', () => {
      animation.easing('ease-in-out');

      animation.progressStart(true);
      expect(animation.getEasing()).toEqual('linear');

      animation.progressEnd(0, 0);
      expect(animation.getEasing()).toEqual('ease-in-out');
    });

    it('should get 0 when duration not set', () => {
      expect(animation.getDuration()).toEqual(0);
    });

    it('should get parent duration when child duration is not set', () => {
      const childAnimation = createAnimation();
      animation.addAnimation(childAnimation).duration(500);

      expect(childAnimation.getDuration()).toEqual(500);
    });

    it('should get prefer child duration over parent duration', () => {
      const childAnimation = createAnimation();
      childAnimation.duration(500);

      animation.addAnimation(childAnimation).duration(1000);

      expect(childAnimation.getDuration()).toEqual(500);
    });

    it('should get 0 when delay not set', () => {
      expect(animation.getDelay()).toEqual(0);
    });

    it('should get parent delay when child delay is not set', () => {
      const childAnimation = createAnimation();
      animation.addAnimation(childAnimation).delay(500);

      expect(childAnimation.getDelay()).toEqual(500);
    });

    it('should get prefer child delay over parent delay', () => {
      const childAnimation = createAnimation();
      childAnimation.delay(500);

      animation.addAnimation(childAnimation).delay(1000);

      expect(childAnimation.getDelay()).toEqual(500);
    });

    it('should get 1 when iterations not set', () => {
      expect(animation.getIterations()).toEqual(1);
    });

    it('should get parent iterations when child iterations is not set', () => {
      const childAnimation = createAnimation();
      animation.addAnimation(childAnimation).iterations(2);

      expect(childAnimation.getIterations()).toEqual(2);
    });

    it('should get prefer child iterations over parent iterations', () => {
      const childAnimation = createAnimation();
      childAnimation.iterations(2);

      animation.addAnimation(childAnimation).iterations(1);

      expect(childAnimation.getIterations()).toEqual(2);
    });

    it('should get "both" when fill not set', () => {
      expect(animation.getFill()).toEqual('both');
    });

    it('should get parent fill when child fill is not set', () => {
      const childAnimation = createAnimation();
      animation.addAnimation(childAnimation).fill('both');

      expect(childAnimation.getFill()).toEqual('both');
    });

    it('should get prefer child fill over parent fill', () => {
      const childAnimation = createAnimation();
      childAnimation.fill('none');

      animation.addAnimation(childAnimation).fill('forwards');

      expect(childAnimation.getFill()).toEqual('none');
    });

    it('should get "normal" when direction not set', () => {
      expect(animation.getDirection()).toEqual('normal');
    });

    it('should get parent direction when child direction is not set', () => {
      const childAnimation = createAnimation();
      animation.addAnimation(childAnimation).direction('alternate');

      expect(childAnimation.getDirection()).toEqual('alternate');
    });

    it('should get prefer child direction over parent direction', () => {
      const childAnimation = createAnimation();
      childAnimation.direction('alternate-reverse');

      animation.addAnimation(childAnimation).direction('normal');

      expect(childAnimation.getDirection()).toEqual('alternate-reverse');
    });
  });
});

describe('cubic-bezier conversion', () => {
  describe('should properly get a time value (x value) given a progression value (y value)', () => {
    it('cubic-bezier(0.32, 0.72, 0, 1)', () => {
      const equation = [
        [0, 0],
        [0.32, 0.72],
        [0, 1],
        [1, 1],
      ];

      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.5), [
        0.16,
      ]);
      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.97), [
        0.56,
      ]);
      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.33), [
        0.11,
      ]);
    });

    it('cubic-bezier(1, 0, 0.68, 0.28)', () => {
      const equation = [
        [0, 0],
        [1, 0],
        [0.68, 0.28],
        [1, 1],
      ];

      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.08), [
        0.6,
      ]);
      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.5), [
        0.84,
      ]);
      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.94), [
        0.98,
      ]);
    });

    it('cubic-bezier(0.4, 0, 0.6, 1)', () => {
      const equation = [
        [0, 0],
        [0.4, 0],
        [0.6, 1],
        [1, 1],
      ];

      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.39), [
        0.43,
      ]);
      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.03), [
        0.11,
      ]);
      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.89), [
        0.78,
      ]);
    });

    it('cubic-bezier(0, 0, 0.2, 1)', () => {
      const equation = [
        [0, 0],
        [0, 0],
        [0.2, 1],
        [1, 1],
      ];

      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.95), [
        0.71,
      ]);
      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.1), [
        0.03,
      ]);
      shouldApproximatelyEqual(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 0.7), [
        0.35,
      ]);
    });

    it('cubic-bezier(0.32, 0.72, 0, 1) (with out of bounds progression)', () => {
      const equation = [
        [0, 0],
        [0.05, 0.2],
        [0.14, 1.72],
        [1, 1],
      ];

      expect(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 1.32)[0]).toBeUndefined();
      expect(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], -0.32)[0]).toBeUndefined();
    });

    it('cubic-bezier(0.21, 1.71, 0.88, 0.9) (multiple solutions)', () => {
      const equation = [
        [0, 0],
        [0.21, 1.71],
        [0.88, 0.9],
        [1, 1],
      ];

      shouldApproximatelyEqual(
        getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 1.02),
        [0.35, 0.87]
      );
    });

    it('cubic-bezier(0.32, 0.72, 0, 1) (with out of bounds progression)', () => {
      const equation = [
        [0, 0],
        [0.05, 0.2],
        [0.14, 1.72],
        [1, 1],
      ];

      expect(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], 1.32)).toEqual([]);
      expect(getTimeGivenProgression(equation[0], equation[1], equation[2], equation[3], -0.32)).toEqual([]);
    });
  });
});

const shouldApproximatelyEqual = (givenValues: number[], expectedValues: number[]): void => {
  givenValues.forEach((givenValue, i) => {
    expect(Math.abs(expectedValues[i] - givenValue)).toBeLessThanOrEqual(0.01);
  });
};
