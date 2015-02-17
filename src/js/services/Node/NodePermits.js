angular.module('app.services')
	.factory('NodePermits', ['$resource', '$rootScope', function($resource, $rootScope) {
	    return $resource($rootScope.api_url_version+'/nodes/:id/permits',{
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