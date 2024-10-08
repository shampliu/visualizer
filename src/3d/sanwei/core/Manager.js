import { RAF } from "./RAF";


import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

import { Pane } from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";


import { UIEmitter } from "./UIEmitter";
import { Mouse } from "./Mouse";
import { Sound } from "./Sound";

import { GlobalUniforms } from "./GlobalUniforms";


export const IS_DEBUG = process.env.NEXT_PUBLIC_IS_DEBUG === "true";
// const IS_DEBUG = true; //TODO: fix this;



class ManagerClass {
  isSingleton = true;
  constructor(container) {
    this.loader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.shouldUpdate = true;
    this.scenes = [];
  }

  init = async (container) => {
    RAF.init();
    this.container = container;

    if (IS_DEBUG) {
      const pane = new Pane({});
      pane.registerPlugin(EssentialsPlugin);

      this.fpsGraph = pane.addBlade({
        view: "fpsgraph",

        label: "fpsgraph",
        rows: 2,
      });

      this.pane = pane;
    }

    const dpi = window.devicePixelRatio;

    const renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      // antialias: true,
    });

    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.physicallyCorrectLights = true;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = Math.pow(UNIFORMS.exposure, 4.0); // TODO:
    renderer.toneMappingExposure = 0.3; // TODO:

    this.renderer = renderer;

    await this.initClass(Mouse);
    await this.initClass(Sound);

    

   

    RAF.subscribe("main", this.update);

    this.container.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.handleResize);

    // TODO: emit loaded
  };

  initClass = async (Class, ...args) => {
    let ret;
    if (Class.isSingleton) {
      await Class.init(...args);
      ret = Class;
    } else {
      ret = new Class(...args);

      if (ret.init) {
        await ret.init(...args);
      }
    }

    if (IS_DEBUG) {
      if (ret.initDebug && this.pane) {
        await ret.initDebug(this.pane);
      }
    }

    return ret;
  };

  update = () => {
    if (!this.shouldUpdate) {
      return;
    }

    IS_DEBUG && this.fpsGraph.begin();
    this.scenes.forEach((s) => {
      s.isActive && s.update();
    });

    Mouse.update();

    GlobalUniforms.uTime.value += RAF.delta;
    IS_DEBUG && this.fpsGraph.end();
  };

  handleResize = () => {
    this.scenes.forEach((s) => {
      if (s.isActive) {
        s.camera.aspect = window.innerWidth / window.innerHeight;
        s.camera.updateProjectionMatrix();
      }
    });

    GlobalUniforms.uScreen.value.set(window.innerWidth, window.innerHeight);

    this.renderer.setSize(
      GlobalUniforms.uScreen.value.x,
      GlobalUniforms.uScreen.value.y
    );
  };
}

export const Manager = new ManagerClass();
