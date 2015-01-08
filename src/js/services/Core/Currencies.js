angular.module('app.services')
	.factory('Currencies', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/currencies', {}, {});
	}]);