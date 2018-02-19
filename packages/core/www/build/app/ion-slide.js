/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Slide {
    hostData() {
        return {
            class: {
                'slide-zoom': true,
                'swiper-slide': true
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-slide"; }
    static get style() { return "ion-slide {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n.slide-zoom {\n  text-align: center;\n  display: block;\n  width: 100%;\n}\n\n.swiper-slide {\n  text-align: center;\n  box-sizing: border-box;\n  position: relative;\n  display: flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  font-size: 18px;\n}\n\n.swiper-slide img {\n  width: auto;\n  max-width: 100%;\n  height: auto;\n  max-height: 100%;\n}"; }
}

export { Slide as IonSlide };
