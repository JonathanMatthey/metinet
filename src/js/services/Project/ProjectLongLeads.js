angular.module('app.services')
	.factory('ProjectLongLeads', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/projects/:id/long-leads/:long_lead_id',{
			id:'@_id',
			long_lead_id:'@_long_lead_id'
		},{
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