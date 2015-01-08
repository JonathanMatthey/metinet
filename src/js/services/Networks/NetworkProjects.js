angular.module('app.services')
	.factory('NetworkProjects', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/networks/:id/projects',{
			id:'@_id'
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
	}])