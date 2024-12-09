import {ASerializable, Vec3} from "../../../../anigraph";
import {TriangleMeshCharacterModel} from "../CharacterNodes/TriangleMeshCharacterModel";
import {ATexture} from "../../../../anigraph/rendering/ATexture";
import {AppConfigs} from "../../../AppConfigs";
import {CharacterModel} from "../../../BaseClasses";
import {GameTerrainModel} from "../GameTerrain/GameTerrainModel";

@ASerializable("PlayerModel")
export class PlayerModel extends TriangleMeshCharacterModel {
  size!: number;
  requestJump: boolean = false;
  horizontalMoving: boolean = false;

  static async Create(diffuseMap: string | ATexture, size?: number, ...args: any[]) {
    size = size ?? AppConfigs.DefaultBotSize;
    let newmodel = new this();
    newmodel.size = size;
    await newmodel.init(diffuseMap);
    return newmodel;
  }

  async init(diffuseMap: string | ATexture, ...args: any[]) {
    this.setMaterial(CharacterModel.ShaderModel.CreateMaterial(
      (diffuseMap instanceof ATexture) ? diffuseMap : new ATexture(diffuseMap)
    ));
  }

  update(deltaT: number, listOfTerrains: GameTerrainModel[]) {
    if (this.requestJump) {
      if (AppConfigs.AllowMultiJump || Math.abs(this.velocity.y) < 0.001) {
        this.velocity.y = AppConfigs.JumpPower;
      }
      this.requestJump = false;
    }
    this.velocity.y -= AppConfigs.Gravity;
    if (!this.horizontalMoving) {
      this.velocity.x /= 1 + AppConfigs.SlowDown;
    }
    let realVelX = this.velocity.x;
    for (let terrain of listOfTerrains) {
      if (terrain.position.y < -400) continue;
      const upperBound = terrain.position.y + terrain.sizeY / 2;
      const lowerBound = terrain.position.y - terrain.sizeY / 2;
      const leftBound = terrain.position.x - terrain.sizeX / 2;
      const rightBound = terrain.position.x + terrain.sizeX / 2;

      const thisUpperBound = this.position.y + this.size / 2;
      const thisLowerBound = this.position.y - this.size / 2;
      const thisLeftBound = this.position.x - this.size / 2;
      const thisRightBound = this.position.x + this.size / 2;

      if ((thisLowerBound < upperBound && thisLowerBound > lowerBound) ||
        (thisUpperBound > lowerBound && thisUpperBound < upperBound) ||
        Math.abs(thisLowerBound - lowerBound) < .00001 && Math.abs(thisUpperBound - upperBound) < .00001) {
        if (this.velocity.x > 0 && thisRightBound + this.velocity.x > leftBound && thisLeftBound < rightBound) {
          realVelX = Math.min(this.velocity.x, leftBound - thisRightBound);
        }

        if (this.velocity.x < 0 && thisLeftBound + this.velocity.x < rightBound && thisRightBound > rightBound) {
          realVelX = Math.max(this.velocity.x, -(thisLeftBound - rightBound));
        }
      }

      if ((thisLeftBound < rightBound && thisLeftBound > leftBound) ||
        (thisRightBound > leftBound && thisRightBound < rightBound) ||
        Math.abs(thisRightBound - rightBound) < .00001 && Math.abs(thisLeftBound - leftBound) < .00001) {
        if (this.velocity.y < 0 && thisLowerBound + this.velocity.y < upperBound && thisUpperBound > upperBound) {
          this.velocity.y = Math.max(this.velocity.y, -(thisLowerBound - upperBound));
        }

        if (this.velocity.y > 0 && thisUpperBound + this.velocity.y > lowerBound && thisLowerBound < lowerBound) {
          this.velocity.y = Math.min(this.velocity.y, lowerBound - thisUpperBound);
        }
      }

    }

    this.position = this.position.plus(new Vec3(realVelX, this.velocity.y, 0));
  }
}



