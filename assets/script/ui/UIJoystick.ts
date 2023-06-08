import { _decorator, CCFloat, Component, EventTouch, input, Input, math, Node, v3, Vec2, Vec3 } from "cc";
import { VirtualInput } from "../input/VirtualInput";
const { ccclass, property } = _decorator;

@ccclass("UIJoystick")
export class UIJoystick extends Component {
  @property(Node)
  stickBg: Node | null = null;

  @property(Node)
  thumbnail: Node | null = null;

  @property({ type: CCFloat })
  radius: number = 0;

  initPosition: Vec3 = v3();

  start() {
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    this.initPosition = this.stickBg.worldPosition.clone();
  }

  update(deltaTime: number) {}

  onTouchStart(ev: EventTouch) {
    const x = ev.touch.getUILocationX();
    const y = ev.touch.getUILocationY();
    this.stickBg.setWorldPosition(x, y, 0);
  }

  onTouchMove(ev: EventTouch) {
    const x = ev.touch.getUILocationX();
    const y = ev.touch.getUILocationY();

    const worldPosition = v3(x, y, 0);
    const localPosition = v3();

    this.stickBg.inverseTransformPoint(localPosition, worldPosition);
    const len = localPosition.length();
    localPosition.normalize();

    localPosition.multiplyScalar(math.clamp(len, 0, this.radius));

    this.thumbnail.setPosition(localPosition);

    VirtualInput.horizontal = this.thumbnail.position.x / this.radius;
    VirtualInput.vertical = this.thumbnail.position.y / this.radius;
  }

  onTouchEnd() {
    this.stickBg.setWorldPosition(this.initPosition);
    this.thumbnail.setPosition(Vec3.ZERO);

    VirtualInput.horizontal = 0;
    VirtualInput.vertical = 0;
  }
}
