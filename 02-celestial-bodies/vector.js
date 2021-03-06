/* jshint esversion: 6 */

class Vector {
  constructor(values) {
    this.values = (values instanceof Vector ? values.values : values);
  }

  multiply(other) {
    let len = this.values.length;

    // If the other value is an array, just create a Vector from it.
    if (other instanceof Array) {
      let array = other;
      other = new Vector(array);
    }

    // If the other value is not an array and not a vector, then assume it's
    // scalar and create a single-value Vector.
    else if (!(other instanceof Vector)) {
      let value = other;
      other = new Vector(new Array(len));
      other.values.fill(value);
    }

    // Assert that the vectors have the same dimension
    if (other.values.length !== len) {
      console.error(this);
      console.error(other);
      throw 'Arrays do not have the same dimension.';
    }

    let result = new Array(len);
    for (let i = 0; i < len; ++i) {
      result[i] = this.values[i] * other.values[i];
    }
    return new Vector(result);
  }

  add(other) {
    let len = this.values.length;

    // If the other value is an array, just create a Vector from it.
    if (other instanceof Array) {
      let array = other;
      other = new Vector(array);
    }

    // Assert that the vectors have the same dimension
    if (other.values.length !== len) {
      console.error(this);
      console.error(other);
      throw 'Arrays do not have the same dimension.';
    }

    let result = new Array(len);
    for (let i = 0; i < len; ++i) {
      result[i] = this.values[i] + other.values[i];
    }
    return new Vector(result);
  }

  subtract(other) {
    return this.add(other.multiply(-1));
  }

  x() { return this.values[0]; }
  y() { return this.values[1]; }
  magnitude() {
    let sum = 0;
    for (let value of this.values) {
      sum += Math.pow(value, 2);
    }
    return Math.sqrt(sum);
  }
  unit() {
    return this.multiply(1.0 / this.magnitude());
  }
}
