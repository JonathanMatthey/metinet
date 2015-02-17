angular.module('app.services')
	.factory('ProjectMilestones', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/projects/:project_id/milestones',{
			project_id:'@_project_id'
		},{});
	}]);