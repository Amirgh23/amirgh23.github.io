// Fixed world-space camera keyframes, ordered as a nearly complete orbit.
export const CAMERA_POINTS = [
  [14, 8, 24],       // Establish the installation and its surroundings.
  [7.5, 3, 12],      // Dolly toward the core.
  [17, 4, 1],        // Reveal the thickness of the mechanism.
  [5, 15, -15],      // Crane over the rear of the array.
  [-12, 6, -17],     // Reverse angle behind the gate.
  [-17, .5, 4],      // Low pass above the docking platform.
  [-7, 7, 24],       // Pull away to the opposite establishing angle.
];
export const CAMERA_LENSES = [43, 48, 40, 46, 44, 46, 42];
export const SHOT_LABELS = ['FIRST CONTACT', 'THE ENERGY CORE', 'LATERAL APPROACH', 'ABOVE THE ARRAY', 'BEYOND THE GATE', 'SURFACE PASS', 'THE DEPARTURE'];
