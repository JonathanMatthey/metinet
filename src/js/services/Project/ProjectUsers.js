angular.module('app.services')
	.factory('ProjectUsers', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/projects/:id/users/:userId',{
			id:'@_id',
			userId:'@userId'
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