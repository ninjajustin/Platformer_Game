import {LevelDefinition} from "./Level";
import {CURR_VERSION} from "./LevelLoader";


const LEVEL1: LevelDefinition =
  {"fires":[[23,1],[24,1],[27,1],[28,1],[27,2],[28,2],[13,3],[13,4],[51,1],[79,2],[79,1],[99,1],[100,1],[88,2],[89,3],[90,4]],"checkpoints":[[38,[38,2]],[73.5,[73.5,2]],[92,[92,7]]],"name":"Mario 1-1","player":[0,2],"terrains":[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[-3,0,0,0],[-3,0,0,0],[-3,0,0,0],[-3,0,0,0],[-3,0,0,0],[-3,0,0,0],[-1.5,0,38,1],[-1.5,0,0,0],[38,0,10.5,1],[50,0.5,0,0],[50,0.5,0,0],[50,0,22,1],[50,0,0,0],[50,0,0,0],[50,0,0,0],[73.5,0.5,0,0],[73.5,0.5,0,0],[73.5,-0.5,0,0],[73.5,-0.5,0,0],[73.5,-0.5,0,0],[73.5,0,32,1],[73.5,0,0,0],[73.5,0,0,0],[73.5,0,0,0],[73.5,0,0,0],[73.5,0,0,0],[73.5,0,0,0],[73.5,0,0,0],[73.5,0,0,0],[6,2,1,1],[6,2,0,0],[10,2,8,1],[13,5,1,1],[13,5,0,0],[13,5,0,0],[23,1,0,0],[23,1,0,0],[23,1,0,0],[23,1,0,0],[22,1,0,0],[22,1,0,0],[22.5,1,0,0],[22.5,1,0,0],[22.5,1,0,0],[22.5,1,0,0],[21,1,2,1],[25,1,2,2],[29,1,2,2],[33,1,2,3],[33,1,0,0],[33,1,0,0],[33,1,0,0],[42,3,0,0],[42,3,0,0],[41,2,3,1],[41,2,0,0],[45,4,0,0],[45,4,0,0],[45,4,5,1],[45,4,0,0],[52,4,3,1],[54,2,1,1],[54,2,0,0],[54,2,0,0],[58,2,2,1],[58,2,0,0],[58,2,0,0],[62,2,1,1],[64,4,2,1],[67,4,2,1],[69,2.5,0,0],[69,2.5,0,0],[69,2,2,1],[69,2,0,0],[69,2,0,0],[69,2,0,0],[69,2,0,0],[69,2,0,0],[75,1,1,1],[76,1,1,1],[76,2,0,0],[76,2,0,0],[76,2,1,1],[77,3,1,1],[77,2.5,0,0],[77,2.5,0,0],[77,2.5,0,0],[77,2.5,0,0],[77,2,1,1],[77,1,1,1],[78,4,1,1],[78,3,1,1],[78,2,0,0],[78,2,0,0],[78,2,0,0],[78,2,1,1],[78,1,1,1],[79,4,0,0],[79,4,0,0],[79,3,1,1],[80,4,1,1],[80,3,1,1],[80,2,1,1],[80,1,1,1],[81,3,1,1],[81,2,1,1],[81,1,1,1],[82,2,1,1],[82,1,1,1],[83,1,1,1],[83,1,0,0],[83,1,0,0],[83,1,0,0],[83,1,0,0],[83,1,0,0],[83,1,0,0],[86.5,2.5,0,0],[86.5,2.5,0,0],[86.5,2,0,0],[86.5,2,0,0],[86.5,2,0,0],[86.5,2,0,0],[86.5,2,1,1],[87.5,3,1,1],[88.5,4,1,1],[90,5,0,0],[90,5,0,0],[89.5,5,1,1],[90.5,6,1,1],[94,1,0.5,21.5],[96.5,1.5,0,0],[96.5,1.5,0,0],[96,1,0,0],[96,1,0,0],[97,1.5,0,0],[97,1.5,0,0],[96.5,5.5,0.5,1],[103,5.5,0.5,1],[98,5.5,4,2.5],[98,5.5,0,0],[98,5.5,0,0],[98,5.5,0,0],[98,5.5,0,0],[98,8,0.5,1],[101.5,8,0.5,1],[100.5,8,0.5,1],[100.5,8,0,0],[100.5,8,0,0],[99,8,0.5,1],[99,8,0,0],[99,8,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[96.5,1,2.5,4.5],[101,1,2.5,4.5],[99,2,2,3.5],[1,-4.5,1,4],[1.5,-1.5,2,1],[3,-2.5,1,1],[2,-3,1,1],[3.5,-3.5,0.5,0],[3.5,-3.5,0.5,0],[3.5,-4.5,0.5,0],[3,-4,1,1],[2,-4.5,1,1],[5,-1,0.5,0],[5,-1.5,1,1],[7,-1.5,1,1],[5.5,-2,1,1],[6.5,-2,1,1],[6,-4.5,1,3],[11,-4.5,1,4],[11.5,-4.5,2,1],[14,-4.5,1,4],[15,-4.5,2,1],[15,-1.5,2,1],[15,-3,1,1],[18,-4,1,3],[19,-1.5,1,1],[20,-4,1,3],[19,-4.5,1,1]],"version":3}
;

const LEVEL2: LevelDefinition =
  {"fires":[[40,1],[21,0],[23,0],[54,-1],[61,-1],[63,-1],[65,-1]],"checkpoints":[[18,[18,0.5]],[45,[45,-0.5]],[69,[69,0.5]]],"terrains":[[-22,-10,22,30.5],[0,-1,1,1],[2,-1,1,1],[4,-1,1,1],[6,-1,1,1],[8,-1,1,1],[10,-1,1,1],[12,-1,1,1],[14,-1,1,1],[18,-1,1,1],[20,-1,1,1],[22,-1,1,1],[24.5,0,0.5,0],[24,-1,1,1],[26,-1,1,1],[28,-1,1,1],[30,0,1,1],[32,0,1,1],[34,0,1,1],[36,0,1,1],[38,0,1,1],[40,0,1,1],[42,0,1,1],[45,-2,1,1],[47,-2,1,1],[51,-1.5,0.5,0],[60,-1,1,1],[62,-1,1,1],[64,-1,1,1],[66,-1,1,1],[69,-1,1,1],[71,-1,1,1],[73.5,-1,1,1],[75.5,-1,1,1],[78,-1,1,1],[80,-1,1,1],[82,-1,14,1],[49,-2,1,1],[51,-2,1,1],[53,-2,1,1],[55,-2,1,1],[57,-2,1,1],[58.5,-1.5,1,1],[92,2,0.5,0],[96,-1,1,7],[93,6,4,1],[92,1.5,1,5.5]],"name":"Speed Run","version":3,"player":[1,2]}
;

const DEFAULT_LEVELS: LevelDefinition[] = [
  LEVEL1,
  LEVEL2,
];

export const EMPTY_LEVEL: LevelDefinition = {
  name: "___empty_level___",
  player: [0, 0],
  terrains: [],
  version: 3,
  checkpoints: [],
  fires: [],
};

export default DEFAULT_LEVELS;