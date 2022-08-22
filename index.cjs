'use strict';

module.exports = Object.defineProperty(
  {
    default: function v(k, v) {
      return function (p) {
        var a = v[p[k]];
        return a === null ? null : a != null ? a : v.DEFAULT;
      };
    },
  },
  '__esModule',
  { value: true },
);
