angular.module('app.controllers').controller('ModalRFICtrl', [	'$scope',
																	'$modal',
																	'$log', function(	$scope,
																						$modal,
																						$log 	) {
	$scope.items = ['rfi1', 'rfi2', 'rfi3'];
	$scope.open = function (size, templateUrl) {
		var modalInstance = $modal.open({
			templateUrl: templateUrl,
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
}]);