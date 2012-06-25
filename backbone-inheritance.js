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
      factory(root, _);
    });
  }
  // Browser globals
  else {
    if (root.Backbone === undefined) throw new Error('Couldn\'t find Backbone');
    root.Backbone.mixin || (root.Backbone.mixin = {});
    root.Backbone.mixin.inheritance = factory(root, root._);
  }
})(this, function (root, _) {

  var backboneInherit = function (inheritables) {
    inheritables || (inheritables = []);

    // Augmenting `extend` to add `__super__` as a reference to the parent class on instances so that we can travel up the prototype chain. `__super__` shouldn't be used for any logic in the instance itself.
    var _extend = this.extend;
    this.extend = function (protoProps, classProps) {
      var child = _extend.apply(this, arguments);
      child.prototype.__super__ = this.prototype;
      return child;
    };

    // Augmented `_configure` to call `_inheritProperties` first.
    var __configure = this.prototype._configure;
    this.prototype._configure = function (options) {
      this._inheritProperties(this.inheritableProperties || []);
      return __configure.apply(this, arguments);
    };

    // Runs up the prototype chain and checks for the properties in `inheritableProperties`. Inherits based on type, so Strings get concatenated with a space, arrays get unioned, and objects get defaulted.
    //
    //     childString + ' ' + parentString;
    //     _.union(childArray, parentArray);
    //     _.defaults(childObject, parentObject);
    this.prototype._inheritProperties = function (properties) {
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

    // A list of properties to inherit. The only inheritable property by default is `inheritableProperties` itself so that it's usable anywhere on the chain, but you can add to it in any extended child views.
    var _inheritableProperties = this.prototype.inheritableProperties;
    this.prototype.inheritableProperties = _.union(_inheritableProperties, inheritables, ['inheritableProperties']);
  };

  return backboneInherit;
});