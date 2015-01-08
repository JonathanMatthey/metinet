angular.module('app.services')
	.factory('ProjectLongLeads', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/projects/:id/long-leads',{
			id:'@_id'
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