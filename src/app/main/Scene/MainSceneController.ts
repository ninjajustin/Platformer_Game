/**
 * @file Main scene controller for your application
 * @description This is where you connect models to views.
 * This is done mainly by defining your model view spec and interaction modes.
 */


import {BaseSceneController} from "../../BaseClasses";
import {AGLContext, AGLRenderWindow,} from "../../../anigraph";
import {ATriangleMeshModel, ATriangleMeshView} from "../../../anigraph/scene/nodes";

import {APointLightModel, APointLightView} from "../../../anigraph/scene/lights";
import {PlayerModel, PlayerView} from "../Nodes/PlayerNode";
import {MainSceneModel} from "./MainSceneModel";
import {BotModel} from "../Nodes/CharacterNodes/BotModel";
import {BotView} from "../Nodes/CharacterNodes/BotView";
import {ExampleThreeJSNodeModel, ExampleThreeJSNodeView} from "../Nodes/ExampleNodes/ExampleThreeJSNode";
import {ExampleParticleSystemModel} from "../Nodes/ExampleNodes/ExampleParticleSystemNode/ExampleParticleSystemModel";
import {ExampleParticleSystemView} from "../Nodes/ExampleNodes/ExampleParticleSystemNode/ExampleParticleSystemView";
import {AppConfigs} from "../../AppConfigs";
import * as THREE from "three";
import {GameTerrainModel} from "../Nodes/GameTerrain/GameTerrainModel";
import {GameTerrainView} from "../Nodes/GameTerrain/GameTerrainView";
import {GameInteractionMode} from "../InteractionModes/GameInteractionMode";
import {GetAppState} from "../MainAppState";
import {ADebugInteractionMode} from "../../../anigraph/scene/interactionmodes";
import { LoadedCharacterModel } from "src/app/BaseClasses/LoadedCharacterModel";
import { LoadedCharacterView } from "src/app/BaseClasses/LoadedCharacterView";
import { BillboardParticleSystemModel, BillboardParticleSystemView } from "../Nodes/BillboardParticleSystem";
import {LevelDefinition} from "../../Backend/Level";
import { ExampleLoadedCharacterModel, ExampleLoadedModel, ExampleLoadedView } from "../Nodes/Loaded";
import { EMPTY_LEVEL } from "src/app/Backend/DefaultLevels";

export class MainSceneController extends BaseSceneController {
  enterEditorMode: () => void = () => {};
  levels: LevelDefinition[] = [EMPTY_LEVEL];
  paused: boolean = false;

  get model(): MainSceneModel {
    return this._model as MainSceneModel;
  }

  /**
   * This is where you specify the mapping from model classes to view classes.
   */
  initModelViewSpecs(): void {
    this.addModelViewSpec(APointLightModel, APointLightView);
    this.addModelViewSpec(ATriangleMeshModel, ATriangleMeshView);
    this.addModelViewSpec(PlayerModel, PlayerView);
    this.addModelViewSpec(BotModel, BotView);
    this.addModelViewSpec(ExampleThreeJSNodeModel, ExampleThreeJSNodeView);
    this.addModelViewSpec(ExampleParticleSystemModel, ExampleParticleSystemView);
    this.addModelViewSpec(GameTerrainModel, GameTerrainView);
    this.addModelViewSpec(LoadedCharacterModel, LoadedCharacterView);
    this.addModelViewSpec(BillboardParticleSystemModel, BillboardParticleSystemView);
    this.addModelViewSpec(ExampleLoadedCharacterModel, ExampleLoadedView);
    this.addModelViewSpec(ExampleLoadedModel, ExampleLoadedView);
  }

  async initScene(): Promise<void> {
    /**
     * Set up the skybox background
     */
    await super.initScene();
    let path = './images/terrain/sand2';
    let format = '.jpg'
    const urls = [
        path + format, path + format,
        path + format, path + format,
        path + format, path + format
    ];

    /**
     * If you want to change the skybox, you will need to provide the appropriate urls to the corresponding textures
     * from a cube map
     */
    const reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.rotation = Math.PI * 0.25;
    this.view.threejs.background = reflectionCube;
  }

  addSlider(name: string, def: number, setter: (v: number) => void,
            min: number, max: number, step: number, multi: number = 1) {
    let appState = GetAppState();
    appState.addSliderControl(name, def * multi, min * multi, max * multi, step * multi);
    this.subscribeToAppState(name, (v) => {
      setter(v / multi)
    });
    appState.updateControlPanel();
  }

  addSelections<T>(name: string, def: T, setter: (v: T) => void, selections: T[]) {
    let appState = GetAppState();
    appState.setSelectionControl(name, def, selections);
    this.subscribeToAppState(name, (v) => {
      setter(v)
    });
    appState.updateControlPanel();
  }

  addBooleanSelections(name: string, def: boolean, setter: (v: boolean) => void) {
    this.addSelections(name, def ? "Yes" : "No", (v) => {
      setter(v === "Yes")
    }, ["Yes", "No"]);
  }

  initControlPanel() {
    this.addSlider(
      "Jump Power",
      AppConfigs.JumpPower, (v) => AppConfigs.JumpPower = v,
      .01, .20, .005, 10000);
    this.addSlider(
      "Move Speed",
      AppConfigs.MoveSpeed, (v) => AppConfigs.MoveSpeed = v,
      .001, .300, .001, 10000);
    this.addSlider(
      "Gravity",
      AppConfigs.Gravity, (v) => AppConfigs.Gravity = v,
      .0001, .0020, .0001, 10000);
    this.addSlider(
      "Slow Down",
      AppConfigs.SlowDown, (v) => AppConfigs.SlowDown = v,
      .01, .20, .001, 1000);
    this.addBooleanSelections(
      "In-air Jump", AppConfigs.AllowMultiJump, (v) => AppConfigs.AllowMultiJump = v);
    // this.addBooleanSelections(
    //   "Debug", false, (v) => {
    //       this.setCurrentInteractionMode(v ? "Debug" : "GameInteraction");
    //   });

  }

  updateLevels(levels: LevelDefinition[]) {
    this.levels = levels;
    this.model.updateLevel(levels[0]);
    const setter = (level: string) => {
      if (level === "Enter editor") {
        this.enterEditorMode();
        return;
      } else {
        const ind = levels.findIndex((v) => v.name === level);
        this.model.updateLevel(levels[ind]);
      }
    };
    this.addSelections<string>("Levels",
      levels[0].name,
      setter,
      [...levels.map((s) => s.name), "Enter editor"]);
  }

  onResize(renderWindow: AGLRenderWindow) {

  }

  initInteractions() {

    /**
     * We will define the debug interaction mode here.
     * The debug mode is offered mainly to provide camera controls for developing and debugging non-control-related
     * features. It may also be useful as an example for you to look at if you like.
     */
    super.initInteractions();
    this.initControlPanel();
    // let debugInteractionMode = new ADebugInteractionMode(this);
    // this.defineInteractionMode("Debug", debugInteractionMode);
    //
    //
    // /**
    //  * This code adds the ExamplePlayer interaction mode and sets it as the current active mode
    //  */
    // let playerInteractionMode = new ExamplePlayerInteractionMode(this);
    // this.defineInteractionMode("ExamplePlayer", playerInteractionMode);
    //
    //
    // let pointerLockInteractionMode = new ExamplePointerLockInteractionMode(this);
    // this.defineInteractionMode("ExamplePointerLock", pointerLockInteractionMode);

    let gameInteractionMode = new GameInteractionMode(this);
    this.defineInteractionMode("GameInteraction", gameInteractionMode);

    /**
     * For starters we will default to the debug mode.
     */
    this.setCurrentInteractionMode("GameInteraction");

  }

  onAnimationFrameCallback(context: AGLContext) {
    // let's update the model
    let time = this.time;
    this.model.timeUpdate(time, this.paused);//, this._currentInteractionModeName.toLowerCase().includes("debug"));

    /**
     * And the interaction mode... This is important for things like camera motion filtering.
     */
    this.interactionMode.timeUpdate(time)

    // clear the rendering context
    context.renderer.clear();
    // this.renderer.clear(false, true);

    // render the scene view
    context.renderer.render(this.view.threejs, this._threeCamera);
  }

}



