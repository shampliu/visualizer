export const addUniforms = (folder, uniforms) => {
  for (const key in uniforms) {
    const {
      min = 0,
      max = 1,
      label = "Label",
      step = 0.01,
      value,
    } = uniforms[key];
    if (typeof value === "number") {
      folder.addBinding(uniforms[key], "value", {
        min,
        max,
        step,
        label,
      });
    } else {
      folder.addBinding(uniforms[key], "value", {
        label,
      });
    }
  }

  return folder;
};
