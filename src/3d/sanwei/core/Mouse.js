import { getPos, events } from "../util/responsive";
import normalizeWheel from "normalize-wheel";
import * as THREE from "three";
import { RAF } from "./RAF";

export const SCROLL_DIRECTION = {
  DOWN: 1,
  UP: 2,
  LEFT: 3,
  RIGHT: 4,
};

class MouseClass {
  isSingleton = true;
  subscribers = {};
  callbacks = {};
  shouldUpdate = true;

  constructor() {
    this.position = new THREE.Vector2(0, 0);

    this.scroll = {
      ease: 0.15,
      current: new THREE.Vector2(0, 0),
      target: new THREE.Vector2(0, 0),
      last: new THREE.Vector2(0, 0),
      velocity: new THREE.Vector2(0, 0),

      dragStart: new THREE.Vector2(0, 0),
    };

    this.scrollDirection = new THREE.Vector2(0, 0);

    this.drag = {
      start: new THREE.Vector2(0, 0),
      end: new THREE.Vector2(0, 0),

      active: false,

      momentumVelocity: new THREE.Vector2(0, 0),
    };
  }

  handleMousemove = (e) => {
    const { x, y } = getPos(e);

    this.position.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );

    if (this.drag.active) {
      const deltaX = this.position.x - this.drag.start.x;
      const deltaY = this.position.y - this.drag.start.y;

      this.scroll.target.set(
        this.scroll.dragStart.x - deltaX * 100,
        this.scroll.dragStart.y + deltaY * 100
      );
    }

    this.subscribers[events.move].forEach((id) => {
      this.callbacks[id]();
    });
  };

  handleMousedown = () => {
    this.drag.active = true;

    this.drag.start.copy(this.position);
    this.scroll.dragStart.copy(this.scroll.target);
  };

  handleMouseup = () => {
    // TODO: add momentum scrolling?
    this.drag.active = false;

    this.drag.momentumVelocity.copy(this.scroll.velocity).multiplyScalar(10);
  };

  handleWheel = (e) => {
    // if (this.currentPage !== PAGE_TYPES.CAROUSEL) return;
    const { pixelX, pixelY } = normalizeWheel(e);
    // const wheelDelta = Math.abs(pixelX) > Math.abs(pixelY) ? -pixelX : -pixelY;
    // this.getNewPlanePositions(wheelDelta * 0.1, planes);
    // planes.forEach((p, i) => {
    //   p.position.x = planeTweenTargets[i].x;
    // });
    // currScrollTop += wheelDelta;

    // this.updateIntersected();

    this.scroll.target.y += pixelY * 0.5;
    this.scroll.target.x += pixelX * 0.5;
  };

  init = () => {
    this.subscribers[events.move] = [];
    this.subscribers[events.wheel] = [];

    window.addEventListener(events.move, this.handleMousemove);
    window.addEventListener(events.down, this.handleMousedown);
    window.addEventListener(events.up, this.handleMouseup);

    if (events.wheel) {
      window.addEventListener(events.wheel, this.handleWheel);
    }
  };

  subscribe = (event, id, cb) => {
    this.subscribers[event].push(id);

    this.callbacks[id] = cb;
  };

  reset = () => {
    this.drag.momentumVelocity.set(0, 0);
    this.scroll.velocity.set(0, 0);
    this.scroll.current.set(0, 0);
    this.scroll.target.set(0, 0);
  };

  update = () => {
    if (!this.shouldUpdate) return;

    if (this.drag.momentumVelocity.length() > 0.01) {
      this.scroll.target.add(this.drag.momentumVelocity.multiplyScalar(0.98));
    }

    this.scroll.current.lerp(this.scroll.target, this.scroll.ease);

    this.scrollDirection.set(
      this.scroll.current.x > this.scroll.last.x
        ? SCROLL_DIRECTION.RIGHT
        : SCROLL_DIRECTION.LEFT,
      this.scroll.current.y > this.scroll.last.y
        ? SCROLL_DIRECTION.DOWN
        : SCROLL_DIRECTION.UP
    );

    // this.scroll.velocity.set(
    //   (this.scroll.current.x - this.scroll.last.x) / RAF.delta,
    //   (this.scroll.current.y - this.scroll.last.y) / RAF.delta
    // );

    // TODO:
    this.scroll.velocity.set(
      (this.scroll.current.x - this.scroll.last.x) / 10,
      (this.scroll.current.y - this.scroll.last.y) / 10
    );

    this.scroll.last.copy(this.scroll.current);
  };
}

export const Mouse = new MouseClass();
