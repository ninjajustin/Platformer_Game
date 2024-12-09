/**
 * @file Manages the configuration settings for the widget.
 * @author Abe Davis
 * @description Main react component for the app. If you want to add additional react widgets you are welcome, but this
 * generally shouldn't be necessary.
 */

import {GetAppState} from "./MainAppState";
import {AThreeJSContextComponent, ControlPanel} from "../../anigraph";
import React, {useEffect, useState} from "react";

import {MainSceneController, MainSceneModel} from "./Scene";
import Editor from "./Editor/Editor";
import {LevelDefinition} from "../Backend/Level";
import {readLevels, saveLevels} from "../Backend/LevelLoader";

const SceneModel = new MainSceneModel();
SceneModel.confirmInitialized();
const SceneController = new MainSceneController(SceneModel);


/**
 * Comment out the code above and uncomment the code below to run the Example1Scene
 * Which has a loaded 3D model and the billboard particle system skeleton code
 */
// import {Example1SceneModel} from "./Scene/ExampleScenes/Example1";
// import {Example1SceneController} from "./Scene/ExampleScenes/Example1";
// const SceneModel = new Example1SceneModel();
// SceneModel.confirmInitialized();
// const SceneController = new Example1SceneController(SceneModel);


// import {Example2SceneModel} from "./Scene/ExampleScenes/Example2";
// import {Example2SceneController} from "./Scene/ExampleScenes/Example2";
// const SceneModel = new Example2SceneModel();
// SceneModel.confirmInitialized();
// const SceneController = new Example2SceneController(SceneModel);

// import {Example3SceneModel} from "./Scene/ExampleScenes/Example3";
// import {Example3SceneController} from "./Scene/ExampleScenes/Example3";
// const SceneModel = new Example3SceneModel();
// SceneModel.confirmInitialized();
// const SceneController = new Example3SceneController(SceneModel);


let appState = GetAppState();

export function MainComponent() {
  const [levels, setLevels] = useState<LevelDefinition[]>(readLevels());
  const [editorMode, setEditorMode] = useState<boolean>(false);

  SceneController.enterEditorMode = () => {
    setEditorMode(true);
  };

  useEffect(() => {
    SceneController.updateLevels(levels);
  }, []);

  useEffect(() => {
    const resizeHandle = () => {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const agc = document.body.querySelector<HTMLDivElement>(".anigraphcontainer");
      const scale = Math.min(vw / 2000, vh / 2000);
      const tx = (vw - scale * 2000) / 2;
      const ty = (vh - scale * 2000) / 2;
      agc!.style.transform = `translateX(${tx}px) translateY(${ty}px) scale(${scale})`;
    };
    resizeHandle();
    window.addEventListener("resize", resizeHandle);
    return () => {
      window.removeEventListener("resize", resizeHandle);
    };
  }, []);

  useEffect(() => {
    SceneController.paused = editorMode;
  }, [editorMode]);

  return (
    <div>
      {!editorMode && <>
        <ControlPanel appState={appState}></ControlPanel>
        <AThreeJSContextComponent
          controller={SceneController}
        />
      </>}
      {editorMode && <Editor levels={levels} updateLevels={(levels) => {
        setLevels(levels);
        // debugger;
        saveLevels(levels);
      }} exit={() => {
        window.location.reload();
      }}/>}

    </div>
  );
}
