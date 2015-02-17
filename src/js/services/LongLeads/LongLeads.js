angular.module('app.services')
	.factory('LongLeads', ['$resource', '$rootScope', function($resource, $rootScope) {
	    return $resource($rootScope.api_url_version+'/long-leads/:id',{
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