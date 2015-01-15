angular.module('app.services')
	.factory('Profile', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/profiles/:id',{
			id:'@id'
		},{
			update: {
				method: 'PUT'
			}
		});
	}]);