//     Backbone Inheritance 0.0.1
//
//     by Ian Storm Taylor
//     https://github.com/ianstormtaylor/backbone-inheritance

;(function (Backbone) {
/*global Backbone, _ */

// Augmenting View's `extend` to add `super` as a reference to the parent class.
var _extend = Backbone.View.extend;
Backbone.View.extend = function (protoProps, classProps) {
  var child = _extend.apply(this, arguments);
  child.prototype.super = this.prototype;
  return child;
};

// Extending the original Backbone.View to support inheritance.
var _View = Backbone.View;
Backbone.View = _View.extend({

  // Augmented `_configure` to inherit and combine, instead of overwriting properties up the prototype chain.
  _configure : function (options) {
    this._inheritProperties(this.inheritableProperties || []);
    _View.prototype._configure.apply(this, arguments);
  },

  // Runs up the prototype chain and checks for the properties in `inheritableProperties`. Inherits based on type, so Strings get concatenated with a space, arrays get unioned, and objects get defaulted.
  //
  //     childString + ' ' + parentString;
  //     _.union(childArray, parentArray);
  //     _.defaults(childObject, parentObject);
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

  // A list of properties to inherit. The only inheritable property by default is `inheritableProperties` itself so that it is usable anywhere on the chain, but you can add to it in any extended child views.
  inheritableProperties : [
    'inheritableProperties'
  ],
});

}(Backbone));