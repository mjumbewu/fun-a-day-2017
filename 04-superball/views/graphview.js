/* jshint esversion: 6 */

class GraphView extends EventManager {
  constructor(obj, el, func) {
    super();
    this.obj = obj;
    this.el = el;
    this.func = func;
    obj.addEventListener('step', bind(this.handleStep, this));
    this.update(obj.state(), 0, false);
  }

  handleStep(evt) {
    this.update(evt.state, evt.time, true);
  }

  update(state, time, step) {
    let value = this.func(time, state);
    let path = this.el.getAttribute('d') || '';
    this.el.classList.add('graph');
    this.el.setAttribute('d', path + (step ? ' L ' : ' M ') + time + ' ' + value);
  }
}