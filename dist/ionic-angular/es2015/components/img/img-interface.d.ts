export interface Img {
    top: number;
    bottom: number;
    canRender: boolean;
    canRequest: boolean;
    reset(): void;
    update(): void;
}
