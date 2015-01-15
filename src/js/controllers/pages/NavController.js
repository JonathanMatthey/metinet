angular.module('app.controllers').controller('NavController', [	'$scope',
																'Auth', function(	$scope,
																					Auth 	) {
	$scope.user_data = Auth.getCredential('user_data');

}]);