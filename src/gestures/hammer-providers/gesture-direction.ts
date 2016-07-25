import * as hammer from 'hammerjs';

export enum GestureDirection {
  ALL = <number> hammer.DIRECTION_ALL,
  DOWN = <number> hammer.DIRECTION_DOWN,
  HORIZONTAL = <number> hammer.DIRECTION_HORIZONTAL,
  LEFT = <number> hammer.DIRECTION_LEFT,
  NONE = <number> hammer.DIRECTION_NONE,
  RIGHT = <number> hammer.DIRECTION_RIGHT,
  UP = <number> hammer.DIRECTION_UP,
  VERTICAL = <number> hammer.DIRECTION_VERTICAL
};
