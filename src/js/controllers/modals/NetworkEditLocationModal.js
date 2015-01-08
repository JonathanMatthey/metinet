angular.module('app.controllers').controller('NetworkEditLocationModal', [	'$scope',
																				'$modalInstance',
																				'$http',
																				'location',
																				'countries',	function(	$scope,
																											$modalInstance,
																											$http,
																											location,
																											countries	) {

	$scope.location_data 		= location;
	$scope.countries 			= countries;		

	$scope.ok = function () {
		$modalInstance.close($scope.location_data);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);