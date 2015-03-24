var platforms = [];

// TODO(ajoslin): move this to a facade somewhere else?
var ua = window.navigator.userAgent;

class Platform {
  constructor({
    name,
    matcher
  }) {
    this.name = name;
    this.matcher = matcher;
  }
}

class PlatformController {
  constructor() {
    this.registry = [];
  }
  set(platform) {
    this.current = platform;
  }
  get() {
    return platform;
  }
  register(platform) {
    this.registry.push(platform);
  }
  detect() {
    for (let platform of this.registry) {
      if (platform.matcher()) {
        return platform;
      }
    }
  }
}

export let platform = new PlatformController();

platform.register(new Platform({
  name: 'android',
  matcher: () => {
    return /android/i.test(ua)
  }
}));
platform.register(new Platform({
  name: 'ios',
  matcher: () => {
    return /iPhone|iPad|iPod/.test(ua)
  }
})

function detectPlatform() {
}
