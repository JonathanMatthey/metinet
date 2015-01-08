angular.module('app.services')
	.factory('Activate', ['$resource', '$rootScope', function($resource, $rootScope) {
		return $resource($rootScope.api_url+'/activate/:activation_code', {activation_code:'@code'}, {
			execute: {
				method: 'POST'				
			}
		});
	}]);