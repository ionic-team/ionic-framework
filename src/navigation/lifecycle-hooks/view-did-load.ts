/**
 * @hidden
 * ionViewDidLoad interface
 */
export interface ViewDidLoad {
    /**
     * @function ionViewDidLoad
     * @description
     * Runs when the page has loaded. This event only happens once per page being created. If a page leaves but is cached, then this event will not fire again on a subsequent viewing. The ionViewDidLoad event is good place to put your setup code for the page.
     */
    ionViewDidLoad(): void;
}
