/* jshint esversion: 6 */

class World extends StateObject {
  constructor(time, objects) {
    super(time, { objects });
    for (let obj of objects) {
      obj.world = this;
    }
    this.time = time || 0.0;
    this.playing = false;
    this.timeout = null;
  }

  pause() {
    this.playing = false;
    clearTimeout(this.timeout);
  }

  play(step_duration = 0.02, step_delay = null) {
    this.playing = true;
    this.step(step_duration, step_delay);
  }

  step(elapsed_world_time, wait_time) {
    let t = elapsed_world_time;
    let {objects} = this.state();
    for (let obj of objects) {
      obj.step(t);
    }
    this.time += t;

    if (this.playing) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => { this.step(t, wait_time); }, wait_time || t * 1000);
    }

    this.emit('step', {
      time: this.time,
      objects: objects
    });
  }

  spliceAt(time) {
    super.spliceAt(time);
    this.time = Math.min(time, this.time);
    let {objects} = this.state();
    for (let obj of objects) {
      obj.spliceAt(time);
    }
  }

  playFrom(time) {
    this.spliceAt(time);
    this.play();
  }
}
