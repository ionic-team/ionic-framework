import { Component, Prop, State } from '@stencil/core';


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
  assetsDir: 'svg'
})
export class Icon {
  mode: string;

  /**
   * @input {string} Specifies the label to use for accessibility. Defaults to the icon name.
   */
  @State() ariaLabel: string = '';

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


  @State() svgContent: string = null;


  getSvgUrl() {
    const iconName = this.iconName;
    if (iconName !== null) {
      return `${publicPath}svg/${iconName}.svg`;
    }

    return null;
  }


  get iconName() {
    // if no name was passed set iconName to null
    if (!this.name) {
      return null;
    }

    let iconName = this.name.toLowerCase();

    // default to "md" if somehow the mode wasn't set
    const mode = this.mode || 'md';

    if (!(/^md-|^ios-|^logo-/.test(iconName))) {
      // this does not have one of the defaults
      // so lets auto add in the mode prefix for them
      iconName = mode + '-' + iconName;

    } else if (this.ios && mode === 'ios') {
      // if an icon was passed in using the ios or md attributes
      // set the iconName to whatever was passed in
      // when we're also on that mode
      // basically, use the ios attribute when you're on ios
      iconName = this.ios;

    } else if (this.md && mode === 'md') {
      // use the md attribute when you're in md mode
      // and the md attribute has been set
      iconName = this.md;
    }

    // only allow alpha characters and dash
    const invalidChars = iconName.replace(/[a-z]|-/g, '');
    if (invalidChars !== '') {
      console.error(`invalid characters in ion-icon name: ${invalidChars}`);
      return null;
    }

    return iconName;
  }


  hostData() {
    const attrs: {[attrName: string]: string} = {
      'role': 'img'
    };

    if (this.ariaLabel) {
      // user provided label
      attrs['aria-label'] = this.ariaLabel;

    } else {
      // come up with the label based on the icon name
      const iconName = this.iconName;
      if (iconName) {
        attrs['aria-label'] = iconName
                                .replace('ios-', '')
                                .replace('md-', '')
                                .replace(/\-/g, ' ');
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

    // kick off the request for the external svg file
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      // awesome, we've finished loading the svg file

      // remove this url from the active requests
      delete IonIcon.activeRequests[svgUrl];

      // this response is the content of the svg file we're looking for
      let svgContent = this.responseText;

      if (this.status >= 400) {
        // umm, not awesome, something is up
        console.error('Icon could not be loaded:', svgUrl);
        svgContent = `<!--error loading svg-->`;
      }

      // cache the svg content in the global IonIcon constant
      IonIcon.svgContents[svgUrl] = svgContent;

      // find any callbacks waiting on this url
      const svgLoadCallbacks = IonIcon.loadCallbacks[svgUrl];
      if (svgLoadCallbacks) {
        // loop through all the callbacks that are waiting on the svg content
        for (var i = 0; i < svgLoadCallbacks.length; i++) {
          // fire off this callback which was provided by an instance
          svgLoadCallbacks[i](svgContent);
        }
        delete IonIcon.loadCallbacks[svgUrl];
      }
    });

    xhr.addEventListener('error', () => {
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
      return <div class="icon-inner">{/* invalid svg */}</div>;
    }

    const svgContent = IonIcon.svgContents[svgUrl];
    if (svgContent === this.svgContent) {
      // we've already loaded up this svg at one point
      // and the svg content we've loaded and assigned checks out
      // render this svg!!
      return <div class="icon-inner" innerHTML={svgContent}></div>;
    }

    // haven't loaded this svg yet
    // start the request
    Icon.loadSvgContent(svgUrl, loadedSvgContent => {
      // we're finished loading the svg content!
      // set to this.svgContent so we do another render
      this.svgContent = loadedSvgContent;
    });

    // actively requesting the svg, so let's just render a div for now
    return <div class="icon-inner">{/* loading svg */}</div>;
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
