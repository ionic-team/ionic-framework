import { EventEmitter } from '@angular/core';
/**
 * @name SegmentButton
 * @description
 * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
 *
 * @usage
 *
 * ```html
 * <ion-content>
 *   <!-- Segment buttons with icons -->
 *   <ion-segment [(ngModel)]="icons" color="secondary">
 *     <ion-segment-button value="camera">
 *       <ion-icon name="camera"></ion-icon>
 *     </ion-segment-button>
 *     <ion-segment-button value="bookmark">
 *       <ion-icon name="bookmark"></ion-icon>
 *     </ion-segment-button>
 *   </ion-segment>
 *
 *   <!-- Segment buttons with text -->
 *   <ion-segment [(ngModel)]="relationship" color="primary">
 *     <ion-segment-button value="friends" (ionSelect)="selectedFriends()">
 *       Friends
 *     </ion-segment-button>
 *     <ion-segment-button value="enemies" (ionSelect)="selectedEnemies()">
 *       Enemies
 *     </ion-segment-button>
 *   </ion-segment>
 * </ion-content>
 * ```
 *
 *
 * @demo /docs/demos/src/segment/
 * @see {@link /docs/components#segment Segment Component Docs}
 * @see {@link /docs/api/components/segment/Segment/ Segment API Docs}
 */
export declare class SegmentButton {
    isActive: boolean;
    _disabled: boolean;
    /**
     * @input {string} the value of the segment button. Required.
     */
    value: string;
    /**
     * @output {SegmentButton} Emitted when a segment button has been clicked.
     */
    ionSelect: EventEmitter<SegmentButton>;
    /**
     * @input {boolean} If true, the user cannot interact with this element.
     */
    disabled: boolean;
    constructor();
    /**
     * @hidden
     * On click of a SegmentButton
     */
    onClick(): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
}
