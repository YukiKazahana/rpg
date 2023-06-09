import { _decorator, Component, math, Node, v3, Vec3 } from "cc";
import { Actor } from "./Actor";
import { VirtualInput } from "../input/VirtualInput";
import { StateDefine } from "./StateDefine";
import { MathUtil } from "../util/MathUtil";
import { ProjectileEmitter } from "./ProjectileEmitter";
import { ActorManager } from "../level/ActorManager";
import { Events } from "../events/Events";
import { AudioManager } from "../level/AudioManager";
import { ResourceDefine } from "../resource/ResourceDefine";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("PlayerController")
@requireComponent(Actor)
export class PlayerController extends Component {
  actor: Actor = null;

  @property(Node)
  bowString: Node = null;

  private _splitAngle: number[] = [0];

  start() {
    this.actor = this.node.getComponent(Actor);
    this.node.on("onFrameAttackLoose", this.onFrameAttackLoose, this);
    this.node.on(Events.OnKill, this.onKill, this);
    ActorManager.instance.playActor = this.actor;
  }

  protected onDestroy(): void {
    ActorManager.instance.playActor = null;
  }

  update(deltaTime: number) {
    this.actor.input.x = VirtualInput.horizontal;
    this.actor.input.z = -VirtualInput.vertical;

    if (this.actor.input.length() > 0) {
      this.actor.changeState(StateDefine.Run);
    } else {
      let enemy = this.getNearEnemy();
      if (!enemy) {
        this.actor.changeState(StateDefine.Idle);
      } else {
        Vec3.subtract(this.actor.input, enemy.worldPosition, this.node.worldPosition);
        this.actor.input.y = 0;
        this.actor.input.normalize();

        this.actor.changeState(StateDefine.Attack);
      }
    }
  }

  onFrameAttackLoose() {
    const arrowStartPos = this.bowString.worldPosition;

    let arrowForward: Vec3 = v3();
    for (let i = 0; i < this.actor.actorProperty.projectileCount; i++) {
      MathUtil.rotateAround(arrowForward, this.node.forward, Vec3.UP, this._splitAngle[i]);

      const emitter = this.node.getComponent(ProjectileEmitter);
      const projectile = emitter.create();
      projectile.node.forward = arrowForward;
      projectile.node.worldPosition = arrowStartPos;
      projectile.host = this.node;
    }
    AudioManager.instance.playSfx(ResourceDefine.audio.SfxShoot);
  }

  set projectileCount(count: number) {
    this._splitAngle = [];
    const rad = math.toRadian(10);
    const isOdd = count % 2 !== 0;

    const len = Math.floor(count / 2);
    for (let i = 0; i < len; i++) {
      this._splitAngle.push(-rad * (i + 1));
      this._splitAngle.push(rad * (i + 1));
    }

    if (isOdd) this._splitAngle.push(0);
  }

  getNearEnemy(): Node {
    let minDistance = 9999;
    let minNode: Node = null;

    for (let enemy of ActorManager.instance.enemies) {
      const distance = Vec3.distance(this.node.worldPosition, enemy.worldPosition);
      if (distance < minDistance) {
        minDistance = distance;
        minNode = enemy;
      }
    }
    return minNode;
  }

  onKill() {
    let property = this.actor.actorProperty;
    property.exp++;
    if (property.exp >= property.maxExp) {
      property.exp = 0;
      property.maxExp *= 1.1;
      property.level++;
      this.node.emit(Events.OnPlayerUpgrade, property.level);
    }
    this.node.emit(Events.OnExpGain, property.exp, property.maxExp);
  }
}
