angular.module('app.services')
	.factory('User', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/user/:userId', {
			userId:'@user_id'
		}, {
			get: {
				method: 'GET'
			},
			store: {
				method: 'POST'
			},
			put: {
				method: 'PUT'
			}
		});
	}]);