import {
  BoxGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  Vector2,
} from "three";
import { threeCore } from "./index";
import {
  SelectableObject,
  EditableParams,
  SelectableGeometries,
  ParamName,
} from "./types";
import { state } from "./store";

let selectedObject: SelectableObject | null = null;
const pointer = new Vector2();

// Params
const editableParams: EditableParams = {
  BoxGeometry: {
    width: { min: "0.1", max: "2", step: "0.1" },
    height: { min: "0.1", max: "2", step: "0.1" },
    depth: { min: "0.1", max: "2", step: "0.1" },
  },
  IcosahedronGeometry: {
    radius: { min: "0.1", max: "2", step: "0.1" },
    detail: { min: "1", max: "10", step: "1" },
  },
  CylinderGeometry: {
    radiusTop: { min: "0.1", max: "2", step: "0.1" },
    radiusBottom: { min: "0.1", max: "2", step: "0.1" },
    height: { min: "0.1", max: "2", step: "0.1" },
  },
};

export function onCanvasClick(event: MouseEvent) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  threeCore.raycaster.setFromCamera(pointer, threeCore.camera);
  const intersects = threeCore.raycaster.intersectObjects(
    threeCore.scene.children,
    false
  );
  const optionsContainer = document.getElementById("options_container");
  const optionsEl = document.getElementById("options");

  if (intersects.length > 0 && intersects[0].object.type === "Mesh") {
    const intersectedObject = intersects[0].object as THREE.Mesh;
    if (
      intersectedObject.geometry.type === "BoxGeometry" ||
      intersectedObject.geometry.type === "IcosahedronGeometry" ||
      intersectedObject.geometry.type === "CylinderGeometry"
    ) {
      selectedObject = intersectedObject as SelectableObject;
      state.objectToAnimate = selectedObject;
      const currentParameters = selectedObject.geometry.parameters as any;
      const paramsToEdit = editableParams[intersectedObject.geometry.type];

      const paramElements = [] as Node[];
      Object.keys(paramsToEdit).forEach((param) => {
        const paramnName = param as ParamName;
        const label = document.createElement("label");
        label.innerText = paramnName;
        const input = document.createElement("input");
        input.type = "range";
        input.name = paramnName;
        input.min = paramsToEdit[paramnName]?.min ?? "0.1";
        input.max = paramsToEdit[paramnName]?.max ?? "2";
        input.step = paramsToEdit[paramnName]?.step ?? "0.1";
        input.value = currentParameters[param];
        input.addEventListener("input", onInputChange);
        paramElements.push(label);
        paramElements.push(input);
      });

      optionsEl?.replaceChildren(...paramElements);
      optionsContainer?.classList.add("show");
    }
  } else {
    selectedObject = null;
    optionsContainer?.classList.remove("show");
  }
}

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const parameterName = target.name;
  const inputValue = parseFloat(target.value);

  if (
    selectedObject &&
    inputValue &&
    !Number.isNaN(inputValue) &&
    inputValue > 0
  ) {
    const currentParameters = (selectedObject.geometry as SelectableGeometries)
      .parameters;

    const newParameters = {
      ...currentParameters,
      [parameterName]: inputValue,
    };
    const newParametersValues = Object.values(newParameters);
    selectedObject.geometry.dispose();

    switch (selectedObject.geometry.type) {
      case "BoxGeometry":
        selectedObject.geometry = new BoxGeometry(...newParametersValues);
        break;
      case "IcosahedronGeometry":
        selectedObject.geometry = new IcosahedronGeometry(
          ...newParametersValues
        );
        break;
      case "CylinderGeometry":
        selectedObject.geometry = new CylinderGeometry(...newParametersValues);
        break;
      default:
        break;
    }
  }
}

export function onWindowResize() {
  threeCore.camera.aspect = window.innerWidth / window.innerHeight;
  threeCore.camera.updateProjectionMatrix();
  threeCore.renderer.setSize(window.innerWidth, window.innerHeight);
}
