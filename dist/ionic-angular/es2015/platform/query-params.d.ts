/**
 * @hidden
 */
export declare class QueryParams {
    data: {
        [key: string]: any;
    };
    parseUrl(url: string): void;
    get(key: string): any;
}
