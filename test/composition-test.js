import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import State from '../src/state';

describe("Composition", function() {
  let _true, _false, switchboard;

  beforeEach(function() {
    const Switch = State.extend({
      transitions: {
        toggle(current) {
          return !current;
        }
      }
    });

    _true = new Switch(true);
    _false = new Switch(false);

    switchboard = new State({
      left: _true,
      right: _false
    });
  });


  it("starts out with the left true and the right false", function() {
    expect(switchboard.valueOf()).to.deep.equal({
      left: true,
      right: false
    });
  });

  it("lets you toggle switches individually", function() {
    expect(_true.toggle().valueOf()).to.equal(false);
    expect(_false.toggle().valueOf()).to.equal(true);
  });

  describe("toggling the left switch", function() {
    let next;
    beforeEach(function() {
      next = switchboard.left.toggle();
    });
    it("returns a new switchboard with the left toggled", function() {
      expect(next.valueOf()).to.deep.equal({
        left: false,
        right: false
      });
    });
    it("did not change _true", function() {
      expect(_true.valueOf()).to.equal(true);
    });
  });

  describe("transitions that merge into nested states", function() {
    let Switch, Switchboard, switchboard;
    beforeEach(function() {
      Switch = State.extend({
        transitions: {
          toggle(current) { return !current; }
        }
      });
      Switchboard = State.extend({
        left: new Switch(false),
        right: new Switch(false)
      });
      switchboard = new Switchboard();
    });

    it("preserves the microstate nature of nested properties upon assignement", function() {
      expect(switchboard.assign({right: true}).right).to.be.instanceOf(Switch);
    });

    describe("constructing a new instance", function() {
      let next;
      beforeEach(function() {
        next = new Switchboard({left: false, right: true});
      });
      it("keeps the sub property as a substate", function() {
        expect(next.left).to.be.instanceOf(Switch);
        expect(next.right).to.be.instanceOf(Switch);
      });
    });
  });
});
