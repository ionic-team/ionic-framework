import { Component, h, Prop, State, VNodeData } from '@stencil/core';

const publicPath = '';


@Component({
  tag: 'ion-icon',
  styleUrls: {
    ios: 'icon.ios.scss',
    md: 'icon.md.scss',
    wp: 'icon.wp.scss'
  },
  host: {
    theme: 'icon'
  },
  assetsDir: './svg'
})
export class Icon {
  mode: string;

  /**
   * @input {string} Specifies the label to use for accessibility. Defaults to the icon name.
   */
  @State() label: string = '';

  /**
   * @input {string} Specifies which icon to use. The appropriate icon will be used based on the mode.
   * For more information, see [Ionicons](/docs/ionicons/).
   */
  @Prop() name: string = '';

  /**
   * @input {string} Specifies which icon to use on `ios` mode.
   */
  @Prop() ios: string = '';

  /**
   * @input {string} Specifies which icon to use on `md` mode.
   */
  @Prop() md: string = '';

  /**
   * @input {boolean} If true, the icon is hidden.
   */
  @Prop() hidden: boolean = false;


  @State() svgContent: string = null;


  getSvgUrl() {
    const iconName = this.iconName;
    if (iconName !== null) {
      return `${publicPath}svg/${iconName}.svg`;
    }

    return null;
  }


  get iconName() {
    let iconName: string;

    // if no name was passed set iconName to null
    if (!this.name) {
      return null;
    }

    if (!(/^md-|^ios-|^logo-/.test(this.name))) {
      // this does not have one of the defaults
      // so lets auto add in the mode prefix for them
      iconName = this.mode + '-' + this.name;

    } else if (this.name) {
      // this icon already has a prefix
      iconName = this.name;
    }

    // if an icon was passed in using the ios or md attributes
    // set the iconName to whatever was passed in
    if (this.ios && this.mode === 'ios') {
      iconName = this.ios;

    } else if (this.md && this.mode === 'md') {
      iconName = this.md;
    }

    return iconName;
  }


  hostData(): VNodeData {
    const attrs: {[attrName: string]: string} = {
      'role': 'img'
    };

    if (this.hidden) {
      // adds the hidden attribute
      attrs['hidden'] = '';
    }

    if (this.label) {
      // user provided label
      attrs['aria-label'] = this.label;

    } else {
      // come up with the label based on the icon name
      const iconName = this.iconName;
      if (iconName) {
        attrs['aria-label'] = iconName
                                .replace('ios-', '')
                                .replace('md-', '')
                                .replace('-', ' ');
      }
    }

    return {
      attrs
    };
  }


  static loadSvgContent(svgUrl: string, callback: {(loadedSvgContent: string): void}) {
    // static since all IonIcons use this same function and pointing at global/shared data
    // passed in callback will have instance info

    // add to the list of callbacks to fiure when this url is finished loading
    IonIcon.loadCallbacks[svgUrl] = IonIcon.loadCallbacks[svgUrl] || [];
    IonIcon.loadCallbacks[svgUrl].push(callback);

    if (IonIcon.activeRequests[svgUrl]) {
      // already requesting this url, don't bother again kicking off another
      return;
    }

    // add this url to our list of active requests
    IonIcon.activeRequests[svgUrl] = true;

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      // awesome, we've finished loading the svg file

      // remove this url from the active requests
      delete IonIcon.activeRequests[svgUrl];

      if (this.status >= 400) {
        // ok, not awesome, something is up
        console.error('Icon could not be loaded:', svgUrl);
        return;
      }

      // this response is the content of the svg file we're looking for
      // cache it in the global IonIcon constant
      IonIcon.svgContents[svgUrl] = this.responseText;

      // find any callbacks waiting on this url
      const svgLoadCallbacks = IonIcon.loadCallbacks[svgUrl];
      if (svgLoadCallbacks) {
        // loop through all the callbacks that are waiting on the svg content
        for (var i = 0; i < svgLoadCallbacks.length; i++) {
          // fire off this callback which
          svgLoadCallbacks[i](this.responseText);
        }
        delete IonIcon.loadCallbacks[svgUrl];
      }
    });

    xhr.addEventListener('error', function () {
      // umm, idk
      console.error('Icon could not be loaded:', svgUrl);
    });

    // let's do this!
    xhr.open('GET', svgUrl, true);
    xhr.send();
  }


  render() {
    const svgUrl = this.getSvgUrl();
    if (!svgUrl) {
      // we don't have good data
      return(<div class="missing-svg"></div>);
    }

    const svgContent = IonIcon.svgContents[svgUrl];
    if (svgContent === this.svgContent) {
      // we've already loaded up this svg at one point
      // and the svg content we've loaded and assigned checks out
      // render this svg!!
      return(
        <div innerHTML={svgContent}></div>
      );
    }

    // haven't loaded this svg yet
    // start the request
    Icon.loadSvgContent(svgUrl, loadedSvgContent => {
      // we're finished loading the svg content!
      // set to this.svgContent so we do another render
      this.svgContent = loadedSvgContent;
    });

    // actively requesting the svg, so let's just render a div for now
    return(<div class="loading-svg"></div>);
  }

}


const IonIcon: GlobalIonIcon = {
  activeRequests: {},
  loadCallbacks: [] as any,
  svgContents: {}
};

interface GlobalIonIcon {
  activeRequests: {[url: string]: boolean};
  loadCallbacks: {[url: string]: {(loadedSvgContent: string): void}[]};
  svgContents: {[url: string]: string};
}
