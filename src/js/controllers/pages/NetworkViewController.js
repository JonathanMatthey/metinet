angular.module('app.controllers').controller('NetworkViewController', [  '$scope',
																			'$stateParams', 
																			'Auth', 
																			'Networks', 
																			'NetworkProjects',	function(	$scope, 
																											$stateParams, 
																											Auth,
																											Networks,
																											NetworkProjects	) {

	$scope.network = {};

	$scope.init = function() {
		Networks.get({id:$stateParams.id})
			.$promise
			.then(function(res) {
				$scope.network = res.data;
			});

		NetworkProjects.query({id:$stateParams.id})
			.$promise
			.then(function(data) {
				$scope.network.projects = data;
			});
	}

}]);