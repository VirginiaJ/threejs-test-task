import { Vector3 } from "three";
import { TObjectToAnimate } from "types";

const point = new Vector3();
let currentTime = Date.now();
let isPositionSet = false;

function getLinearPoint(t: number, p0: Vector3, p1: Vector3) {
  if (t === 1) {
    point.copy(p1);
  } else {
    point.copy(p1).sub(p0);
    point.multiplyScalar(t).add(p0);
  }

  return point;
}

function easeOutBounce(x: number) {
  const n1 = 7.5625;
  const d1 = 2.75;
  let t = x;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}

const start = new Vector3(0, 0, 0);
const end = new Vector3(0, 0, 0);

export function applyBouncing(
  object: TObjectToAnimate,
  amplitude: number,
  duration: number,
  startTime: number
) {
  if (!object) return;
  currentTime = Date.now();

  if (!isPositionSet) {
    end.copy(object.position);
    start.copy(object.position);
    start.y += amplitude;
    isPositionSet = true;
  }

  if (currentTime - startTime <= duration) {
    // Convert to a normalized (0 to 1) number
    const normalizedTime = (currentTime - startTime) / duration;
    // Apply easing function
    const easedTime = easeOutBounce(normalizedTime);
    // Update object position
    object.position.copy(getLinearPoint(easedTime, start, end));
    return false;
  } else {
    isPositionSet = false;
    return true;
  }
}
