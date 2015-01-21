angular.module('app.controllers').controller('ProjectLeafNodeController', [ '$scope',
																			'$modal',
																			'$state',
																			'$stateParams',
																			'ProjectLeafNodes',	function(   $scope,
																											$modal,
																											$state,
																											$stateParams,
																											ProjectLeafNodes ) {

	$scope.leaf_nodes_retured = false;

	ProjectLeafNodes.get({project_id:$stateParams.project_id})
		.$promise.then(function(res) {
			$scope.leaf_nodes 			= res.data;
			$scope.leaf_nodes_retured 	= true;
			$('.footable').footable();
		}, function(res) {

		});

}]);