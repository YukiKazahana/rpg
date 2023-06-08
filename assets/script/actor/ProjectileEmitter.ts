import { _decorator, Component, director, instantiate, Node, Pool, Prefab } from "cc";
import { Projectile } from "./Projectile";
import { Events } from "../events/Events";
const { ccclass, property } = _decorator;

@ccclass("ProjectileEmitter")
export class ProjectileEmitter extends Component {
  @property(Prefab)
  arrowPrefab: Prefab = null;

  pool: Pool<Node> = null;

  start() {
    this.pool = new Pool(
      () => {
        const node = instantiate(this.arrowPrefab);
        node.active = false;
        return node;
      },
      50,
      node => {
        node.removeFromParent();
      }
    );
  }

  protected onDestroy(): void {
    this.pool.destroy();
  }

  update(deltaTime: number) {}

  create(): Projectile {
    const node = this.pool.alloc();
    if (node.parent === null) {
      director.getScene().addChild(node);
    }
    const projectile = node.getComponent(Projectile);
    node.once(Events.OnProjectileDead, this.onProjectileDead, this);
    node.active = true;
    return projectile;
  }

  onProjectileDead(projectile: Projectile) {
    projectile.startTime = 0;
    projectile.node.active = false;
    this.pool.free(projectile.node);
  }
}
