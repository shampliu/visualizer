import * as THREE from "three";
import { Manager } from "./Manager";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import {
  COMPOSITE_SHADER_UNIFORMS,
  CompositeShader,
} from "../shaders/postprocessing/compositeShader";
import { RadialBlurShader } from "../shaders/postprocessing/radialBlurShader";
import { RAF } from "./RAF";
import { addUniforms } from "../util/tweakpane";
import { GlobalUniforms } from "./GlobalUniforms";

export const POSTPROCESSING_UNIFORMS = {
  uRadialStrength: {
    value: 0,
  },

  bloom: {
    strength: {
      value: 0.2,
      max: 1,
    },
    threshold: {
      value: 0.2,
    },
    radius: {
      value: 0.1,
      max: 16,
    },
  },
};

class PostprocessingClass {
  isSingleton = true;

  init = async (scene, camera) => {
    this.scene = scene;
    this.camera = camera;

    const composer = new EffectComposer(Manager.renderer);

    const renderPass = new RenderPass(scene, camera);
    renderPass.enabled = true;
    this.renderPass = renderPass;
    composer.addPass(renderPass);

    const radialBlurPass = new ShaderPass(RadialBlurShader);
    radialBlurPass.uniforms.uTime = GlobalUniforms.uTime;

    this.radialBlurPass = radialBlurPass;
    composer.addPass(radialBlurPass);

    const compositePass = new ShaderPass(CompositeShader);
    Object.assign(compositePass.uniforms, {
      uTime: GlobalUniforms.uTime,
      ...COMPOSITE_SHADER_UNIFORMS,
    });
    compositePass.uniforms.uTime = GlobalUniforms.uTime;
    this.compositePass = compositePass;
    composer.addPass(compositePass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.5,
      0.85
    );
    bloomPass.threshold = POSTPROCESSING_UNIFORMS.bloom.threshold.value;
    bloomPass.strength = POSTPROCESSING_UNIFORMS.bloom.strength.value;
    bloomPass.radius = POSTPROCESSING_UNIFORMS.bloom.radius.value;
    this.bloomPass = bloomPass;
    // composer.addPass(bloomPass);

    this.composer = composer;
  };

  initDebug = (pane) => {
    const folder = pane.addFolder({ title: "Postprocessing", expanded: false });
    folder.addBinding(POSTPROCESSING_UNIFORMS.uRadialStrength, "value", {
      min: 0,
      max: 1,
      label: "Radial Strength",
    });

    addUniforms(folder, COMPOSITE_SHADER_UNIFORMS);

    for (const key in POSTPROCESSING_UNIFORMS.bloom) {
      const { min = 0, max = 1 } = POSTPROCESSING_UNIFORMS.bloom[key];
      folder
        .addBinding(POSTPROCESSING_UNIFORMS.bloom[key], "value", {
          min,
          max,
          label: "bloom " + key,
          step: 0.01,
        })
        .on("change", (ev) => {
          this.bloomPass[key] = ev.value;
        });
    }

    const rendererUniforms = {
      exposure: 0.2,
    };
    folder
      .addBinding(rendererUniforms, "exposure", {
        min: 0,
      })
      .on("change", (ev) => {
        Manager.renderer.toneMappingExposure = ev.value;
      });
  };

  update = () => {
    this.radialBlurPass.uniforms.uRadialStrength =
      POSTPROCESSING_UNIFORMS.uRadialStrength;

    this.composer.render(RAF.delta);
  };
}

export const Postprocessing = new PostprocessingClass();
