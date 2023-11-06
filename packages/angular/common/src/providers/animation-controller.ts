import type {
  Animation,
  createAnimation as _createAnimation,
  getTimeGivenProgression as _getTimeGivenProgression,
} from '@ionic/core/components';

export class AnimationController {
  constructor(
    private createAnimation: typeof _createAnimation,
    private getTimeGivenProgression: typeof _getTimeGivenProgression
  ) {}

  /**
   * Create a new animation
   */
  create(animationId?: string): Animation {
    return this.createAnimation(animationId);
  }

  /**
   * EXPERIMENTAL
   *
   * Given a progression and a cubic bezier function,
   * this utility returns the time value(s) at which the
   * cubic bezier reaches the given time progression.
   *
   * If the cubic bezier never reaches the progression
   * the result will be an empty array.
   *
   * This is most useful for switching between easing curves
   * when doing a gesture animation (i.e. going from linear easing
   * during a drag, to another easing when `progressEnd` is called)
   */
  easingTime(p0: number[], p1: number[], p2: number[], p3: number[], progression: number): number[] {
    return this.getTimeGivenProgression(p0, p1, p2, p3, progression);
  }
}
