angular.module('app.controllers').controller('ProjectViewRFIModalController', [	'$scope',
																				'$modalInstance',
																				'rfi',
																				'action', function(	$scope,
																									$modalInstance,
																									rfi,
																									action	) {
	$scope.rfi 		= rfi;
	$scope.action 	= action;

	$scope.ok 	= function () {
		if ($scope.action == 'view') {
			$modalInstance.close();
		} else {
			$modalInstance.close($scope.rfi);
		}
	};

	$scope.cancel 	= function () {
		$modalInstance.close();
	};

}]);