'use strict';

/* Filters */
// need load the moment.js to use this filter.
angular.module('app.filters', [])
  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  })
  .filter('formatFullDate', function() {
    return function(date) {
      return moment(date).format("D MMM YYYY");
    }
  })
  .filter('join', function() {
    return function(list, token) {
        return (list||[]).join(token);
    }
  })
  .filter('pluck', function() {
    function pluck(objects, property) {
        if (!(objects && property && angular.isArray(objects))) return [];

        property = String(property);

        return objects.map(function(object) {
            // just in case
            object = Object(object);

            if (object.hasOwnProperty(property)) {
                return object[property];
            }

            return '';
        });
    }

    return function(objects, property) {
        return pluck(objects, property);
    }
  });