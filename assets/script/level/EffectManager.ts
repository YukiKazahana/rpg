import { Node, ParticleSystem, Pool, Prefab, Vec3, director, instantiate, randomRangeInt, resources } from "cc";
import { Pools } from "../util/Pools";

export class EffectManager {
  private static _instance: EffectManager | null = null;

  static get instance(): EffectManager {
    if (this._instance === null) {
      this._instance = new EffectManager();
    }
    return this._instance;
  }
  pools: Pools<string, Node> = new Pools();

  init(onComplete: () => void) {
    resources.loadDir("effect/prefab", Prefab, (err: Error, prefabs: Prefab[]) => {
      if (err) {
        throw err;
      }
      for (const p of prefabs) {
        console.log("pools", p.name);
        this.pools.newPool(
          "effect/prefab/" + p.name,
          (): Node => {
            const node = instantiate(p);
            node.active = false;
            director.getScene().addChild(node);
            return node;
          },
          50,
          (node: Node) => {
            node.removeFromParent();
          }
        );
      }

      onComplete();
    });
  }

  destroy() {
    this.pools.destroyAll();
  }

  play(key: string, position: Vec3) {
    const node = this.pools.alloc(key);
    node.active = true;
    node.setWorldPosition(position);

    const particleSystem = node.getComponent(ParticleSystem);
    particleSystem.play();

    particleSystem.schedule(() => {
      this.pools.free(key, node);
    }, particleSystem.duration);
  }
}
