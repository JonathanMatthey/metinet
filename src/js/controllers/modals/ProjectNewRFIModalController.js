angular.module('app.controllers').controller('ProjectNewRFIModalController', [	'$scope',
																				'$modalInstance',
																				'Auth',
																				'possible_networks', function(	$scope,
																												$modalInstance,
																												Auth,
																												possible_networks 	) {
	$scope.possible_networks	= possible_networks;

	var user_data 				= Auth.getCredential('user_data');
	$scope.rfi 					= {
		requesting_network: user_data.network,
	};

	$scope.ok 	= function () {
		$modalInstance.close($scope.rfi);
	};

	$scope.cancel 	= function () {
		$modalInstance.close('cancel');
	};

}]);