import { _decorator, Component, director, Node, resources } from "cc";
import { DialogDef, UIManager } from "./UIManager";
const { ccclass, property } = _decorator;

@ccclass("UIGame")
export class UIGame extends Component {
  start() {}

  update(deltaTime: number) {}

  onExitGame() {
    resources.releaseUnusedAssets();
    director.loadScene("startup");
  }

  onPauseGame() {
    if (director.isPaused) {
      director.resume();
    } else {
      director.pause();
    }
  }

  onOpenSetting() {
    UIManager.instance.openDialog(DialogDef.UISetting);
  }
}
