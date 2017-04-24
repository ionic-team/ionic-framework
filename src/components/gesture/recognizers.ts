

export class PanRecognizer {
  private startX: number;
  private startY: number;

  private dirty: boolean = false;
  private threshold: number;
  private maxCosine: number;

  private angle = 0;
  private isPan = 0;


  constructor(private direction: string, threshold: number, maxAngle: number) {
    const radians = maxAngle * (Math.PI / 180);
    this.maxCosine = Math.cos(radians);
    this.threshold = threshold * threshold;
  }

  start(x: number, y: number) {
    this.startX = x;
    this.startY = y;
    this.angle = 0;
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

    if (distance >= this.threshold) {
      var angle = Math.atan2(deltaY, deltaX);
      var cosine = (this.direction === 'y')
        ? Math.sin(angle)
        : Math.cos(angle);

      this.angle = angle;

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

    return false;
  }

  isGesture(): number {
    return this.isPan;
  }
}
