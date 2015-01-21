angular.module('app.services')
	.factory('UserHomepage', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/user/homepage',{
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