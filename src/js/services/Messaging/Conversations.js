angular.module('app.services')
	.factory('Conversations', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/conversations/:id',{
			id:'@id'
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