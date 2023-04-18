import { SelectableObject } from "types";
import { proxy } from "valtio/vanilla";

interface IStore {
  objectToAnimate: SelectableObject | null;
}

export const state: IStore = proxy({ objectToAnimate: null });
