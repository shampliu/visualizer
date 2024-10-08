import * as THREE from "three";

export const createVideoTexture = (src) => {
  const video = document.createElement("video");
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.crossOrigin = "anonymous";

  const texture = new THREE.VideoTexture(video);
  texture.crossOrigin = "anonymous";
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;

  video.src = src;
  video.play();

  return texture;
};
