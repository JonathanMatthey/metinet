angular.module('app.controllers').controller('ChangeNetworkModal', [	'$scope',
																		'$modalInstance',
																		'networks',			function(	$scope,
																										$modalInstance,
																										networks	) {

	$scope.networks 	= networks;

	console.log($scope.networks);

	$scope.ok = function () {
		$modalInstance.close($scope.selected_network.id);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);