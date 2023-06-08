import { _decorator, Component, instantiate, Layout, Node, Pool, Prefab, resources, Sprite, SpriteFrame } from "cc";
const { ccclass, property, requireComponent } = _decorator;

const replace = new Map([["/", "Slash"]]);

@ccclass("UIImageLabel")
@requireComponent(Layout)
export class UIImageLabel extends Component {
  layout: Layout;

  @property(Prefab)
  numberPrefab: Prefab | null = null;

  numberPool: Pool<Node> = null;

  private _string = "";

  get string(): string {
    return this._string;
  }

  set string(value: string) {
    if ((this, this._string === value)) {
      return;
    }
    this._string = value;
    this.resetString();
  }

  start() {
    this.layout = this.node.getComponent(Layout);

    this.numberPool = new Pool(
      (): Node => {
        const node = instantiate(this.numberPrefab);
        this.node.addChild(node);
        node.active = false;
        return node;
      },
      5,
      (node: Node) => {
        node.removeFromParent();
      }
    );

    this.string = "123";
  }

  protected onDestroy(): void {
    this.numberPool.destroy();
  }

  update(deltaTime: number) {}

  resetString() {
    this.clearString();

    const dir = "ui/art/num/";

    resources.loadDir(dir, () => {
      for (let i = 0; i < this.string.length; i++) {
        let char = this.string[i];
        if (replace.has(char)) {
          char = replace.get(char);
        }
        const path = dir + char + "/spriteFrame";
        const spriteFrame = resources.get(path, SpriteFrame);

        const spriteNode = this.numberPool.alloc();
        const sprite = spriteNode.getComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
        spriteNode.active = true;
        spriteNode.setSiblingIndex(i);
      }
      this.layout.updateLayout();
    });
  }

  clearString() {
    for (let child of this.node.children) {
      child.active = false;
      this.numberPool.free(child);
    }
  }
}
