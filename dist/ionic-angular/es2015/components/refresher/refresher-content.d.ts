import { Config } from '../../config/config';
import { Refresher } from './refresher';
/**
 * @hidden
 */
export declare class RefresherContent {
    r: Refresher;
    private _config;
    /**
     * @input {string} a static icon to display when you begin to pull down
     */
    pullingIcon: string;
    /**
     * @input {string} the text you want to display when you begin to pull down
     */
    pullingText: string;
    /**
     * @input {string} An animated SVG spinner that shows when refreshing begins
     */
    refreshingSpinner: string;
    /**
     * @input {string} the text you want to display when performing a refresh
     */
    refreshingText: string;
    constructor(r: Refresher, _config: Config);
    /**
     * @hidden
     */
    ngOnInit(): void;
}
