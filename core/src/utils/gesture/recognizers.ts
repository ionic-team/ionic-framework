
export interface PanRecognizer {
  start(x: number, y: number): void;
  detect(x: number, y: number): boolean;
  isGesture(): boolean;
  getDirection(): number;
}

export const createPanRecognizer = (direction: string, thresh: number, maxAngle: number): PanRecognizer => {
  const radians = maxAngle * (Math.PI / 180);
  const isDirX = direction === 'x';
  const isDirUndefined = direction === undefined;
  const maxCosine = Math.cos(radians);
  const threshold = thresh * thresh;

  let startX = 0;
  let startY = 0;

  let dirty = false;
  let isPan = 0;

  return {
    start(x: number, y: number) {
      startX = x;
      startY = y;
      isPan = 0;
      dirty = true;
    },

    detect(x: number, y: number): boolean {
      if (!dirty) {
        return false;
      }

      const deltaX = (x - startX);
      const deltaY = (y - startY);
      const distance = deltaX * deltaX + deltaY * deltaY;

      if (distance < threshold) {
        return false;
      }
      const hypotenuse = Math.sqrt(distance);
      
      if(isDirUndefined) {
        pan = distance > 0 ? 1 : 0; // Could do the calculation with the bigger Dx or Dy
        /* 
          (WARNING): Pan the way it's used does not make sense since it does not have an X or Y element and just represents the chosen direction.
          This change has the potential to be breaking for users who actually un-ironically use undefined for 'y', or if the base of
          Ionic made that mistake anywhere.
          (DOCS): undefined is now actually an option just like in the docs.
          (PERF): Instead of creating 2 `createGesture`'s you can use one. (for people who need an X&Y draggable item) 
        */
        dirty = false;
        return true;
      }
      
      const cosine = (isDirX ? deltaX : deltaY) / hypotenuse;

      if (cosine > maxCosine) {
        isPan = 1;

      } else if (cosine < -maxCosine) {
        isPan = -1;

      } else {
        isPan = 0;
      }

      dirty = false;
      return true;
    },

    isGesture(): boolean {
      return isPan !== 0;
    },

    getDirection(): number {
      return isPan;
    }
  };
};
