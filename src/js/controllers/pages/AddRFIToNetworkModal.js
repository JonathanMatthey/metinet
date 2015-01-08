angular.module('app.controllers').controller('AddRFIToNetworkModal', [	'$scope',
																			'$modalInstance',
																			'networks',  function(	$scope,
																									$modalInstance,
																									networks 	) {
	$scope.networks = networks;
	$scope.selectedUsers = [];
	$scope.newRFI = {};

	$scope.ok = function () {
		$scope.newRFI.requesting_network_id = $scope.requestingNetwork.id;
		$scope.newRFI.responding_network_id = $scope.respondingNetwork.id;
		$modalInstance.close($scope.newRFI);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);