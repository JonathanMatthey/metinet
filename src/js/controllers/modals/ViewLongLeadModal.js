angular.module('app.controllers').controller('ViewLongLeadModal', [	'$scope',
																		'$modalInstance',
																		'longleadItem',
																		'longleadAudit', function(	$scope,
																									$modalInstance,
																									longleadItem,
																									longleadAudit 	) {
	$scope.longleadItem = longleadItem;
	$scope.longleadAudit = longleadAudit;
	$scope.hideAudit = true;

	$scope.showAudit = function () {
		$scope.hideAudit = false;
	};

	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);