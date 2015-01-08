angular.module('app.controllers').controller('SignInController', [	'$scope',
																	'$rootScope',
																	'$http',
																	'$state',
																	'Auth',	function(	$scope,
																						$rootScope,
																						$http,
																						$state,
																						Auth 	) {
	$scope.user 			= {};
	$scope.authError 		= null;
	$scope.process_engaged 	= false;
	Auth.clearCredentials();

	$scope.signUpUser = {};

	$scope.login = function() {
		$('.btn-login').html('<i class="fa fa-fw fa-spin fa-refresh"></i>');
		$scope.authError 		= null;
		// Try to login
		$http.post($rootScope.api_url+'/auth', {
			headers: {'Authorization': 'Basic amVtaW1hLnNjb3R0QGZha2VyZW1haWwuY29tOnRlc3QxMjM0'},
				email: 		$scope.user.email,
				password:  	$scope.user.password
			}).then(function(response) {
					if (response.status === 200) {
						// user logged in
						Auth.setCredentials($scope.user.email, $scope.user.password, response.data.user_data);
						$state.go('app.home');
					} else {
						$scope.authError = 'Email or Password not right';
					}
				}, function(response) {
					$('.btn-login').html('Log In');
					if (response.status === 403) {
						$scope.authError = response.data.msg.text;
					} else {
						$scope.authError = 'Server Error';
					}
				}
			);
	};
}]);