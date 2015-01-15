angular.module('app.controllers').controller('ProjectPermitModalController', [	'$scope',
																				'$modalInstance',
																				'permit',
																				'action', function(	$scope,
																									$modalInstance,
																									permit,
																									action	) {
	$scope.permit 	= permit;
	$scope.action 		= action;

	$scope.ok 	= function () {
		if ($scope.action == 'view') {
			$modalInstance.close();
		} else {
			$modalInstance.close($scope.permit);
		}
	};

	$scope.cancel 	= function () {
		$modalInstance.close('cancel');
	};

}]);