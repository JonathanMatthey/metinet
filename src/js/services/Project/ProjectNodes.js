angular.module('app.services')
	.factory('ProjectNodes', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/projects/:id/nodes',{
			id:'@_id'
		},
		{
			store: {
				method: 'POST'
			}
		});
	}]);