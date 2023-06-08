import { _decorator, BoxCollider, Collider, Component, macro, Node, randomRange, RigidBody, v3, Vec3 } from "cc";
import { ActorManager } from "./ActorManager";
import { Actor } from "../actor/Actor";
const { ccclass, property } = _decorator;

@ccclass("Level")
export class Level extends Component {
  @property(BoxCollider)
  spawnCollider: BoxCollider = null;

  spawnPos: Vec3 = v3();

  baseHp: number = 100;

  count: number = 10;

  maxAlive: number = 50;

  start() {
    ActorManager.instance.init(() => {
      this.schedule(
        () => {
          if (ActorManager.instance.enemies.length > this.maxAlive) {
            return;
          }
          for (let i = 0; i < this.count; i++) {
            this.randomSpawn();
          }
        },
        10,
        macro.REPEAT_FOREVER,
        1.0
      );
      this.schedule(
        () => {
          this.baseHp *= 1.2;
        },
        20,
        macro.REPEAT_FOREVER,
        1.0
      );
    });
  }

  randomSpawn() {
    this.spawnPos.x = randomRange(-this.spawnCollider.size.x, this.spawnCollider.size.x);
    this.spawnPos.z = randomRange(-this.spawnCollider.size.z, this.spawnCollider.size.z);
    this.doSpawn(this.spawnPos);
  }

  doSpawn(spawnPoint: Vec3) {
    const node = ActorManager.instance.createEnemy();
    //TODO
    node.setWorldPosition(spawnPoint);

    const actor = node.getComponent(Actor);
    actor.actorProperty.maxHp = this.baseHp;
    actor.actorProperty.hp = this.baseHp;

    const scale = randomRange(1.0, 2.0);
    node.setWorldScale(scale, scale, scale);

    const rigidBody = node.getComponent(RigidBody);
    rigidBody.mass = scale;
  }

  update(deltaTime: number) {}
}
