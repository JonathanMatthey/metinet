angular.module('app.services')
	.factory('Networks', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/networks/:id',{
			id:'@_id'
		}, {
			query: {
				method: 'GET'
			},
			store: {
				method: 'POST'
			},
			update: {
				method: 'PUT'
			},
			delete: {
				method: 'DELETE'
			}
		});
	}]);