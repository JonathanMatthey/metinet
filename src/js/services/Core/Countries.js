angular.module('app.services')
	.factory('Countries', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url_version+'/countries/:action', {action:'@action'}, {
			findByCoords: {
				method: 'POST'
			}
		});
	}]);