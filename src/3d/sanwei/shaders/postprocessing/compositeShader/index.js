import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import fragmentShader from "./frag.glsl";

export const COMPOSITE_SHADER_UNIFORMS = {
  // uTime: { value: 0, label: 'uTime' },
  uRGBShift: { value: 0.08, label: "RGB Shift" },
  uK1: { value: -0.2, label: "K1" },
  uK2: { value: -0.03, label: "K2" },
  uNoiseOpacity: { value: 0.13, label: "Noise Opacity" },

  uProgress: { value: 1, label: "Progress" },
  // uGamma: { value: 0, label: "Gamma" },
  // uExposure: { value: 0, label: "Exposure" },
  uMonochrome: { value: 0, label: "Monochrome" },
};

export const CompositeShader = {
  uniforms: {
    tDiffuse: { value: null },
  },
  vertexShader: CopyShader.vertexShader,
  fragmentShader,
};
