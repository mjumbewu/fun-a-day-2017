/* jshint esversion: 6 */

class StateObject extends EventManager {
  constructor(time, data) {
    super();
    this.history = [ [ time || 0.0, data ] ];
  }

  state() {
    return this.stateAt(null);
  }

  stateWithTime() {
    return this.stateWithTimeAt(null);
  }

  pushState(time, data) {
    this.history.push([time, data]);
  }

  stateIndexAt(t) {
    let firstIndex = 0;
    let lastIndex = this.history.length - 1;

    if (t !== 0 && !t) { return lastIndex; }

    let matchesStateTime = (index, time) => {
      let [currentTime, currentData] = this.history[index] || [null, null];
      let [nextTime, nextData] = this.history[index + 1] || [null, null];

      if (currentTime === null) { return false; }
      if (currentTime === time) { return true; }
      else if (currentTime < time && nextTime === null) { return true; }
      else if (currentTime < time && nextTime > time) { return true; }
      else { return false; }
    };

    // Make a guess at the current index.
    let i = Math.min(Math.floor(t), lastIndex);
    let time, data;

    while (!matchesStateTime(i, t)) {
      [time, data] = this.history[i];
      if (time < t) { firstIndex = i + 1; }
      else if (time > t) { lastIndex = i - 1; }

      if (lastIndex < firstIndex) { return -1; }
      else { i = Math.floor((firstIndex + lastIndex) / 2); }
    }
    return i;
  }

  stateWithTimeAt(t) {
    let index = this.stateIndexAt(t);
    return this.history[index] || [null, null];
  }

  stateAt(t) {
    let [, state] = this.stateWithTimeAt(t);
    return state;
  }

  spliceAt(t) {
    let i = this.stateIndexAt(t);
    this.history.splice(i + 1);
  }
}
