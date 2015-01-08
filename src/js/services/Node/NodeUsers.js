angular.module('app.services')
	.factory('NodeUsers', ['$resource', '$rootScope', function($resource, $rootScope) {
	    return $resource($rootScope.api_url+'/nodes/:id/users',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}]);