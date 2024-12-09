/**
 * @file Main scene model
 * @description Scene model for your application
 */

import {A3DModelLoader, ACameraModel, AInteractionEvent, ANodeModel, AObject3DModelWrapper, AObjectNode, AShaderMaterial, Color, GetAppState, NodeTransform3D, Quaternion, V3, Vec2, Vec3, VertexArray3D} from "../../../anigraph";
import {BaseSceneModel} from "../../BaseClasses";
import {ATexture} from "src/anigraph/rendering/ATexture";
import {APointLightModel} from "../../../anigraph/scene/lights";
import {AppConfigs} from "../../AppConfigs";
import {PlayerModel} from "../Nodes/PlayerNode";
import {BotModel} from "../Nodes/CharacterNodes/BotModel";
import {GameTerrainModel} from "../Nodes/GameTerrain/GameTerrainModel";
import {BillboardParticleSystemModel} from "../Nodes/BillboardParticleSystem";
import {LevelDefinition} from "../../Backend/Level";
import {EMPTY_LEVEL} from "../../Backend/DefaultLevels";
import playerBlock from "../Editor/PlayerBlock";
import { CharacterModel, CharacterModelInterface } from "../../BaseClasses";
import { ExampleLoadedCharacterModel } from "../Nodes/Loaded/ExampleLoadedCharacterModel";
import { AddStandardUniforms } from "./HowToAddUniformToControlPanel";
import { LoadedCharacterModel } from "src/app/BaseClasses/LoadedCharacterModel";
import { ABasicShaderModel } from "src/anigraph/rendering/shadermodels/ABasicShaderModel";

let appState = GetAppState();

enum MyMaterialNames {
  basicshader1 = "basicshader1",
  mymaterial2 = "mymaterial2",
}

export class MainSceneModel extends BaseSceneModel {

  playerTexture!: ATexture;
  /**
   * An array of bots. Your
   */
  bots: BotModel[] = [];
  gameTerrains: { [name: string]: GameTerrainModel[] } = {};
  lastTerrains: GameTerrainModel[] = [];
  currentLevel: LevelDefinition = EMPTY_LEVEL;
  passedCheckpoints: number = 0;
  private lastT: number = 0;
  playerMaterial!:AShaderMaterial;
  billboardParticles:BillboardParticleSystemModel[] = [];
  loaded3DModel!: AObject3DModelWrapper;

  /**
   * Our custom player model, and a texture to use for our player
   */
  _player!: LoadedCharacterModel;

  get player(): LoadedCharacterModel {
    return this._player as LoadedCharacterModel;
  }

  set player(v: LoadedCharacterModel) {
    this._player = v;
  }

  _mesh!: CharacterModelInterface;
  get mesh(): CharacterModelInterface {
    return this._mesh as LoadedCharacterModel;
  }
  set mesh(v: CharacterModelInterface) {
    this._mesh = v;
  }

  async loadModelFromFile(path: string, transform?: NodeTransform3D) {
    /**
     * Here we need to load the .ply file into an AObject3DModelWrapper instance
     */
    let meshObject = await A3DModelLoader.LoadFromPath(path)
    meshObject.sourceTransform = transform ?? new NodeTransform3D();
    return meshObject;
  }

  async PreloadAssets() {
    await super.PreloadAssets();
    await GameTerrainModel.LoadShader();
    await PlayerModel.LoadShader();
    // this.materials.setMaterialModel("textured", await ABasicShaderModel.CreateModel("basic"));
    let basicshader1ShaderMaterialModel = await ABasicShaderModel.CreateModel("customexample1");
    await this.materials.setMaterialModel("basicshader1", basicshader1ShaderMaterialModel);

    /**
     * If we want to use vertex colors in our shader, we need to set useVertexColors to true.
     * This will turn vertex colors on by default for materials created with this model.
     * Each time you create a material, you can turn off vertex colors for that material if you want.
     */
    basicshader1ShaderMaterialModel.usesVertexColors=true;

    /**
     * Once a shader model is set like this, we can access it with the material name we assigned it to like so:
     */
    this.playerMaterial = this.materials.CreateShaderMaterial("basicshader1");

  }

  initCamera() {
    this.cameraModel = ACameraModel.CreatePerspectiveFOV(90, 1, 0.01, 30);
    this.cameraModel.setPose(
      NodeTransform3D.LookAt(
        V3(0.0, 0, 5), V3(0, 0, 0),
        V3(0, 1, 0)
      )
    )
  }

  /**
   * The view light is a light that is attached to the camera.
   */
  initViewLight() {

    if (this.viewLight) return;

    /**
     * Create a point light
     * You can have up to 16 point lights in the scene at once by default
     */
    this.viewLight = new APointLightModel(
      this.camera.pose,
      Color.FromString("#ffffff"),
      0.5,
      AppConfigs.ViewLightRange,
      1
    );

    /**
     * Add it as a child of the camera model so that it will move with the camera
     */
    this.cameraModel.addChild(this.viewLight);
  }

  async initGameTerrain() {
    if (this.lastTerrains == this.gameTerrains[this.currentLevel.name])
      return;
    for (let t of this.lastTerrains) {
      t.position.y -= 500;
    }
    if (this.gameTerrains[this.currentLevel.name]) {
      this.lastTerrains = this.gameTerrains[this.currentLevel.name];
      for (let t of this.lastTerrains) {
        t.position.y += 500;
      }
    } else {
      const t = [];
      for (let [x1, y1, w, h] of this.currentLevel.terrains) {
        let terrain = await GameTerrainModel.Create(w, h);
        terrain.position.x = x1 + w / 2;
        terrain.position.y = y1 + h / 2;
        t.push(terrain);
        this.addChild(terrain);
      }
      this.gameTerrains[this.currentLevel.name] = t;
      this.lastTerrains = t;
    }
  }

  async initGameHero() {
    if (!this.player) {
      // this.playerTexture = await ATexture.LoadAsync("./images/tanktexburngreen.jpeg")
      // this.player = await LoadedCharacterModel.Create(this.playerTexture);
      // this.addChild(this.player);
      this.playerTexture = await ATexture.LoadAsync("./models/gltf/Cat_diffuse.jpg");
      const b = this.materials.CreateShaderMaterial("basicshader1");
      b.setTexture('diffuse', this.playerTexture);
      let transform = NodeTransform3D.FromPositionZUpAndScale(V3([0,0,0]), Vec3.UnitZ().times(1), Vec3.UnitY().times(-1), 0.028);
      const q = new Quaternion(1, -1, -1)
      transform._setQuaternionRotation(q)
      const glb = await this.loadModelFromFile("./models/gltf/cat.glb", transform);
      this.player = await LoadedCharacterModel.Create(glb, b);
      this.addChild(this.player);
    }
    this.player.position = new Vec3(...this.currentLevel.player, 0);





  }

  async initModel(model: string, texture: string, scale: number, pos: Array<number>, dir: number=0) {
    let transform = NodeTransform3D.FromPositionZUpAndScale(V3(pos), Vec3.UnitZ().times(1), Vec3.UnitY().times(-1), scale);
    let direction = Quaternion.RotationY(Math.PI * dir);
    let q = new Quaternion(1, 1, 1)
    let sceneRotation = direction.times(q);
    transform._setQuaternionRotation(Quaternion.FromQuaternion(sceneRotation));
    //transform._setQuaternionRotation();
    const glb = await this.loadModelFromFile(model, transform);

    const b = this.materials.CreateShaderMaterial(MyMaterialNames.basicshader1);
    const d = await ATexture.LoadAsync(texture);

    b.setTexture('diffuse', d)
    const a = new ExampleLoadedCharacterModel(
      glb,
      b
    );
    AddStandardUniforms(a.material);
    this.addChild(a);
  }

  async initScene() {
    await this.initGameTerrain();
    await this.initGameHero();
    await this.initParticles();

    //add models
    //cactus
    await this.initModel("./models/gltf/cactus.glb", "./models/gltf/Cactus_diffuse.jpg", 0.175, [10, -34, -20]);
    await this.initModel("./models/gltf/cactus.glb", "./models/gltf/Cactus_diffuse.jpg", 0.173, [29, -34, -20]);
    await this.initModel("./models/gltf/cactus.glb", "./models/gltf/Cactus_diffuse.jpg", 0.171, [51, -34, -20]);
    await this.initModel("./models/gltf/cactus.glb", "./models/gltf/Cactus_diffuse.jpg", 0.179, [70, -34, -20]);
    await this.initModel("./models/gltf/cactus.glb", "./models/gltf/Cactus_diffuse.jpg", 0.176, [91, -34, -20]);
    await this.initModel("./models/gltf/cactus.glb", "./models/gltf/Cactus_diffuse.jpg", 0.177, [119, -34, -20]);

    //scorpion
    // await this.initModel("./models/gltf/scorpion.glb", "./models/gltf/Scorpion_diffuse1.jpg", 0.1, [6, 1, 0]);

    //snake
    // await this.initModel("./models/gltf/snake.glb", "./models/gltf/Snake_diffuse.jpg", 0.02, [4, 1, 0]);

    //camels
    // await this.initModel("./models/gltf/camel.glb", "./models/gltf/Camel_diffuse1.jpg", 1, [7, -19, -20]);

    //tumbleweed
    //await this.initModel("./models/gltf/tumbleweed.glb", "./models/gltf/Tumbleweed_diffuse.jpg", 2, [11, 1, 0]);

    //palm tree
    await this.initModel("./models/gltf/palm_tree.glb", "./models/gltf/Palm_tree_diffuse.jpg", 0.08, [0, -34, -20]);
    await this.initModel("./models/gltf/palm_tree.glb", "./models/gltf/Palm_tree_diffuse.jpg", 0.07, [20, -34, -20]);
    await this.initModel("./models/gltf/palm_tree.glb", "./models/gltf/Palm_tree_diffuse.jpg", 0.09, [39, -34, -20]);
    await this.initModel("./models/gltf/palm_tree.glb", "./models/gltf/Palm_tree_diffuse.jpg", 0.085, [60, -34, -20]);
    await this.initModel("./models/gltf/palm_tree.glb", "./models/gltf/Palm_tree_diffuse.jpg", 0.079, [81, -34, -20]);
    await this.initModel("./models/gltf/palm_tree.glb", "./models/gltf/Palm_tree_diffuse.jpg", 0.08, [100, -34, -20]);

    //await this.initModel("./models/gltf/dragon.glb", "./models/gltf/Dragon_diffuse.jpg", 1, [102, -19, -20]);
    //await this.initModel("./models/gltf/skull.glb", "./models/gltf/skull_diffuse.jpg", 0.01, [-1, 1, 0]);
    //await this.initModel("./models/gltf/turtle.glb", "./models/gltf/Turtle_diffuse.jpg", 0.01, [1.3, 1, 0]);

    this.passedCheckpoints = 0;

    /**
     * Now let's initialize the view light
     */
    this.initViewLight();
  }

    async initParticles() {
        // BillboardParticleSystemModel.AddParticleSystemControls();
      const targetLength = this.currentLevel.fires.length;
      for (let i = this.billboardParticles.length; i < targetLength; i++) {
        const bp = new BillboardParticleSystemModel(new NodeTransform3D(V3(0, -999, 0)));
        this.billboardParticles.push(bp);
      }
      for (let i = 0, j = this.currentLevel.fires.length; i < j; i++) {
        const bp = this.billboardParticles[i];
        bp.setDisable();
        bp.myTransform.position = V3(0, -999, 0);
      }
    }

  async updateLevel(level: LevelDefinition) {
    this.currentLevel = level;
    await this.initScene();
  }

  playerDie() {
    this.player.position = new Vec3(...(
      this.passedCheckpoints === 0 ? this.currentLevel.player : this.currentLevel.checkpoints[this.passedCheckpoints - 1][1]
    ), 0);
    this.player.velocity = new Vec3();
    const q = new Quaternion(0, 0, 0);
    this.player.transform._setQuaternionRotation(q);
  }

    timeUpdate(t: number, paused: boolean = false, ...args:any[]) {
      /**
       * We can call timeUpdate on all of the model nodes in the scene here, which will trigger any updates that they
       * individually define.
       */
      for (let c of this.getDescendantList()) {
        c.timeUpdate(t);
      }

      if (!paused) {
        this.player.update(t - this.lastT, this.gameTerrains[this.currentLevel.name] || []);

        if (this.player.position.y < -10 || t <= 0.5) {
          this.playerDie();
        }

        const [
          playerUpper,
          playerRight,
          playerLower,
          playerLeft
        ] = this.player.getFourBounds();
        for (let i = 0, j = this.currentLevel.fires.length; i < j; i++) {
          const [x, y] = this.currentLevel.fires[i];
          const p = this.billboardParticles[i];
          if (x < playerLeft - 10 || x > playerRight + 10 || y < playerLower - 10 || y > playerUpper + 10) {
            if (!p.disabled) {
              p.setDisable();
              p.myTransform.position = V3(0, -999, 0);
              p.parent?.removeChild(p);
            }
            continue;
          } else {
            if (p.disabled) {
              p.disabled = false;
              p.myTransform.position = V3(x + .5, y, 0);
              this.addChild(p);
            }
          }
          if (((playerLower < y + .8 && playerLower > y + .2) ||
            (playerUpper > y + .2 && playerUpper < y + .8) ||
              (playerLower < y + .2 && playerUpper > y + .8)) &&
            ((playerLeft < x + .8 && playerLeft > x + .2) ||
              (playerRight > x + .2 && playerRight < x + .8) ||
              (playerLeft < x + .2 && playerRight > x + .8))) {
            this.playerDie();
          }
        }

        for (let i = this.passedCheckpoints, j = this.currentLevel.checkpoints.length; i < j; i++) {
          if (Math.abs(this.player.velocity.y) < 0.01 && this.player.position.x >= this.currentLevel.checkpoints[i][0]) {
            this.passedCheckpoints = Math.max(i + 1, this.passedCheckpoints);
          }
        }

        if (Math.abs(this.cameraModel.pose.position.x - this.player.position.x) >= 0.01 ||
          Math.abs(this.cameraModel.pose.position.y - this.player.position.y) >= 0.01) {

          const cameraPos = this.cameraModel.pose.position.clone()
          const playerPos = this.player.position.clone();
          const playerVel = this.player.velocity.clone();
          // higher gravity will look like player falling down harder
          const g = AppConfigs.Gravity > 10 ? (AppConfigs.Gravity - 10) / 10 : 0
          playerVel.y = playerVel.y < g * playerVel.y ? 0 : playerVel.y
          // rate of camera movement, with 1 being camera on player at all times
          const rate = (this.cameraModel.pose.position.y < this.player.position.y ? 0.04 : 0.05);
          // 1.5 is how much screen moves with player
          const velocityCamera = cameraPos.clone().plus(playerVel.clone().times(1.5))
          const new_camera_pos = velocityCamera.clone().plus(playerPos.clone().minus(velocityCamera).times(rate))
          new_camera_pos.z = 10;

          const new_target_pos = new_camera_pos.clone()
          new_target_pos.z = 0;

          this.cameraModel.setPose(
            NodeTransform3D.LookAt(
              new_camera_pos, new_target_pos,
              new Vec3(0, 1, 0)
            )
          );
        }
        this.cameraModel.signalCameraProjectionUpdate();
      }

      this.lastT = t;


        // /**
        //  * For interactions between models, we can trigger logic here. For example, if you want characters to walk on
        //  * uneven terrain, you can make that happen by completing the functions used here:
        //  */
        // const self = this;
        // function adjustHeight(character:Particle3D){
        //     let height = self.terrain.getTerrainHeightAtPoint(character.position.xy);
        //     if(character.position.z<height){character.position.z = height;}
        // }
        //
        // /**
        //  * Here we would apply our adjust height function to the player
        //  */
        // adjustHeight(this.player);
        //
        // /**
        //  * Now lets update bots
        //  */
        // let orbitradius = 0.25;
        // for(let ei=0;ei<this.bots.length;ei++){
        //     let e = this.bots[ei];
        //
        //     /**
        //      * Characters have velocity and mass properties in case you want to implement particle physics
        //      * But for now we will just have them orbit each other.
        //      */
        //     e.position = new Vec3(Math.cos(t*(ei+1)), Math.sin(t*(ei+1)),0).times(orbitradius);
        //
        //     /**
        //      * adjust their height
        //      */
        //     adjustHeight(e);
        // }
    }

    getCoordinatesForCursorEvent(event: AInteractionEvent){
        return event.ndcCursor??new Vec2();
    }
}


