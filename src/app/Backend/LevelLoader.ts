import {LevelDefinition} from "./Level";
import DefaultLevels from "./DefaultLevels";

export const CURR_VERSION = 3;

export const readLevels = (): LevelDefinition[] => {
  if (typeof window.localStorage === "undefined") {
    return DefaultLevels;
  }
  try {
    const json = localStorage.getItem("savedLevels")!;
    const obj: LevelDefinition[] = JSON.parse(json)!;
    const res = obj.filter((s) => s.version === CURR_VERSION);
    if (res.length === 0) {
      return DefaultLevels;
    } else {
      return res;
    }
  } catch (e) {
    return DefaultLevels;
  }
}

export const saveLevels = (levels: LevelDefinition[]) => {
  if (typeof window.localStorage === "undefined") return;
  localStorage.setItem("savedLevels", JSON.stringify(levels));
}
