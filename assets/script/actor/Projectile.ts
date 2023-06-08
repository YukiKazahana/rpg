import { _decorator, CCFloat, Collider, Component, ICollisionEvent, math, Node, PhysicsSystem, v3, Vec3 } from "cc";
import { ProjectileProperty } from "./ProjectileProperty";
import { Events } from "../events/Events";
import { MathUtil } from "../util/MathUtil";
const { ccclass, property, requireComponent } = _decorator;

let tempPosition: Vec3 = v3();
let forward: Vec3 = v3();

@ccclass("Projectile")
export class Projectile extends Component {
  @property(CCFloat)
  linearSpeed: number = 3;

  @property(CCFloat)
  angularSpeed: number = 180;

  host: Node = null;

  projectileProperty: ProjectileProperty = new ProjectileProperty();

  collider: Collider = null;

  target: Node = null;

  startTime: number = 0;

  protected start(): void {
    this.collider = this.node.getComponent(Collider);
    this.collider.on("onTriggerEnter", this.onTriggerEnter, this);
  }

  protected onDestroy(): void {}

  protected update(dt: number): void {
    this.startTime += dt;
    if (this.startTime > this.projectileProperty.lifeTime) {
      this.node.emit(Events.OnProjectileDead, this);
      return;
    }
    if (this.target !== null) {
      Vec3.subtract(tempPosition, this.target.worldPosition, this.node.worldPosition);
      tempPosition.normalize();

      const angle = math.toRadian(this.angularSpeed) * dt;
      MathUtil.rotateToward(forward, this.node.forward, tempPosition, angle);
      this.node.forward = forward;
    }

    Vec3.scaleAndAdd(tempPosition, this.node.worldPosition, this.node.forward, this.linearSpeed * dt);
    //TODO:this.node.worldPosition=tempPosition;
    this.node.setWorldPosition(tempPosition);
  }

  onTriggerEnter(ev: ICollisionEvent) {
    this.projectileProperty.penetration--;
    if (this.projectileProperty.penetration <= 0) {
      this.node.emit(Events.OnProjectileDead, this);
    }
  }
}
