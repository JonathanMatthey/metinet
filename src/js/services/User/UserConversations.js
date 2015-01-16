angular.module('app.services')
	.factory('UserConversations', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/conversations/latest',{},{});
	}]);