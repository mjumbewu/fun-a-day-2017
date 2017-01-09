/* jshint esversion: 6 */

class Body extends StateObject {
  constructor(pos, vel, mass, time) {
    super(time, {pos: new Vector(pos), vel: new Vector(vel), mass});
  }

  step(t) {
    let pos, vel, mass, time, forces;
    [time, {pos, vel, mass}] = this.state();

    forces = new Array(pos.values.length);
    forces.fill(0);
    forces = new Vector(forces);

    let [, {objects}] = this.world.state();
    for (let obj of objects) {
      if (obj === this) { continue; }
      let [, other] = obj.stateAt(time);
      let delta = other.pos.subtract(pos);
      let magnitude = G * mass * other.mass / Math.pow(delta.magnitude(), 2);
      forces = forces.add(delta.unit().multiply(magnitude));
    }
    let acc = forces.multiply(1 / mass);

    let newpos = pos.add(vel.multiply(t)).add(acc.multiply(t*t/2));
    let newvel = vel.add(acc.multiply(t));
    let newtime = time + t;

    this.pushState(newtime, { pos: newpos, vel: newvel, mass });
    return this;
  }
}
