/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'ion-card.ion-card-content.ion-card-header.ion-card',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
var Card = (function () {
    function Card() {
    }
    Card.prototype.render = function () {
        return h(0, 0);
    };
    return Card;
}());

var CardContent = (function () {
    function CardContent() {
    }
    CardContent.prototype.render = function () {
        return h(0, 0);
    };
    return CardContent;
}());

var CardHeader = (function () {
    function CardHeader() {
    }
    CardHeader.prototype.render = function () {
        return h(0, 0);
    };
    return CardHeader;
}());

var CardTitle = (function () {
    function CardTitle() {
    }
    CardTitle.prototype.render = function () {
        return h(0, 0);
    };
    return CardTitle;
}());

exports['ION-CARD'] = Card;
exports['ION-CARD-CONTENT'] = CardContent;
exports['ION-CARD-HEADER'] = CardHeader;
exports['ION-CARD-TITLE'] = CardTitle;
},


/***************** ion-card *****************/
[
/** ion-card: [0] tag **/
'ION-CARD',

/** ion-card: [1] host **/
{"theme":"card"}

],

/***************** ion-card-content *****************/
[
/** ion-card-content: [0] tag **/
'ION-CARD-CONTENT',

/** ion-card-content: [1] host **/
{"theme":"card-content"}

],

/***************** ion-card-header *****************/
[
/** ion-card-header: [0] tag **/
'ION-CARD-HEADER',

/** ion-card-header: [1] host **/
{"theme":"card-header"}

],

/***************** ion-card-title *****************/
[
/** ion-card-title: [0] tag **/
'ION-CARD-TITLE',

/** ion-card-title: [1] host **/
{"theme":"card-title"}

]
)