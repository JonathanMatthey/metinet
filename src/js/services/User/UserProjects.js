angular.module('app.services')
	.factory('UserProjects', ['$resource', '$rootScope', function($resource, $rootScope) {
	    return $resource($rootScope.api_url+'/user/:id/projects',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                return res.data;
	            },
	            isArray: true
	        }
	    });
	}]);