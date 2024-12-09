import React from "react";

export type PlayerBlockProps = {
  x: number;
  y: number;
};

const PlayerBlock: React.FC<PlayerBlockProps> = (p) => {
  return (
    <div className={"player"}
         style={{
           top: `${50000 - p.y * 50 - 1 * 50}px`,
           left: `${50000 + p.x * 50}px`,
           width: `${1 * 50}px`,
           height: `${1 * 50}px`,
         }}/>
  )
};

export default PlayerBlock;
