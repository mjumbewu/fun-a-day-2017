/* jshint esversion: 6 */

var grav = new Vector([0, -9.8]);

class Ball extends StateObject {
  constructor(pos, vel, time) {
    super(time, {pos: new Vector(pos), vel: new Vector(vel)});
  }

  step(t) {
    let pos, vel, time;
    [time, {pos, vel}] = this.state();

    let newpos = pos.add(vel.multiply(t)).add(grav.multiply(t*t/2));
    let newvel = vel.add(grav.multiply(t));
    let newtime = time + t;

    let signs = new Array(vel.values.length);
    signs.fill(1);
    for (let dim = 0; dim < pos.values.length; ++dim) {
      if (newpos.values[dim] <= 0) { signs[dim] = -1; }
    }

    this.pushState(newtime, { pos: newpos, vel: newvel.multiply(signs) });
    return this;
  }
}

class World extends eventMixin(StateObject) {
  constructor(time) {
    super(time, {
      objects: [new Ball([0.0, 0.0], [1.0, 5.0])]
    });
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
    this.step(0.02);
  }

  step(t) {
    let [_, {objects}] = this.state();
    for (let obj of objects) {
      obj.step(t);
    }
    this.time += t;

    if (this.playing) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => { this.step(t); }, t * 1000);
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
var width = parseInt(svgEl.getAttribute('width'));
var height = parseInt(svgEl.getAttribute('height'));

let sx = 30.0;
let sy = -30.0;
let tx = 10.0;
let ty = height - 10.0;

function screen2world(l, t) {
  let result = [(l - tx) / sx, (t - ty) / sy];
  return new Vector(result);
}

function world2screen(pos) {
  return [pos.x() * sx + tx, pos.y() * sy + ty];
}

var ballEl = document.querySelector('circle');

function updateBallView(time) {
  let [worldTime, {objects}] = world.stateAt(time);
  let [ballTime, {pos, vel}] = objects[0].stateAt(time);
  let screen = world2screen(pos);
  ballEl.setAttribute('cx', screen[0]);
  ballEl.setAttribute('cy', screen[1]);
}

var world = new World();
world.play();
world.addEventListener('step', (evt) => {
  updateBallView(world.time);
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
  updateBallView(time);
});

var toggleBtn = document.querySelector('button');
toggleBtn.addEventListener('click', (evt) => {
  if (world.playing) { world.pause(); }
  else { playFromRangeThumb(); }
  updateRange();
});