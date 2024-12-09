import type {HasInteractionModeCallbacks} from "../../../anigraph";
import {Quaternion} from "../../../anigraph";
import {AInteractionEvent, AKeyboardInteraction, ASerializable, NodeTransform3D, Vec3} from "../../../anigraph";
import {ASceneInteractionMode} from "../../../anigraph/scene/interactionmodes/ASceneInteractionMode";
import {MainSceneController} from "../Scene/MainSceneController";
import {MainAppInteractionMode} from "../../BaseClasses/MainAppInteractionMode";
import {AppConfigs} from "../../AppConfigs";


@ASerializable("GameInteractionMode")
export class GameInteractionMode extends MainAppInteractionMode {

  constructor(owner?: MainSceneController,
              name?: string,
              interactionCallbacks?: HasInteractionModeCallbacks,
              ...args: any[]) {
    super(name, owner, interactionCallbacks, ...args);
    // this.reset();
  }

  get camera() {
    return this.model.camera;
  }

  get player() {
    return this.model.player;
  }

  /**
   * Create an instance in a single call, instead of calling new followed by init
   * @param owner
   * @param args
   * @returns {ASceneInteractionMode}
   * @constructor
   */
  static Create(owner: MainSceneController, ...args: any[]) {
    let controls = new this();
    controls.init(owner);
    return controls;
  }

  reset() {
    // You can reset the control mode here
    this.camera.pose = NodeTransform3D.LookAt(
      this.player.position.plus(Vec3.UnitZ().times(3)),
      this.player.position,
      Vec3.UnitY()
    )
  }

  /**
   * This gets called immediately before the interaction mode is activated. For now, we will call reset()
   * @param args
   */
  beforeActivate(...args: any[]) {
    super.beforeActivate(...args);
    this.reset();
  }

  // onWheelMove(event: AInteractionEvent, interaction: AWheelInteraction) {
  //     let zoom = (event.DOMEvent as WheelEvent).deltaY;
  //     let movedir = this.camera.pose.rotation.getLocalZ();
  //     this.camera.pose.position = this.camera.pose.position.plus( movedir.times(0.0005 * zoom));
  // }

  // onDragStart(event: AInteractionEvent, interaction: ADragInteraction): void {
  //     interaction.setInteractionState('lastCursor', event.ndcCursor);
  // }
  // onDragMove(event: AInteractionEvent, interaction: ADragInteraction): void {
  //     if(!event.ndcCursor){
  //         return;
  //     }
  //     let mouseMovement = event.ndcCursor.minus(interaction.getInteractionState('lastCursor'));
  //     interaction.setInteractionState('lastCursor', event.ndcCursor);
  //     let rotationX = -mouseMovement.x;
  //     let rotationY = mouseMovement.y;
  //     let qX = Quaternion.FromAxisAngle(this.camera.up, rotationX);
  //     let qY = Quaternion.FromAxisAngle(this.camera.right, rotationY);
  //     let newPose = this.camera.pose.clone();
  //     newPose = new NodeTransform3D(qX.appliedTo(newPose.position), newPose.rotation.times(qX));
  //     newPose = new NodeTransform3D(qY.appliedTo(newPose.position), newPose.rotation.times(qY));
  //     this.cameraModel.setPose(newPose);
  //     this.cameraModel.signalTransformUpdate();
  // }
  // onDragEnd(event: AInteractionEvent, interaction: ADragInteraction): void {
  //     let cursorWorldCoordinates:Vec2|null = event.ndcCursor;
  //     let dragStartWorldCoordinates:Vec2|null = interaction.dragStartEvent.ndcCursor;
  // }

  onKeyDown(event: AInteractionEvent, interaction: AKeyboardInteraction) {
    if (interaction.keysDownState['w'] ||
      interaction.keysDownState['ArrowUp'] ||
      interaction.keysDownState['Up']) {
      this.player.requestJump = true;
    }
    if (interaction.keysDownState['a'] ||
      interaction.keysDownState['ArrowLeft'] ||
      interaction.keysDownState['Left']) {
      this.player.velocity.x = -AppConfigs.MoveSpeed;
      this.player.horizontalMoving = true;
      const q = Quaternion.RotationY(Math.PI)
      this.player.transform._setQuaternionRotation(q)

    }
    if (interaction.keysDownState['d'] ||
      interaction.keysDownState['ArrowRight'] ||
      interaction.keysDownState['Right']) {
      this.player.velocity.x = AppConfigs.MoveSpeed;
      this.player.horizontalMoving = true;
      const q = new Quaternion(0, 0, 0)
      this.player.transform._setQuaternionRotation(q)
    }
  }

  onKeyUp(event: AInteractionEvent, interaction: AKeyboardInteraction) {
    // if(!(interaction.keysDownState['w'] ||
    //   interaction.keysDownState['ArrowUp'] ||
    //   interaction.keysDownState['Up'])){
    //     //this.player.position.y = this.player.position.y+this.keyboardMovementSpeed;
    // }
    if (!(interaction.keysDownState['a'] ||
      interaction.keysDownState['ArrowLeft'] ||
      interaction.keysDownState['Left'] ||
      interaction.keysDownState['d'] ||
      interaction.keysDownState['ArrowRight'] ||
      interaction.keysDownState['Right'])) {
      this.player.horizontalMoving = false;
    }
  }

  /**
   * This would be a good place to implement the time update of any movement filters
   * @param t
   * @param args
   */
  timeUpdate(t: number, ...args: any[]) {
  }

}