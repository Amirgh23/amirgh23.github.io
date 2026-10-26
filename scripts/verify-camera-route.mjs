import assert from 'node:assert/strict';
import { CatmullRomCurve3, Vector3 } from 'three';
import { CAMERA_POINTS, CAMERA_LENSES, SHOT_LABELS } from '../src/cameraRoute.js';

const route = new CatmullRomCurve3(CAMERA_POINTS.map(point => new Vector3(...point)), false, 'centripetal');
let winding = 0;
let previousAngle = Math.atan2(CAMERA_POINTS[0][0], CAMERA_POINTS[0][2]);
for (let sample = 0; sample <= 1200; sample++) {
  const point = route.getPoint(sample / 1200);
  assert(point.toArray().every(Number.isFinite), 'Camera coordinates must remain finite.');
  assert(Math.hypot(point.x, point.z) > 9, 'Camera must clear the gate and its supports.');
  assert(point.y > -4.5, 'Camera must stay above the platform.');
  const angle = Math.atan2(point.x, point.z);
  winding += Math.atan2(Math.sin(angle - previousAngle), Math.cos(angle - previousAngle));
  previousAngle = angle;
}
assert(winding > Math.PI * 1.5, 'The route must orbit over 270 degrees, rather than pan left and right.');
assert(Math.max(...CAMERA_POINTS.map(point => point[1])) - Math.min(...CAMERA_POINTS.map(point => point[1])) > 12, 'Include a genuine crane shot and low pass.');
assert.equal(CAMERA_POINTS.length, CAMERA_LENSES.length);
assert.equal(CAMERA_POINTS.length, SHOT_LABELS.length);
console.log(`Camera route verified: ${Math.round(winding * 180 / Math.PI)} degree orbit, 1201 collision-clear samples, 7 shots.`);
