import {
  Mesh,
  Material,
  BoxGeometry,
  IcosahedronGeometry,
  CylinderGeometry,
} from "three";
import { state } from "./store";
import { snapshot } from "valtio/vanilla";

export type SelectableGeometries =
  | BoxGeometry
  | IcosahedronGeometry
  | CylinderGeometry;

export type SelectableObject = Mesh<
  SelectableGeometries,
  Material | Material[]
>;

export type GeometryNames =
  | "BoxGeometry"
  | "IcosahedronGeometry"
  | "CylinderGeometry";

type RangeOptions = {
  min: string;
  max: string;
  step: string;
};

export type ParamName =
  | "width"
  | "height"
  | "depth"
  | "radius"
  | "detail"
  | "radiusTop"
  | "radiusBottom";

export type EditableParams = Record<
  GeometryNames,
  Partial<Record<ParamName, RangeOptions>>
>;

const { objectToAnimate } = snapshot(state);

export type TObjectToAnimate = typeof objectToAnimate;
