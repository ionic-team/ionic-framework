import * as Hammer from 'hammerjs';

export enum GestureDirection {
  ALL = <number> Hammer.DIRECTION_ALL,
  DOWN = <number> Hammer.DIRECTION_DOWN,
  HORIZONTAL = <number> Hammer.DIRECTION_HORIZONTAL,
  LEFT = <number> Hammer.DIRECTION_LEFT,
  NONE = <number> Hammer.DIRECTION_NONE,
  RIGHT = <number> Hammer.DIRECTION_RIGHT,
  UP = <number> Hammer.DIRECTION_UP,
  VERTICAL = <number> Hammer.DIRECTION_VERTICAL
};
