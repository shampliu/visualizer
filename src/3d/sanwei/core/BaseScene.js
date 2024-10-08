import { Manager } from "./Manager";
import * as THREE from "three";

// TODO: rename to activity?
export class BaseScene {
  isActive = true;
  constructor() {
    const { renderer } = Manager;

    this.renderer = renderer;
    this.scene = new THREE.Scene();

  }

}
