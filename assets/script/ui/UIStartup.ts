import { _decorator, Button, Component, director, EventHandler, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UIStartup")
export class UIStartup extends Component {
  start() {
    const clickEventHandler = new EventHandler();
    clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
    clickEventHandler.component = "UIStartup"; // 这个是脚本类名
    clickEventHandler.handler = "onBtnStartupClicked";
    clickEventHandler.customEventData = "foobar";

    const btn = this.node.getChildByName("Button").getComponent(Button);
    btn.clickEvents.push(clickEventHandler);
  }

  update(deltaTime: number) {}

  onBtnStartupClicked() {
    director.loadScene("game");
  }
}
