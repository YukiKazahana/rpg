import { _decorator, Component, Node, ProgressBar, Slider, sys } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UISetting")
export class UISetting extends Component {
  sliderBgmVolume: Slider | null = null;

  progressbarBgmVolume: ProgressBar | null = null;

  sliderSfxVolume: Slider | null = null;

  progressbarSfxVolume: ProgressBar | null = null;

  start() {
    this.sliderBgmVolume = this.node.getChildByName("Bgm").getComponent(Slider);
    this.progressbarBgmVolume = this.node.getChildByPath("Bgm/ProgressBar").getComponent(ProgressBar);
    this.sliderBgmVolume.node.on("slide", this.onBgmVolumeChange, this);

    this.sliderSfxVolume = this.node.getChildByName("Sfx").getComponent(Slider);
    this.progressbarSfxVolume = this.node.getChildByPath("Sfx/ProgressBar").getComponent(ProgressBar);
    this.sliderSfxVolume.node.on("slide", this.onSfxVolumeChange, this);
  }

  update(deltaTime: number) {}

  onBgmVolumeChange(value: Slider) {
    this.progressbarBgmVolume.progress = value.progress;
  }

  onSfxVolumeChange(value: Slider) {
    this.progressbarSfxVolume.progress = value.progress;
  }
}
