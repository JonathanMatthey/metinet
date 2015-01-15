angular.module('app.controllers').controller('NodeAddUsersModalController', [	'$scope',
																				'$modalInstance',
																				'potential_users', function(	$scope,
																												$modalInstance,
																												potential_users 	) {
		$scope.potential_users 	= potential_users;
		$scope.selected_users 	= [];

		$scope.ok = function () {
			$modalInstance.close($scope.selected_users);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);