angular.module('app.services')
	.factory('NodeUsers', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/nodes/:id/users/:user_id',{
			id:'@id',
			user_id:'@user_id'
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
			}
		});
	}]);