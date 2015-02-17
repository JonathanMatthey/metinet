angular.module('app.services')
	.factory('StoreMessage', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/conversations/:id/message',{id:'@id'},{});
	}]);