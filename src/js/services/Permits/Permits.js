angular.module('app.services')
	.factory('Permits', ['$resource', '$rootScope', function($resource, $rootScope) {
	    return $resource($rootScope.api_url_version+'/permits/:id',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
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