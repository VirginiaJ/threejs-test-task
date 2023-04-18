import {
  PerspectiveCamera,
  Raycaster,
  Scene,
  WebGLRenderer,
  WebGLRendererParameters,
} from "three";

interface IOptions {
  cameraOptions: {
    fov?: number | undefined;
    aspect?: number | undefined;
    near?: number | undefined;
    far?: number | undefined;
  };
  rendererOptions: WebGLRendererParameters | undefined;
}

export class ThreeCore {
  camera: PerspectiveCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  raycaster: Raycaster;

  constructor(options: IOptions) {
    this.scene = new Scene();
    this.raycaster = new Raycaster();
    this.camera = new PerspectiveCamera(
      options.cameraOptions.fov,
      options.cameraOptions.aspect,
      options.cameraOptions.near,
      options.cameraOptions.far
    );
    this.renderer = new WebGLRenderer(options.rendererOptions);
  }
}
