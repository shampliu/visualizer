Date.now =
  Date.now ||
  function () {
    // IE8
    return new Date().getTime();
  };

let id, now;

// TODO: include updatePriority, frameRateForced
class RAFBase {
  constructor() {
    this.delta = Infinity;
    this.last = Date.now();
    this.timeElapsed = 0;

    this.subscribers = [];
    this.callbacks = {};
    this.lastUpdate = {};
    this.frameRates = {};
  }

  init = () => {
    window.addEventListener("focus", () => {
      this.last = Date.now();
    });

    this.update();
  };

  destroy = () => {
    if (this.id) {
      cancelAnimationFrame(this.id);
    }
  };

  update = (t) => {
    this.id = requestAnimationFrame(this.update);

    now = Date.now();
    this.delta = (now - this.last) / 1000;
    this.last = now;
    this.timeElapsed += this.delta;

    for (let i = 0; i < this.subscribers.length; i++) {
      id = this.subscribers[i];
      if (
        this.frameRates[id] !== null &&
        now - this.lastUpdate[id] < this.frameRates[id] * 1000
      ) {
        continue;
      }

      this.lastUpdate[id] = now;
      this.callbacks[id]();
    }
  };

  subscribe = (id, cb, fps = null) => {
    this.subscribers.push(id);
    this.callbacks[id] = cb;
    this.lastUpdate[id] = Date.now();

    if (fps !== null) {
      this.frameRates[id] = 1 / fps;
    } else {
      this.frameRates[id] = null;
    }
  };
}

export const RAF = new RAFBase();
