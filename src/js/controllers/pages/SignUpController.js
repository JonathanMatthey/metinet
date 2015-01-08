angular.module('app.controllers').controller('SignUpController', [	'$scope', 
																		'$http', 
																		'$state',
																		'$translate',
																		'$location',
																		'User', function(	$scope, 
																							$http,
																							$state,
																							$translate,
																							$location,
																							User 	) {
	$translate('sign_up').then(function (sign_up) {
		$scope.sign_up = sign_up;
	});

	$scope.user_data = {};

	// Reset Server Error
	$scope.authError 		= null;
	$scope.process_engaged 	= false;
	$scope.sign_up_complete = false;

	$scope.signup = function() {
		$scope.process_engaged = true;

		// Reset Server Error
		$scope.authError = null;

		var store_user	= User.store($scope.user_data)
							.$promise.then(

								// Success
								function(data) {
									$scope.process_engaged 	= false;
									$scope.sign_up_complete = true;
								}, 

								// Fail
								function (data) {
									$scope.process_engaged 		= false;										
									$scope.authError 			= data.data.detail;
									$scope.validation_errors	= data.data.data;
								}
							);
	};
}]);