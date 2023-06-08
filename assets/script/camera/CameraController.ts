import { _decorator, Component, Node, v3, Vec3 } from "cc";
import { ActorManager } from "../level/ActorManager";
const { ccclass, property } = _decorator;

let tempPos: Vec3 = v3();

@ccclass("Camera")
export class Camera extends Component {
  initialDirection: Vec3 = v3();

  speed: number = 0.0;

  start() {
    // Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target!.worldPosition);
    // this.camera.node.lookAt(this.target.worldPosition, Vec3.UP);
  }

  update(deltaTime: number) {
    let target = ActorManager.instance.playActor;
    if (!target) {
      return;
    }
    if (this.initialDirection === null) {
      this.initialDirection = v3();
      Vec3.subtract(this.initialDirection, this.node.worldPosition, target.node.worldPosition);
      this.node.lookAt(target.node.worldPosition, Vec3.UP);
    } else {
      Vec3.add(tempPos, target.node.worldPosition, this.initialDirection);
      tempPos.y = 4;
      this.node.setWorldPosition(tempPos);
    }
  }
}
