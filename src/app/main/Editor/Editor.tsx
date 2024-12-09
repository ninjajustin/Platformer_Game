import React, {useCallback, useState} from "react";
import "./Editor.css";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LevelDefinition} from "../../Backend/Level";
import Canvas from "./Canvas";
import DEFAULT_LEVELS from "../../Backend/DefaultLevels";

export type EditorProps = {
  levels: LevelDefinition[];
  updateLevels: (levels: LevelDefinition[]) => void;
  exit: () => void;
};

const Editor: React.FC<EditorProps> = (p) => {
  const [currentName, setCurrentName] = useState<string>(p.levels[0].name);
  const [viewSeed, setViewSeed] = useState<number>(Math.random());

  const ind = p.levels.findIndex((v) => v.name === currentName);

  const updateLevel = (level: LevelDefinition) => {
    const levels = p.levels.slice();
    levels[ind] = level;
    p.updateLevels(levels);
  };

  const select = useCallback((ind: number) => {
    setCurrentName(p.levels[ind].name);
    setViewSeed(Math.random());
  }, [p.levels]);

  const nameRequest = (promptStr: string, def: string) => {
    let newname = prompt(promptStr, def);
    newname = newname.trim();
    if (newname === "") {
      alert("New name cannot be empty.");
      return nameRequest(promptStr, def);
    }
    for (let level of p.levels) {
      if (level.name === newname) {
        alert("A level with the same name already exists.");
        return nameRequest(promptStr, def);
      }
    }
    return newname;
  };

  const create = useCallback((evt) => {
    let newname = nameRequest("Please name for the new level.", "");
    const levels = p.levels.slice();
    levels.push({fires: [], checkpoints: [], terrains: [], name: newname, version: 3, player: [0, 0]});
    p.updateLevels(levels);
    setCurrentName(newname);
    setViewSeed(Math.random());
    evt.preventDefault();
  }, [p.levels]);

  const rename = useCallback((evt) => {
    let newname = nameRequest("Please enter a new name.", currentName);
    const levels = p.levels.slice();
    levels[ind] = {...levels[ind], name: newname};
    p.updateLevels(levels);
    setCurrentName(newname);
    evt.preventDefault();
  }, [currentName, ind]);

  const remove = useCallback((evt) => {
    const levels = p.levels.slice();
    levels.splice(ind, 1);
    p.updateLevels(levels);
    setCurrentName(levels[0].name);
    setViewSeed(Math.random());
    evt.preventDefault();
  }, [ind]);

  const reset = (evt) => {
    let reset = false;
    if (confirm("Are you sure you want to reset all levels?")) {
      if (!confirm("Confirming once more. This operation cannot be undone.\nClick \"Cancel\" to confirm.")) {
        if (confirm("FINAL CONFIRMATION. \nYou are about to reset all levels to factory settings. This operation CANNOT BE UNDONE. Click \"Yes\" or \"OK\" to confirm.")) {
          p.updateLevels(DEFAULT_LEVELS);
          setCurrentName(DEFAULT_LEVELS[0].name);
          setViewSeed(Math.random());
          alert("The levels have been reset to factory setting.");
          reset = true;
        }
      }
    }
    if (!reset) {
      alert("YOU HAVE CANCELLED RESETTING THE LEVELS. All levels are untouched.");
    }
    evt.preventDefault();
  };

  const exportLevels = () => {
    console.group("Exported JSON");
    const levels = JSON.stringify(p.levels);
    console.log(levels);
    console.groupEnd();
    let success: boolean = false;
    try {
      navigator.clipboard.writeText(levels);
      success = true;
    } catch (e) {}
    alert("Levels JSON has been printed to console" + (success ? " and copied to clipboard." : "."));
  };

  const exportLevel = () => {
    console.group(`Exported JSON for level "${currentName}"`);
    const level = JSON.stringify(p.levels[ind]);
    console.log(level);
    console.groupEnd();
    let success: boolean = false;
    try {
      navigator.clipboard.writeText(level);
      success = true;
    } catch (e) {}
    alert("Level JSON has been printed to console" + (success ? " and copied to clipboard." : "."));
  };

  const [playerMove, setPlayerMove] = useState<boolean>(false);

  const movePlayer = () => {
    setPlayerMove(s => !s);
  }

  const [checkpointTip, setCheckpointTip] = useState<boolean>(false);

  return (
    <div className={"editor"}>
      <Canvas informCheckpointPlayer={() => setCheckpointTip(true)}
              leaveCheckpointPlayer={() => setCheckpointTip(false)}
              leaveMovePlayer={() => setPlayerMove(false)} movePlayer={playerMove} level={p.levels[ind]}
              updateLevel={updateLevel} viewSeed={viewSeed}/>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>{currentName}</Navbar.Brand>
          <Nav>
            <Nav.Link onClick={(evt) => {
              evt.preventDefault();
              p.exit();
            }} href="#">Exit Editor Mode</Nav.Link>
            <NavDropdown title={"Levels"}>
              <>
                {p.levels.map((level, ind) => (
                  <NavDropdown.Item onClick={(evt) => {
                    select(ind);
                    evt.preventDefault();
                  }} href={"#"} key={ind}>{level.name}</NavDropdown.Item>
                ))}
              </>
              <NavDropdown.Divider/>
              <NavDropdown.Item onClick={create} href={"#"}>Create new level</NavDropdown.Item>
              <NavDropdown.Item onClick={reset} href={"#"}>Reset levels to factory setting</NavDropdown.Item>
              <NavDropdown.Item onClick={exportLevels} href={"#"}>Export JSON of all levels</NavDropdown.Item>
              <NavDropdown.Item onClick={exportLevel} href={"#"}>Export JSON of current level</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={"Edit"}>
              <NavDropdown.Item onClick={rename} href={"#"}>Rename this level</NavDropdown.Item>
              <NavDropdown.Item onClick={remove} href={"#"} disabled={p.levels.length < 2}>Remove this
                level</NavDropdown.Item>
              <NavDropdown.Item onClick={movePlayer}
                                disabled={checkpointTip}
                                href={"#"}>{!playerMove ? "Move player" : "Cancel moving player"}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      {!playerMove && !checkpointTip && <Navbar bg="primary" variant="dark">
        <Container>
          <span style={{color: "white"}}>
            Hold Ctrl and drag to create new terrain.
            Double-click terrain to remove.<br/>
            Double-click empty space to add a checkpoint.
            Double-click a checkpoint to remove it.<br/>
            Hold Shift and click to add an obstacle.
            Double-click an obstacle to remove it.
          </span>
        </Container>
      </Navbar>}
      {checkpointTip && <Navbar bg="light" variant="light">
        <Container>
          You have now defined the checkpoint mark.
          Double-click where the player would revive.
        </Container>
      </Navbar>}
      {playerMove && <Navbar bg="light" variant="light">
        <Container>
          Double-click the bottom-left corner of where you would like the player to go.
        </Container>
      </Navbar>}
    </div>
  );
};

export default Editor;
