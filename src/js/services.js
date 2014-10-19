'use strict';

/* Services */

angular.module('app.services',[]).factory('Project', ['$resource', function($resource) {
    return $resource('http://178.62.117.241/projects/:id',{
      id:'@_id'
    },{
        query: {
            method: 'GET',
            transformResponse: function (data) {
                console.log(JSON.parse(data).projects)
                return JSON.parse(data).projects;
            },
            isArray: true
        },
        update: {
            method: 'PUT'
        }
    });
}]).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});
