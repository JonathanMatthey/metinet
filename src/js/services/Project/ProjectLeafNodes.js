angular.module('app.services')
	.factory('ProjectLeafNodes', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/projects/:project_id/leaves',	{ project_id:'@_project_id' }, {});
	}]);