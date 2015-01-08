angular.module('app.controllers').controller('AddLongLeadModal', [	'$scope',
																		'$modalInstance',
																		'longlead',  function(	$scope,
																								$modalInstance, 
																								longlead 	) {
	$scope.longlead = longlead;

	$scope.ok = function () {
		$modalInstance.close($scope.longlead);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);