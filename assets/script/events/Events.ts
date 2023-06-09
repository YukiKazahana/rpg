import { Event } from "cc";

export enum Events {
  OnDie = "onDie",
  OnProjectileDead = "onProjectileDead",
  OnHurt = "onHurt",
  OnKill = "onKill",
  OnPlayerUpgrade = "onPlayerUpgrade",
  OnExpGain = "onExpGain",
  OnBgmVolumeChanged = "onBgmVolumeChanged",
}

export class CustomEventData extends Event {
  static TYPE;
}
