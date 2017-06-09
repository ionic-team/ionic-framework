/**
 * @hidden
 * ionViewCanLeave interface
 */
export interface ViewCanLeave {
    /**
     * @function ionViewCanLeave
     * @description
     * Runs before the view can leave. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can leave
     */
    ionViewCanLeave(): boolean | Promise <boolean|void> ;
}
