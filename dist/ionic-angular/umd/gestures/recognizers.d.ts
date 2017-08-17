import { PointerCoordinates } from '../util/dom';
export declare class PanRecognizer {
    private direction;
    private startCoord;
    private dirty;
    private threshold;
    private maxCosine;
    private _angle;
    private _isPan;
    constructor(direction: string, threshold: number, maxAngle: number);
    start(coord: PointerCoordinates): void;
    detect(coord: PointerCoordinates): boolean;
    angle(): any;
    pan(): number;
}
