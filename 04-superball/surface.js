/* jshint esversion: 6 */

class Surface extends StateObject {
  constructor(pos1, pos2, time) {
    super(time, {pos1: new Vector(pos1), pos2: new Vector(pos2)});
  }

  normal() {
    if (!this._normal) {
      let {pos1, pos2} = this.state();
      let diff = pos2.subtract(pos1);
      let unit = diff.multiply(1 / diff.magnitude());
      this._normal = new Vector([-unit.y(), unit.x()]);
    }
    return this._normal;
  }

  step(t) {}

  pos1(time) { return this.stateAt(time).pos1; }
  pos2(time) { return this.stateAt(time).pos2; }
}
