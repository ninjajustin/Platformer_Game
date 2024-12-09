export type Position = [number, number];
// x, y, width, height
export type Terrain = [number, number, number, number];

export type LevelDefinition = {
  name: string;
  player: Position;
  terrains: Terrain[];
  fires: Position[];
  version: 1 | 2 | 3;
  checkpoints: [number, [number, number]][],
};
