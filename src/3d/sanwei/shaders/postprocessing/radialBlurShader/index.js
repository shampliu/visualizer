import { CopyShader } from "three/examples/jsm/shaders/CopyShader";

const fragmentShader = `
  precision highp float;

  uniform sampler2D tDiffuse;
  uniform sampler2D tBright;
  
  varying vec2 vUv;
  uniform float uTime;
  uniform float uRadialStrength;

  const int nsamples = 8;

  const float unitLength = 0.70710678118;

  float crange(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  void main() {
    vec2 center = vec2(.5, .5);
    float blurStart = .78;
    float blurWidth = 0.1;

    vec2 uv = vUv - vec2(.5, .5);
    float precompute = blurWidth * (1.0 / float(nsamples - 1));

    
    vec4 originalColor = texture2D(tDiffuse, vUv);
    float step = 1.0 / float(nsamples);
    vec4 color = vec4(0.);
    
    for(int i = 0; i < nsamples; i++)
    {
        // float scale = blurStart + (float(i)* precompute) + sin(uTime) * .1;
        float scale = blurStart + (float(i)* precompute);
        color += texture2D(tBright, uv * scale + center) * step;
    }

    float mask = crange(length(uv), 0., unitLength, 0., 1.) * 1.5 * uRadialStrength;

   



    gl_FragColor =  mix(originalColor, color, mask);
    // gl_FragColor = vec4(vec3(mask * 1.5), 1.);

  }
`;

export const RadialBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    tBright: { value: null },
    uTime: { value: 0, type: "f" },
    uRadialStrength: { value: 0 },
  },
  vertexShader: CopyShader.vertexShader,
  fragmentShader,
};
