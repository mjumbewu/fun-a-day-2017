/* jshint esversion: 6 */

var G = 6.673e-11;  // gravitational constant

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

class World extends eventMixin(StateObject) {
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

  play() {
    this.playing = true;
    this.step(3600, 1);
  }

  step(elapsed_world_time, wait_time) {
    let t = elapsed_world_time;
    let [_, {objects}] = this.state();
    for (let obj of objects) {
      obj.step(t);
    }
    this.time += t;

    if (this.playing) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => { this.step(t, wait_time); }, wait_time || t * 1000);
    }

    let time = this.time;
    let event = new CustomEvent('step', { detail: {time, objects} });
    this.dispatchEvent(event);
  }

  spliceAt(time) {
    super.spliceAt(time);
    this.time = Math.min(time, this.time);
    let [_, {objects}] = this.state();
    for (let obj of objects) {
      obj.spliceAt(time);
    }
  }

  playFrom(time) {
    this.spliceAt(time);
    this.play();
  }
}

var svgEl = document.querySelector('svg');
var width = svgEl.viewBox.baseVal.width;
var height = svgEl.viewBox.baseVal.height;

let sx = 5e-10;
let sy = -5e-10;
let tx = width / 2;
let ty = height / 2;

function screen2world(l, t) {
  let result = [(l - tx) / sx, (t - ty) / sy];
  return new Vector(result);
}

function world2screen(pos) {
  return [pos.x() * sx + tx, pos.y() * sy + ty];
}

var bodyEls = [
  document.querySelector('#sun'),
  document.querySelector('#mercury'),
  document.querySelector('#venus'),
  document.querySelector('#earth'),
  document.querySelector('#moon'),
  document.querySelector('#mars'),
];
var distEl = document.querySelector('#dist');
var avgVelEl = document.querySelector('#avg-vel');

function updateBodyViews(time) {
  let [, {objects}] = world.stateAt(time);
  for (let [obj, el] of zip(objects, bodyEls)) {
    let [, {pos}] = obj.stateAt(time);
    let screen = world2screen(pos);
    el.setAttribute('cx', screen[0]);
    el.setAttribute('cy', screen[1]);
  }
}

var world = new World(0, [new Body([0, 0], [0, 0], 1.989e30),  // Sun
                          new Body([5.791e10, 0],           [0, 4.736e4],           3.28500e23),  // Mercury
                          new Body([1.082e11, 0],           [0, 3.502e4],           4.86700e24),  // Venus
                          new Body([1.496e11, 0],           [0, 2.978e4],           5.97219e24),  // Earth
                          new Body([1.496e11 + 3.844e8, 0], [0, 2.978e4 + 1.022e3], 7.34600e22),  // Moon
                          new Body([2.279e11, 0],           [0, 2.407e4],           6.39000e23),  // Mars
                        ]);
world.play();
world.addEventListener('step', (evt) => {
  updateBodyViews(world.time);
});

var historyRange = document.querySelector('input[type="range"]');
function updateRange() {
  if (!world.playing) {
    historyRange.min = 0;
    historyRange.max = world.time;
    historyRange.value = historyRange.max;
    historyRange.disabled = false;
  } else {
    historyRange.disabled = true;
  }
}

function playFromRangeThumb() {
  let time = parseFloat(historyRange.value);
  world.spliceAt(time);
  world.play();
}

historyRange.addEventListener('input', (evt) => {
  let time = parseFloat(historyRange.value);
  updateBodyViews(time);
});

var toggleBtn = document.querySelector('button');
toggleBtn.addEventListener('click', (evt) => {
  if (world.playing) { world.pause(); }
  else { playFromRangeThumb(); }
  updateRange();
});