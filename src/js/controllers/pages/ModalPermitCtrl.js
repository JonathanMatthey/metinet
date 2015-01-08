angular.module('app.controllers').controller('ModalPermitCtrl', [	'$scope',
																	'$modal',
																	'$log',
																	'ProjectPermits', function(	$scope,
																								$modal,
																								$log,
																								ProjectPermits 	) {
	$scope.items = ['permit1', 'permit2', 'permit3'];
	$scope.open = function (size) {
		var modalInstance = $modal.open({
			templateUrl: 'permitEditModalContent.html',
			controller: 'ModalInstanceCtrl',
			size: size,
			resolve: {
				items: function () {
				return $scope.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.newPermit = new ProjectPermits();
	$scope.newPermit.name = "Big New Project";
	$scope.newPermit.lat = 1.1;
	$scope.newPermit.lng = 2.2;
	$scope.newPermit.client_name = "JCB";

	$scope.create = function() {
		console.log($scope.newPermit);
		toaster.pop('wait', 'Saving Permit', 'Shouldn\'t take long...');
		$scope.newPermit.$save(function(data) {
			console.log(JSON.stringify(data));
			if(!data.result) {
				toaster.pop('error', 'Error', '');
			} else {
				toaster.pop('success', 'Success', '');
				setTimeout(function() {
				// $state.go('app.page.projects');
				}, 1500);
			}
		});
	};
}]);