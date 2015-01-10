angular.module('app.services')
	.factory('ProjectPotentialNetworks', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/projects/:project_id/potential-networks',{
			project_id:'@_project_id'
		},{});
	}]);