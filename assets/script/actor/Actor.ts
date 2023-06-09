import {
  _decorator,
  Animation,
  CCFloat,
  Collider,
  Component,
  ICollisionEvent,
  Node,
  PhysicsSystem,
  RigidBody,
  SkeletalAnimation,
  SkeletalAnimationState,
  v3,
  Vec3,
} from "cc";
import { StateDefine } from "./StateDefine";
import { MathUtil } from "../util/MathUtil";
import { ActorProperty } from "./ActorProperty";
import { Projectile } from "./Projectile";
import { Events } from "../events/Events";
const { ccclass, property } = _decorator;

const tempVelocity = v3();

@ccclass("Actor")
export class Actor extends Component {
  currState: StateDefine = StateDefine.Idle;

  @property(SkeletalAnimation)
  skeletalAnimation: SkeletalAnimation = null;

  rigidBody: RigidBody = null;
  collider: Collider = null;

  @property(CCFloat)
  linearSpeed: number = 1.0;

  @property(CCFloat)
  angularSpeed: number = 20;

  input: Vec3 = v3();

  actorProperty: ActorProperty = new ActorProperty();

  start() {
    this.rigidBody = this.node.getComponent(RigidBody);
    this.collider = this.node.getComponent(Collider);
    this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
    this.skeletalAnimation?.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);
  }

  protected onDestroy(): void {
    this.collider?.off("onTriggerEnter", this.onTriggerEnter, this);
    this.skeletalAnimation?.off(Animation.EventType.FINISHED, this.onAnimationFinished, this);
  }

  update(deltaTime: number) {
    switch (this.currState) {
      case StateDefine.Run:
        this.doRotate();
        this.doMove();
        break;
    }
  }

  doRotate() {
    const angle = MathUtil.signAngle(this.node.forward, this.input, Vec3.UP);
    tempVelocity.x = 0;
    tempVelocity.y = angle * this.angularSpeed;
    tempVelocity.z = 0;
    this.rigidBody.setAngularVelocity(tempVelocity);
  }

  doMove() {
    const spead = this.input.length() * this.linearSpeed;
    tempVelocity.x = this.node.forward.x * spead;
    tempVelocity.y = 0;
    tempVelocity.z = this.node.forward.z * spead;
    this.rigidBody.setLinearVelocity(tempVelocity);
  }

  stopMove() {
    this.rigidBody.setLinearVelocity(Vec3.ZERO);
  }

  changeState(state: StateDefine) {
    if (state == this.currState && state != StateDefine.Hit) {
      return;
    }

    if (this.currState === StateDefine.Die) {
      return;
    }

    if (this.currState === StateDefine.Hit) {
      if (state !== StateDefine.Die && state !== StateDefine.Hit) {
        return;
      }
    }

    if (state !== StateDefine.Run) {
      this.stopMove();
    }
    this.currState = state;
    this.skeletalAnimation.crossFade(state, 0.1);
  }

  onAnimationFinished(eventType: Animation.EventType, state: SkeletalAnimationState) {
    if (state.name == StateDefine.Attack) {
      this.changeState(StateDefine.Idle);
    }

    if (state.name == StateDefine.Hit) {
      this.changeState(StateDefine.Idle);
    }
  }

  respawn() {
    this.currState = StateDefine.Idle;
    this.skeletalAnimation.crossFade(this.currState, 0.1);
  }

  onTriggerEnter(ev: ICollisionEvent) {
    if (ev.otherCollider.getGroup() === PhysicsSystem.PhysicsGroup.DEFAULT) {
      return;
    }

    const projectile = ev.otherCollider.getComponent(Projectile);
    const hostActor = projectile.host.getComponent(Actor);

    let hurtDirection = v3();
    Vec3.subtract(hurtDirection, this.node.worldPosition, projectile.node.worldPosition);
    hurtDirection.normalize();
    this.hurt(hostActor.actorProperty.attack, hurtDirection, projectile.host);
  }

  hurt(damage: number, hurtDirection: Vec3, hurtSrc: Node) {
    if (this.currState === StateDefine.Die) {
      return;
    }
    this.actorProperty.hp -= damage;
    this.node.emit(Events.OnHurt, this.actorProperty.hp / this.actorProperty.maxHp);
    if (this.actorProperty.hp <= 0) {
      this.onDie();
      hurtSrc.emit(Events.OnKill, this);
    } else {
      this.changeState(StateDefine.Hit);
    }
    hurtDirection.multiplyScalar(2.0);
    this.rigidBody.applyImpulse(hurtDirection);
  }

  onDie() {
    this.changeState(StateDefine.Die);
    this.node.emit(Events.OnDie, this.node);
  }
}
