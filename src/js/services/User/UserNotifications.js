angular.module('app.services')
	.factory('UserNotifications', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/user/notifications/:option/:skip',{
			option:'@option',
			skip:'@skip'
		},{});
	}]);