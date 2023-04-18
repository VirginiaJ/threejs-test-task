import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { applyBouncing } from "./animation";
import { SelectableObject } from "./types";
import { ThreeCore } from "./threeCore";
import { onCanvasClick, onWindowResize } from "./handlers";
import { state } from "./store";
import { snapshot } from "valtio/vanilla";

let controls: OrbitControls;

// Variables
let playAnimation = true;
let startTime = Date.now();
let amplitude = 5;
let duration = 3000;

export const threeCore = new ThreeCore({
  cameraOptions: {
    fov: 45,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 100,
  },
  rendererOptions: { antialias: true },
});

init();
animate();

function init() {
  const container = document.getElementById("canvas");
  threeCore.camera.position.set(0, 1, 10);
  threeCore.scene.background = new THREE.Color(0xf9f9f9);
  threeCore.scene.fog = new THREE.Fog(0xf9f9f9, 10, 15);

  // Setup renderer
  threeCore.renderer.setPixelRatio(window.devicePixelRatio);
  threeCore.renderer.setSize(window.innerWidth, window.innerHeight);
  threeCore.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  threeCore.renderer.outputEncoding = THREE.sRGBEncoding;
  threeCore.renderer.shadowMap.enabled = true;
  threeCore.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container?.appendChild(threeCore.renderer.domElement);

  // Setup lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-2, 5, 2);
  directionalLight.castShadow = true;
  threeCore.scene.add(ambientLight);
  threeCore.scene.add(hemisphereLight);
  threeCore.scene.add(directionalLight);

  // Add orbit controls
  controls = new OrbitControls(threeCore.camera, threeCore.renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 1;
  controls.maxDistance = 10;
  controls.update();

  // Add scene objects
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshPhongMaterial({ color: 0xe4e4e4 })
  );
  plane.rotation.set(-Math.PI / 2, 0, 0);
  plane.receiveShadow = true;
  threeCore.scene.add(plane);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  );
  cube.position.set(0, 0.5, 0);
  cube.castShadow = true;
  threeCore.scene.add(cube);

  const icoSphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshPhongMaterial({ color: 0xff0000, flatShading: true })
  );
  icoSphere.position.set(2, 1, 0);
  icoSphere.castShadow = true;
  icoSphere.name = "sphere";
  threeCore.scene.add(icoSphere);

  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 3),
    new THREE.MeshPhongMaterial({ color: 0xffff00 })
  );
  cylinder.position.set(-2, 1.5, 0);
  cylinder.castShadow = true;
  threeCore.scene.add(cylinder);

  state.objectToAnimate = threeCore.scene.getObjectByName(
    "sphere"
  ) as SelectableObject;

  threeCore.renderer.domElement.addEventListener("click", onCanvasClick);
  document.getElementById("play")?.addEventListener("click", onClickPlay);
  window.addEventListener("resize", onWindowResize);
}

function onClickPlay() {
  const amplitudeInput = document.getElementById(
    "amplitude"
  ) as HTMLInputElement;
  const durationInput = document.getElementById("duration") as HTMLInputElement;
  amplitude = parseInt(amplitudeInput.value);
  duration = parseInt(durationInput.value) * 1000;
  playAnimation = true;
  startTime = Date.now();
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const { objectToAnimate } = snapshot(state);

  if (objectToAnimate && playAnimation) {
    const isFinished = applyBouncing(
      objectToAnimate,
      amplitude,
      duration,
      startTime
    );
    if (isFinished) playAnimation = false;
  }

  render();
}

function render() {
  threeCore.renderer.render(threeCore.scene, threeCore.camera);
}
