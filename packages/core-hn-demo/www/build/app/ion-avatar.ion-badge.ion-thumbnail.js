/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'ion-avatar.ion-badge.ion-thumbnail',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
var Avatar = (function () {
    function Avatar() {
    }
    Avatar.prototype.render = function () {
        return h(0, 0);
    };
    return Avatar;
}());

var Badge = (function () {
    function Badge() {
    }
    Badge.prototype.render = function () {
        return h(0, 0);
    };
    return Badge;
}());

var Thumbnail = (function () {
    function Thumbnail() {
    }
    Thumbnail.prototype.render = function () {
        return h(0, 0);
    };
    return Thumbnail;
}());

exports['ION-AVATAR'] = Avatar;
exports['ION-BADGE'] = Badge;
exports['ION-THUMBNAIL'] = Thumbnail;
},


/***************** ion-avatar *****************/
[
/** ion-avatar: [0] tag **/
'ION-AVATAR',

/** ion-avatar: [1] host **/
{"theme":"avatar"}

],

/***************** ion-badge *****************/
[
/** ion-badge: [0] tag **/
'ION-BADGE',

/** ion-badge: [1] host **/
{"theme":"badge"}

],

/***************** ion-thumbnail *****************/
[
/** ion-thumbnail: [0] tag **/
'ION-THUMBNAIL',

/** ion-thumbnail: [1] host **/
{"theme":"thumbnail"}

]
)