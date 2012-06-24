/*global Backbone, _, sinon, suite, beforeEach, test, expect */

(function () {

  var Grandparent = Backbone.View.extend({
    inheritableProperties : [
      'className',
      'options',
      'states'
    ],
    className : 'agatha',
    options : {
      age  : 'old',
      type : 'human'
    },
    states : ['alive']
  });

  var Parent = Grandparent.extend({
    className : 'joe',
    options : {
      age : 'average'
    },
    states : ['employed']
  });

  var Child = Parent.extend({
    className : 'bart',
    options : {
      age : 'young'
    }
  });

  suite('backbone-inheritance');
  beforeEach(function () {
    this.grandparent = new Grandparent();
    this.parent = new Parent();
    this.child = new Child();
  });

  test('instances should have a reference to their super', function () {
    expect(this.grandparent.super).to.exist;
    expect(this.parent.super).to.exist;
    expect(this.child.super).to.exist;
  });

  test('should inherit strings by concatenation with space', function () {
    expect(this.grandparent.$el).to.have.class('agatha');
    expect(this.parent.$el).to.have.class('agatha');
    expect(this.parent.$el).to.have.class('joe');
    expect(this.child.$el).to.have.class('agatha');
    expect(this.child.$el).to.have.class('joe');
    expect(this.child.$el).to.have.class('bart');
  });

  test('should inherit arrays by union', function () {
    expect(this.grandparent.states).to.include('alive');
    expect(this.parent.states).to.include('alive');
    expect(this.parent.states).to.include('employed');
    expect(this.child.states).to.include('alive');
    expect(this.child.states).to.include('employed');
  });

  test('should inherit objects by defaults', function () {
    expect(this.grandparent.options.age).to.equal('old');
    expect(this.grandparent.options.type).to.equal('human');
    expect(this.parent.options.age).to.equal('average');
    expect(this.parent.options.type).to.equal('human');
    expect(this.child.options.age).to.equal('young');
    expect(this.child.options.type).to.equal('human');
  });

}());