/**
 * @hidden
 * ionViewCanEnter interface
 */
export interface ViewCanEnter {
    /**
     * @function ionViewCanEnter
     * @description
     * Runs before the view can enter. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can enter
     */
    ionViewCanEnter(): boolean | Promise <boolean|void> ;
}
