/* jshint esversion: 6 */

class StateObject {
  constructor(time, data) {
    this.history = [ [ time || 0.0, data ] ];
  }

  state() {
    let lastIndex = this.history.length - 1;
    return this.history[lastIndex];
  }

  pushState(time, data) {
    this.history.push([time, data]);
  }

  stateIndexAt(t) {
    let firstIndex = 0;
    let lastIndex = this.history.length - 1;

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

  stateAt(t) {
    let index = this.stateIndexAt(t);
    return this.history[index];
  }

  spliceAt(t) {
    let i = this.stateIndexAt(t);
    this.history.splice(i + 1);
  }
}
