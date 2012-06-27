//     Backbone Inheritance 0.0.1
//
//     by Ian Storm Taylor
//     https://github.com/ianstormtaylor/backbone-inheritance

;(function (root, factory) {
  // Set up appropriately for the environment.
  // AMD
  /*global define */
  if (typeof define === 'function' && define.amd) {
    define(['underscore'], function(_) {
      return factory(root, _);
    });
  }
  // Browser globals
  else {
    if (root.Backbone === undefined) throw new Error('Couldn\'t find Backbone');
    root.Backbone.mixin || (root.Backbone.mixin = {});
    root.Backbone.mixin.inheritance = factory(root, root._);
  }
})(this, function (root, _) {

  var backboneInherit = function (inherits) {
    inherits || (inherits = []);

    // Augmenting `extend` to add `__super__` as a reference to the parent class on instances so that we can travel up the prototype chain. `__super__` shouldn't be used for any logic in the instance itself.
    var _extend = this.extend;
    this.extend = function (protoProps, classProps) {
      var child = _extend.apply(this, arguments);
      child.prototype.__super__ = this.prototype;
      return child;
    };

    // Augmented `_configure` to call `_inherit` first.
    var __configure = this.prototype._configure;
    this.prototype._configure = function (options) {
      this._inherit(this.inherits || []);
      return __configure.apply(this, arguments);
    };

    // Runs up the prototype chain and checks for the properties in `inherits`. Inherits based on type, so Strings get concatenated with a space, arrays get unioned, and objects get defaulted.
    //
    //     childString + ' ' + parentString;
    //     _.union(childArray, parentArray);
    //     _.defaults(childObject, parentObject);
    this.prototype._inherit = function (properties) {
      var souper = this;

      // While we still have a parent, keep looping over the properties and inheriting them.
      while (souper = souper.__super__) {
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
    };

    // A list of properties to inherit. The only inheritable property by default is `inherits` itself so that it's usable anywhere on the chain, but you can add to it in any extended child views.
    var _inherits = this.prototype.inherits || [];
    this.prototype.inherits = _.union(_inherits, inherits, ['inherits']);
  };

  return backboneInherit;
});