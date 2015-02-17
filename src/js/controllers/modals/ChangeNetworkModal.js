angular.module('app.controllers').controller('ChangeNetworkModal', [	'$scope',
																		'$modalInstance',
																		'networks',			function(	$scope,
																										$modalInstance,
																										networks	) {

	$scope.networks 	= networks;

	$scope.ok = function () {
		console.log($scope.selected_network.id);
		$modalInstance.close($scope.selected_network.id);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);