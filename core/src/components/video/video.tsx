import { Component, ComponentInterface, Element, Prop, State, Watch, h } from '@stencil/core';

@Component({
  tag: 'ion-video',
  styleUrl: 'video.scss',
  shadow: true,
})
export class Video implements ComponentInterface {

  private io?: IntersectionObserver;

  @Element() el!: HTMLElement;

  /**
   * Determines if the video should be muted or unmuted. Muted by default.
   */
  @State() muted ? = true;

  /**
   * Determines if the video is playing to minimize calls.
   */
  @State() playing?: boolean;

  /**
   * The video URL. This attribute is mandatory for the <video> element.
   */
  @Prop() src?: string;

  /**
   * Determines if the video should loop endlessly. Defaults to true.
   */
  @Prop() loop ? = true;

  /**
   * intersection threshold triggers:
   * >= 0.65 will play
   * < 0.65 will pause.
   */
  @Prop() threshold ? = [0, 0.65];

  @Watch('src')
  srcChanged() {
    this.addIO();
  }

  componentDidLoad() {
    this.addIO();
  }

  private addIO() {
    if (this.src === undefined) {
      return;
    }
    if ('IntersectionObserver' in window) {
      this.removeIO();
      this.io = new IntersectionObserver((data: any) => {
        // because there will only ever be one instance
        // of the element we are observing
        // we can just use data[0]

        // Check if we should play the video.
        const shouldPlay = data[0].intersectionRatio > 0.65;

        // Determine if the video state has changed to avoid useless operations.
        if (shouldPlay !== this.playing) {

          // Grab the shadowRoot video element.
          const video = data[0].target.shadowRoot.lastChild;

          // Play or Pause if necessary.
          shouldPlay ? video.play() : video.pause();

          // Update video state.
          this.playing = shouldPlay;
        }
      }, { threshold: this.threshold });

      this.io.observe(this.el);
    }
  }

  private removeIO() {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }

  render() {
    return (
      <video
        playsInline
        preload="auto"
        muted={this.muted}
        loop={this.loop}
      >
        <source
          src={this.src}
          type="video/mp4"
        />
      </video>
    );
  }
}
