angular.module('app.services')
	.factory('NodeDependencies', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/nodes/:node_id/dependencies/:id',{
		  node_id:'@node_id',
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