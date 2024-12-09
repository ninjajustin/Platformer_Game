import React from "react";

export type ObstacleBlockProps = {
  x: number;
  y: number;
  deleteRequest: () => void;
};

const ObstacleBlock: React.FC<ObstacleBlockProps> = (p) => {
  return (
    <div className={"obstacle"}
         onDoubleClick={(evt) => {
           p.deleteRequest();
           evt.stopPropagation();
         }}
         style={{
           top: `${50000 - p.y * 50 - 1 * 50}px`,
           left: `${50000 + p.x * 50}px`,
           width: `${1 * 50}px`,
           height: `${1 * 50}px`,
         }}/>
  )
};

export default ObstacleBlock;
