angular.module('app.services')
	.factory('ProjectAudit', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/projects/:project_id/audit/:skip',	{
			project_id:'@_project_id',
			skip:'@_skip'
		}, {
			query: {
				method: 'GET',
				transformResponse: function (res) {
					var res = JSON.parse(res);
					return res.data;
				},
				isArray: true
			},
			update: {
				method: 'PUT'
			}
		});
	}]);