angular.module('app.controllers').controller('ActivationController', [	'$scope', 
																			'$http', 
																			'$state',
																			'$stateParams',
																			'$translate',
																			'$location',
																			'Activate', function(	$scope, 
																									$http,
																									$state,
																									$stateParams,
																									$translate,
																									$location,
																									Activate 	) {

	$scope.activate = function() {
		$scope.process_engaged 	= true;
		$scope.success 			= false;
		$scope.failed 			= false;

		var activate	= Activate.execute({code:$stateParams.activation_code})
							.$promise.then(
								// Success
								function(response) {
									$scope.success 			= true;
									$scope.user_fullname 	= response.data.fullname;												
									$scope.process_engaged 	= false;
								}, 

								// Fail
								function (response) {
									$scope.failed 			= true;
									$scope.process_engaged 	= false;
								}
							);
	};
}]);