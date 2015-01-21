angular.module('app.controllers').controller('ProjectAuditItemModalController', [	'$scope',
																					'$modalInstance',
																					'audit_item',	function(	$scope,
																												$modalInstance,
																												audit_item	) {
	$scope.audit_item 	= audit_item;

	$scope.ok 			= function () {
		$modalInstance.close('cancel');
	};

}]);