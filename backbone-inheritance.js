/*global Backbone, _ */

;(function (Backbone) {

// Augmenting `extend` to add `this.super` as a reference to the parent class.
var _extend = Backbone.View.extend;
Backbone.View.extend = function (protoProps, classProps) {
  var child = _extend.apply(this, arguments);
  child.prototype.super = this.prototype;
  return child;
};

var _View = Backbone.View;
Backbone.View = _View.extend({

  // Augmented `_configure` to inherit and combine, instead of overwriting properties up the prototype chain.
  _configure : function (options) {
    this._inheritProperties(this.inheritableProperties || []);
    _View.prototype._configure.apply(this, arguments);
  },

  _inheritProperties : function (properties) {
    var souper = this;
    while (souper = souper.super) {

      for (var i = 0, prop; prop = properties[i]; i++) {
        var parentProp = souper[prop], childProp = this[prop];
        if (parentProp === undefined) continue;

        // Allow for inheriting functions that return values, like a Model's defaults value might.
        if (_.isFunction(childProp)) childProp = childProp();
        if (_.isFunction(parentProp)) parentProp = parentProp();

        // Do the inheriting.
        if (typeof childProp === 'string')
          childProp = childProp + ' ' + parentProp;
        else if (_.isArray(childProp) && _.isArray(parentProp))
          childProp = _.union(childProp, parentProp);
        else if (_.isObject(childProp) && _.isObject(parentProp))
          _.defaults(childProp, parentProp);

        this[prop] = childProp;
      }
    }
  },

  inheritableProperties : [
    'inheritableProperties'
  ],
});

}(Backbone));