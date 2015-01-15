angular.module('app.controllers').controller('ProjectOverviewController', [ '$scope',
																			'$stateParams',
																			'ProjectProgressPlot',
																			'$http', 	function(   $scope,
																									$stateParams,
																									ProjectProgressPlot,
																									$http ) {

	$scope.project_id		= $stateParams.id;

	$http.get('http://api.metinet.co/projects/'+$stateParams.id+"/to-do").then(function (resp) {
		$scope.projectTodo 	= resp.data.data;
	});

	ProjectProgressPlot.get({id:$stateParams.id})
		.$promise.then(function(res) {
			// success handler
			$scope.projectProgressPlot = res.data;
			$scope.d0_1 = res.data.actual_plot;
			$scope.d0_2 = res.data.calculated_plot;
		});

}]);