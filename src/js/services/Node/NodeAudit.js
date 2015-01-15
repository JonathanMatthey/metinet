angular.module('app.services')
	.factory('NodeAudit', ['$resource', '$rootScope', function($resource, $rootScope) {
	    return $resource($rootScope.api_url+'/nodes/:id/audit',{
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