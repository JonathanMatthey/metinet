angular.module('app.services')
	.factory('Roles', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/roles', {}, {});
	}]);