import React, {DragEvent, MouseEvent, PointerEvent, useCallback, useEffect, useRef, useState, WheelEvent} from "react";
import {LevelDefinition} from "../../Backend/Level";
import TerrainBlock from "./TerrainBlock";
import PlayerBlock from "./PlayerBlock";
import Checkpoint from "./Checkpoint";
import ObstacleBlock from "./ObstacleBlock";

type CanvasProps = {
  level: LevelDefinition;
  updateLevel: (level: LevelDefinition) => void;
  viewSeed?: number;
  movePlayer: boolean;
  leaveMovePlayer: () => void;
  informCheckpointPlayer: () => void;
  leaveCheckpointPlayer: () => void;
};

type SubcanvasProps = CanvasProps & {
  hideGrid: boolean;
  scale: number;
};

const Subcanvas: React.FC<SubcanvasProps> = (p) => {
  const grids = [];
  for (let i = -50000 + 50; i <= 50000 - 50; i += 50) {
    grids.push(<div className={"vertical-grid grid" + (i == 0 ? " axis" : "")} style={{left: `${i + 50000}px`}}/>);
    grids.push(<div className={"horizontal-grid grid" + (i == 0 ? " axis" : "")} style={{top: `${i + 50000}px`}}/>);
  }

  const inCreation = useRef<boolean>(false);
  const startX = useRef<number>(-999);
  const startY = useRef<number>(-999);
  const [newX, setNewX] = useState<number>(0);
  const [newY, setNewY] = useState<number>(0);
  const [newWidth, setNewWidth] = useState<number>(0);
  const [newHeight, setNewHeight] = useState<number>(0);
  const dragStart = useCallback((evt) => {
    if (evt.shiftKey) {
      evt.stopPropagation();
      return;
    }
    if (!evt.ctrlKey || p.movePlayer) return;
    evt.stopPropagation();
    inCreation.current = true;
    const rect = evt.currentTarget.getBoundingClientRect();
    const divX = (evt.clientX - rect.left) / p.scale - 50000;
    const divY = 50000 - (evt.clientY - rect.top) / p.scale;
    const divXToGrid = Math.round(divX / 25) * 25;
    const divYToGrid = Math.round(divY / 25) * 25;
    startX.current = divXToGrid / 50;
    startY.current = divYToGrid / 50;
    setNewX(divXToGrid / 50);
    setNewY(divYToGrid / 50);
    setNewWidth(.5);
    setNewWidth(.5);
  }, [p.scale]);
  const dragOver = (evt: PointerEvent<HTMLDivElement>) => {
    if (!inCreation.current) return;
    const rect = evt.currentTarget.getBoundingClientRect();
    const divX = (evt.clientX - rect.left) / p.scale - 50000;
    const divY = 50000 - (evt.clientY - rect.top) / p.scale;
    const divXToGrid = Math.round(divX / 25) * 25;
    const divYToGrid = Math.round(divY / 25) * 25;
    const worldX = divXToGrid / 50;
    const worldY = divYToGrid / 50;
    let width = Math.round(Math.abs(worldX - startX.current));
    let height = Math.round(Math.abs(worldY - startY.current));
    if (width == 0) width = 1;
    if (height == 0) height = 1;
    if (worldX < startX.current) {
      setNewX(startX.current - width);
    } else {
      setNewX(startX.current);
    }
    setNewWidth(width);
    if (worldY < startY.current) {
      setNewY(startY.current - height);
    } else {
      setNewY(startY.current);
    }
    setNewHeight(height);
  };
  const dragEnd = () => {
    if (!inCreation.current) return;
    inCreation.current = false;
    const terrains = p.level.terrains.slice();
    terrains.push([newX, newY, newWidth, newHeight]);
    p.updateLevel({...p.level, terrains})
    setNewWidth(0);
    setNewHeight(0);
  };
  const click = (evt: MouseEvent<HTMLDivElement>) => {
    if (!evt.shiftKey) return;
    evt.stopPropagation();
    const rect = evt.currentTarget.getBoundingClientRect();
    const divX = (evt.clientX - rect.left) / p.scale - 50000;
    const divY = 50000 - (evt.clientY - rect.top) / p.scale;
    const divXToGrid = Math.floor(divX / 50) * 50;
    const divYToGrid = Math.floor(divY / 50) * 50;
    const worldX = divXToGrid / 50;
    const worldY = divYToGrid / 50;
    if (p.level.fires.findIndex((s) => s[0] == worldX && s[1] == worldY) >= 0) return;
    p.updateLevel({...p.level, fires: [...p.level.fires, [worldX, worldY]]});
  };

  const [inCheckpointCreation, setInCheckpointCreation] = useState<boolean>(false);
  const [checkpointX, setCheckpointX] = useState<number>(-999);

  const dbchandle = useCallback((evt: MouseEvent<HTMLDivElement>) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    const divX = (evt.clientX - rect.left) / p.scale - 50000;
    const divY = 50000 - (evt.clientY - rect.top) / p.scale;
    const divXToGrid = Math.floor(divX / 50) * 50;
    const divYToGrid = Math.floor(divY / 50) * 50;
    const worldX = divXToGrid / 50;
    const worldY = divYToGrid / 50;
    if (!p.movePlayer && !inCheckpointCreation) {
      const cpind = p.level.checkpoints.findIndex((c) => {
        return c[0] <= worldX && worldX <= c[0] + .5;
      });
      if (cpind >= 0) {
        const cp = p.level.checkpoints.slice();
        cp.splice(cpind, 1);
        p.updateLevel({...p.level, checkpoints: cp});
        return;
      }
      p.informCheckpointPlayer();
      setInCheckpointCreation(true);
      setCheckpointX(worldX);
    } else if (inCheckpointCreation) {
      p.updateLevel({
        ...p.level, checkpoints: [...p.level.checkpoints,
          [checkpointX, [worldX, worldY]]
        ] as [number, [number, number]][]
      });
      p.leaveCheckpointPlayer();
      setInCheckpointCreation(false);
    } else if (p.movePlayer) {
      p.updateLevel({...p.level, player: [worldX, worldY]});
      p.leaveMovePlayer();
    }
  }, [checkpointX, inCheckpointCreation, p.scale, p.movePlayer, p.level.checkpoints]);

  return (
    <div
      className={"editor-canvas"}
      onDoubleClick={dbchandle} onClick={click}
      onPointerDown={dragStart} onPointerMove={dragOver} onPointerUp={dragEnd}>
      <div className={"grid-container" + (p.hideGrid ? " noshow" : "")}>
        {grids}
      </div>
      <div className={"death-area"}/>
      <div className={"terrains" + (p.movePlayer || inCheckpointCreation ? " no-interact" : "")}>
        {p.level.terrains.map((level, ind) => (
          <TerrainBlock
            deleteRequest={() => {
              const terrains = p.level.terrains.slice();
              terrains.splice(ind, 1);
              p.updateLevel({
                ...p.level,
                terrains
              });
            }}
            x={level[0]} y={level[1]} width={level[2]} height={level[3]}/>
        ))}
      </div>
      {p.level.checkpoints.map(([x, _], ind) => (
        <Checkpoint x={x} key={ind}/>
      ))}
      {inCheckpointCreation && <Checkpoint x={checkpointX}/>}
      <TerrainBlock
        deleteRequest={() => {
        }}
        x={newX} y={newY} width={newWidth} height={newHeight}/>
      {p.level.fires.map(([x, y], ind) => (
        <ObstacleBlock x={x} y={y} deleteRequest={() => {
          const fires = p.level.fires.slice();
          fires.splice(ind, 1);
          p.updateLevel({...p.level, fires});
        }} key={ind} />
      ))}
      <PlayerBlock x={p.level.player[0]} y={p.level.player[1]}/>
      {p.level.checkpoints.map(([_, [px, py]], ind) => (
        <PlayerBlock x={px} y={py} key={ind}/>
      ))}
    </div>
  )
};

const Canvas: React.FC<CanvasProps> = (p) => {
  const lastX = useRef<number>(-999);
  const lastY = useRef<number>(-999);
  const [viewX, setViewX] = useState<number>(-49950);
  const [viewY, setViewY] = useState<number>(-49600);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    setViewX(-49950);
    setViewY(-49600);
    setScale(1);
  }, [p.viewSeed]);
  const dragStart = (evt: PointerEvent<HTMLDivElement>) => {
    if (evt.ctrlKey) return;
    lastX.current = evt.clientX;
    lastY.current = evt.clientY;
  };
  const dragOver = (evt: PointerEvent<HTMLDivElement>) => {
    if (lastX.current === -999) return;
    const [dx, dy] = [evt.clientX - lastX.current, evt.clientY - lastY.current];
    lastX.current = evt.clientX;
    lastY.current = evt.clientY;
    setViewX((v) => v + dx);
    setViewY((v) => v + dy);
  };
  const dragEnd = () => {
    lastX.current = -999;
    lastY.current = -999;
  };

  const wheel = (evt: WheelEvent) => {
    const down = evt.deltaY > 0;
    if (!down) {
      setScale(s => Math.min(s * 1.1, 2));
    } else {
      setScale(s => Math.max(.2, s * 0.9));
    }
  };

  return (
    <div
      style={{transform: `translateX(${viewX}px) translateY(${viewY}px) scale(${scale})`}}
      onPointerOut={dragEnd}
      onPointerDown={dragStart} onPointerMove={dragOver} onPointerUp={dragEnd}
      onWheel={wheel}
      className={"canvas-container"}>
      <Subcanvas hideGrid={scale < 0.62} level={p.level}
                 leaveMovePlayer={p.leaveMovePlayer} movePlayer={p.movePlayer} updateLevel={p.updateLevel}
                 scale={scale} informCheckpointPlayer={p.informCheckpointPlayer}
                 leaveCheckpointPlayer={p.leaveCheckpointPlayer}/>
    </div>
  )
};

export default Canvas;
