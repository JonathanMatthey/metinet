angular.module('app.services')
	.factory('ProjectDiscussions', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/projects/:project_id/discussions/:discussion_id/:action/:action_id',{
			project_id:'@_project_id',
			discussion_id:'@_discussion_id',
			action:'@_action',
			action_id:'@_action_id',
		},{
			update: {
				method: 'PUT'
			},
			add_node: {
				method: 'POST'
			}
		});
	}]);