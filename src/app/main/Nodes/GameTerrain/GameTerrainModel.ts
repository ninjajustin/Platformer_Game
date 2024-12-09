import {ATexture} from "../../../../anigraph/rendering/ATexture";
import {ASerializable, V3, VertexArray3D} from "../../../../anigraph";
import {CharacterModel} from "../../../BaseClasses";
import {TriangleMeshCharacterModel} from "../CharacterNodes";
import {AppConfigs} from "../../../AppConfigs";

@ASerializable("BotModel")
export class GameTerrainModel extends TriangleMeshCharacterModel {

  sizeX!: number;
  sizeY!: number;

  /**
   * Creates a new bot model to be textured with the provided diffuse texture map.
   * @param diffuseMap
   * @param sizex
   * @param sizey
   * @param args
   * @returns {Promise<GameTerrainModel>}
   * @constructor
   */
  static async Create(sizex?: number, sizey?: number, ...args: any[]) {
    sizex = sizex ?? AppConfigs.DefaultBotSize;
    sizey = sizey ?? AppConfigs.DefaultBotSize;

    /**
     * Set the vertices to be a box. The Box3D helper function creates box geometry based on opposite corners,
     * specifically the minimumum and maximum x,y,z coordinate values for an axis-aligned box
     */
    let verts = VertexArray3D.Box3D(
      V3(-0.5 * sizex, -0.5 * sizey, -.2),
      V3(0.5 * sizex, 0.5 * sizey, .2),
    );

    /**
     * Create the new bot model, initialize it with the provided diffuse map, and return it when that is done
     * @type {GameTerrainModel}
     */
    let newmodel = new this(verts);
    newmodel.sizeX = sizex;
    newmodel.sizeY = sizey;
    await newmodel.init("./images/terrain/sandstone.jpeg");
    return newmodel;
  }

  async init(diffuseMap: string | ATexture, ...args: any[]) {
    /**
     * The diffuseMap input can be an ATexture object or a path to a texture. If it is a path, then we load the
     * corresponding texture into an ATexture object
     * @type {ATexture}
     */
    let texture = (diffuseMap instanceof ATexture) ? diffuseMap : await ATexture.LoadAsync(diffuseMap);

    /**
     * Sets the material for our model to the corresponding AShaderMaterial instance, with the provided texture as
     * the diffuse texture.
     */
    this.setMaterial(CharacterModel.ShaderModel.CreateMaterial(
      texture
    ));
  }

}


