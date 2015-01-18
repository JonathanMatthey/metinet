angular.module('app.controllers').controller('ProjectOverviewController', [ '$scope',
																			'$modal',
																			'$stateParams',
																			'ProjectProgressPlot',
																			'$http', 	function(   $scope,
																									$modal,
																									$stateParams,
																									ProjectProgressPlot,
																									$http ) {

	$scope.project_id		= $stateParams.project_id;

	$http.get('http://api.metinet.co/projects/'+$stateParams.project_id+"/to-do").then(function (resp) {
		$scope.projectTodo 	= resp.data.data;
	});

	ProjectProgressPlot.get({id:$stateParams.project_id})
		.$promise.then(function(res) {
			// success handler
			$scope.projectProgressPlot = res.data;
			$scope.d0_1 = res.data.actual_plot;
			$scope.d0_2 = res.data.calculated_plot;
		});

	$scope.importTasksModal = function(permit_index, action) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/import_tasks.html',
			controller: 'ProjectImportTasksModalController',
			resolve: {
				project: function() {
					return $scope.project;
				}
			}
		});
	};

}]);