import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Manager } from "./Manager";
import { Postprocessing } from "./Post";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

export const DEBUG_CAMERA_UNIFORMS = {
  enableOrbitControls: true,
};

export class DebugCamera {

  constructor() {

  }
  init = async () => {
    this.camera = new THREE.PerspectiveCamera(
      120,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    this.camera.position.set(0, 0, 200);

    this.orbitControls = new OrbitControls(
      this.camera,
      Manager.renderer.domElement
    );
    this.orbitControls.enabled = DEBUG_CAMERA_UNIFORMS.enableOrbitControls;

    
  };

  initDebug = async (pane) => {
    const cameraFolder = pane.addFolder({
      title: "Debug Camera",
    });

    cameraFolder
      .addBinding(DEBUG_CAMERA_UNIFORMS, "enableOrbitControls")
      .on("change", (ev) => {
        this.orbitControls.enabled = ev.value;
      });

    cameraFolder
      .addBinding(this.camera, "fov", {
        min: 10,
        max: 180,
        step: 1,
      })
      .on("change", () => {
        this.camera.updateProjectionMatrix();
      });

    cameraFolder.addBinding(this.camera, "position");

    cameraFolder
      .addBinding(this.camera, "zoom", {
        min: 0,
        max: 20,
        step: 0.5,
      })
      .on("change", () => {
        this.camera.updateProjectionMatrix();
      });

    const dolly = { value: 0 };

    const width = 40;
    const distance =
      width / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2));
    this.camera.position.z = distance;

    cameraFolder
      .addBinding(this.camera, "fov", {
        min: 20,
        max: 200,
        step: 0.5,
        label: "Dolly (Camera FOV)",
      })
      .on("change", (ev) => {
        const fov = ev.value;
        this.camera.fov = fov;

        const distance =
          width / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2));

        console.log(distance);
        this.camera.position.z = distance;

        this.camera.updateProjectionMatrix();
      });

    cameraFolder.addButton({ title: "Log Position" }).on("click", () => {
      this.camera.updateMatrixWorld();
      const position = this.camera.position
        .clone()
        .applyMatrix4(this.camera.matrixWorld);

      const { x, y, z } = position;
      console.log(`${x}, ${y}, ${z}`);
      const lookAt = new THREE.Vector3(0, 0, -1);
      lookAt.applyQuaternion(this.camera.quaternion);
      console.log(`lookAt: ${lookAt.x}, ${lookAt.y}, ${lookAt.z}`);
    });
  };

  update = () => {
    this.orbitControls.enabled && this.orbitControls.update();
  };
}
