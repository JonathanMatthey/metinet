angular.module('app.services')
	.factory('Profile', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/profiles/:id',{
			id:'@id'
		},{
			query: {
				method: 'GET',
				transformResponse: function (res) {
					var res = JSON.parse(res);
					return res.data;
				}
			},
			update: {
				method: 'PUT'
			}
		});
	}]);