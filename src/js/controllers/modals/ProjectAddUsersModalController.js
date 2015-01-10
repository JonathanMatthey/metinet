angular.module('app.controllers').controller('ProjectAddUsersModalController', [	'$scope',
																					'$modalInstance',
																					'potential_users', function(	$scope,
																													$modalInstance,
																													potential_users 	) {
		$scope.potential_users = potential_users;
		$scope.selectedUsers = [];

		$scope.ok = function () {
			$modalInstance.close($scope.selectedUsers);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);