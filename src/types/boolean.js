import Primitive from "./primitive";

export default class BooleanType extends Primitive {
  static name = "Boolean";

  initialize(value) {
    return !!value;
  }
  toggle() {
    return !this.state;
  }
}
