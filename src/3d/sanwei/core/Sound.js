import * as THREE from "three";

class SoundClass {
  isSingleton = true;

  loadAudio = (url, loop) => {
    const sound = new THREE.Audio(this.listener);
    this.loader.load(url, (buffer) => {
      sound.setBuffer(buffer);
      sound.setVolume(1);
      sound.setLoop(loop);
    });

    return sound;
  };

  init = async () => {
    this.loader = new THREE.AudioLoader();
    this.listener = new THREE.AudioListener();

    // this.startSound = this.loadAudio("/sounds/street.mp3", true);
  };

  update = () => {
    // const playbackRate = 1 - MAIN_SCENE_UNIFORMS.uFreezeProgress.value * 0.75;
    // this.bgStart.playbackRate = playbackRate;
    // this.bgStart.volume = 1 - MAIN_SCENE_UNIFORMS.uFreezeProgress.value;
    // this.bgEnd.volume = MAIN_SCENE_UNIFORMS.uFreezeProgress.value;
  };
}

export const Sound = new SoundClass();
