angular.module('app.services')
	.factory('UserNotifications', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/notifications/:option/:skip',{
			option:'@option',
			skip:'@skip'
		},{});
	}]);