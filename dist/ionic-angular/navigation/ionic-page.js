/**
 * \@name IonicPage
 * \@description
 * The Ionic Page handles registering and displaying specific pages based on URLs. It's used
 * underneath `NavController` so it will never have to be interacted with directly. When a new
 * page is pushed with `NavController`, the URL is updated to match the path to this page.
 *
 * Unlike traditional web apps, URLs don't dictate navigation in Ionic apps.
 * Instead, URLs help us link to specific pieces of content as a breadcrumb.
 * The current URL gets updated as we navigate, but we use the `NavController`
 * push and pop, or `NavPush` and `NavPop` to move around. This makes it much easier
 * to handle complicated nested navigation.
 *
 * We refer to our URL system as a deep link system instead of a router to encourage
 * Ionic developers to think of URLs as a breadcrumb rather than as the source of
 * truth in navigation. This encourages flexible navigation design and happy apps all
 * over the world.
 *
 *
 * \@usage
 *
 * The first step to setting up deep links is to add the page that should be
 * a deep link in the `IonicPageModule.forChild` import of the page's module.
 * For our examples, this will be `MyPage`:
 *
 * ```ts
 * \@NgModule({
 *   declarations: [
 *     MyPage
 *   ],
 *   imports: [
 *     IonicPageModule.forChild(MyPage)
 *   ],
 *   entryComponents: [
 *     MyPage
 *   ]
 * })
 * export class MyPageModule {}
 * ```
 *
 * Then, add the `\@IonicPage` decorator to the component. The most simple usage is adding an
 * empty decorator:
 *
 * ```ts
 * \@IonicPage()
 * \@Component({
 *   templateUrl: 'main.html'
 * })
 * export class MyPage {}
 * ```
 *
 * This will automatically create a link to the `MyPage` component using the same name as the class,
 * `name`: `'MyPage'`. The page can now be navigated to by using this name. For example:
 *
 * ```ts
 * \@Component({
 *   templateUrl: 'another-page.html'
 * })
 * export class AnotherPage {
 *   constructor(public navCtrl: NavController) {}
 *
 *   goToMyPage() {
 *     // go to the MyPage component
 *     this.navCtrl.push('MyPage');
 *   }
 * }
 * ```
 *
 * The `\@IonicPage` decorator accepts a `DeepLinkMetadataType` object. This object accepts
 * the following properties: `name`, `segment`, `defaultHistory`, and `priority`. All of them
 * are optional but can be used to create complex navigation links.
 *
 *
 * ### Changing Name
 *
 * As mentioned previously, the `name` property will be set to the class name if it isn't provided.
 * Changing the name of the link is extremely simple. To change the name used to link to the
 * component, simply pass it in the decorator like so:
 *
 * ```ts
 * \@IonicPage({
 *   name: 'my-page'
 * })
 * ```
 *
 * This will create a link to the `MyPage` component using the name `'my-page'`. Similar to the previous
 * example, the page can be navigated to by using the name:
 *
 * ```ts
 * goToMyPage() {
 *   // go to the MyPage component
 *   this.navCtrl.push('my-page');
 * }
 * ```
 *
 *
 * ### Setting URL Path
 *
 * The `segment` property is used to set the URL to the page. If this property isn't provided, the
 * `segment` will use the value of `name`. Since components can be loaded anywhere in the app, the
 * `segment` doesn't require a full URL path. When a page becomes the active page, the `segment` is
 * appended to the URL.
 *
 * The `segment` can be changed to anything and doesn't have to match the `name`. For example, passing
 * a value for `name` and `segment`:
 *
 * ```ts
 * \@IonicPage({
 *   name: 'my-page',
 *   segment: 'some-path'
 * })
 * ```
 *
 * When navigating to this page as the first page in the app, the URL will look something like:
 *
 * ```
 * http://localhost:8101/#/some-path
 * ```
 *
 * However, navigating to the page will still use the `name` like the previous examples do.
 *
 *
 * ### Dynamic Links
 *
 * The `segment` property is useful for creating dynamic links. Sometimes the URL isn't known ahead
 * of time, so it can be passed as a variable.
 *
 * Since passing data around is common practice in an app, it can be reflected in the app's URL by
 * using the `:param` syntax. For example, set the `segment` in the `\@IonicPage` decorator:
 *
 * ```ts
 * \@IonicPage({
 *   name: 'detail-page',
 *   segment: 'detail/:id'
 * })
 * ```
 *
 * In this case, when we `push` to a new instance of `'detail-page'`, the value of `id` will
 * in the `detailInfo` data being passed to `push` will replace `:id` in the URL.
 *
 * Important: The property needs to be something that can be converted into a string, objects
 * are not supported.
 *
 * For example, to push the `'detail-page'` in the `ListPage` component, the following code could
 * be used:
 *
 * ```ts
 * \@IonicPage({
 *   name: 'list'
 * })
 * export class ListPage {
 *   constructor(public navCtrl: NavController) {}
 *
 *   pushPage(detailInfo) {
 *     // Push an `id` to the `'detail-page'`
 *     this.navCtrl.push('detail-page', {
 *       'id': detailInfo.id
 *     })
 *   }
 * }
 * ```
 *
 * If the value of `detailInfo.id` is `12`, for example, the URL would end up looking like this:
 *
 * ```
 * http://localhost:8101/#/list/detail/12
 * ```
 *
 * Since this `id` will be used to pull in the data of the specific detail page, it's Important
 * that the `id` is unique.
 *
 * Note: Even though the `name` is `detail-page`, the `segment` uses `detail/:id`, and the URL
 * will use the `segment`.
 *
 *
 * ### Default History
 *
 * Pages can be navigated to using deep links from anywhere in the app, but sometimes the app is
 * launched from a URL and the page needs to have the same history as if it were navigated to from
 * inside of the app.
 *
 * By default, the page would be navigated to as the first page in the stack with no prior history.
 * A good example is the App Store on iOS. Clicking on a URL to an application in the App Store will
 * load the details of the application with no back button, as if it were the first page ever viewed.
 *
 * The default history of any page can be set in the `defaultHistory` property. This history will only
 * be used if the history doesn't already exist, meaning if you navigate to the page the history will
 * be the pages that were navigated from.
 *
 * The `defaultHistory` property takes an array of strings. For example, setting the history of the
 * detail page to the list page where the `name` is `list`:
 *
 * ```ts
 * \@IonicPage({
 *   name: 'detail-page',
 *   segment: 'detail/:id',
 *   defaultHistory: ['list']
 * })
 * ```
 *
 * In this example, if the app is launched at `http://localhost:8101/#/detail/my-detail` the displayed page
 * will be the `'detail-page'` with an id of `my-detail` and it will show a back button that goes back to
 * the `'list'` page.
 *
 * An example of an application with a set history stack is the Instagram application. Opening a link
 * to an image on Instagram will show the details for that image with a back button to the user's profile
 * page. There is no "right" way of setting the history for a page, it is up to the application.
 *
 * ### Priority
 *
 * The `priority` property is only used during preloading. By default, preloading is turned off so setting
 * this property would do nothing. Preloading eagerly loads all deep links after the application boots
 * instead of on demand as needed. To enable preloading, set `preloadModules` in the main application module
 * config to `true`:
 *
 * ```ts
 * \@NgModule({
 *   declarations: [
 *     MyApp
 *   ],
 *   imports: [
 *     BrowserModule,
 *     IonicModule.forRoot(MyApp, {
 *       preloadModules: true
 *     })
 *   ],
 *   bootstrap: [IonicApp],
 *   entryComponents: [
 *     MyApp
 *   ]
 * })
 * export class AppModule { }
 * ```
 *
 * If preloading is turned on, it will load the modules based on the value of `priority`. The following
 * values are possible for `priority`: `"high"`, `"low"`, and `"off"`. When there is no `priority`, it
 * will be set to `"low"`.
 *
 * All deep links with their priority set to `"high"` will be loaded first. Upon completion of loading the
 * `"high"` priority modules, all deep links with a priority of `"low"` (or no priority) will be loaded. If
 * the priority is set to `"off"` the link will not be preloaded. Setting the `priority` is as simple as
 * passing it to the `\@IonicPage` decorator:
 *
 * ```ts
 * \@IonicPage({
 *   name: 'my-page',
 *   priority: 'high'
 * })
 * ```
 *
 * We recommend setting the `priority` to `"high"` on the pages that will be viewed first when launching
 * the application.
 *
 * @param {?=} _config
 * @return {?}
 */
export function IonicPage(_config) {
    return function (clazz) {
        return clazz;
    };
}
//# sourceMappingURL=ionic-page.js.map