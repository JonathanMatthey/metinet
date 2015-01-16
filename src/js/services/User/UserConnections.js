angular.module('app.services')
	.factory('UserConnections', ['$resource', '$rootScope', function($resource, $rootScope) {
			return $resource($rootScope.api_url+'/user/:id/connections',{
			id:'@id'
		},{
			query: {
				method: 'GET',
				transformResponse: function (res) {
					var res = JSON.parse(res);
					return res.data;
				},
				isArray: true
			}
		});
	}]);