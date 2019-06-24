import { Component, ComponentInterface, Element, Method, Prop, State, h } from '@stencil/core';

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
   * Determines at what percent the video should be in the view before playing.
   */
  @Prop() playThreshold?: number;

  /**
   * The intersectionObserver threshold values.
   */
  private threshold?: number[];

  componentDidLoad() {
    this.setThreshold();
    this.addIO();
  }

  private setThreshold() {

    // Ensure that the threshold is valid.
    if (this.playThreshold === undefined || this.playThreshold < 0 || this.playThreshold > 1) {
      this.playThreshold = 0.65;
    }
    this.threshold = [0, this.playThreshold];
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
        const shouldPlay = data[0].intersectionRatio >= this.playThreshold!;

        // Determine if the video state has changed to avoid useless operations.
        if (shouldPlay !== this.playing) {

          // Play or Pause as necessary.
          shouldPlay ? this.play() : this.pause();

          // Update video state.
          this.playing = shouldPlay;
        }
      }, { threshold: this.threshold });

      this.io.observe(this.el);
    }
  }

  private getVideoElement() {
    // Grab the shadowRoot video element.
    return this.el.shadowRoot!.lastChild;
  }

  private removeIO() {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }

  /**
   * Plays the video
   */
  @Method()
  async play() {
    const vid: any = this.getVideoElement();
    vid.play();
  }

  /**
   * Pauses the video
   */
  @Method()
  async pause() {
    const vid: any = this.getVideoElement();
    vid.pause();
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
