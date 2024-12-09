import React from "react";

export type TerrainBlockProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  deleteRequest: () => void;
};

const TerrainBlock: React.FC<TerrainBlockProps> = (p) => {
  if (p.width == 0 || p.height == 0) return null;
  return (
    <div className={"terrain"}
         onDoubleClick={(evt) => {
           p.deleteRequest();
           evt.stopPropagation();
         }}
         style={{
           top: `${50000 - p.y * 50 - p.height * 50}px`,
           left: `${50000 + p.x * 50}px`,
           width: `${p.width * 50}px`,
           height: `${p.height * 50}px`,
         }}/>
  )
};

export default TerrainBlock;
