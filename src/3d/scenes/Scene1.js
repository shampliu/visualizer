import * as THREE from "three";
import { Postprocessing, DebugCamera, BaseScene, Manager, IS_DEBUG, Sound} from "@/3d/sanwei";

import useStore, { ColorScheme } from "@/store";


export const MAIN_SCENE_UNIFORMS = {
  uBackground: {
    value: '#fff'
  }
};

const SCENE_ID = 'Scene 1';

export class MainScene extends BaseScene {
  constructor(props) {
    super(props);
  }

  init = async () => {
    // super.init();
    

    
    this.scene.background = new THREE.Color(MAIN_SCENE_UNIFORMS.uBackground.value);

    this.camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 100;


    await Manager.initClass(Postprocessing, this.scene, this.camera); // TODO: allow multiple postprocessing classes
    this.initLights();
    await this.initObjects();

    if (IS_DEBUG) {
      this.debugCamera = await Manager.initClass(DebugCamera, this.scene);
      this.initDebug();
    }
    // this.initEvents();

    // if (IS_DEBUG) {
    // }

    useStore.subscribe((state) => {
      this.scene.background = BackgroundColor[state.prefersColorScheme];
    });
  };

  initLights = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);
  };

  initObjects = async () => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, 20),
      new THREE.MeshBasicMaterial({ color: "red" })
    );

    this.scene.add(mesh);
  };

  initDebug = () => {
    const folder = Manager.pane.addFolder({ title: SCENE_ID });

    folder.addBinding(MAIN_SCENE_UNIFORMS.uBackground, "value").on("change", (e) => {
      this.scene.background.set(e.value);
    });
    

  };

  update = () => {

    Postprocessing.radialBlurPass.uniforms.tBright =
      Postprocessing.radialBlurPass.uniforms.tDiffuse;

    this.debugCamera?.update(); // TODO: refactor debug updates

    Postprocessing.update();
  };
}
