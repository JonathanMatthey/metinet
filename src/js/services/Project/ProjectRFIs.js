angular.module('app.services')
	.factory('ProjectRFIs', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/projects/:id/rfis/:rfi_id',{
			id:'@_id',
			rfi_id:'@rfi_id'
		},{
			query: {
				method: 'GET',
				transformResponse: function (res) {
					var res = JSON.parse(res);
					return res.data;
				},
				isArray: true
			},
			store: {
				method: 'POST'
			},
			update: {
				method: 'PUT'
			}
		});
	}]);