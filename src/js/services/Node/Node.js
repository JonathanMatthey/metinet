angular.module('app.services')
	.factory('Node', ['$resource', '$rootScope', function($resource, $rootScope) {
	    return $resource($rootScope.api_url+'/nodes/:id',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                console.log(res);
	                var res = JSON.parse(res);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}]);