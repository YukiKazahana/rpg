import { EventTarget, math, _decorator } from "cc";
import { PlayerPreference } from "./PlayerPreference";
const { ccclass, property } = _decorator;

@ccclass("Setting")
export class Setting extends EventTarget {
  private static _instance: Setting = new Setting();

  static get instance(): Setting {
    return this._instance;
  }

  private _bgmVolume: number = 1.0;

  set bgmVolume(value: number) {
    this._bgmVolume = math.clamp01(value);
    PlayerPreference.setFloat("bgmVolume", this._bgmVolume);
    this.emit("onBgmVolumeChange", this._bgmVolume);
  }
  get bgmVolume(): number {
    return this._bgmVolume;
  }

  private _sfxVolume: number = 1.0;

  set sfxVolume(value: number) {
    this._sfxVolume = math.clamp01(value);
    PlayerPreference.setFloat("sfxVolume", this._sfxVolume);
    // this.emit("change
  }
  get sfxVolume(): number {
    return this._sfxVolume;
  }

  load() {
    this._bgmVolume = PlayerPreference.getFloat("bgmVolume");
    this._sfxVolume = PlayerPreference.getFloat("sfxVolume");
  }
}
