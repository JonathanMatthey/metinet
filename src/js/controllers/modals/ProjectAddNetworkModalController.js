angular.module('app.controllers').controller('ProjectAddNetworkModalController', [	'$scope',
																					'$modalInstance',
																					'networks', function(	$scope,
																											$modalInstance,
																											networks 	) {
		$scope.networks = networks;

		$scope.ok = function () {
			$modalInstance.close($scope.selected_network);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);