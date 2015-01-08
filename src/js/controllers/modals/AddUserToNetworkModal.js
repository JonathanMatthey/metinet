angular.module('app.controllers').controller('AddUserToNetworkModal', [	'$scope',
																			'$modalInstance',
																			'potentialUsers', 	function(	$scope,
																											$modalInstance,
																											potentialUsers 	) {
	$scope.potentialUsers = potentialUsers;
	$scope.selectedUsers = [];

	$scope.ok = function () {
		$modalInstance.close($scope.selectedUsers);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);