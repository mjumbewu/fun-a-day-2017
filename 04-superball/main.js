/* jshint esversion: 6 */

// Set up the SVG canvas, and functions for converting from screen coordinates
// to world coordinates.
var svgEl = document.querySelector('svg');
var width = parseInt(svgEl.getAttribute('width'));
var height = parseInt(svgEl.getAttribute('height'));

let sx = 1;
let sy = -1;
let tx = 0;
let ty = 150;

function screen2world(l, t) {
  let result = [(l - tx) / sx, (t - ty) / sy];
  return new Vector(result);
}

function world2screen(pos) {
  return [pos.x() * sx + tx, pos.y() * sy + ty];
}

function world2screenLength(len) {
  return len * (Math.abs(sx) + Math.abs(sy)) / 2;
}

// Select the SVG elements that will act as proxies for physical elements.
var superballEl = document.querySelector('#ball');
var surfaceEls = [
  document.querySelector('#surface1'),
  document.querySelector('#surface2'),
  document.querySelector('#surface3'),
  document.querySelector('#surface4'),
  document.querySelector('#surface5'),
  document.querySelector('#surface6'),
  document.querySelector('#surface7'),
];

// Set up the world objects
var superball = new Ball([10, 100], [10, 0]);
var surfaces = [
  new Surface([  0,   0], [300,   0]),
  new Surface([300,   0], [300, 150]),
  new Surface([300, 150], [  0, 150]),
  new Surface([  0, 150], [  0,   0]),
  new Surface([100,  50], [200,  50]),
  new Surface([200,  50], [100,  50]),
  new Surface([  0,  50], [ 50,   0]),
];

// Set up the object views
var superballView = new CircleView(superball, superballEl);
var surfaceViews = [];
for (let [surface, surfaceEl] of zip(surfaces, surfaceEls)) {
  surfaceViews.push(new PathView(surface, surfaceEl));
}
var views = [superballView].concat(surfaceViews);

// Set up the world
var world = new World(0, [superball].concat(surfaces));
var step = 0.1;
world.play(step, 20);

var historyRange = document.querySelector('input[type="range"]');
function updateRange() {
  if (!world.playing) {
    historyRange.min = 0;
    historyRange.max = world.time;
    historyRange.step = step;
    historyRange.value = historyRange.max;
    historyRange.disabled = false;
  } else {
    historyRange.disabled = true;
  }
}

function playFromRangeThumb() {
  let time = parseFloat(historyRange.value);
  world.spliceAt(time);
  world.play(step, 20);
}

historyRange.addEventListener('input', (evt) => {
  let time = parseFloat(historyRange.value);
  for (let view of views) {
    let state = view.obj.stateAt(time);
    view.update(state);
  }
});

var toggleBtn = document.querySelector('button');
toggleBtn.addEventListener('click', (evt) => {
  if (world.playing) { world.pause(); }
  else { playFromRangeThumb(); }
  updateRange();
});