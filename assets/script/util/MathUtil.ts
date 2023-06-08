import { Vec3, v3 } from "cc";

let tempVec: Vec3 = v3();
let tempVec2: Vec3 = v3();
let tempVec3: Vec3 = v3();
let up = v3();

export class MathUtil {
  static signAngle(from: Vec3, to: Vec3, axis: Vec3): number {
    const angle = Vec3.angle(from, to);
    let cross = v3();
    Vec3.cross(cross, from, to);

    const sign = Math.sign(cross.x * axis.x + cross.y * axis.y + cross.z * axis.z);

    return angle * sign;
  }

  static rotateAround(out: Vec3, forward: Vec3, axis: Vec3, maxAngleDelta: number) {
    const cos = Math.cos(maxAngleDelta);
    const sin = Math.sin(maxAngleDelta);

    Vec3.multiplyScalar(tempVec, forward, cos);

    Vec3.cross(tempVec2, axis, forward);

    Vec3.scaleAndAdd(tempVec3, tempVec, tempVec2, sin);

    const dot = Vec3.dot(axis, forward);

    Vec3.scaleAndAdd(out, tempVec3, axis, dot * (1.0 - cos));
  }

  static rotateToward(out: Vec3, from: Vec3, to: Vec3, maxAngleDelta: number) {
    Vec3.cross(up, from, to);
    this.rotateAround(out, from, up, maxAngleDelta);
  }
}
