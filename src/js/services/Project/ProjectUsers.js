angular.module('app.services')
	.factory('ProjectUsers', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/projects/:id/users/:userId',{
			id:'@_id',
			userId:'@userId'
		},{
			query: {
				method: 'GET',
				transformResponse: function (res) {
					var res = JSON.parse(res);
					console.log(res.data);
					return res.data;
				},
				isArray: true
			},
			update: {
				method: 'PUT'
			}
		});
	}]);