export declare class Simulate {
    private index;
    private points;
    timedelta: number;
    static from(x: any, y?: number): Simulate;
    reset(): Simulate;
    start(x: any, y?: number): Simulate;
    to(x: any, y?: number): Simulate;
    delta(x: any, y?: number): Simulate;
    deltaPolar(angle: number, distance: number): Simulate;
    toPolar(angle: number, distance: number): Simulate;
    duration(duration: number): Simulate;
    velocity(vel: number): Simulate;
    swipeRight(maxAngle: number, distance: number): Simulate;
    swipeLeft(maxAngle: number, distance: number): Simulate;
    swipeTop(maxAngle: number, distance: number): Simulate;
    swipeBottom(maxAngle: number, distance: number): Simulate;
    run(callback: Function): this;
    private newPoint(coord, duration);
    private getLastPoint();
    private getPreviousPoint();
}
