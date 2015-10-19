import {Directive, ElementRef, Renderer} from 'angular2/angular2';
import {Platform, Navbar} from 'ionic/ionic';


import {ActionSheetPage} from './actionSheet/actionSheet';

import {ButtonsPage,
        BlockButtonsPage,
        ClearButtonsPage,
        FullButtonsPage,
        OutlineButtonsPage,
        RoundButtonsPage,
        FabPage,
        ButtonSizesPage,
        IconButtonsPage,
        ButtonsInComponentsPage} from './buttons/buttons';

import {CardsBasicPage,
        CardsImagePage,
        CardsHeaderPage,
        CardsListPage,
        CardsBackgroundPage,
        CardsAdvancedMapPage,
        CardsAdvancedSocialPage,
        CardsAdvancedImagePage} from './cards/cards';

import {FormsPage,
        FixedInlinePage,
        FloatingPage,
        InlinePage,
        InsetPage,
        PlaceholderPage,
        StackedPage} from './forms/forms';
        
import {IconsPage} from './icons/icons';

import {BasicListsPage,
        AvatarListsPage,
        IconListsPage,
        BasicDividersPage,
        BasicInsetListsPage,
        ListHeadersPage} from './lists/lists';

import {MenusPage} from './menus/menus';
import {ModalsPage} from './modals/modals';
import {NavigationPage} from './navigation/navigation';
import {PopupsPage} from './popups/popups';
import {SlidesPage} from './slides/slides';
import {TabsPage} from './tabs/tabs';

@Directive({
  selector: '.android-attr',
})
export class AndroidAttribute {

    constructor (platform: Platform, elementRef: ElementRef, renderer: Renderer) {
        this.isAndroid = platform.is('android');
        renderer.setElementAttribute(elementRef, 'primary', this.isAndroid ? true : null);
    }

}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export function getPageFor(hash) {
    return {
        'action-sheets': ActionSheetPage,
        'buttons': ButtonsPage,
        'block-buttons': BlockButtonsPage,
        'clear-buttons': ClearButtonsPage,
        'full-buttons': FullButtonsPage,
        'outline-buttons': OutlineButtonsPage,
        'round-buttons': RoundButtonsPage,
        'floating-action-buttons': FabPage,
        'buttons-in-components': ButtonsInComponentsPage,
        'button-sizes': ButtonSizesPage,
        'icon-buttons': IconButtonsPage,

        'cards': CardsBasicPage,
        'card-header': CardsHeaderPage,
        'card-list': CardsListPage,
        'card-image': CardsImagePage,
        'card-background': CardsBackgroundPage,
        'card-advanced-map': CardsAdvancedMapPage,
        'card-advanced-social': CardsAdvancedSocialPage,
        'card-advanced-image': CardsAdvancedImagePage,

        'forms': FormsPage,
        'fixed-inline-labels': FixedInlinePage,
        'floating-labels': FloatingPage,
        'inline-labels': InlinePage,
        'inset-labels': InsetPage,
        'placeholder-labels': PlaceholderPage,
        'stacked-labels': StackedPage,

        'icons': IconsPage,

        'lists': BasicListsPage,
        'avatar-list': AvatarListsPage,
        'icon-list': IconListsPage,
        'list-dividers': BasicDividersPage,
        'inset-list': BasicInsetListsPage,
        'list-headers': ListHeadersPage,

        'menus': MenusPage,
        'modals': ModalsPage,
        'navigation': NavigationPage,
        'popups': PopupsPage,
        'slides': SlidesPage,
        'tabs': TabsPage
    }[hash]
}

export function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
