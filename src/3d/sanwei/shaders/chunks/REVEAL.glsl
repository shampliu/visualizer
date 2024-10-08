uniform float uReveal;

vec4 reveal(vec4 color, float progress) {
  // if (uReveal == 0.) discard;

  // if (step(uReveal) < 1.) discard;
  // if (step(uv.x, uReveal) < 1.) discard;

  color.a = step(progress, uReveal);

  // color.r += .5;

  return color;

  // return mix(color, vec4(0.), step(uReveal, uv.x));

}