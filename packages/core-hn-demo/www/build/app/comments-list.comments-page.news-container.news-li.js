/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'comments-list.comments-page.news-container.news-li',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
var CommentsList = (function () {
    function CommentsList() {
    }
    CommentsList.prototype.render = function () {
        var items = this.type.map(function (comment) {
            return (h("ion-item", 0,
                h("ion-label", 0,
                    h("h2", 0, "Posted by " + comment.user + " " + comment.time_ago),
                    h("div", { "p": { "innerHTML": comment.content } }))));
        });
        return (h("ion-list", 0, items));
    };
    return CommentsList;
}());

var CommentsPage = (function () {
    function CommentsPage() {
    }
    CommentsPage.prototype.close = function () {
        Ionic.emit(this, 'ionDismiss');
    };
    CommentsPage.prototype.render = function () {
        return [
            h("ion-header", 0,
                h("ion-toolbar", { "a": { "color": 'primary' } },
                    h("ion-button", { "c": { "close-button": true }, "o": { "click": this.close.bind(this) }, "a": { "slot": 'start' }, "p": { "clear": true } },
                        h("ion-icon", { "s": { "color": 'white' }, "a": { "slot": 'icon-only', "name": 'close' } })),
                    h("ion-title", { "c": { "comments-title": true }, "a": { "slot": 'end' } }, t("Comments")))),
            h("ion-content", 0,
                h("comments-list", { "p": { "type": this.comments } }))
        ];
    };
    return CommentsPage;
}());

var NewsContainer = (function () {
    function NewsContainer() {
        this.stories = [];
        this.apiRootUrl = 'https://node-hnapi.herokuapp.com';
        this.page = 1;
        this.secondSelectedClass = false;
        this.thirdSelectedClass = false;
        this.fourthSelectedClass = false;
    }
    NewsContainer.prototype["componentWillLoad"] = function () {
        var _this = this;
        if (Ionic.isServer)
            return;
        this.firstSelectedClass = true;
        // call to firebase function for first view
        this.fakeFetch('https://us-central1-corehacker-10883.cloudfunctions.net/fetchNews').then(function (data) {
            _this.stories = data;
            _this.pageType = 'news';
        });
    };
    NewsContainer.prototype.fakeFetch = function (url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.addEventListener('load', function () {
                resolve(JSON.parse(this.responseText));
            });
            request.addEventListener('error', function () {
                reject("error: " + this.statusText + " / " + this.status);
            });
            request.open('GET', url, true);
            request.send();
        });
    };
    NewsContainer.prototype.getStories = function (type) {
        var _this = this;
        if (Ionic.isServer)
            return;
        // reset page number
        this.page = 1;
        // this is definitely not the best solution
        // working on something more elegant, but this
        // gets the job done for the moment
        switch (type) {
            case 'news':
                this.firstSelectedClass = true;
                this.secondSelectedClass = false;
                this.thirdSelectedClass = false;
                this.fourthSelectedClass = false;
                break;
            case 'show':
                this.secondSelectedClass = true;
                this.firstSelectedClass = false;
                this.thirdSelectedClass = false;
                this.fourthSelectedClass = false;
                break;
            case 'jobs':
                this.thirdSelectedClass = true;
                this.firstSelectedClass = false;
                this.fourthSelectedClass = false;
                this.secondSelectedClass = false;
                break;
            case 'ask':
                this.fourthSelectedClass = true;
                this.thirdSelectedClass = false;
                this.secondSelectedClass = false;
                this.firstSelectedClass = false;
                break;
        }
        Ionic.controller('loading', { content: "fetching " + type + " articles..." }).then(function (loading) {
            loading.present().then(function () {
                _this.fakeFetch(_this.apiRootUrl + "/" + type + "?page=1").then(function (data) {
                    _this.stories = data;
                    loading.dismiss();
                });
                _this.pageType = type;
            });
        });
    };
    NewsContainer.prototype.previous = function () {
        var _this = this;
        if (this.page > 1) {
            Ionic.controller('loading', { content: "fetching articles..." }).then(function (loading) {
                loading.present().then(function () {
                    _this.page = _this.page--;
                    console.log(_this.page--);
                    _this.fakeFetch(_this.apiRootUrl + "/" + _this.pageType + "?page=" + _this.page).then(function (data) {
                        _this.stories = data;
                        loading.dismiss();
                    });
                });
            });
        }
        else {
            window.navigator.vibrate(200);
        }
    };
    NewsContainer.prototype.next = function () {
        var _this = this;
        Ionic.controller('loading', { content: "fetching articles..." }).then(function (loading) {
            loading.present().then(function () {
                _this.page = _this.page++;
                console.log(_this.page++);
                _this.fakeFetch(_this.apiRootUrl + "/" + _this.pageType + "?page=" + _this.page).then(function (data) {
                    if (data.length !== 0) {
                        _this.stories = data;
                    }
                    loading.dismiss();
                });
            });
        });
    };
    NewsContainer.prototype["componentWillUpdate"] = function () {
        this.prevClass = this.page === 1 ? { 'no-back': true } : { 'yes-back': true };
    };
    NewsContainer.prototype.render = function () {
        var _this = this;
        console.log('rendering');
        return [
            h("ion-header", { "p": { "mdHeight": '56px', "iosHeight": '61px' } },
                h("ion-toolbar", { "a": { "color": 'primary' } },
                    h("img", { "c": { "ionic-icon": true }, "a": { "src": 'ionic.svg', "alt": 'ionic' } }),
                    h("div", { "c": { "tabs-bar": true } },
                        h("ion-button", { "c": { "header-button": true, "first-button": true, "header-button-selected": this.firstSelectedClass }, "o": { "click": function () { return _this.getStories('news'); } }, "p": { "clear": true } }, t("News")),
                        h("ion-button", { "c": { "header-button": true, "header-button-selected": this.secondSelectedClass }, "o": { "click": function () { return _this.getStories('show'); } }, "p": { "clear": true } }, t("Show")),
                        h("ion-button", { "c": { "header-button": true, "header-button-selected": this.thirdSelectedClass }, "o": { "click": function () { return _this.getStories('jobs'); } }, "p": { "clear": true } }, t("Jobs")),
                        h("ion-button", { "c": { "header-button": true, "header-button-selected": this.fourthSelectedClass }, "o": { "click": function () { return _this.getStories('ask'); } }, "p": { "clear": true } }, t("Ask"))))),
            h("ion-content", 0,
                h("news-list", { "p": { "type": this.stories } })),
            h("ion-footer", 0,
                h("ion-toolbar", { "c": { "pager": true } },
                    h("ion-buttons", { "a": { "slot": 'start' } },
                        h("ion-button", { "c": this.prevClass, "o": { "click": function () { return _this.previous(); } }, "p": { "clear": true } }, t("prev"))),
                    h("span", { "c": { "page-number": true } }, t("page "),
                        this.page),
                    h("ion-buttons", { "a": { "slot": 'end' } },
                        h("ion-button", { "o": { "click": function () { return _this.next(); } }, "a": { "color": 'primary' }, "p": { "clear": true } }, t("next")))))
        ];
    };
    return NewsContainer;
}());

var NewsList = (function () {
    function NewsList() {
        this.apiRootUrl = 'https://node-hnapi.herokuapp.com';
        this.fakeData = [];
    }
    NewsList.prototype.fakeFetch = function (url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.addEventListener('load', function () {
                resolve(JSON.parse(this.responseText));
            });
            request.addEventListener('error', function () {
                reject("error: " + this.statusText + " / " + this.status);
            });
            request.open('GET', url, true);
            request.send();
        });
    };
    NewsList.prototype.comments = function (story) {
        var _this = this;
        if (Ionic.isServer)
            return;
        Ionic.controller('loading', { content: 'fetching comments...' }).then(function (loading) {
            loading.present();
            _this.fakeFetch(_this.apiRootUrl + "/item/" + story.id).then(function (data) {
                setTimeout(function () {
                    loading.dismiss().then(function () {
                        Ionic.controller('modal', { component: 'comments-page', componentProps: { comments: data.comments, storyId: story.id } }).then(function (modal) {
                            console.log('modal created');
                            modal.present().then(function () {
                                console.log('modal finished transitioning in, commments: ', modal.componentProps.comments);
                            });
                        });
                    });
                }, 300);
            });
        });
    };
    NewsList.prototype.render = function () {
        var _this = this;
        if (this.type.length === 0) {
            return (h("ion-list", 0, Array.from(Array(10)).map(function () {
                return h("ion-item", 0,
                    h("div", { "c": { "points": true }, "a": { "slot": 'start' } },
                        h("ion-skeleton-text", { "a": { "width": '20px' } })),
                    h("ion-label", 0,
                        h("h2", { "c": { "list-header": true } },
                            h("ion-skeleton-text", { "a": { "width": '90%' } }),
                            h("ion-skeleton-text", { "a": { "width": '85%' } })),
                        h("h3", { "c": { "comments-text": true } },
                            h("ion-skeleton-text", { "a": { "width": '60%' } }))));
            })));
        }
        return (h("ion-list", 0, this.type.map(function (story) { return (h("ion-item", 0,
            h("div", { "c": { "points": true }, "a": { "slot": 'start' } }, story.points || 0),
            h("ion-label", 0,
                h("h2", { "c": { "list-header": true } },
                    h("a", { "p": { "href": story.url } }, story.title)),
                h("h3", { "c": { "comments-text": true }, "o": { "click": function () { return _this.comments(story); } } }, t("Posted by "),
                    story.user, t(" "),
                    story.time_ago, t(" | "),
                    story.comments_count, t(" comments"))))); })));
    };
    return NewsList;
}());

exports['COMMENTS-LIST'] = CommentsList;
exports['COMMENTS-PAGE'] = CommentsPage;
exports['NEWS-CONTAINER'] = NewsContainer;
exports['NEWS-LIST'] = NewsList;
},


/***************** comments-list *****************/
[
/** comments-list: [0] tag **/
'COMMENTS-LIST',

/** comments-list: [1] host **/
{}

],

/***************** comments-page *****************/
[
/** comments-page: [0] tag **/
'COMMENTS-PAGE',

/** comments-page: [1] host **/
{}

],

/***************** news-container *****************/
[
/** news-container: [0] tag **/
'NEWS-CONTAINER',

/** news-container: [1] host **/
{},

/** news-container: [2] listeners **/
0 /* no listeners */,

/** news-container: [3] states **/
['firstSelectedClass', 'fourthSelectedClass', 'secondSelectedClass', 'stories', 'thirdSelectedClass']

],

/***************** news-list *****************/
[
/** news-list: [0] tag **/
'NEWS-LIST',

/** news-list: [1] host **/
{},

/** news-list: [2] listeners **/
0 /* no listeners */,

/** news-list: [3] states **/
['fakeData']

]
)