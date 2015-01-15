angular.module('app.controllers').controller('ProjectLongLeadItemModalController', [	'$scope',
																						'$modalInstance',
																						'long_lead',
																						'action', function(	$scope,
																											$modalInstance,
																											long_lead,
																											action	) {
	$scope.long_lead 	= long_lead;
	$scope.action 		= action;

	$scope.ok 	= function () {
		if ($scope.action == 'view') {
			$modalInstance.close();
		} else {
			$modalInstance.close($scope.long_lead);
		}
	};

	$scope.cancel 	= function () {
		$modalInstance.close('cancel');
	};

}]);