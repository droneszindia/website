/**
 * Engineering-dossier callouts for each pre-built frame. Labels are drawn from the client's own
 * narrative prose (NOT invented specs) and anchored to real parts in the exploded flat-lay photo.
 * `ax/ay` = anchor point on the photo (% of the image box, measured off a calibration grid);
 * `ly` = the label's vertical slot at the right margin (% of the image box) so labels don't
 * collide. Anchors bias right/centre so the leader lines don't cross the whole specimen.
 */
export interface FrameCallout {
  label: string;
  ax: number;
  ay: number;
  ly: number;
}

export const FRAME_CALLOUTS: Record<string, FrameCallout[]> = {
  "five-inch": [
    { label: "Field-replaceable arms", ax: 78, ay: 21, ly: 18 },
    { label: "Reinforced carbon fiber", ax: 62, ay: 34, ly: 37 },
    { label: "Modular 3D-printed core", ax: 58, ay: 49, ly: 53 },
    { label: "Industry-standard electronics", ax: 47, ay: 61, ly: 73 },
  ],
  "seven-inch": [
    { label: "Extended long-range arms", ax: 78, ay: 22, ly: 18 },
    { label: "Endurance-optimized frame", ax: 45, ay: 37, ly: 38 },
    { label: "Payload flexibility", ax: 63, ay: 57, ly: 58 },
    { label: "Field-repairable & modular", ax: 42, ay: 66, ly: 80 },
  ],
  "ten-inch": [
    { label: "Sensor & payload mounts", ax: 52, ay: 14, ly: 16 },
    { label: "Larger structural footprint", ax: 60, ay: 42, ly: 40 },
    { label: "Vibration-damping standoffs", ax: 88, ay: 55, ly: 58 },
    { label: "Higher payload capacity", ax: 48, ay: 89, ly: 82 },
  ],
  "thirteen-inch": [
    { label: "Larger-propulsion arms", ax: 78, ay: 22, ly: 18 },
    { label: "Reinforced truss geometry", ax: 45, ay: 44, ly: 40 },
    { label: "Modular standoff mounts", ax: 67, ay: 54, ly: 58 },
    { label: "High-strength composite", ax: 50, ay: 64, ly: 78 },
  ],
};
