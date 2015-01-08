angular.module('app.controllers').controller('HeaderController', [	'$scope',
																	'$state',
																	'$cookies',																	
																	'$window',
																	'$http',
																	'Auth', function(	$scope,
																						$state,
																						$cookies,
																						$window,
																						$http,
																						Auth 	) {
	$scope.user_data = Auth.getCredential('user_data');

	$scope.init = function() {

	}

}]);