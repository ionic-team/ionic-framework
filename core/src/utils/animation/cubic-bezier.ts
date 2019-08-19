/**
 * Based on:
 * https://stackoverflow.com/questions/7348009/y-coordinate-for-a-given-x-cubic-bezier
 * https://math.stackexchange.com/questions/26846/is-there-an-explicit-form-for-cubic-b%C3%A9zier-curves
 * TODO: Increase precision
 */

export class Point {
  constructor(public x: number, public y: number) {}
}

/**
 * Given a cubic-bezier curve, get the x value (time) given
 * the y value (progression).
 * Ex: cubic-bezier(0.32, 0.72, 0, 1);
 * P0: (0, 0)
 * P1: (0.32, 0.72)
 * P2: (0, 1)
 * P3: (1, 1)
 */
export const getTimeGivenProgression = (p0: Point, p1: Point, p2: Point, p3: Point, progression: number) => {
  const tValues = solveCubicBezier(p0.y, p1.y, p2.y, p3.y, progression);
  return solveCubicBezierParametricEquation(p0.x, p1.x, p2.x, p3.x, tValues[0]); // TODO: Add better strategy for dealing with multiple solutions
};

/**
 * Solve the parametric form of a cubic bezier for x(t) or y(t)
 */
const solveCubicBezierParametricEquation = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const partA = (3 * p1) * Math.pow(t - 1, 2);
  const partB = (-3 * p2 * t) + (3 * p2) + (p3 * t);
  const partC = p0 * Math.pow(t - 1, 3);

  return t * (partA + (t * partB)) - partC;
};

const solveCubicBezier = (p0: number, p1: number, p2: number, p3: number, refPoint: number): number[] => {
  p0 -= refPoint;
  p1 -= refPoint;
  p2 -= refPoint;
  p3 -= refPoint;

  const roots = solveCubicEquation(
    p3 - 3 * p2 + 3 * p1 - p0,
    3 * p2 - 6 * p1 + 3 * p0,
    3 * p1 - 3 * p0,
    p0
  );

  return roots.filter(root => root >= 0 && root <= 1);
};

const solveQuadraticEquation = (a: number, b: number, c: number) => {
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return [];
  } else {
    return [
      (-b + Math.sqrt(discriminant)) / (2 * a),
      (-b - Math.sqrt(discriminant)) / (2 * a)
    ];
  }
};

const solveCubicEquation = (a: number, b: number, c: number, d: number) => {
  if (a === 0) { return solveQuadraticEquation(b, c, d); }

  b /= a;
  c /= a;
  d /= a;

  const p = (3 * c - b * b) / 3;
  const q = (2 * b * b * b - 9 * b * c + 27 * d) / 27;

  if (p === 0) {
    return [Math.pow(-q, 1 / 3)];
  } else if (q === 0) {
    return [Math.sqrt(-p), -Math.sqrt(-p)];
  } else {
    const discriminant = Math.pow(q / 2, 2) + Math.pow(p / 3, 3);

    if (discriminant === 0) {

      return [Math.pow(q / 2, 1 / 2) - b / 3];
    } else if (discriminant > 0) {

      return [Math.pow(-(q / 2) + Math.sqrt(discriminant), 1 / 3) - Math.pow((q / 2) + Math.sqrt(discriminant), 1 / 3) - b / 3];
    } else {
      const r = Math.sqrt(Math.pow(-(p / 3), 3));
      const phi = Math.acos(-(q / (2 * Math.sqrt(Math.pow(-(p / 3), 3)))));

      const s = 2 * Math.pow(r, 1 / 3);

      return [
        s * Math.cos(phi / 3) - b / 3,
        s * Math.cos((phi + 2 * Math.PI) / 3) - b / 3,
        s * Math.cos((phi + 4 * Math.PI) / 3) - b / 3
      ];
    }
  }
};
