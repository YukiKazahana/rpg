import { _decorator, Component, Node, Prefab, AudioSource, resources, instantiate, director } from "cc";
import { Setting } from "../config/Setting";
import { ResourceDefine } from "../resource/ResourceDefine";
import { Events } from "../events/Events";

/**
 * 音效管理器
 */
export class AudioManager {
  static _instance: AudioManager | null = null;

  static get instance(): AudioManager {
    if (this._instance === null) {
      this._instance = new AudioManager();
    }
    console.log(this._instance);
    return this._instance;
  }

  private bgm: AudioSource | null = null;

  private sfx: Map<string, AudioSource> = new Map();

  onLoad() {
    Setting.instance.on(Events.OnBgmVolumeChanged, this.onBgmVolumeChanged, this);
  }

  onDestroy() {
    Setting.instance.off(Events.OnBgmVolumeChanged, this.onBgmVolumeChanged, this);
  }
  init() {
    resources.load(ResourceDefine.audio.Bgm, Prefab, (err: Error, bgmPrefab: Prefab) => {
      let bgmNode = instantiate(bgmPrefab);
      director.getScene().addChild(bgmNode);
      this.bgm = bgmNode.getComponent(AudioSource);
    });

    this.initSfx(ResourceDefine.audio.SfxHit);
    this.initSfx(ResourceDefine.audio.SfxShoot);
  }

  private initSfx(path: string) {
    resources.load(ResourceDefine.audio.Bgm, Prefab, (err: Error, prefab: Prefab) => {
      let node = instantiate(prefab);
      director.getScene().addChild(node);
      const as = node.getComponent(AudioSource);

      this.sfx.set(path, as);
    });
  }

  playBgm() {
    if (!this.bgm) {
      return;
    }
    if (this.bgm) {
      this.bgm.stop();
    }
    let node = this.bgm.node;
    node.active = true;
    let as = node.getComponent(AudioSource);
    as.volume = Setting.instance.bgmVolume;
    this.bgm = as;
  }

  playSfx(path: string) {
    if (!this.sfx.has(path)) {
      return;
    }
    let node = this.sfx.get(path).node;
    node.active = true;
    let as = node.getComponent(AudioSource);
    as.volume = Setting.instance.sfxVolume;
    as.play();
  }

  onBgmVolumeChanged() {
    if (this.bgm) {
      this.bgm.volume = Setting.instance.bgmVolume;
    }
  }
}
