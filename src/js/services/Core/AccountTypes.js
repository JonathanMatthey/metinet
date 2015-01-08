angular.module('app.services')
	.factory('AccountTypes', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/account-types', {}, {});
	}]);