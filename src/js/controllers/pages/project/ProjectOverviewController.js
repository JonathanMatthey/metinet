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

		modalInstance.result.then(function(permit) {
			if (action == 'view') {
				return true;
			}

			$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
			$('.btn-edit.permit-'+permit.id).addClass('text-center');
			$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			Permits.update({id:permit.id}, permit)
				.$promise.then(function(res) {
					$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.permit-'+permit.id).addClass('btn-success');
					$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-check"></i>');
					$('.btn-edit.permit-'+permit.id).prop('disabled', false);
					$scope.permits[permit_index] = res.data;
				}, function(response) {
					$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.permit-'+permit.id).addClass('btn-danger');
					$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-times"></i>');
					$('.btn-edit.permit-'+permit.id).prop('disabled', false);
				});
		});
	};

}]);