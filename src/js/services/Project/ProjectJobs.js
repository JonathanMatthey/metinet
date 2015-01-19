angular.module('app.services')
	.factory('ProjectJobs', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/projects/:project_id/jobs/:job_id',{
			project_id:'@_project_id',
			job_id:'@_job_id'
		},{});
	}]);