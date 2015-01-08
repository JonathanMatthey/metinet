angular.module('app.controllers').controller('AddPermitModal', [	'$scope',
																	'$modalInstance',
																	'permit', 	function(	$scope,
																							$modalInstance,
																							permit 	) {
	$scope.permit = permit;

	$scope.ok = function () {
		$modalInstance.close($scope.permit);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);