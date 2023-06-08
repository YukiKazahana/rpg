import { _decorator, Node, Prefab, find, instantiate, resources } from "cc";
const { ccclass, property } = _decorator;

export enum DialogDef {
  UISetting = "UISetting",
  UISkillUpgrade = "UISkillUpgrade",
  UISettlement = "UISettlement",
}

@ccclass("UIManager")
export class UIManager {
  private static _instance: UIManager | null = null;

  static get instance(): UIManager {
    if (this._instance === null) {
      this._instance = new UIManager();
    }
    return this._instance;
  }

  private uiRoot: Node | null = null;

  private panels: Map<string, Node> = new Map();

  openPanel(name: string, top: boolean = true) {
    if (this.uiRoot === null) this.uiRoot = find("UIRoot");

    if (this.panels.has(name)) {
      const panel = this.panels.get(name);
      panel.active = true;
      if (top) {
        const index = panel.parent.children.length - 1;
        panel.setSiblingIndex(index);
      }
      return;
    }
    resources.load("ui/prefab/" + name, Prefab, (err: Error, data: Prefab) => {
      const panel = instantiate(data);
      this.panels.set(name, panel);
      this.uiRoot.addChild(panel);
      if (top) {
        const index = panel.parent.children.length - 1;
        panel.setSiblingIndex(index);
      }
    });
  }

  closePanel(name: string, destroy: boolean = false) {
    if (!this.panels.has(name)) {
      return;
    }
    const panel = this.panels.get(name);
    if (destroy) {
      this.panels.delete(name);
      panel.removeFromParent();
    } else [(panel.active = false)];
  }

  openDialog(name: string) {
    for (let dialogDef in DialogDef) {
      if (dialogDef === name) {
        this.openPanel(name);
      } else {
        this.closePanel(dialogDef);
      }
    }
  }

  closeDialog(destroy: boolean = false) {
    for (let dialogDef in DialogDef) {
      this.closePanel(dialogDef, destroy);
    }
  }
}
