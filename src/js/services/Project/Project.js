angular.module('app.services')
	.factory('Project', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/projects/:id',{
			id:'@_id'
		},{
			query: {
				method: 'GET'
			},
			store: {
				method: 'POST'
			},
			update: {
				method: 'PUT'
			}
		});
	}]);