angular.module('app.services')
	.factory('Messages', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/messages/:id',{id:'@id'},{});
	}]);