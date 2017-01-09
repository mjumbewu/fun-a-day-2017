/* jshint esversion: 6 */

function eventMixin(Base) {
  return class extends Base {
    constructor(...args) {
      super(...args);
      this.listeners = {};
    }

    dispatchEvent(event) {
      let type = event.type;  // e.g., 'click' or 'step'
      let handlers = this.listeners[type];

      if (!handlers) return;

      for (let handler of handlers) {
        setTimeout(() => { handler(event.detail); }, 0);
      }
    }

    emit(name, data) {
      let event = new CustomEvent(name, { detail: data });
      this.dispatchEvent(event);
    }

    addEventListener(type, handler) {
      let handlers = this.listeners[type];
      if (!handlers) { handlers = this.listeners[type] = []; }
      let index = handlers.indexOf(handler);
      if (index === -1) { handlers.push(handler); }
    }

    removeEventListener(type, handler) {
      if (type && !handler) {
        delete this.listeners[type];
        return;
      }

      let handlers = this.listeners[type];
      if (handlers && handler) {
        let index = handlers.indexOf(handler);
        if (index > -1) { handlers.splice(index, 1); }
      }
    }
  };
}

class EventManager extends eventMixin(Object) {}
