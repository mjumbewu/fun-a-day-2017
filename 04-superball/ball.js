/* jshint esversion: 6 */

RADIUS = 5;

class Ball extends StateObject {
  constructor(pos, vel, rad, time) {
    super(time, {pos: new Vector(pos), vel: new Vector(vel), radius: rad || RADIUS});
  }

  step(t, silent=false) {
    let {pos, vel, radius} = this.state();
    let time = this.world.time;

    let newpos = pos.add(vel.multiply(t)).add(grav.multiply(t*t/2));
    let newvel = vel.add(grav.multiply(t));
    let newtime = time + t;
    let remaining = 0;

    let {objects} = this.world.state();
    for (let obj of objects) {
      if (obj instanceof Surface) {
        // Surfaces don't move, so we don't have to worry about time; this is a
        // "simple" 2D collision detection
        let normal = obj.normal();

        // Check whether the ball is moving towards the surface by checking the
        // dot product of the shifted
        let delta = newpos.subtract(pos);
        let componentlen = delta.dot(normal);
        let direction = componentlen > 0 ? 1 : -1;

        // Make a surface unidirectional; the ball should only interact with one
        // side (the positive side) of the surface.
        if (direction > 0) { continue; }

        // Check whether the segment from pos to newpos intersects the segment
        // that is the surface shifted by radshift.
        let radshift = normal.multiply(RADIUS);
        let shifted1 = obj.pos1().add(radshift);
        let shifted2 = obj.pos2().add(radshift);
        let segment = shifted2.subtract(shifted1);
        let crossmag = delta.cross(segment);

        if (crossmag === 0) {
          continue;
        }

        // The following formulas are adapted from
        // http://stackoverflow.com/a/565282/123776
        //
        // p = pos
        // q = shifted1
        // r = delta
        // s = segment
        // t = ballprogress
        // u = surfprogress
        let diff = shifted1.subtract(pos);
        let ballprogress = diff.cross(segment) / crossmag;
        let surfprogress = diff.cross(delta) / crossmag;

        if (0 <= ballprogress && 1 >= ballprogress &&
            0 <= surfprogress && 1 >= surfprogress) {
          let dt = t * ballprogress;

          remaining = t - dt;

          newpos = pos.add(delta.multiply(ballprogress));
          newvel = vel.add(grav.multiply(dt));
          newvel = newvel.subtract(normal.multiply(2 * newvel.dot(normal)));
          newtime = time + dt;
        }
      }
    }

    let newstate = { pos: newpos, vel: newvel, radius};
    this.pushState(newtime, newstate);

    if (remaining) {
      this.step(remaining, silent=true);
    }

    if (!silent) {
      this.emit('step', {time: newtime, state: newstate});
    }

    return this;
  }
}
