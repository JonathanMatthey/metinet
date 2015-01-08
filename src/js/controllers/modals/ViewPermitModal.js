angular.module('app.controllers').controller('ViewPermitModal', [	'$scope',
																	'$modalInstance',
																	'permitItem',
																	'permitAudit',	function(	$scope,
																								$modalInstance,
																								permitItem,
																								permitAudit 	) {
	$scope.permit = permitItem;
	$scope.permitAudit = permitAudit;
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