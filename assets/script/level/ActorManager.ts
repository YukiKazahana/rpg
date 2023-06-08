import {
  Animation,
  Node,
  Pool,
  Prefab,
  SkeletalAnimationState,
  director,
  instantiate,
  randomRangeInt,
  resources,
} from "cc";
import { Actor } from "../actor/Actor";
import { Events } from "../events/Events";
import { StateDefine } from "../actor/StateDefine";

export class ActorManager {
  private static _instance: ActorManager | null = null;

  static get instance(): ActorManager {
    if (this._instance === null) {
      this._instance = new ActorManager();
    }
    return this._instance;
  }

  playActor: Actor = null;

  enemies: Array<Node> = [];

  enemyPool: Pool<Node> = null;

  init(onComplete: () => void) {
    resources.loadDir("actor/enemy", Prefab, (err: Error, prefabs: Prefab[]) => {
      if (err) {
        throw err;
      }
      this.enemyPool = new Pool<Node>(
        (): Node => {
          const prefab = prefabs[randomRangeInt(0, prefabs.length)];
          const node = instantiate(prefab);
          node.active = false;
          director.getScene().addChild(node);
          return node;
        },
        10 * prefabs.length,
        (node: Node) => {
          node.removeFromParent();
        }
      );
      onComplete();
    });
  }

  destroy() {
    this.enemies = [];
    this.enemyPool.destroy();
  }

  createEnemy(): Node {
    const node = this.enemyPool.alloc();
    node.active = true;
    this.enemies.push(node);
    node.on(Events.OnDie, this.onEnemyDie, this);
    return node;
  }

  onEnemyDie(node: Node) {
    this.enemies.splice(this.enemies.indexOf(node), 1);
    const actor = node.getComponent(Actor);
    actor.changeState(StateDefine.Die);
    actor.skeletalAnimation.on(
      Animation.EventType.FINISHED,
      (type: Animation.EventType, state: SkeletalAnimationState) => {
        if (state.name === StateDefine.Die) {
          this.enemyPool.free(node);
          node.active = false;
        }
      }
    );
  }

  get randomEnemy() {
    return this.enemies[randomRangeInt(0, this.enemies.length)];
  }
}
