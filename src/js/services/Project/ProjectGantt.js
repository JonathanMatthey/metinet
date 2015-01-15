angular.module('app.services')
	.factory('ProjectGantt', ['$resource', '$rootScope', function($resource, $rootScope) {
	    return $resource($rootScope.api_url+'/projects/:id/gantt',{
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