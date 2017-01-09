/* jshint esversion: 6 */

class PathView extends EventManager {
  constructor(obj, el) {
    super();
    this.obj = obj;
    this.el = el;
    obj.addEventListener('step', bind(this.handleStep, this));
    this.update(obj.state());
  }

  handleStep(evt) {
    this.update(evt.state);
  }

  update(state) {
    let {pos1, pos2} = state;
    let screen1 = world2screen(pos1);
    let screen2 = world2screen(pos2);
    this.el.classList.add('surface');
    this.el.setAttribute('d', 'M ' + screen1[0] + ' ' + screen1[1] +
                             ' L ' + screen2[0] + ' ' + screen2[1]);
  }
}