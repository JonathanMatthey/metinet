angular.module('app.controllers').controller('AddPackageModal', [	'$scope',
																	'$modalInstance',	function(	$scope,
																									$modalInstance	) {
	$scope.newPackage = {};

	$scope.ok = function () {
		$modalInstance.close($scope.newPackage);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);