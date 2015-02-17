angular.module('app.controllers').controller('SignUpController', [	'$scope',
																	'$http',
																	'$state',
																	'$translate',
																	'$location',
																	'Auth',
																	'User', function(	$scope,
																						$http,
																						$state,
																						$translate,
																						$location,
																						Auth,
																						User 	) {
	$translate('sign_up').then(function (sign_up) {
		$scope.sign_up = sign_up;
	});

	$scope.user_data = {
		linked_in_id: "",
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		password_confirm: "",
		terms: false
	};

	// Reset Server Error
	$scope.authError 		= null;
	$scope.process_engaged 	= false;
	$scope.sign_up_complete = false;

	$scope.signup = function() {
		$scope.process_engaged = true;

		// Reset Server Error
		$scope.authError = null;

		User.store($scope.user_data)
			.$promise.then(function(response) {
					$scope.process_engaged 	= false;
					if (response.data.active) {
						Auth.setCredentials($scope.user_data.email, $scope.user_data.password, response.data);
						$state.go('app.home');
					} else {
						$scope.sign_up_complete = true;
					}
				}, function(response) {
					$scope.process_engaged 		= false;
					$scope.authError 			= response.data.detail;
					$scope.validation_errors	= response.data.data;
				});
	};

}]);