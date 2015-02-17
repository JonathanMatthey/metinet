angular.module('app.services')
	.factory('Profile', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/profiles/:id',{
			id:'@id'
		},{
			update: {
				method: 'PUT'
			}
		});
	}]);