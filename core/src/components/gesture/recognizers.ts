
export class PanRecognizer {

  private startX!: number;
  private startY!: number;

  private dirty = false;
  private threshold: number;
  private maxCosine: number;
  private isDirX: boolean;
  private isPan = 0;

  constructor(direction: string, threshold: number, maxAngle: number) {
    const radians = maxAngle * (Math.PI / 180);
    this.isDirX = direction === 'x';
    this.maxCosine = Math.cos(radians);
    this.threshold = threshold * threshold;
  }

  start(x: number, y: number) {
    this.startX = x;
    this.startY = y;
    this.isPan = 0;
    this.dirty = true;
  }

  detect(x: number, y: number): boolean {
    if (!this.dirty) {
      return false;
    }

    const deltaX = (x - this.startX);
    const deltaY = (y - this.startY);
    const distance = deltaX * deltaX + deltaY * deltaY;

    if (distance < this.threshold) {
      return false;
    }
    const hypotenuse = Math.sqrt(distance);
    const cosine = ((this.isDirX) ? deltaX : deltaY) / hypotenuse;

    if (cosine > this.maxCosine) {
      this.isPan = 1;

    } else if (cosine < -this.maxCosine) {
      this.isPan = -1;

    } else {
      this.isPan = 0;
    }

    this.dirty = false;
    return true;
  }

  isGesture(): boolean {
    return this.isPan !== 0;
  }

  getDirection(): number {
    return this.isPan;
  }
}
