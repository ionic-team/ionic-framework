import { PointerCoordinates } from '../util/dom';


export class PanRecognizer {

  private startCoord: PointerCoordinates;
  private dirty: boolean = false;
  private threshold: number;
  private maxCosine: number;

  private _angle: any = 0;
  private _isPan: number = 0;

  constructor(private direction: string, threshold: number, maxAngle: number) {
    const radians = maxAngle * (Math.PI / 180);
    this.maxCosine = Math.cos(radians);
    this.threshold = threshold * threshold;
  }

  start(coord: PointerCoordinates) {
    this.startCoord = coord;
    this._angle = 0;
    this._isPan = 0;
    this.dirty = true;
  }

  detect(coord: PointerCoordinates): boolean {
    if (!this.dirty) {
      return false;
    }
    const deltaX = (coord.x - this.startCoord.x);
    const deltaY = (coord.y - this.startCoord.y);
    const distance = deltaX * deltaX + deltaY * deltaY;

    if (distance >= this.threshold) {
      var angle = Math.atan2(deltaY, deltaX);
      var cosine = (this.direction === 'y')
        ? Math.sin(angle)
        : Math.cos(angle);

      this._angle = angle;
      if (cosine > this.maxCosine) {
        this._isPan = 1;
      } else if (cosine < -this.maxCosine) {
        this._isPan = -1;
      } else {
        this._isPan = 0;
      }
      this.dirty = false;
      return true;
    }
    return false;
  }

  angle(): any {
    return this._angle;
  }

  pan(): number {
    return this._isPan;
  }
}
