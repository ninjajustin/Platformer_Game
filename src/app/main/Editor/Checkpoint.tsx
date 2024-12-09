import React from "react";

export type CheckpointProps = {
  x: number;
}

const Checkpoint: React.FC<CheckpointProps> = (p) => (
  <div className={"checkpoint"} style={{left: 50000 + p.x * 50}}/>
);

export default Checkpoint;
