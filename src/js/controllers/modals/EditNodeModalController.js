angular.module('app.controllers').controller('EditNodeModalController', [	'$scope',
																			'$modalInstance',
																			'node',
																			'is_leaf', function(	$scope,
																									$modalInstance,
																									node,
																									is_leaf	) {
	$scope.node 	= node;
	$scope.is_leaf 	= is_leaf;

	$scope.ok 	= function () {
		$modalInstance.close($scope.node);
	};

	$scope.cancel 	= function () {
		$modalInstance.close('cancel');
	};

}]);