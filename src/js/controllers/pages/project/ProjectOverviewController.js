angular.module('app.controllers').controller('ProjectOverviewController', [ '$scope',
																			'$rootScope',
																			'$modal',
																			'$stateParams',
																			'ProjectProgressPlot',
																			'$http', 	function(   $scope,
																									$rootScope,
																									$modal,
																									$stateParams,
																									ProjectProgressPlot,
																									$http ) {

	$scope.project_id		= $stateParams.project_id;

	$http.get($rootScope.api_url_version+'/projects/'+$stateParams.project_id+"/to-do").then(function (resp) {
		$scope.projectTodo 	= resp.data.data;
	});

	ProjectProgressPlot.get({id:$stateParams.project_id})
		.$promise.then(function(res) {
			// success handler
			$scope.projectProgressPlot = res.data;
			$scope.d0_1 = res.data.actual_plot;
			$scope.d0_2 = res.data.calculated_plot;
		});

	$scope.importProjectFileModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/import_project_file.html',
			controller: 'ProjectImportProjectFileModalController',
			resolve: {
				project: function() {
					return $scope.project;
				}
			}
		});
	};

	$scope.importTasksModal = function() {
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