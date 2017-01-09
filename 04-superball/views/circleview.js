/* jshint esversion: 6 */

class CircleView extends EventManager {
  constructor(obj, el) {
    super();
    this.obj = obj;
    this.el = el;
    obj.addEventListener('step', bind(this.handleStep, this));
  }

  handleStep(evt) {
    this.update(evt.state);
  }

  update(state) {
    let {pos, radius} = state;
    let screen = world2screen(pos);
    let screenr = world2screenLength(radius);

    // If there is a pre-existing shadow element, remove it
    if (this.oldEl) { this.oldEl.remove(); }

    // Make the current element the new shadow element, and clone it to create a
    // new current element.
    this.oldEl = this.el;
    this.el = this.oldEl.cloneNode();

    // Add the current element to the DOM.
    let parent = this.oldEl.parentNode;
    parent.appendChild(this.el);

    // Update the position and size of the current element
    this.el.setAttribute('cx', screen[0]);
    this.el.setAttribute('cy', screen[1]);
    this.el.setAttribute('r', screenr);

    // Fade out the shadow element.
    this.oldEl.style.fillOpacity = 0.5;
  }
}